<script setup>
import { ref, onMounted } from 'vue'

// Preferences state
const theme = ref('black') // 'black' | 'dark'
const notificationsEnabled = ref(true)
const defaultPeriod = ref('1W') // 1D|1W|1M|1Y
const email = ref('')
const phone = ref('')
const watchlist = ref('AAPL, TSLA, NVDA')

// API Keys state
const apiKeys = ref([])

function showToast(message, type = 'info') {
  const container = document.getElementById('global-toast-container')
  if (!container) return
  const wrapper = document.createElement('div')
  const alertClass = type === 'success' ? 'alert-success' : type === 'error' ? 'alert-error' : type === 'warning' ? 'alert-warning' : 'alert-info'
  wrapper.className = `alert ${alertClass}`
  wrapper.innerHTML = `<span class="iconify" data-icon="heroicons:information-circle" data-width="18"></span><span>${message}</span>`
  container.appendChild(wrapper)
  setTimeout(() => wrapper.remove(), 3000)
}

function saveSettings() {
  localStorage.setItem('pref.notificationsEnabled', String(notificationsEnabled.value))
  localStorage.setItem('pref.defaultPeriod', defaultPeriod.value)
  localStorage.setItem('pref.email', email.value)
  localStorage.setItem('pref.phone', phone.value)
  localStorage.setItem('pref.watchlist', watchlist.value)
  localStorage.setItem('theme', theme.value)
  document.documentElement.setAttribute('data-theme', theme.value)
  showToast('设置已保存', 'success')
}

function loadSettings() {
  notificationsEnabled.value = localStorage.getItem('pref.notificationsEnabled') !== 'false'
  defaultPeriod.value = localStorage.getItem('pref.defaultPeriod') || '1W'
  email.value = localStorage.getItem('pref.email') || ''
  phone.value = localStorage.getItem('pref.phone') || ''
  watchlist.value = localStorage.getItem('pref.watchlist') || 'AAPL, TSLA, NVDA'
  theme.value = localStorage.getItem('theme') || 'black'
  document.documentElement.setAttribute('data-theme', theme.value)
}

function generateApiKey() {
  const raw = 'prod_sk_' + Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10) + Math.floor(Math.random() * 9000 + 1000)
  apiKeys.value.unshift({ id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), raw, createdAt: new Date().toISOString() })
  showToast('新 API 密钥已生成', 'success')
}

function copyKey(key) {
  navigator.clipboard.writeText(key.raw).then(() => showToast('已复制到剪贴板', 'success')).catch(() => showToast('复制失败', 'error'))
}

function deleteKey(id) {
  apiKeys.value = apiKeys.value.filter(k => k.id !== id)
  showToast('API 密钥已删除', 'info')
}

function maskKey(raw) {
  if (!raw) return ''
  const head = raw.slice(0, 8)
  const tail = raw.slice(-4)
  return `${head}••••••••••••••••••••${tail}`
}

onMounted(() => {
  loadSettings()
})
</script>

