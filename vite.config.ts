import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base: './' — сайт работает из любой папки на обычном хостинге
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
