import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import api from './services/api'

import { createI18n } from 'vue-i18n'
import pl from './locales/pl.json'
import en from './locales/en.json'

import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

// Create i18n instance
const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: 'en',
  fallbackLocale: 'en',
  messages: { pl, en }
})

const token = localStorage.getItem('token')
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

const app = createApp(App)
app.use(createPinia())
app.use(i18n)
app.use(Vue3Toastify)
app.use(router)
app.mount('#app')

window.cl = console.log
