<template>
  <div class="message-sync">
    <van-nav-bar title="消息同步" />
    
    <!-- 状态显示 -->
    <StatusDisplay 
      :accounts="accounts"
      :is-sync="isSending"
    />

    <!-- 消息输入区域 -->
    <div class="message-input">
      <van-field
        v-model="message"
        rows="3"
        type="textarea"
        placeholder="请输入要同步的消息"
        class="message-field"
      />
      <van-button 
        type="primary" 
        block 
        :loading="isSending"
        :disabled="!mainAccount || !message"
        @click="handleSend"
      >
        发送消息
      </van-button>
    </div>

    <!-- 消息历史记录 -->
    <van-cell-group inset class="message-history" title="最近消息">
      <van-cell 
        v-for="msg in messageHistory" 
        :key="msg.id"
        :title="msg.content"
        :label="msg.time"
      />
    </van-cell-group>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { showToast } from 'vant'
import StatusDisplay from '@/components/StatusDisplay.vue'

const store = useStore()
const message = ref('')
const isSending = ref(false)
const messageHistory = ref([])

// 从 store 获取账号信息
const accounts = computed(() => store.state.accounts.accounts)
const mainAccount = computed(() => store.getters['accounts/mainAccount'])

// 发送消息
const handleSend = async () => {
  if (!mainAccount.value) {
    showToast('请先设置主账号')
    return
  }

  if (!message.value.trim()) {
    showToast('请输入消息内容')
    return
  }

  isSending.value = true
  try {
    // 添加到历史记录
    const newMessage = {
      id: Date.now(),
      content: message.value,
      time: new Date().toLocaleString()
    }
    messageHistory.value.unshift(newMessage)
    
    // 保存历史记录
    localStorage.setItem('messageHistory', JSON.stringify(messageHistory.value))
    
    // 清空输入
    message.value = ''
    showToast('发送成功')
  } catch (error) {
    showToast('发送失败：' + error.message)
  } finally {
    isSending.value = false
  }
}

// 加载历史记录
onMounted(() => {
  const savedHistory = localStorage.getItem('messageHistory')
  if (savedHistory) {
    messageHistory.value = JSON.parse(savedHistory)
  }
})
</script>

<style scoped>
.message-sync {
  padding: 16px;
}

.message-input {
  margin: 16px 0;
}

.message-field {
  margin-bottom: 16px;
}

.message-history {
  margin-top: 16px;
}
</style> 