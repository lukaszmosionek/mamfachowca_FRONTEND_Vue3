import { defineStore } from 'pinia'
import api from '@/services/api'
import { useRouter } from 'vue-router'

const router = useRouter()

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: null as null | Record<string, any>,
  }),
  actions: {
    async login(email: string, password: string) {
      const res = await api.post('/login', { email, password })
      this.token = res.data.data.token
      this.user = res.data.data.user

      localStorage.setItem('token', this.token)
      api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
    },
    async logout() {
      await api.post('/logout')
      this.token = ''
      this.user = null
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
    },
    async register(payload: Record<string, any>) {
      const res = await api.post('/register', payload)
      this.token = res.data.data.token
      this.user = res.data.data.user
      localStorage.setItem('token', this.token)
      api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
    },
  },
})
