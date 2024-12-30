import { statsApi } from '@/api'

export default {
  namespaced: true,
  
  state: {
    syncStats: null,
    accountStats: {},
    overview: null
  },

  mutations: {
    SET_SYNC_STATS(state, stats) {
      state.syncStats = stats
    },
    
    SET_ACCOUNT_STATS(state, { accountId, stats }) {
      state.accountStats = {
        ...state.accountStats,
        [accountId]: stats
      }
    },
    
    SET_OVERVIEW(state, overview) {
      state.overview = overview
    }
  },

  actions: {
    async fetchSyncStats({ commit }, params) {
      const stats = await statsApi.getSyncStats(params)
      commit('SET_SYNC_STATS', stats)
    },

    async fetchAccountStats({ commit }, accountId) {
      const stats = await statsApi.getAccountStats(accountId)
      commit('SET_ACCOUNT_STATS', { accountId, stats })
    },

    async fetchOverview({ commit }) {
      const overview = await statsApi.getOverview()
      commit('SET_OVERVIEW', overview)
    },

    async exportReport(_, params) {
      return await statsApi.exportReport(params)
    }
  },

  getters: {
    accountStatsById: state => id => state.accountStats[id] || null
  }
} 