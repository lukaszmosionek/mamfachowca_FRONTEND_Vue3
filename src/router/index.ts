// src/router/index.ts
import { createRouter, createWebHistory, type RouteLocationNormalized, type NavigationGuardNext } from 'vue-router'
import { useAuthStore } from '@/stores/auth.ts'
import routes from '@/router/routes.ts'
import Swal from 'sweetalert2'
import i18n from '@/i18n'

// Typ rozszerzający meta pola trasy
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    role?: string
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes: routes ?? []
})

// Autoryzacja tras
router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const auth = useAuthStore()

  const requiresAuth = to.meta.requiresAuth
  const requiredRole = to.meta.role

  // Sprawdzenie autoryzacji użytkownika
  if (requiresAuth && !auth.token) {
    const result = await Swal.fire({
      title: i18n.global.t('other.unauthorized') as string,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: i18n.global.t('other.buttons.goToLogin') as string,
      cancelButtonText: i18n.global.t('other.buttons.ok') as string
    })

    if (result.isConfirmed) {
      return next({
        name: 'Login',
        query: { redirect: to.fullPath ?? from.fullPath }
      })
    }

    return next(false)
  }

  // Sprawdzenie roli użytkownika
  if (
    requiresAuth &&
    requiredRole &&
    auth.user?.role !== requiredRole &&
    auth.user?.role !== 'admin'
  ) {
    const result = await Swal.fire(
      i18n.global.t('other.forbidden') as string,
      '',
      'warning'
    )

    if (result.isConfirmed) {
      return next({ name: 'Home' })
    }

    return next(false)
  }

  next()
})

export default router
