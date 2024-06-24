import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  '/api': {
    target: 'http://localhost:1989',
    changeOrigin: true,
    // rewrite: path => path.replace(/^\/api/, '')
  },
  server: {
    host: '127.0.0.1',
    port: '3000',
    proxy: {
      '/api': {
        target: 'http://localhost:1989',
        changeOrigin: true,
        secure: false,
        // rewrite: path => path.replace(/^\/api/, '')
      },
    }
  }
})
