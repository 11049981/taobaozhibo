<template>
  <div class="account-list">
    <van-cell-group inset>
      <van-cell 
        v-for="account in accounts" 
        :key="account.id"
        :title="account.name"
        :label="account.isMain ? '主账号' : '跟随账号'">
        <template #right-icon>
          <van-switch 
            v-model="account.isMain" 
            @change="handleMainChange(account)"
            :disabled="account.isMain && !canUnsetMain" />
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  accounts: {
    type: Array,
    required: true
  },
  canUnsetMain: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:accounts', 'mainChange'])

const handleMainChange = (account) => {
  const updatedAccounts = props.accounts.map(acc => ({
    ...acc,
    isMain: acc.id === account.id
  }))
  emit('update:accounts', updatedAccounts)
  emit('mainChange', account)
}
</script>

<style scoped>
.account-list {
  margin: 12px 0;
}
</style> 