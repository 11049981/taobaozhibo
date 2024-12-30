<template>
  <div class="stats-chart">
    <van-cell-group inset title="数据统计">
      <canvas ref="chartRef"></canvas>
    </van-cell-group>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const chartRef = ref(null)
let chart = null

onMounted(() => {
  if (chartRef.value) {
    chart = new Chart(chartRef.value, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: '消息同步量',
          data: []
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    })
  }
})

watch(() => props.data, (newData) => {
  if (chart) {
    chart.data.labels = newData.labels
    chart.data.datasets[0].data = newData.values
    chart.update()
  }
}, { deep: true })
</script>

<style scoped>
.stats-chart {
  margin: 12px 0;
  height: 200px;
}
</style> 