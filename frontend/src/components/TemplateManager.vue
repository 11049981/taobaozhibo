<template>
  <div class="template-manager">
    <van-cell-group inset title="消息模板">
      <van-cell>
        <template #title>
          <van-button 
            type="primary" 
            size="small" 
            icon="plus"
            @click="showAddDialog = true">
            添加模板
          </van-button>
        </template>
      </van-cell>
      
      <van-swipe-cell 
        v-for="template in templates" 
        :key="template.id">
        <van-cell 
          :title="template.name"
          :label="template.content"
          @click="useTemplate(template)"/>
        <template #right>
          <van-button 
            type="danger" 
            square 
            text="删除" 
            @click="deleteTemplate(template.id)"/>
        </template>
      </van-swipe-cell>
    </van-cell-group>

    <!-- 添加模板弹窗 -->
    <van-dialog
      v-model:show="showAddDialog"
      title="添加模板"
      show-cancel-button
      @confirm="saveTemplate">
      <van-field
        v-model="newTemplate.name"
        label="模板名称"
        placeholder="请输入模板名称"
      />
      <van-field
        v-model="newTemplate.content"
        type="textarea"
        label="模板内容"
        placeholder="请输入模板内容"
        rows="3"
      />
      <div class="template-tips">
        支持变量：{用户名}、{时间}、{直播间}
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  templates: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['use', 'add', 'delete'])

const showAddDialog = ref(false)
const newTemplate = ref({
  name: '',
  content: ''
})

const useTemplate = (template) => {
  emit('use', template)
}

const saveTemplate = () => {
  if (!newTemplate.value.name || !newTemplate.value.content) {
    return
  }
  emit('add', {
    id: Date.now(),
    ...newTemplate.value
  })
  newTemplate.value = { name: '', content: '' }
}

const deleteTemplate = (id) => {
  emit('delete', id)
}
</script>

<style scoped>
.template-manager {
  margin: 12px 0;
}

.template-tips {
  padding: 8px 16px;
  color: #999;
  font-size: 12px;
}
</style> 