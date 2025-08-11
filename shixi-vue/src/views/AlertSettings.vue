<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { saveAlertRules } from '@/services/api'

// Channels
const channelEmail = ref(true)
const channelSms = ref(false)
const channelInApp = ref(true)

// Load contact from personalization
const contactEmail = ref('')
const contactPhone = ref('')

// Rule editor state
const isEditing = ref(false)
const editingId = ref(null)
const newRule = reactive({
  name: '',
  symbols: 'AAPL, TSLA',
  ruleType: 'price', // price | rsi | volume | maCross
  operator: '>',
  threshold: 100,
  windowDays: 1,
  activeHours: '09:30-15:00',
  weekdays: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false },
  enabled: true,
})

// Rule list
const rules = ref([])

// Utilities
function uid() {
  return (crypto.randomUUID && crypto.randomUUID()) || `r_${Date.now()}_${Math.random().toString(36).slice(2,8)}`
}

function showToast(message, type = 'info') {
  const container = document.getElementById('global-toast-container')
  if (!container) return
  const alert = document.createElement('div')
  const cls = type === 'success' ? 'alert-success' : type === 'error' ? 'alert-error' : type === 'warning' ? 'alert-warning' : 'alert-info'
  alert.className = `alert ${cls}`
  alert.innerHTML = `<span class="iconify" data-icon="heroicons:information-circle" data-width="18"></span><span>${message}</span>`
  container.appendChild(alert)
  setTimeout(() => alert.remove(), 3000)
}

function resetEditor() {
  isEditing.value = false
  editingId.value = null
  Object.assign(newRule, {
    name: '', symbols: 'AAPL, TSLA', ruleType: 'price', operator: '>', threshold: 100, windowDays: 1,
    activeHours: '09:30-15:00', weekdays: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false }, enabled: true,
  })
}

function saveRule() {
  if (!newRule.name.trim()) return showToast('请填写规则名称', 'error')
  if (!newRule.symbols.trim()) return showToast('请填写股票代码', 'error')

  const payload = JSON.parse(JSON.stringify(newRule))
  if (isEditing.value && editingId.value) {
    const idx = rules.value.findIndex(r => r.id === editingId.value)
    if (idx >= 0) {
      rules.value[idx] = { ...rules.value[idx], ...payload }
      showToast('规则已更新', 'success')
    }
  } else {
    rules.value.unshift({ id: uid(), createdAt: new Date().toISOString(), ...payload })
    showToast('规则已创建', 'success')
  }
  persist()
  resetEditor()
}

function editRule(rule) {
  isEditing.value = true
  editingId.value = rule.id
  Object.assign(newRule, JSON.parse(JSON.stringify(rule)))
}

function deleteRule(id) {
  rules.value = rules.value.filter(r => r.id !== id)
  persist()
  showToast('规则已删除', 'info')
}

function toggleRuleEnabled(rule) {
  rule.enabled = !rule.enabled
  persist()
}

function testSend(rule) {
  const channels = [channelInApp.value && '站内', channelEmail.value && '邮箱', channelSms.value && '短信'].filter(Boolean).join('、')
  showToast(`已测试发送（${channels}）: ${rule.name}`, 'success')
}

function persist() {
  localStorage.setItem('alertRules', JSON.stringify(rules.value))
  localStorage.setItem('alertChannels', JSON.stringify({ email: channelEmail.value, sms: channelSms.value, inApp: channelInApp.value }))
}

function restore() {
  try {
    const saved = JSON.parse(localStorage.getItem('alertRules') || '[]')
    if (Array.isArray(saved)) rules.value = saved
  } catch {}
  try {
    const ch = JSON.parse(localStorage.getItem('alertChannels') || '{}')
    if (typeof ch === 'object') {
      channelEmail.value = !!ch.email
      channelSms.value = !!ch.sms
      channelInApp.value = ch.inApp !== false
    }
  } catch {}
  contactEmail.value = localStorage.getItem('pref.email') || ''
  contactPhone.value = localStorage.getItem('pref.phone') || ''
}

onMounted(restore)

const rulesCount = computed(() => rules.value.length)

