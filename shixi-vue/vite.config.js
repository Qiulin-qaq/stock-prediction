import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from 'tailwindcss'
import daisyui from 'daisyui'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~assets': path.resolve(__dirname, '../assets')
    },
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        daisyui
      ]
    }
  },
  server: {
    port: 8080,
    open: true
  }
})
