import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import routes from './routes'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Autoryzacja tras
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()

  const requiresAuth = to.meta.requiresAuth
  const requiredRole = to.meta.role

  if (requiresAuth && !auth.token) {
     alert('Dostep tylko dla zalogowanych')
    return next({ name: 'Login' })
  }

  if (requiresAuth && requiredRole && auth.user?.role !== requiredRole) {
    alert('Brak dostępu (403)')
    return next({ name: 'Home' }) // lub np. 403
  }

  next()
})

export default router
