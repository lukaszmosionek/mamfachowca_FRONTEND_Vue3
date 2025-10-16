import axios from 'axios'
import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import i18n from '@/i18n'
import router from '@/router'
import { useAuthStore } from '@/stores/auth.ts'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string

const api: AxiosInstance = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  config.headers = config.headers || {}
  config.headers['Accept-Language'] = localStorage.getItem('lang') ?? 'en'

  const authStore = useAuthStore()
  const token = authStore.token

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response?.data?.data ?? response.data
  },
  (error: AxiosError<any>) => {
    console.error({ error })

    const response = error.response
    const authStore = useAuthStore()

    if (response?.data?.message === 'Unauthenticated.') {
      if (router.currentRoute.value.name !== 'Login') {
        router.push({
          name: 'Login',
          query: {
            redirect: router.currentRoute.value.fullPath,
            successMessage: 'other.sessionExpired',
          },
        })
        authStore.clear()
      }
    }

    if (response?.status === 404 && response.data?.error_code === 'API_ROUTE_NOT_FOUND') {
      alert(`${response.data?.message} ${i18n.global.t('other.tryAgainLater')}`)
    }

    if (response?.status === 500) {
      alert(`${i18n.global.t('other.serverError')} ${i18n.global.t('other.tryAgainLater')}`)
    }

    const errorData = response?.data?.data ?? response?.data ?? error
    return Promise.reject(errorData)
  }
)

export default api
