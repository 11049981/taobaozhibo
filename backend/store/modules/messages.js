import { messageApi } from '@/api'

export default {
  namespaced: true,
  
  state: {
    messages: [],
    syncStatus: {
      syncing: false,
      lastSync: null,
      error: null
    }
  },

  mutations: {
    ADD_MESSAGE(state, message) {
      state.messages.unshift(message)
    },
    
    SET_MESSAGES(state, messages) {
      state.messages = messages
    },
    
    SET_SYNC_STATUS(state, status) {
      state.syncStatus = { ...state.syncStatus, ...status }
    },
    
    UPDATE_MESSAGE_STATUS(state, { messageId, status }) {
      const message = state.messages.find(msg => msg.id === messageId)
      if (message) {
        message.status = status
      }
    }
  },

  actions: {
    async sendMessage({ commit, rootState }, { content, delay = 0 }) {
      const mainAccount = rootState.accounts.mainAccount
      if (!mainAccount) {
        throw new Error('未设置主账号')
      }

      const message = {
        id: Date.now(),
        content,
        time: new Date().toISOString(),
        status: 'sending'
      }
      
      commit('ADD_MESSAGE', message)
      
      try {
        await messageApi.sendMessage({
          content,
          delay,
          accountId: mainAccount.id
        })
        commit('UPDATE_MESSAGE_STATUS', { 
          messageId: message.id, 
          status: 'sent' 
        })
      } catch (error) {
        commit('UPDATE_MESSAGE_STATUS', { 
          messageId: message.id, 
          status: 'failed' 
        })
        throw error
      }
    },

    async fetchHistory({ commit }, params) {
      const history = await messageApi.getHistory(params)
      commit('SET_MESSAGES', history)
    },

    async checkSyncStatus({ commit }) {
      const status = await messageApi.getSyncStatus()
      commit('SET_SYNC_STATUS', status)
    }
  },

  getters: {
    recentMessages: state => state.messages.slice(0, 20),
    messageById: state => id => state.messages.find(msg => msg.id === id),
    isSyncing: state => state.syncStatus.syncing
  }
} 