import { fileURLToPath, URL } from 'node:url'

// import { defineConfig } from 'vite'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'


// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    vue(),
    // Only enable Vue DevTools in development, not in test (Cypress) or production
    ...(mode === 'development' ? [vueDevTools()] : []),
  ],
  css: {
    preprocessorOptions: {
      scss: {
          additionalData: `@use "@/assets/styles/_variables" as *;`
      }
    }
  },
  test: {
    globals: true,     // allows `describe`, `it`, `expect` without imports
    environment: 'jsdom',
    setupFiles: './tests/setup.ts'
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
      // '@': path.resolve(__dirname, './src'),
    },
  },
  base: '/',
  // base: '/home/serwer2529876/public_html/mamfachowca.mosioneklukasz.pl',
}))
