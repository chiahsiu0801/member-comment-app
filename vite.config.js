import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/realtime-chat-app/",
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: [
          "http://localhost:3000",
        ],
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
})
