import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/control-admin-vue/',
  server: {
    port: 6001
  }
})