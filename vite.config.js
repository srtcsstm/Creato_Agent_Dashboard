import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // '@' alias'ını 'src' klasörüne işaret et
      '@': path.resolve(__dirname, './src'),
    },
  },
  publicDir: 'public', // Explicitly define public directory
})
