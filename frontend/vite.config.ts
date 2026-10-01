import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // strictPort membuat Vite gagal start bila 5173 sudah dipakai, bukan diam-diam
    // pindah ke 5174. Port harus sama dengan SANCTUM_STATEFUL_DOMAINS/FRONTEND_URL
    // di Backend/.env, kalau tidak Sanctum menolak session sebagai first-party
    // dan semua request tulis admin dibalas 401.
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/sanctum': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/storage': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
})