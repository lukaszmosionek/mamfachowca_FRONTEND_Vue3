<template>

  <header class="bg-gray-800 text-white px-6 py-4">
    <div class="wrapper flex justify-between items-center">
      <h1 class="text-xl font-bold">
        <RouterLink to="/">{{ $t('Home') }}</RouterLink>
      </h1>

      <!-- Hamburger Icon (Mobile only) -->
      <button class="md:hidden" @click="mobileMenuOpen = !mobileMenuOpen">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
             viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>

      <!-- Desktop Nav -->
      <nav class="hidden md:flex items-center gap-4">

        <ChangeLanguage/>

        <button @click="clearCache" class="clear-button">
            {{ $t('Clear Cache') }}
        </button>

        <RouterLink v-if="!authStore.token" to="/login">{{ $t('Login') }}</RouterLink>
        <RouterLink v-if="!authStore.token" to="/register">{{ $t('Register') }}</RouterLink>

        <RouterLink v-if="authStore.token && isClient" to="/appointments">{{ $t('Appointments') }}</RouterLink>
        <RouterLink v-if="authStore.token && isProvider" to="/my-services">{{ $t('My services') }}</RouterLink>

        <RouterLink v-if="authStore.token" to="/account">{{ authStore.user.name }} ({{ isProvider ? authStore.user.role : '' }})</RouterLink>
        <BaseButton :loading="loading" :name="$t('Logout')" class="bg-red-500 px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-60 cursor-pointer w-fit" v-if="authStore.token" @click="logout"/>

      </nav>
    </div>
  </header>

  <!-- Mobile Menu (shown when hamburger is clicked) -->
  <nav
    v-if="mobileMenuOpen"
    class="md:hidden bg-gray-700 text-white px-6 py-4 flex flex-col gap-2"
  >
    <RouterLink @click="mobileMenuOpen = false" v-if="!authStore.token" to="/login">{{ $t('Login') }}</RouterLink>
    <RouterLink @click="mobileMenuOpen = false" v-if="!authStore.token" to="/register">{{ $t('Register') }}</RouterLink>

    <RouterLink @click="mobileMenuOpen = false" v-if="authStore.token && isClient" to="/appointments">{{ $t('Appointments') }}</RouterLink>
    <RouterLink @click="mobileMenuOpen = false" v-if="authStore.token && isProvider" to="/my-services">{{ $t('My services') }}</RouterLink>

    <span v-if="authStore.user" class="font-semibold mt-6">
      {{ authStore.user.name }} ({{ isProvider ? authStore.user.role : '' }})
    </span>

    <button
      v-if="authStore.token"
      @click="handleLogout"
      class="bg-red-500 px-3 py-1 rounded text-sm hover:bg-red-700"
    >
      {{ $t('Logout') }}
    </button>
  </nav>
</template>


<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter, RouterLink } from 'vue-router'
import { computed, ref } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import ChangeLanguage from './ChangeLanguage.vue'
import { toast } from 'vue3-toastify'

const authStore = useAuthStore()
const router = useRouter()

const isProvider = computed(() => authStore.user?.role === 'provider')
const isClient = computed(() => authStore.user?.role === 'client')
const mobileMenuOpen = ref(false)
const loading = ref(false)

const logout = async () => {
  loading.value = true
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('API call error:', error?.message)
  } finally {
    loading.value = false
  }
}

const handleLogout = async () => {
  mobileMenuOpen.value = false
  await logout()
}

function clearCache() {
  // Remove specific auth/local data
  localStorage.removeItem('token'); // or whatever key you're using

  // OR: Clear all localStorage
  localStorage.clear();

  // Optional: Redirect to login or refresh the app
  window.location.reload(); // or use Vue Router to redirect
}
</script>
