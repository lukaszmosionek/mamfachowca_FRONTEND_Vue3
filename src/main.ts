import '@/assets/styles/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { initEcho } from '@/plugins/echo.ts'

import App from './App.vue'
import router from './router/index.ts'
import i18n from './i18n.ts'
import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { FontAwesomeIcon } from './plugins/fontawesome.ts' // ✅ Import from your plugin

const app = createApp(App)
app.use(createPinia())
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(i18n)
app.use(Vue3Toastify)
app.use(router)

import { useAuthStore } from '@/stores/auth.ts'
const authStore = useAuthStore()

if (authStore.token) {
    initEcho() // <-- Echo is initialized here
}

// Check localStorage to enable or disable devtools
// if (localStorage.getItem('vueDevtoolsDisabled') === 'true') {
//   (app.config as any).devtools = false
// } else {
//   (app.config as any).devtools = true
// }

app.mount('#app')

app.config.globalProperties.$VueValidation = true;


