import { defineStore } from 'pinia'
import api from '@/services/api'
import { Enums } from '@/enums'
import { toast } from 'vue3-toastify'

/* ============================
   TYPES
============================ */
interface User {
  id: number
  name: string
  email: string
  role: string
  lang?: string
  [key: string]: unknown
}

interface LoginForm {
  email: string
  password: string
}

interface RegisterPayload {
  name: string
  email: string
  password: string
  [key: string]: unknown
}

interface AuthResponse {
  token: string
  user: User
}

interface AuthState {
  token: string | null
  user: User | null
}

/* ============================
   STORE
============================ */
export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: sessionStorage.getItem('token') || null,
    user: JSON.parse(sessionStorage.getItem('user') || 'null'),
  }),

  getters: {
    isProvider: (state): boolean => state.user?.role === Enums.Role.Provider,
    isClient: (state): boolean => state.user?.role === Enums.Role.Client,
    isAdmin: (state): boolean => state.user?.role === Enums.Role.Admin,
    isLoggedIn: (state): boolean => !!state.user,
  },

  actions: {
    async login(form: LoginForm, locale?: { value: string }) {
      const { response } = await api.post<AuthResponse>('/login', form)
      this.setUserAndToken(response)

      // Optionally update locale based on user preference
      // if (locale && this.user?.lang) locale.value = this.user.lang
    },

    async register(payload: RegisterPayload) {
      const response = await api.post<AuthResponse>('/register', payload)
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

    clear() {
      this.token = null
      this.user = null
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('user')
      delete api.defaults.headers.common['Authorization']
    },

    setUserAndToken(response: AuthResponse) {
      this.token = response.token
      this.user = response.user

      sessionStorage.setItem('token', this.token)
      sessionStorage.setItem('user', JSON.stringify(this.user))
      api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
    },

    async fetchUser() {
      try {
        const { data } = await api.get<AuthResponse>('/me')
        this.setUserAndToken(data)
      } catch (error) {
        toast.error('Failed to fetch user.')
        console.error(error)
      }
    },
  },
})
