import axios from 'axios'
import i18n from '@/i18n'
import router from '@/router';
import { useAuthStore } from '@/stores/auth'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  withCredentials: true,
})

api.interceptors.request.use(config => {
  config.headers['Accept-Language'] = localStorage.getItem('lang') ?? 'en'

    const authStore = useAuthStore()
    const token = authStore.token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

  return config
})

api.interceptors.response.use(
  response => {
    // Flatten deeply nested data
    response = response?.data?.data ?? response.data
    return response
  },
  error => {
    // Log or transform the error
    console.error({error})

    if (error.response && error.response.data.message === 'Unauthenticated.' ) {
        if (router.currentRoute.value.name !== 'Login') {
            router.push({ name: 'Login', query: { redirect: router.currentRoute.value.fullPath, successMessage: 'other.sessionExpired' } })
            const authStore = useAuthStore()
            authStore.clear()
        }
    }

    if (error.response && error.response.status === 404 && error.response?.data?.error_code === 'API_ROUTE_NOT_FOUND' ) {
        alert(error.response?.data?.message +' ' + i18n.global.t('other.tryAgainLater') );
    }

    if (error.response.status === 500) {
        alert( i18n.global.t('other.serverError') + ' ' + i18n.global.t('other.tryAgainLater') );
    }

    const errorData = error.response?.data?.data ?? error?.response.data

    return Promise.reject(errorData);
  }
);

export default api
