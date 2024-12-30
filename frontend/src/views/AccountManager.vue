<template>
  <div class="account-manager">
    <van-nav-bar title="账号管理" />
    
    <!-- 账号列表 -->
    <van-cell-group inset>
      <van-swipe-cell v-for="account in accounts" :key="account.id">
        <van-cell :title="account.name">
          <template #right-icon>
            <van-switch 
              :model-value="account.isMain"
              @change="() => handleSetMain(account.id)"
            />
          </template>
        </van-cell>
        <template #right>
          <van-button 
            square 
            type="danger" 
            text="删除" 
            @click="handleDelete(account.id)"
          />
        </template>
      </van-swipe-cell>
    </van-cell-group>

    <!-- 添加账号按钮 -->
    <van-button 
      type="primary" 
      block 
      class="add-btn"
      @click="showAddDialog = true"
    >
      添加账号
    </van-button>

    <!-- 添加账号弹窗 -->
    <van-dialog
      v-model:show="showAddDialog"
      title="添加账号"
      show-cancel-button
      @confirm="handleAdd"
    >
      <van-field
        v-model="newAccountName"
        label="账号名称"
        placeholder="请输入账号名称"
      />
    </van-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { showToast } from 'vant'

const store = useStore()
const showAddDialog = ref(false)
const newAccountName = ref('')

// 从 store 获取账号列表
const accounts = computed(() => store.state.accounts.accounts)

// 组件挂载时加载账号数据
onMounted(() => {
  store.dispatch('accounts/loadAccounts')
})

// 添加账号
const handleAdd = () => {
  if (!newAccountName.value) {
    showToast('请输入账号名称')
    return
  }

  store.dispatch('accounts/addAccount', {
    id: Date.now(),
    name: newAccountName.value,
    isMain: false
  })

  newAccountName.value = ''
}

// 设置主账号
const handleSetMain = (accountId) => {
  store.dispatch('accounts/setMainAccount', accountId)
}

// 删除账号
const handleDelete = (accountId) => {
  store.dispatch('accounts/deleteAccount', accountId)
}
</script>

<style scoped>
.account-manager {
  padding: 16px;
}

.add-btn {
  margin-top: 16px;
}
</style> 