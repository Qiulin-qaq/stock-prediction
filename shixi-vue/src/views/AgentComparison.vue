<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, watch } from 'vue'

// Filters
const dateRange = ref('30d')
const stock = ref('TSLA')
const dimension = ref('adaptability')
const allAgents = ['LSTM', 'Transformer', 'RandomForest', 'SVM', 'XGBoost']
const selectedAgents = ref(['LSTM', 'Transformer', 'RandomForest'])

// Timeline controls
const autoPlay = ref(false)
const timeline = ref(50)
let timelineTimer = null

// ECharts instances
let radarChart = null
let heatmapChart = null
let weightChart = null

// Utils
function getAgentColor(agent, alpha = 1) {
  const colors = {
    LSTM: `rgba(102, 102, 255, ${alpha})`,
    Transformer: `rgba(51, 255, 204, ${alpha})`,
    RandomForest: `rgba(255, 136, 51, ${alpha})`,
    SVM: `rgba(255, 51, 102, ${alpha})`,
    XGBoost: `rgba(0, 255, 127, ${alpha})`
  }
  return colors[agent] || `rgba(240, 240, 240, ${alpha})`
}

// Mock data generators
const mockRadar = {
  LSTM: [92, 88, 85, 90, 87],
  Transformer: [89, 92, 88, 85, 91],
  RandomForest: [85, 85, 92, 88, 84]
}

function generateHeatmapData(agents = allAgents) {
  const data = []
  const days = ['周一', '周二', '周三', '周四', '周五']
  for (let i = 0; i < agents.length; i++) {
    for (let j = 0; j < days.length; j++) {
      data.push([i, j, Math.round(Math.random() * 40 + 60)])
    }
  }
  return data
}

function generateWeightData(agents = selectedAgents.value, range = dateRange.value) {
  const days = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 30
  const dates = []
  const data = {}
  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - (days - i))
    dates.push(date.toISOString().split('T')[0])
  }
  agents.forEach(agent => {
    data[agent] = []
    let baseWeight = Math.random() * 0.4 + 0.3
    for (let i = 0; i < days; i++) {
      baseWeight += (Math.random() - 0.5) * 0.1
      baseWeight = Math.max(0.1, Math.min(0.9, baseWeight))
      data[agent].push(Math.round(baseWeight * 100))
    }
  })
  data.dates = dates
  return data
}

// Init charts
function initCharts() {
  const echarts = window.echarts
  if (!echarts) return
  const radarEl = document.getElementById('radarChart')
  const heatEl = document.getElementById('heatmapChart')
  const weightEl = document.getElementById('weightChart')
  if (!radarEl || !heatEl || !weightEl) return

  radarChart = echarts.init(radarEl, 'dark')
  heatmapChart = echarts.init(heatEl, 'dark')
  weightChart = echarts.init(weightEl, 'dark')

  updateRadar()
  updateHeatmap()
  updateWeight()
}

function updateRadar() {
  if (!radarChart) return
  const seriesData = selectedAgents.value.map(a => ({
    value: mockRadar[a] || [80, 75, 85, 80, 82],
    name: a,
    itemStyle: { color: getAgentColor(a) },
    areaStyle: { color: getAgentColor(a, 0.2) }
  }))
  radarChart.setOption({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item', backgroundColor: 'rgba(0,0,0,0.9)', borderColor: 'rgba(102,102,255,0.3)', textStyle: { color: '#f0f0f0' } },
    legend: { data: selectedAgents.value, textStyle: { color: '#f0f0f0' }, bottom: 10 },
    radar: {
      indicator: [
        { name: '预测精度', max: 100 },
        { name: '市场适应性', max: 100 },
        { name: '风险规避', max: 100 },
        { name: '稳定性', max: 100 },
        { name: '响应速度', max: 100 }
      ],
      splitArea: { areaStyle: { color: ['rgba(102,102,255,0.1)', 'rgba(51,255,204,0.05)'] } },
      axisLine: { lineStyle: { color: 'rgba(102,102,255,0.3)' } },
      splitLine: { lineStyle: { color: 'rgba(102,102,255,0.2)' } }
    },
    series: [{ type: 'radar', data: seriesData }]
  })
}

