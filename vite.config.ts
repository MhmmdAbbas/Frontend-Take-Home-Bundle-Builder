import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // 8080 is reserved on this machine; start at 8081 and auto-bump if busy
    host: true, // expose on LAN so phones can open the Network URL
    port: 8081,
    strictPort: false,
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
  preview: {
    host: true,
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
