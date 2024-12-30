import request from './request'

export const statsApi = {
  // 获取同步统计数据
  getSyncStats(params) {
    return request.get('/stats/sync', { params })
  },

  // 获取账号活动统计
  getAccountStats(accountId) {
    return request.get(`/stats/accounts/${accountId}`)
  },

  // 获取系统概览数据
  getOverview() {
    return request.get('/stats/overview')
  },

  // 导出统计报告
  exportReport(params) {
    return request.get('/stats/export', { 
      params,
      responseType: 'blob'
    })
  }
} 