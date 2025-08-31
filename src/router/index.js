import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import routes from '@/router/routes'
import Swal from 'sweetalert2'
import i18n from '@/i18n'

const router = createRouter({
  history: createWebHistory(),
  routes: routes ?? []
})

// Autoryzacja tras
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()

  const requiresAuth = to.meta.requiresAuth
  const requiredRole = to.meta.role

  if ( requiresAuth && !auth.token ) {
    const result = await Swal.fire( i18n.global.t('Access only for logged in users'),'', 'warning')
    if (result.isConfirmed) return next({ name: 'Login', query: { redirect: to.fullPath ?? from.fullPath } })
    return next(false)
  }

  if ( requiresAuth && requiredRole && auth.user?.role !== requiredRole && auth.user?.role !== 'admin' ) {
    const result = await Swal.fire( i18n.global.t('No access (403)'), '','warning')
    if (result.isConfirmed) return next({ name: 'Home' }) // lub np. 403
    return next(false)
  }

  next()
})

export default router
