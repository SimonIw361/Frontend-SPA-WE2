import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/preview-options.html#preview-port
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  preview:{
    port: 3000,
  }
})
