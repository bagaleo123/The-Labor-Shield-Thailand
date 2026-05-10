import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

// Стандартный конфиг для обычного React приложения
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths()
  ],
  build: {
    outDir: 'dist',
  }
})
