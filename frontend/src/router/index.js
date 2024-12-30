import { createRouter, createWebHistory } from 'vue-router'
import AccountManager from '../views/AccountManager.vue'
import MessageSync from '../views/MessageSync.vue'

const routes = [
  {
    path: '/',
    redirect: '/accounts'
  },
  {
    path: '/accounts',
    name: 'Accounts',
    component: AccountManager,
    meta: {
      title: '账号管理'
    }
  },
  {
    path: '/sync',
    name: 'Sync',
    component: MessageSync,
    meta: {
      title: '消息同步'
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// 设置页面标题
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '淘宝直播同步助手'
  next()
})

export default router 