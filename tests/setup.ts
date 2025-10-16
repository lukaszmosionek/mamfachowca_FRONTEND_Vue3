import { createRouter, createWebHistory } from 'vue-router'
import { beforeAll } from 'vitest'
import { config } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { createPinia } from 'pinia'
import routes from '@/router/routes'

import langs from '@/locales'

// Enable Composition API mode
const i18n = createI18n({
  legacy: false,   // ✅ Important for useI18n()
  locale: 'en',
  langs,
})


const router = createRouter({
  history: createWebHistory(),
  routes
})

beforeAll(() => {
  config.global.plugins.push(i18n)
  config.global.plugins.push(createPinia())
  config.global.plugins.push(router)
  config.global.stubs = ['font-awesome-icon', 'router-link']
})
