import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/market-overview'
  },
  {
    path: '/market-overview',
    name: 'marketOverview',
    component: () => import('../views/MarketOverview.vue')
  },
  {
    path: '/personalization',
    name: 'personalizationSettings',
    component: () => import('../views/PersonalizationSettings.vue')
  },
  {
    path: '/help-support',
    name: 'helpSupport',
    component: () => import('../views/HelpSupport.vue')
  },
  {
    path: '/forgot-password',
    name: 'forgotPassword',
    component: () => import('../views/ForgotPassword.vue')
  },
  {
    path: '/alert-settings',
    name: 'alertSettings',
    component: () => import('../views/AlertSettings.vue')
  },
  {
    path: '/agent-comparison',
    name: 'agentComparison',
    component: () => import('../views/AgentComparison.vue')
  },
  
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router