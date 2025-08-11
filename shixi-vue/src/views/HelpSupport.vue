<script setup>
import { ref } from 'vue'

// Contact form state
const nameInput = ref('')
const emailInput = ref('')
const subjectInput = ref('')
const messageInput = ref('')

function showToast(message, type = 'info') {
  const container = document.getElementById('global-toast-container')
  if (!container) return
  const wrapper = document.createElement('div')
  const alertClass = type === 'success' ? 'alert-success' : type === 'error' ? 'alert-error' : type === 'warning' ? 'alert-warning' : 'alert-info'
  wrapper.className = `alert ${alertClass}`
  wrapper.innerHTML = `<span class="iconify" data-icon="heroicons:information-circle" data-width="18"></span><span>${message}</span>`
  container.appendChild(wrapper)
  setTimeout(() => wrapper.remove(), 3500)
}

function submitContact() {
  if (!nameInput.value || !emailInput.value || !subjectInput.value || !messageInput.value) {
    showToast('请填写所有必填项。', 'error')
    return
  }
  showToast('您的问题已成功提交！我们的团队会尽快与您联系。', 'success')
  nameInput.value = ''
  emailInput.value = ''
  subjectInput.value = ''
  messageInput.value = ''
}
</script>

<template>
  <div class="bg-base-100 text-base-content tech-background min-h-screen">
    <!-- Hero -->
    <section class="hero min-h-96 rounded-box overflow-hidden">
      <div class="hero-overlay bg-base-100 bg-opacity-80"></div>
      <div class="hero-content text-center">
        <div class="max-w-2xl">
          <h1 class="mb-5 text-5xl font-bold text-primary glow-primary font-heading">帮助与支持</h1>
          <p class="mb-8 text-lg text-base-content/80">获取系统使用指南、常见问题解答及技术支持</p>
          <router-link to="/market-overview" class="btn btn-primary btn-lg glow-primary">
            <span class="iconify" data-icon="heroicons:arrow-left-circle" data-width="24"></span>
            返回仪表盘
          </router-link>
        </div>
      </div>
    </section>

    <!-- Guidance & FAQ -->
    <section class="py-16 container mx-auto px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 class="text-3xl font-bold mb-6 text-secondary glow-secondary flex items-center gap-3">
            <span class="iconify" data-icon="heroicons:book-open" data-width="28"></span>
            使用指南
          </h2>
          <div class="space-y-4">
            <div class="collapse collapse-arrow glass-panel shadow-tech">
              <input type="radio" name="help-accordion" checked>
              <div class="collapse-title text-lg font-medium text-secondary">仪表盘概览</div>
              <div class="collapse-content text-base-content/80">
                <p>仪表盘展示关键市场指数、自选股表现与预测信号，帮助你快速了解市场动态。</p>
              </div>
            </div>
            <div class="collapse collapse-arrow glass-panel shadow-tech">
              <input type="radio" name="help-accordion">
              <div class="collapse-title text-lg font-medium text-secondary">如何进行预测分析</div>
              <div class="collapse-content text-base-content/80">
                <p>在“预测结果分析中心”输入股票代码，系统基于多模型生成未来走势预测与关键拐点。</p>
              </div>
            </div>
            <div class="collapse collapse-arrow glass-panel shadow-tech">
              <input type="radio" name="help-accordion">
              <div class="collapse-title text-lg font-medium text-secondary">个性化设置</div>
              <div class="collapse-content text-base-content/80">
                <p>在“个性化设置中心”管理自选股、默认周期与通知偏好，获取更相关的推送。</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 class="text-3xl font-bold mb-6 text-secondary glow-secondary flex items-center gap-3">
            <span class="iconify" data-icon="heroicons:question-mark-circle" data-width="28"></span>
            常见问题解答
          </h2>
          <div class="space-y-4">
            <div class="collapse collapse-arrow glass-panel shadow-tech">
              <input type="radio" name="help-accordion">
              <div class="collapse-title text-lg font-medium text-secondary">预测结果的准确性如何？</div>
              <div class="collapse-content text-base-content/80">
                <p>预测基于先进 AI 模型与历史数据，供参考不构成投资建议。</p>
              </div>
            </div>
            <div class="collapse collapse-arrow glass-panel shadow-tech">
              <input type="radio" name="help-accordion">
              <div class="collapse-title text-lg font-medium text-secondary">数据是实时更新的吗？</div>
              <div class="collapse-content text-base-content/80">
                <p>市场数据为实时，模型更新频率依策略而定，一般为每日。</p>
              </div>
            </div>
            <div class="collapse collapse-arrow glass-panel shadow-tech">
              <input type="radio" name="help-accordion">
              <div class="collapse-title text-lg font-medium text-secondary">如何重置我的密码？</div>
              <div class="collapse-content text-base-content/80">
                <p>登录页点击“忘记密码”，按指引通过邮箱验证后重置。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact -->
    <section class="py-12 container mx-auto px-8">
      <div class="text-center mb-10">
        <h2 class="text-3xl font-bold mb-2 text-accent glow-accent">需要更多帮助？</h2>
        <p class="text-lg text-base-content/70">我们的技术支持团队随时准备为您服务。</p>
      </div>
      <div class="card glass-panel shadow-tech-lg max-w-5xl mx-auto">
        <div class="card-body p-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <form class="space-y-4" @submit.prevent="submitContact">
              <label class="form-control">
                <div class="label"><span class="label-text">姓名</span></div>
                <input class="input input-bordered" type="text" placeholder="您的姓名" v-model="nameInput" required>
              </label>
              <label class="form-control">
                <div class="label"><span class="label-text">邮箱</span></div>
                <input class="input input-bordered" type="email" placeholder="您的电子邮箱" v-model="emailInput" required>
              </label>
              <label class="form-control">
                <div class="label"><span class="label-text">主题</span></div>
                <input class="input input-bordered" type="text" placeholder="问题主题" v-model="subjectInput" required>
              </label>
              <label class="form-control">
                <div class="label"><span class="label-text">留言</span></div>
                <textarea class="textarea textarea-bordered h-32" placeholder="请详细描述您遇到的问题..." v-model="messageInput" required></textarea>
              </label>
              <button type="submit" class="btn btn-accent glow-accent mt-2">提交问题</button>
            </form>

            <div class="space-y-6 text-base">
              <div class="flex items-start gap-4">
                <span class="iconify text-accent mt-1" data-icon="heroicons:envelope-open" data-width="22"></span>
                <div>
                  <h3 class="font-bold text-accent">电子邮箱</h3>
                  <a class="link link-hover">support@stock-prediction.com</a>
                  <p class="text-sm text-base-content/70 mt-1">我们承诺在 24 小时内回复您的邮件。</p>
                </div>
              </div>
              <div class="flex items-start gap-4">
                <span class="iconify text-accent mt-1" data-icon="heroicons:clock" data-width="22"></span>
                <div>
                  <h3 class="font-bold text-accent">工作时间</h3>
                  <p>周一至周五，上午 9:00 - 下午 6:00（法定节假日除外）</p>
                </div>
              </div>
              <div class="flex items-start gap-4">
                <span class="iconify text-accent mt-1" data-icon="heroicons:sparkles" data-width="22"></span>
                <div>
                  <h3 class="font-bold text-accent">产品建议</h3>
                  <p>欢迎提出任何改进建议，你的想法是我们前进的动力。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.tech-background::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at 25% 25%, rgba(102, 102, 255, 0.08) 2px, transparent 2px),
    radial-gradient(circle at 75% 75%, rgba(51, 255, 204, 0.08) 2px, transparent 2px);
  background-size: 40px 40px, 40px 40px;
  opacity: 0.2;
  pointer-events: none;
}
.glass-panel {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(102, 102, 255, 0.1);
}
</style>


