import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const API_TARGET = process.env.API_TARGET ?? 'http://localhost:5000';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: ['@dagrejs/dagre'],
  },
  server: {
    proxy: {
      '/classrooms': API_TARGET,
      '/template': API_TARGET,
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-grid': ['ag-grid-community', 'ag-grid-react'],
          'vendor-charts': ['recharts'],
          'vendor-xlsx': ['xlsx'],
        },
      },
    },
  },
})
