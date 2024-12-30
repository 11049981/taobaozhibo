<template>
  <div id="app">
    <router-view></router-view>
    <van-tabbar v-model="active" route>
      <van-tabbar-item to="/accounts" icon="friends-o">
        账号管理
      </van-tabbar-item>
      <van-tabbar-item to="/sync" icon="chat-o">
        消息同步
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'App',
  setup() {
    const active = ref(0)
    return { active }
  }
}
</script>

<style>
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica,
    Segoe UI, Arial, Roboto, 'PingFang SC', 'miui', 'Hiragino Sans GB', 'Microsoft Yahei',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f7f8fa;
}

/* 防止页面滚动 */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

/* 内容区域可滚动 */
.van-tabbar {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #fff;
}
</style> 