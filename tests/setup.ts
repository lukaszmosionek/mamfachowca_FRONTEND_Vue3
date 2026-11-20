import { createRouter, createWebHistory } from 'vue-router'
import { beforeAll, vi } from 'vitest'
import { config } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { createPinia } from 'pinia'
import routes from '@/router/routes'

import langs from '@/locales'

vi.mock('@/services/api.ts', () => ({
  default: {
    get: vi.fn(async (url: string) => {
      if (url === '/services') return { services: [], last_page: 1 }
      if (url === '/providers') return { providers: [] }
      return {}
    }),
    post: vi.fn(),
  },
}))

// Enable Composition API mode
const i18n = createI18n({
  legacy: false,   // ✅ Important for useI18n()
  locale: 'en',
  fallbackLocale: 'en',
  messages: langs,
})


export const router = createRouter({
  history: createWebHistory(),
  routes
})

beforeAll(() => {
  config.global.plugins.push(i18n)
  config.global.plugins.push(createPinia())
  config.global.plugins.push(router)
  config.global.stubs = ['font-awesome-icon', 'router-link']
})
