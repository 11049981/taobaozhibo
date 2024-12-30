import request from './request'

export const accountApi = {
  // 获取账号列表
  getAccounts() {
    return request.get('/accounts')
  },

  // 添加账号
  addAccount(account) {
    return request.post('/accounts', account)
  },

  // 更新账号
  updateAccount(id, account) {
    return request.put(`/accounts/${id}`, account)
  },

  // 删除账号
  deleteAccount(id) {
    return request.delete(`/accounts/${id}`)
  },

  // 设置主账号
  setMainAccount(id) {
    return request.put(`/accounts/${id}/main`)
  },

  // 导入账号
  importAccounts(accounts) {
    return request.post('/accounts/import', { accounts })
  },

  // 导出账号
  exportAccounts() {
    return request.get('/accounts/export')
  },

  // 检查账号状态
  checkStatus(id) {
    return request.get(`/accounts/${id}/status`)
  }
} 