import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/member-comment-app/",
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: [
          "https://member-real-time-chatroom.vercel.app/",
        ],
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
})