function updateHeatmap() {
  if (!heatmapChart) return
  const echarts = window.echarts
  const agents = selectedAgents.value
  heatmapChart.setOption({
    backgroundColor: 'transparent',
    tooltip: { position: 'top', backgroundColor: 'rgba(0,0,0,0.9)', borderColor: 'rgba(51,255,204,0.3)', textStyle: { color: '#f0f0f0' } },
    grid: { height: '70%', top: '10%' },
    xAxis: { type: 'category', data: agents, splitArea: { show: true }, axisLabel: { color: '#f0f0f0' } },
    yAxis: { type: 'category', data: ['周一','周二','周三','周四','周五'], splitArea: { show: true }, axisLabel: { color: '#f0f0f0' } },
    visualMap: { min: 0, max: 100, calculable: true, orient: 'horizontal', left: 'center', bottom: '5%', inRange: { color: ['rgba(102,102,255,0.3)','rgba(51,255,204,0.8)','rgba(255,136,51,1)'] }, textStyle: { color: '#f0f0f0' } },
    series: [{ name: '预测准确度', type: 'heatmap', data: generateHeatmapData(agents), emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(51,255,204,0.5)' } }, label: { show: true, color: '#000' } }]
  })
}

function updateWeight() {
  if (!weightChart) return
  const data = generateWeightData(selectedAgents.value, dateRange.value)
  const series = selectedAgents.value.map(a => ({
    name: a, type: 'line', stack: 'Total',
    areaStyle: { color: getAgentColor(a, 0.3) }, lineStyle: { color: getAgentColor(a) }, data: data[a] || []
  }))
  weightChart.setOption({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: 'rgba(0,0,0,0.9)', borderColor: 'rgba(255,136,51,0.3)', textStyle: { color: '#f0f0f0' } },
    legend: { data: selectedAgents.value, textStyle: { color: '#f0f0f0' }, top: 10 },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', boundaryGap: false, data: data.dates, axisLabel: { color: '#f0f0f0' }, axisLine: { lineStyle: { color: 'rgba(102,102,255,0.3)' } } },
    yAxis: { type: 'value', axisLabel: { color: '#f0f0f0' }, axisLine: { lineStyle: { color: 'rgba(102,102,255,0.3)' } }, splitLine: { lineStyle: { color: 'rgba(102,102,255,0.1)' } } },
    series
  })
  // draw timeline indicator
  drawTimelineIndicator()
}

function drawTimelineIndicator() {
  if (!weightChart) return
  const val = Number(timeline.value)
  const frame = Math.floor((val / 100) * 100)
  weightChart.setOption({
    graphic: [{
      type: 'line',
      shape: { x1: `${val}%`, y1: '10%', x2: `${val}%`, y2: '90%' },
      style: { stroke: 'rgba(255,136,51,0.8)', lineWidth: 2 }
    }]
  })
}

function startAutoPlay() {
  if (timelineTimer) return
  timelineTimer = setInterval(() => {
    timeline.value = (Number(timeline.value) + 2) % 101
    drawTimelineIndicator()
  }, 200)
}

function stopAutoPlay() {
  if (timelineTimer) {
    clearInterval(timelineTimer)
    timelineTimer = null
  }
}

function onResize() {
  radarChart && radarChart.resize()
  heatmapChart && heatmapChart.resize()
  weightChart && weightChart.resize()
}

onMounted(() => {
  initCharts()
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  stopAutoPlay()
  window.removeEventListener('resize', onResize)
  radarChart && radarChart.dispose()
  heatmapChart && heatmapChart.dispose()
  weightChart && weightChart.dispose()
})

// watchers
watch([selectedAgents, dateRange], () => { updateRadar(); updateHeatmap(); updateWeight() })
watch(timeline, () => drawTimelineIndicator())
watch(autoPlay, (v) => { v ? startAutoPlay() : stopAutoPlay() })
</script>

<template>
  <div class="bg-base-100 min-h-screen flex flex-col">
    <section class="bg-base-200 px-8 py-6">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-4">
            <router-link class="btn btn-ghost btn-sm text-secondary hover:bg-secondary/10 hover:text-secondary" to="/market-overview">
              <span class="iconify" data-icon="heroicons:arrow-left" data-width="20"></span>
              返回仪表盘
            </router-link>
            <div class="divider divider-horizontal"></div>
            <h1 class="text-3xl font-bold">智能体模型对比</h1>
          </div>
          <div class="badge badge-primary badge-lg">
            <span class="iconify" data-icon="heroicons:cpu-chip" data-width="16"></span>
            AI 分析
          </div>
        </div>

        <div class="glass-panel rounded-lg p-6">
          <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <label class="form-control">
              <div class="label"><span class="label-text">时间范围</span></div>
              <select class="select select-bordered select-sm bg-base-100/50" v-model="dateRange">
                <option value="7d">近7天</option>
                <option value="30d">近30天</option>
                <option value="90d">近90天</option>
              </select>
            </label>

            <label class="form-control">
              <div class="label"><span class="label-text">股票标的</span></div>
              <select class="select select-bordered select-sm bg-base-100/50" v-model="stock">
                <option value="AAPL">苹果 (AAPL)</option>
                <option value="TSLA">特斯拉 (TSLA)</option>
                <option value="NVDA">英伟达 (NVDA)</option>
                <option value="MSFT">微软 (MSFT)</option>
              </select>
            </label>

            <label class="form-control">
              <div class="label"><span class="label-text">评估维度</span></div>
              <select class="select select-bordered select-sm bg-base-100/50" v-model="dimension">
                <option value="accuracy">预测精度</option>
                <option value="adaptability">市场适应性</option>
                <option value="risk">风险规避</option>
                <option value="stability">稳定性</option>
              </select>
            </label>

            <div>
              <div class="label"><span class="label-text">智能体选择</span></div>
              <div class="bg-base-100/50 border border-base-300 rounded-box p-2 grid grid-cols-2 gap-1">
                <label v-for="a in allAgents" :key="a" class="label cursor-pointer justify-start gap-2">
                  <input type="checkbox" class="checkbox checkbox-primary checkbox-xs" :value="a" v-model="selectedAgents" />
                  <span class="label-text text-xs">{{ a }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="flex-1 px-8 py-6 bg-base-100">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div class="card bg-base-200 shadow-tech glass-panel">
            <div class="card-body p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="card-title text-lg">
                  <span class="iconify text-primary" data-icon="heroicons:chart-pie" data-width="20"></span>
                  多维度性能雷达图
                </h3>
                <div class="badge badge-secondary badge-sm">实时</div>
              </div>
              <div id="radarChart" class="w-full h-80 bg-base-100/20 rounded-lg border border-primary/20"></div>
            </div>
          </div>

          <div class="card bg-base-200 shadow-tech glass-panel">
            <div class="card-body p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="card-title text-lg">
                  <span class="iconify text-secondary" data-icon="heroicons:squares-2x2" data-width="20"></span>
                  时序预测热力图
                </h3>
              </div>
              <div id="heatmapChart" class="w-full h-80 bg-base-100/20 rounded-lg border border-secondary/20"></div>
            </div>
          </div>

          <div class="card bg-base-200 shadow-tech glass-panel xl:col-span-2">
            <div class="card-body p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="card-title text-lg">
                  <span class="iconify text-accent" data-icon="heroicons:chart-bar" data-width="20"></span>
                  动态权重变化趋势
                </h3>
                <div class="flex items-center gap-4">
                  <label class="label cursor-pointer gap-2"><span class="label-text text-sm">自动播放</span><input type="checkbox" class="toggle toggle-primary toggle-sm" v-model="autoPlay"></label>
                  <button class="btn btn-primary btn-sm" @click="autoPlay = !autoPlay">
                    <span class="iconify" :data-icon="autoPlay ? 'heroicons:pause' : 'heroicons:play'" data-width="16"></span>
                    {{ autoPlay ? '暂停' : '播放' }}
                  </button>
                </div>
              </div>
              <div id="weightChart" class="w-full h-96 bg-base-100/20 rounded-lg border border-accent/20"></div>
              <div class="mt-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm text-base-content/70">时间轴控制</span>
                  <span class="text-sm font-mono text-primary">{{ timeline }}%</span>
                </div>
                <input type="range" min="0" max="100" v-model="timeline" class="range range-primary range-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.glass-panel { background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(10px); border: 1px solid rgba(102, 102, 255, 0.1); }
</style>


