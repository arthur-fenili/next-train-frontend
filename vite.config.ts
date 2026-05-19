import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const bffUrl = env.VITE_BFF_URL || 'http://localhost:8000'

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/lines': {
          target: bffUrl,
          changeOrigin: true,
        },
      },
    },
  }
})
