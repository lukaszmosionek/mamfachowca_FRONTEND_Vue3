import './assets/styles/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import api from './services/api'
import i18n from './i18n' // Import from i18n.ts
import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

// await axios.get(import.meta.env.VITE_BACKEND_URL+'/sanctum/csrf-cookie').catch(error => {
// await api.get('/sanctum/csrf-cookie').catch(error => {
//   console.error('Failed to get CSRF cookie:', error);
// });


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
