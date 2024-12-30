import { accountApi } from './account'
import { messageApi } from './message'
import { statsApi } from './stats'

export {
  accountApi,
  messageApi,
  statsApi
}

// 统一处理API错误
export const handleApiError = (error) => {
  console.error('API Error:', error)
  if (error.response) {
    // 服务器响应错误
    switch (error.response.status) {
      case 401:
        // 未授权，跳转到登录页
        router.push('/login')
        break
      case 403:
        // 权限不足
        showToast('权限不足')
        break
      case 404:
        // 资源不存在
        showToast('请求的资源不存在')
        break
      default:
        // 其他错误
        showToast(error.response.data.message || '请求失败')
    }
  } else if (error.request) {
    // 请求发送失败
    showToast('网络连接失败')
  } else {
    // 其他错误
    showToast('请求处理失败')
  }
  return Promise.reject(error)
}

// 在组件中使用
import { accountApi, messageApi, statsApi } from '@/api'

// 获取账号列表
const getAccounts = async () => {
  try {
    const accounts = await accountApi.getAccounts()
    // 处理数据
  } catch (error) {
    // 错误已经被统一处理
  }
}

// 发送消息
const sendMessage = async (message) => {
  try {
    await messageApi.sendMessage({
      content: message,
      delay: 1000, // 延迟1秒
      followAccounts: true // 同步到跟随账号
    })
    showToast('发送成功')
  } catch (error) {
    // 错误已经被统一处理
  }
}