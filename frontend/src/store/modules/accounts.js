import { showToast } from 'vant'

export default {
  namespaced: true,
  
  state: {
    accounts: [],
    loading: false
  },

  mutations: {
    SET_ACCOUNTS(state, accounts) {
      state.accounts = accounts
    },
    ADD_ACCOUNT(state, account) {
      state.accounts.push(account)
    },
    UPDATE_ACCOUNT(state, { id, updates }) {
      const index = state.accounts.findIndex(acc => acc.id === id)
      if (index !== -1) {
        state.accounts[index] = { ...state.accounts[index], ...updates }
      }
    },
    SET_MAIN_ACCOUNT(state, accountId) {
      state.accounts = state.accounts.map(acc => ({
        ...acc,
        isMain: acc.id === accountId
      }))
    },
    DELETE_ACCOUNT(state, accountId) {
      state.accounts = state.accounts.filter(acc => acc.id !== accountId)
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    }
  },

  actions: {
    // 加载账号列表
    loadAccounts({ commit }) {
      const accounts = JSON.parse(localStorage.getItem('accounts') || '[]')
      commit('SET_ACCOUNTS', accounts)
    },

    // 添加账号
    addAccount({ commit, state }, account) {
      commit('ADD_ACCOUNT', account)
      localStorage.setItem('accounts', JSON.stringify(state.accounts))
      showToast('添加成功')
    },

    // 设置主账号
    setMainAccount({ commit, state }, accountId) {
      commit('SET_MAIN_ACCOUNT', accountId)
      localStorage.setItem('accounts', JSON.stringify(state.accounts))
      showToast('设置成功')
    },

    // 删除账号
    deleteAccount({ commit, state }, accountId) {
      commit('DELETE_ACCOUNT', accountId)
      localStorage.setItem('accounts', JSON.stringify(state.accounts))
      showToast('删除成功')
    }
  },

  getters: {
    mainAccount: state => state.accounts.find(acc => acc.isMain),
    followAccounts: state => state.accounts.filter(acc => !acc.isMain),
    accountById: state => id => state.accounts.find(acc => acc.id === id)
  }
} 