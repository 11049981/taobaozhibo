import request from './request'

export const messageApi = {
  // 发送消息
  sendMessage(data) {
    return request.post('/messages/send', data)
  },

  // 获取消息历史
  getHistory(params) {
    return request.get('/messages/history', { params })
  },

  // 获取消息模板
  getTemplates() {
    return request.get('/messages/templates')
  },

  // 添加消息模板
  addTemplate(template) {
    return request.post('/messages/templates', template)
  },

  // 更新消息模板
  updateTemplate(id, template) {
    return request.put(`/messages/templates/${id}`, template)
  },

  // 删除消息模板
  deleteTemplate(id) {
    return request.delete(`/messages/templates/${id}`)
  },

  // 获取同步状态
  getSyncStatus() {
    return request.get('/messages/sync-status')
  }
} 