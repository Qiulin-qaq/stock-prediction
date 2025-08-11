<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const showClear = ref(false)
const submitting = ref(false)

const feedbackType = ref('') // success | error | info
const feedbackText = ref('')

function onEmailInput(e) {
  showClear.value = !!email.value
}

function clearEmail() {
  email.value = ''
  showClear.value = false
}

function setFeedback(message, type = 'info') {
  feedbackText.value = message
  feedbackType.value = type
}

function submit() {
  const value = email.value.trim()
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!value) {
    setFeedback('邮箱地址不能为空。', 'error')
    return
  }
  if (!emailRegex.test(value)) {
    setFeedback('请输入有效的邮箱地址。', 'error')
    return
  }

  setFeedback('密码重置链接已发送至您的邮箱，请注意查收。', 'success')
  submitting.value = true

  setTimeout(() => {
    router.push('/login')
  }, 3000)
}
</script>

<template>
  <div class="font-body bg-base-100 text-base-content min-h-screen flex flex-col">
    <main class="flex-grow flex items-center justify-center p-4 relative overflow-hidden">
      <div class="absolute inset-0 z-0 bg-circuit-pattern opacity-10"></div>

      <section class="relative z-10 w-full max-w-md">
        <div class="card glass-panel shadow-tech-lg noise-texture">
          <div class="card-body p-8 md:p-12">
            <h1 class="card-title text-3xl font-bold text-center mb-6">忘记密码</h1>
            <p class="text-center text-base-content/70 mb-8">请输入您的注册邮箱地址，我们将向您发送密码重置链接。</p>

            <div class="mb-4 min-h-[48px]">
              <div v-if="feedbackText" class="alert shadow-lg text-sm" :class="{
                'alert-success': feedbackType==='success',
                'alert-error': feedbackType==='error',
                'alert-info': feedbackType==='info'
              }">
                <span class="iconify" data-icon="heroicons:information-circle" data-width="18"></span>
                <span>{{ feedbackText }}</span>
              </div>
            </div>

            <form @submit.prevent="submit">
              <div class="form-control">
                <label class="label">
                  <span class="label-text text-base-content/80">注册邮箱</span>
                </label>
                <div class="relative">
                  <input :disabled="submitting" v-model="email" @input="onEmailInput" type="email" placeholder="例如: user@example.com" class="input input-bordered w-full pr-10" required />
                  <button type="button" class="btn btn-ghost btn-circle btn-sm absolute top-1/2 right-2 -translate-y-1/2" :class="{ 'hidden': !showClear }" @click="clearEmail">
                    <span class="iconify text-base-content/50" data-icon="heroicons:x-circle-solid" data-width="20"></span>
                  </button>
                </div>
              </div>

              <div class="form-control mt-8">
                <button :disabled="submitting" type="submit" class="btn btn-primary w-full">
                  提交重置请求
                </button>
              </div>
            </form>

            <div class="divider my-6 text-base-content/50">或者</div>

            <div class="text-center">
              <router-link to="/login" class="link link-hover text-secondary font-semibold">返回登录</router-link>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.bg-circuit-pattern {
  background-image:
    linear-gradient(rgba(102, 102, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(102, 102, 255, 0.05) 1px, transparent 1px),
    linear-gradient(rgba(51, 255, 204, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(51, 255, 204, 0.03) 1px, transparent 1px);
  background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;
  background-position: -2px -2px, -2px -2px, -1px -1px, -1px -1px;
  animation: pan-background 60s linear infinite;
}
@keyframes pan-background { 0% { background-position: 0% 0%; } 100% { background-position: 100% 100%; } }

.noise-texture::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuODUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48ZmVDb21wb25lbnRUcmFuc2Zlcj48ZmVGdW5jQSB0eXBlPSJkaXNjcmV0ZSIgdGFibGVWYWx1ZXM9IjAgMSIvPjwvZmVDb21wb25lbnRUcmFuc2Zlcj48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIi8+PC9zdmc+');
  opacity: 0.025;
  pointer-events: none;
  z-index: -1;
}

.glass-panel {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(102, 102, 255, 0.1);
}
</style>


