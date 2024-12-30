import { accountApi } from '@/api'

export default {
  namespaced: true,
  
  state: {
    accounts: [],
    mainAccount: null,
    loading: false
  },

  mutations: {
    SET_ACCOUNTS(state, accounts) {
      state.accounts = accounts
      state.mainAccount = accounts.find(acc => acc.isMain) || null
    },
    
    SET_MAIN_ACCOUNT(state, accountId) {
      state.accounts = state.accounts.map(acc => ({
        ...acc,
        isMain: acc.id === accountId
      }))
      state.mainAccount = state.accounts.find(acc => acc.isMain) || null
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
    
    DELETE_ACCOUNT(state, accountId) {
      state.accounts = state.accounts.filter(acc => acc.id !== accountId)
      if (state.mainAccount?.id === accountId) {
        state.mainAccount = null
      }
    },
    
    SET_LOADING(state, loading) {
      state.loading = loading
    }
  },

  actions: {
    async fetchAccounts({ commit }) {
      commit('SET_LOADING', true)
      try {
        const accounts = await accountApi.getAccounts()
        commit('SET_ACCOUNTS', accounts)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async addAccount({ commit }, account) {
      const newAccount = await accountApi.addAccount(account)
      commit('ADD_ACCOUNT', newAccount)
      return newAccount
    },

    async setMainAccount({ commit }, accountId) {
      await accountApi.setMainAccount(accountId)
      commit('SET_MAIN_ACCOUNT', accountId)
    },

    async updateAccount({ commit }, { id, updates }) {
      await accountApi.updateAccount(id, updates)
      commit('UPDATE_ACCOUNT', { id, updates })
    },

    async deleteAccount({ commit }, accountId) {
      await accountApi.deleteAccount(accountId)
      commit('DELETE_ACCOUNT', accountId)
    },

    async importAccounts({ commit }, accounts) {
      const importedAccounts = await accountApi.importAccounts(accounts)
      commit('SET_ACCOUNTS', importedAccounts)
    }
  },

  getters: {
    followAccounts: state => state.accounts.filter(acc => !acc.isMain),
    accountById: state => id => state.accounts.find(acc => acc.id === id),
    hasMainAccount: state => !!state.mainAccount
  }
} 