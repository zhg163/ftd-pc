import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/ftd-pc/',
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: '',
    rollupOptions: {
      output: {
        chunkFileNames: '[name]-[hash].js',
        entryFileNames: '[name]-[hash].js',
        assetFileNames: '[name]-[hash].[ext]'
      }
    }
  }
})
