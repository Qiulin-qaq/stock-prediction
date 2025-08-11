import './assets/global.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// ����VueӦ��
const app = createApp(App)

// ʹ��·��
app.use(router)

// ����Ӧ��
app.mount('#app')