<template>
  <div class="min-h-screen bg-base-100 text-base-content flex flex-col">
    <!-- Header -->
    <section class="px-8 py-6 border-b border-base-300 glass-panel">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="iconify text-primary" data-icon="heroicons:cog-6-tooth" data-width="28"></span>
          <h1 class="text-3xl font-bold">个性化设置中心</h1>
        </div>
        <div class="flex items-center gap-2">
          <router-link class="btn btn-ghost btn-sm" to="/market-overview">
            <span class="iconify" data-icon="heroicons:arrow-left" data-width="16"></span>
            返回仪表盘
          </router-link>
          <button class="btn btn-primary btn-sm" @click="saveSettings">
            <span class="iconify" data-icon="heroicons:check" data-width="16"></span>
            保存设置
          </button>
        </div>
      </div>
      <p class="text-base-content/70 mt-2">配置主题、通知、默认周期、观察列表与 API 密钥</p>
    </section>

    <!-- Content -->
    <div class="p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Left: Preferences -->
      <div class="lg:col-span-8 space-y-6">
        <!-- Theme -->
        <div class="card glass-panel">
          <div class="card-body">
            <h3 class="card-title text-lg">
              <span class="iconify text-primary" data-icon="heroicons:sun" data-width="18"></span>
              主题外观
            </h3>
            <div class="mt-4 flex gap-4 items-center">
              <label class="label cursor-pointer gap-3">
                <span class="label-text">黑色主题</span>
                <input type="radio" name="theme" class="radio radio-primary" value="black" v-model="theme" />
              </label>
              <label class="label cursor-pointer gap-3">
                <span class="label-text">深色主题</span>
                <input type="radio" name="theme" class="radio radio-secondary" value="dark" v-model="theme" />
              </label>
            </div>
          </div>
        </div>

        <!-- Notifications & Period -->
        <div class="card glass-panel">
          <div class="card-body">
            <h3 class="card-title text-lg">
              <span class="iconify text-secondary" data-icon="heroicons:bell" data-width="18"></span>
              通知与默认周期
            </h3>
            <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <label class="label cursor-pointer justify-start gap-3">
                <input type="checkbox" class="toggle toggle-primary" v-model="notificationsEnabled" />
                <span class="label-text">启用系统通知</span>
              </label>
              <label class="form-control w-full">
                <div class="label"><span class="label-text">默认时间周期</span></div>
                <select class="select select-bordered" v-model="defaultPeriod">
                  <option value="1D">日</option>
                  <option value="1W">周</option>
                  <option value="1M">月</option>
                  <option value="1Y">年</option>
                </select>
              </label>
            </div>
          </div>
        </div>

        <!-- Contacts & Watchlist -->
        <div class="card glass-panel">
          <div class="card-body">
            <h3 class="card-title text-lg">
              <span class="iconify text-accent" data-icon="heroicons:user" data-width="18"></span>
              联系方式与自选股
            </h3>
            <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <label class="form-control">
                <div class="label"><span class="label-text">邮箱</span></div>
                <input class="input input-bordered" type="email" placeholder="you@example.com" v-model="email" />
              </label>
              <label class="form-control">
                <div class="label"><span class="label-text">手机号</span></div>
                <input class="input input-bordered" type="tel" placeholder="13800000000" v-model="phone" />
              </label>
            </div>
            <div class="mt-4">
              <label class="form-control">
                <div class="label"><span class="label-text">自选股（逗号分隔）</span></div>
                <input class="input input-bordered" type="text" v-model="watchlist" />
                <div class="label"><span class="label-text-alt text-base-content/60">示例：AAPL, TSLA, NVDA</span></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: API Keys -->
      <div class="lg:col-span-4 space-y-6">
        <div class="card glass-panel">
          <div class="card-body">
            <h3 class="card-title text-lg">
              <span class="iconify text-primary" data-icon="heroicons:key" data-width="18"></span>
              API 密钥管理
            </h3>
            <div class="mt-2 text-sm text-base-content/70">用于访问你的后端预测服务接口</div>
            <div class="mt-4 flex gap-2">
              <button class="btn btn-primary btn-sm" @click="generateApiKey">
                <span class="iconify" data-icon="heroicons:plus" data-width="16"></span>
                生成新密钥
              </button>
            </div>
            <div class="divider my-4"></div>
            <div id="api-key-list" class="space-y-2">
              <div v-if="apiKeys.length === 0" class="text-sm text-base-content/60">暂无密钥</div>
              <div v-for="k in apiKeys" :key="k.id" class="flex items-center justify-between p-3 bg-base-200 rounded-box">
                <div class="font-mono truncate mr-3">{{ maskKey(k.raw) }}</div>
                <div class="flex gap-2">
                  <button class="btn btn-xs btn-ghost btn-square" @click="copyKey(k)" title="复制">
                    <span class="iconify" data-icon="heroicons:clipboard-document" data-width="16"></span>
                  </button>
                  <button class="btn btn-xs btn-ghost btn-square text-error" @click="deleteKey(k.id)" title="删除">
                    <span class="iconify" data-icon="heroicons:trash" data-width="16"></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tips -->
        <div class="card glass-panel">
          <div class="card-body">
            <h3 class="card-title text-lg">
              <span class="iconify text-info" data-icon="heroicons:light-bulb" data-width="18"></span>
              使用提示
            </h3>
            <ul class="mt-2 text-sm list-disc list-inside space-y-1 text-base-content/80">
              <li>主题会保存到浏览器并即时生效</li>
              <li>默认周期将用于仪表盘与图表初始区间</li>
              <li>API 密钥请妥善保管，不要暴露在前端代码中</li>
            </ul>
          </div>
        </div>
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


