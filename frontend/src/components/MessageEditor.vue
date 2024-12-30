<template>
  <div class="message-editor">
    <van-field
      v-model="message"
      rows="3"
      type="textarea"
      placeholder="请输入要同步的消息"
      :disabled="disabled"
    />
    <div class="editor-toolbar">
      <van-space>
        <van-button 
          size="small" 
          plain 
          type="primary"
          @click="insertEmoji">
          表情
        </van-button>
        <van-button 
          size="small" 
          plain 
          type="primary"
          @click="insertTemplate">
          模板
        </van-button>
      </van-space>
      <van-button 
        type="primary" 
        :disabled="!message || disabled"
        @click="handleSend">
        发送
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['send'])

const message = ref('')

const handleSend = () => {
  emit('send', message.value)
  message.value = ''
}

const insertEmoji = () => {
  // TODO: 实现表情插入
}

const insertTemplate = () => {
  // TODO: 实现模板插入
}
</script>

<style scoped>
.message-editor {
  background: #fff;
  padding: 12px;
  border-radius: 8px;
}

.editor-toolbar {
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style> 