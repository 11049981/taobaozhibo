<template>
  <div class="status-display">
    <van-cell-group inset title="系统状态">
      <van-cell title="主账号">
        <template #value>
          <span :class="{'status-active': mainAccount}">
            {{ mainAccount?.name || '未设置' }}
          </span>
        </template>
      </van-cell>
      <van-cell title="跟随账号">
        <template #value>
          <span :class="{'status-active': followAccounts.length}">
            {{ followAccounts.length }}个
          </span>
        </template>
      </van-cell>
      <van-cell title="同步状态">
        <template #value>
          <span :class="{'status-active': isSync}">
            {{ isSync ? '同步中' : '未同步' }}
          </span>
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
  isSync: {
    type: Boolean,
    default: false
  }
})

const mainAccount = computed(() => 
  props.accounts.find(acc => acc.isMain)
)

const followAccounts = computed(() => 
  props.accounts.filter(acc => !acc.isMain)
)
</script>

<style scoped>
.status-display {
  margin: 12px 0;
}

.status-active {
  color: var(--van-success-color);
}
</style> 