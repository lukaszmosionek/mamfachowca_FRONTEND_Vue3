import { defineStore } from 'pinia'
import api from '@/services/api'
import { Enums } from '@/enums.js'
import { toast } from 'vue3-toastify'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: sessionStorage.getItem('token') || null,
    user: JSON.parse(sessionStorage.getItem('user')) || null,
  }),
  getters: {
    isProvider: (state) => state.user?.role === Enums.Role.Provider,
    isClient: (state) => state.user?.role === Enums.Role.Client,
    isAdmin: (state) => state.user?.role === Enums.Role.Admin,
    isLoggedIn: (state) => !!state.user,
  },
  actions: {
    async login(form, locale) {
      // await axios.get("/sanctum/csrf-cookie")
      const response = await api.post('/login', form)
      this.setUserAndToken(response)

      locale.value = this.user.lang
    },
    async register(payload) {
      const response = await api.post('/register', payload)
      this.setUserAndToken(response)
    },
    async logout() {
      try {
        await api.post('/logout')
      } catch (error) {
        console.error('Logout failed:', error)
      }
      this.clear()
    },
    clear(){
      this.token = ''
      this.user = ''
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('user')

      delete api.defaults.headers.common['Authorization']
    },
    setUserAndToken(response){
      this.token = response.token
      this.user = response.user

      sessionStorage.setItem('token', this.token)
      sessionStorage.setItem('user', JSON.stringify(this.user) )

      api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
    },
    async fetchUser(){
      try {
        const response = await api.get('/me')
        this.setUserAndToken(response)
      } catch (error) {
        toast.error('Failed to fetch user:', error)
      }
    }
  },
})
