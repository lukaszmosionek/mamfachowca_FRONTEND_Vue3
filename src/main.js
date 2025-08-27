import '@/assets/styles/main.scss'

import '@fortawesome/fontawesome-free/css/all.css';

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { initEcho } from '@/plugins/echo'

import App from './App.vue'
import router from './router'
import i18n from './i18n'
import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { FontAwesomeIcon } from './plugins/fontawesome.js' // ✅ Import from your plugin

const app = createApp(App)
app.use(createPinia())
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(i18n)
app.use(Vue3Toastify)
app.use(router)

import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()

if (authStore.token) {
    initEcho() // <-- Echo is initialized here
}

app.mount('#app')

app.config.globalProperties.$VueValidation = true;

window.l = console.log
