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