async function syncToServer() {
  try {
    const { saved } = await saveAlertRules(rules.value)
    showToast(`已同步 ${saved} 条规则`, 'success')
  } catch (e) {
    showToast('同步失败：' + e.message, 'error')
  }
}
</script>

<template>
  <div class="min-h-screen bg-base-100 text-base-content p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <span class="iconify text-primary" data-icon="heroicons:bell-alert" data-width="28"></span>
        <h1 class="text-3xl font-bold">时序预警设置</h1>
        <div class="badge badge-primary">{{ rulesCount }} 条规则</div>
      </div>
      <router-link to="/market-overview" class="btn btn-ghost btn-sm">
        <span class="iconify" data-icon="heroicons:arrow-left" data-width="16"></span>
        返回仪表盘
      </router-link>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Editor -->
      <section class="lg:col-span-8">
        <div class="card glass-panel">
          <div class="card-body">
            <div class="flex items-center justify-between">
              <h2 class="card-title text-lg">
                <span class="iconify text-secondary" data-icon="heroicons:adjustments-horizontal" data-width="18"></span>
                {{ isEditing ? '编辑规则' : '新建预警规则' }}
              </h2>
              <div class="flex gap-2">
                <button class="btn btn-ghost btn-sm" @click="resetEditor" :disabled="!isEditing">重置</button>
                <button class="btn btn-primary btn-sm" @click="saveRule">保存</button>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <label class="form-control">
                <div class="label"><span class="label-text">规则名称</span></div>
                <input class="input input-bordered" placeholder="例如：AAPL 突破 200" v-model="newRule.name" />
              </label>
              <label class="form-control">
                <div class="label"><span class="label-text">股票代码（逗号分隔）</span></div>
                <input class="input input-bordered" placeholder="AAPL, TSLA" v-model="newRule.symbols" />
              </label>

              <label class="form-control">
                <div class="label"><span class="label-text">指标</span></div>
                <select class="select select-bordered" v-model="newRule.ruleType">
                  <option value="price">价格</option>
                  <option value="rsi">RSI</option>
                  <option value="volume">成交量</option>
                  <option value="maCross">均线金叉/死叉</option>
                </select>
              </label>
              <div class="grid grid-cols-3 gap-2 items-end">
                <label class="form-control col-span-1">
                  <div class="label"><span class="label-text">比较</span></div>
                  <select class="select select-bordered" v-model="newRule.operator">
                    <option value=">">大于</option>
                    <option value="<">小于</option>
                    <option value=">=">大于等于</option>
                    <option value="<=">小于等于</option>
                    <option value="crossUp">上穿</option>
                    <option value="crossDown">下穿</option>
                  </select>
                </label>
                <label class="form-control col-span-2">
                  <div class="label"><span class="label-text">阈值</span></div>
                  <input type="number" class="input input-bordered" v-model.number="newRule.threshold" />
                </label>
              </div>

              <label class="form-control">
                <div class="label"><span class="label-text">时间窗口（天）</span></div>
                <input type="number" min="1" class="input input-bordered" v-model.number="newRule.windowDays" />
              </label>
              <label class="form-control">
                <div class="label"><span class="label-text">活跃时段</span></div>
                <input class="input input-bordered" placeholder="09:30-15:00" v-model="newRule.activeHours" />
              </label>

              <div class="md:col-span-2">
                <div class="label"><span class="label-text">工作日</span></div>
                <div class="flex flex-wrap gap-2">
                  <label class="label cursor-pointer gap-2"><input type="checkbox" class="checkbox checkbox-sm" v-model="newRule.weekdays.mon" />一</label>
                  <label class="label cursor-pointer gap-2"><input type="checkbox" class="checkbox checkbox-sm" v-model="newRule.weekdays.tue" />二</label>
                  <label class="label cursor-pointer gap-2"><input type="checkbox" class="checkbox checkbox-sm" v-model="newRule.weekdays.wed" />三</label>
                  <label class="label cursor-pointer gap-2"><input type="checkbox" class="checkbox checkbox-sm" v-model="newRule.weekdays.thu" />四</label>
                  <label class="label cursor-pointer gap-2"><input type="checkbox" class="checkbox checkbox-sm" v-model="newRule.weekdays.fri" />五</label>
                  <label class="label cursor-pointer gap-2"><input type="checkbox" class="checkbox checkbox-sm" v-model="newRule.weekdays.sat" />六</label>
                  <label class="label cursor-pointer gap-2"><input type="checkbox" class="checkbox checkbox-sm" v-model="newRule.weekdays.sun" />日</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Channels -->
        <div class="card glass-panel mt-6">
          <div class="card-body">
            <h2 class="card-title text-lg">
              <span class="iconify text-info" data-icon="heroicons:paper-airplane" data-width="18"></span>
              通知渠道
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <label class="label cursor-pointer gap-3">
                <input type="checkbox" class="toggle toggle-primary" v-model="channelInApp" />
                <span class="label-text">站内提醒</span>
              </label>
              <label class="label cursor-pointer gap-3">
                <input type="checkbox" class="toggle toggle-secondary" v-model="channelEmail" />
                <span class="label-text">邮箱</span>
                <span class="text-xs text-base-content/60">{{ contactEmail || '未设置邮箱' }}</span>
              </label>
              <label class="label cursor-pointer gap-3">
                <input type="checkbox" class="toggle toggle-accent" v-model="channelSms" />
                <span class="label-text">短信</span>
                <span class="text-xs text-base-content/60">{{ contactPhone || '未设置手机号' }}</span>
              </label>
            </div>
            <div class="mt-2 text-xs text-base-content/60">渠道偏好会保存在本地浏览器。</div>
            <div class="mt-3">
              <button class="btn btn-sm" @click="persist">保存渠道偏好</button>
              <button class="btn btn-primary btn-sm ml-2" @click="syncToServer">同步规则到后端</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Rules List -->
      <aside class="lg:col-span-4">
        <div class="card glass-panel">
          <div class="card-body">
            <h2 class="card-title text-lg">
              <span class="iconify text-primary" data-icon="heroicons:queue-list" data-width="18"></span>
              规则列表
            </h2>
            <div class="mt-4 space-y-3">
              <div v-if="rules.length === 0" class="text-sm text-base-content/60">暂无规则，先在左侧创建一条吧。</div>
              <div v-for="r in rules" :key="r.id" class="p-3 rounded-lg bg-base-200/40 border border-base-300">
                <div class="flex items-start justify-between gap-2">
                  <div>
                    <div class="font-semibold">{{ r.name }}</div>
                    <div class="text-xs text-base-content/70 mt-1">
                      {{ r.symbols }} · {{ r.ruleType }} {{ r.operator }} {{ r.threshold }} · 窗口 {{ r.windowDays }}天
                    </div>
                    <div class="text-xs text-base-content/50 mt-1">活跃时段 {{ r.activeHours }}</div>
                  </div>
                  <div class="flex items-center gap-2">
                    <label class="label cursor-pointer gap-2">
                      <span class="text-xs">启用</span>
                      <input type="checkbox" class="toggle toggle-xs" :checked="r.enabled" @change="toggleRuleEnabled(r)" />
                    </label>
                    <div class="dropdown dropdown-end">
                      <div tabindex="0" role="button" class="btn btn-ghost btn-xs">
                        <span class="iconify" data-icon="heroicons:ellipsis-horizontal" data-width="16"></span>
                      </div>
                      <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-36">
                        <li><a @click.prevent="editRule(r)">编辑</a></li>
                        <li><a @click.prevent="testSend(r)">测试发送</a></li>
                        <li><a class="text-error" @click.prevent="deleteRule(r.id)">删除</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tips -->
        <div class="card glass-panel mt-6">
          <div class="card-body">
            <h2 class="card-title text-lg">
              <span class="iconify text-warning" data-icon="heroicons:light-bulb" data-width="18"></span>
              使用提示
            </h2>
            <ul class="text-sm list-disc list-inside space-y-1 text-base-content/80 mt-2">
              <li>支持价格、RSI、成交量与均线交叉等基础条件。</li>
              <li>复杂策略建议在后端组合实现，仅在前端配置触发条件。</li>
              <li>请在“个性化设置中心”完善邮箱/手机号以启用对应渠道。</li>
            </ul>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.glass-panel { background: rgba(0,0,0,0.4); backdrop-filter: blur(10px); border: 1px solid rgba(102,102,255,0.1); }
</style>


