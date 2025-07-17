import { defineStore } from 'pinia'
import api from '@/services/api'
import { useRouter } from 'vue-router'

// const router = useRouter()

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: JSON.parse(localStorage.getItem('user')) || '',
  }),
  actions: {
    async login(form) {
      const res = await api.post('/login', form)
      this.token = res.data.token
      this.user = res.data.user

      localStorage.setItem('token', this.token)
      localStorage.setItem('user', JSON.stringify(this.user))
      api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
    },
    async logout() {
      try {
        await api.post('/logout')
      } catch (error) {
        console.error('Logout failed:', error)
      }
      this.token = ''
      this.user = ''
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      delete api.defaults.headers.common['Authorization']
      router.push('/login')
    },
    async register(payload) {
      const res = await api.post('/register', payload)
      this.token = res.data.token
      this.user = res.data.user
      localStorage.setItem('token', this.token)
      localStorage.setItem('user', JSON.stringify(this.user))
      api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
    },
  },
})
