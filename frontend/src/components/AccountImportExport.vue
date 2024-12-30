<template>
  <div class="account-import-export">
    <van-cell-group inset title="账号导入导出">
      <van-cell>
        <template #title>
          <van-space>
            <van-button 
              type="primary" 
              size="small" 
              icon="down"
              @click="exportAccounts">
              导出账号
            </van-button>
            <van-button 
              type="primary" 
              size="small" 
              icon="up"
              @click="triggerImport">
              导入账号
            </van-button>
          </van-space>
        </template>
      </van-cell>
    </van-cell-group>

    <!-- 隐藏的文件输入 -->
    <input 
      type="file" 
      ref="fileInput"
      style="display: none"
      accept=".json"
      @change="handleImport"
    >

    <!-- 导入预览弹窗 -->
    <van-dialog
      v-model:show="showPreview"
      title="导入预览"
      show-cancel-button
      @confirm="confirmImport">
      <div class="preview-content">
        <van-cell-group>
          <van-cell 
            v-for="account in importPreview" 
            :key="account.id"
            :title="account.name"
            :label="account.isMain ? '主账号' : '跟随账号'"
          />
        </van-cell-group>
      </div>
      <div class="preview-tips">
        将导入 {{ importPreview.length }} 个账号
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['import'])
const fileInput = ref(null)
const showPreview = ref(false)
const importPreview = ref([])

const triggerImport = () => {
  fileInput.value.click()
}

const handleImport = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    const text = await file.text()
    const data = JSON.parse(text)
    importPreview.value = data
    showPreview.value = true
  } catch (error) {
    showToast('文件格式错误')
  } finally {
    event.target.value = '' // 重置文件输入
  }
}

const confirmImport = () => {
  emit('import', importPreview.value)
  importPreview.value = []
  showPreview.value = false
}

const exportAccounts = () => {
  // 从props获取账号数据
  const accounts = props.accounts || []
  const data = JSON.stringify(accounts, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const a = document.createElement('a')
  a.href = url
  a.download = `accounts_${new Date().toISOString().split('T')[0]}.json`
  a.click()
  
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.account-import-export {
  margin: 12px 0;
}

.preview-content {
  max-height: 300px;
  overflow-y: auto;
  padding: 12px;
}

.preview-tips {
  padding: 8px 16px;
  color: #999;
  font-size: 12px;
  text-align: center;
  border-top: 1px solid #eee;
}
</style> 