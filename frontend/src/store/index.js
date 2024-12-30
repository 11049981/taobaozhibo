import { createStore } from 'vuex'
import accounts from './modules/accounts'
import messages from './modules/messages'
import templates from './modules/templates'
import stats from './modules/stats'

// 创建 store 实例
export default createStore({
  state: {
    loading: false,
    error: null
  },

  mutations: {
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    }
  },

  actions: {
    setLoading({ commit }, loading) {
      commit('SET_LOADING', loading)
    },
    setError({ commit }, error) {
      commit('SET_ERROR', error)
      // 可以在这里添加错误处理逻辑，比如显示错误提示
      console.error('Global Error:', error)
    }
  },

  modules: {
    accounts,   // 账号管理模块
    messages,   // 消息管理模块
    templates,  // 模板管理模块
    stats       // 统计数据模块
  },

  // 全局 getters
  getters: {
    isLoading: state => state.loading,
    hasError: state => !!state.error,
    errorMessage: state => state.error?.message || null
  }
}) 