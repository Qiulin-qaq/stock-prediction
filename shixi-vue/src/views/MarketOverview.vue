<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { predict } from '@/services/api'

const chartContainerRef = ref(null)
let chartInstance = null

const initChart = async () => {
  if (!chartContainerRef.value) return
  const echarts = window.echarts
  if (!echarts) return
  chartInstance = echarts.init(chartContainerRef.value)
  const seriesData = await loadSeries()
  chartInstance.setOption({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 20, top: 20, bottom: 40 },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: Array.from({ length: 50 }, (_, i) => `${i + 1}`),
      axisLine: { lineStyle: { color: '#888' } },
      axisLabel: { color: 'rgba(240,240,240,0.7)' }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#888' } },
      splitLine: { lineStyle: { color: 'rgba(136,136,136,0.2)' } },
      axisLabel: { color: 'rgba(240,240,240,0.7)' }
    },
    series: [
      {
        name: '预测价格',
        type: 'line',
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 2, color: '#6666FF' },
        areaStyle: { color: 'rgba(102,102,255,0.12)' },
        data: seriesData
      }
    ]
  })
}

async function loadSeries() {
  try {
    const { points } = await predict({ symbol: 'AAPL', horizon: '30d', model: 'LSTM' })
    return points.map(p => p.v)
  } catch {
    // fallback synthetic data
    let value = 100
    return Array.from({ length: 50 }, () => {
      value += (Math.random() - 0.45) * 2.5
      return Number(value.toFixed(2))
    })
  }
}

const handleResize = () => {
  chartInstance && chartInstance.resize()
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})
</script>

<template>
  <div class="min-h-screen bg-base-100 text-base-content flex flex-col">
    <section class="px-8 py-6 border-b border-base-300 glass-panel">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="iconify text-primary" data-icon="heroicons:chart-bar" data-width="28"></span>
          <h1 class="text-3xl font-bold">市场概览仪表盘</h1>
          <div class="badge badge-primary badge-lg ml-2">演示</div>
        </div>
        <div class="flex items-center gap-2">
          <button class="btn btn-sm btn-primary" @click="initChart">
            <span class="iconify" data-icon="heroicons:arrow-path" data-width="16"></span>
            刷新图表
          </button>
        </div>
      </div>
      <p class="text-base-content/70 mt-2">使用 ECharts 渲染的折线预测示例</p>
    </section>

    <div class="p-8 flex-1">
      <div class="glass-panel rounded-lg p-4">
        <div class="bg-base-200/50 rounded-lg h-[480px]" ref="chartContainerRef"></div>
      </div>
    </div>
  </div>
  
</template>

<style scoped>
.glass-panel {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(102, 102, 255, 0.1);
}
</style>


