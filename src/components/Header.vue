<template>
  <div ref="container">
    <header class="bg-gray-800 py-4 text-white">
      <div class="wrapper flex items-center justify-between">
        <h1 class="font-bold md:text-xl" id="logo">
          <RouterLink
            class="link-home"
            :to="{ name: 'Home', params: {}, query: {} }"
            @click="headerStore.triggerHomeClick()"
          >
            <font-awesome-icon :icon="['fas', 'hammer']" title="Home Page" />&nbsp;Mam Fachowca
          </RouterLink>
        </h1>

        <div class="flex items-center gap-2">
          <RouterLink v-if="isLogged" :to="{ name: 'Favorites' }" :aria-label="$t('favorites.title')">
            <font-awesome-icon :icon="['far', 'heart']" />
          </RouterLink>
          <NotificationDropdown v-if="isLogged" />
          <button
            type="button"
            aria-label="Menu"
            aria-controls="site-menu"
            :aria-expanded="menuOpen"
            @click="menuOpen = !menuOpen"
          >
            <img src="@/assets/icons/hamburger-icon.svg" class="h-6 w-6" alt="">
          </button>
        </div>
      </div>
    </header>

    <nav v-if="menuOpen" id="site-menu" class="bg-gray-700 px-6 py-4 text-white">
      <div class="wrapper flex flex-col gap-2">
        <RouterLink
          v-if="authStore.isAdmin"
          :to="{ name: 'AdminDashboard', params: {}, query: {} }"
          @click="headerStore.triggerHomeClick(); menuOpen = false"
        >
          Admin Panel
        </RouterLink>

        <RouterLink v-if="isLogged" :to="{ name: 'Messages', params: { userId: 1 } }" @click="menuOpen = false">
          {{ $t('header.messages') }}
        </RouterLink>
        <RouterLink v-if="isLogged" :to="{ name: 'Favorites' }" @click="menuOpen = false">
          {{ $t('favorites.title') }}
        </RouterLink>
        <RouterLink v-if="isLogged" :to="{ name: 'Appointments' }" @click="menuOpen = false">
          {{ $t('header.appointments') }}
        </RouterLink>
        <RouterLink v-if="isLogged && isProvider" :to="{ name: 'MyServices' }" @click="menuOpen = false">
          {{ $t('header.my-services') }}
        </RouterLink>
        <RouterLink v-if="isLogged" :to="{ name: 'Account' }" @click="menuOpen = false">
          {{ $t('header.account') }} — {{ authStore.user.name }} #{{ authStore.user.id }} ({{ authStore.user.role }})
        </RouterLink>

        <RouterLink :to="{ name: 'Contact' }" @click="menuOpen = false">
          {{ $t('header.contact') }}
        </RouterLink>
        <RouterLink :to="{ name: 'About' }" @click="menuOpen = false">
          {{ $t('header.about') }}
        </RouterLink>
        <RouterLink v-if="!isLogged" :to="{ name: 'Login' }" @click="menuOpen = false">
          {{ $t('header.login') }}
        </RouterLink>
        <RouterLink v-if="!isLogged" :to="{ name: 'Register' }" @click="menuOpen = false">
          {{ $t('header.register') }}
        </RouterLink>

        <div class="mt-2 border-t border-gray-600 pt-3">
          <div class="mb-3 px-3">
            <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-300">
              {{ $t('header.currency') }}
            </span>
            <CurrencySwitcher :label="$t('header.currency')" />
          </div>
          <span class="block px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-300">
            {{ $t('header.language') }}
          </span>
          <ChangeLanguage class="!justify-start !py-0 !text-white" />
        </div>

        <BaseButton
          v-if="isLogged"
          @click="handleLogout"
          :loading="loading"
          class="w-fit cursor-pointer rounded bg-red-500 px-3 py-1 text-sm hover:bg-red-700 disabled:opacity-60"
        >
          <font-awesome-icon :icon="['fas', 'right-from-bracket']" />&nbsp;{{ $t('header.logout') }}
        </BaseButton>
      </div>
    </nav>
  </div>
</template>

<style scoped>
#site-menu a,
#site-menu :deep(.changeLanguage) {
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  transition: background-color 150ms ease, color 150ms ease;
}

#site-menu a {
  display: block;
}

#site-menu :deep(.changeLanguage) {
  display: flex;
  align-items: center;
}

#site-menu a:hover,
#site-menu a:focus-visible,
#site-menu :deep(.changeLanguage:hover),
#site-menu :deep(.changeLanguage:focus-visible) {
  background-color: rgba(255, 255, 255, 0.14);
}

#site-menu a:focus-visible,
#site-menu :deep(.changeLanguage:focus-visible) {
  outline: 2px solid white;
  outline-offset: 2px;
}
</style>

<script setup>
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { computed, ref, watch, onBeforeUnmount, onMounted } from 'vue'
import { toast } from 'vue3-toastify'
import { useAuthStore } from '@/stores/auth.ts'
import BaseButton from '@/components/BaseButton.vue'
import ChangeLanguage from './ChangeLanguage.vue'
import CurrencySwitcher from './CurrencySwitcher.vue'
import NotificationDropdown from '@/components/NotificationDropdown.vue'
import { useHeaderStore } from '@/stores/useHeaderStore.ts'
import { useI18n } from 'vue-i18n'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const headerStore = useHeaderStore()
const { t } = useI18n()

const isProvider = computed(() => authStore.isProvider)
const isLogged = computed(() => authStore.isLoggedIn )
const menuOpen = ref(false)
const container = ref(null)
const loading = ref(false)

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

const logout = async () => {
  loading.value = true
  try {
    await authStore.logout()
    router.push({ name: 'Login', query: { successMessage: 'header.logged-out-successfully' } })
  } catch (error) {
    console.error('API call error:', error?.message)
  } finally {
    loading.value = false
  }
}

const handleLogout = async () => {
  menuOpen.value = false
  await logout()
}

watch(() => route.fullPath, () => {
  menuOpen.value = false
})

watch(() => route.query.successMessage, (newValue) => {
  if (route.query.successMessage) {
    toast.success(t(route.query.successMessage))
  }
  if (route.query.errorMessage) {
    toast.error(route.query.errorMessage)
  }
})

//click Outside mobile dropdown menu
function handleClickOutside(event) {
  if (container.value && !container.value.contains(event.target)) {
      menuOpen.value = false
  }
}

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
