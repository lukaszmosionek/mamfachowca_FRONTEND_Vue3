<template>

  <header class="bg-gray-800 text-white px-6 py-4">
  <div class="wrapper  flex justify-between items-center">
    <h1 class="text-xl font-bold">
      <RouterLink to="/">Home</RouterLink>
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
      <RouterLink v-if="!authStore.token" to="/login">Login</RouterLink>
      <RouterLink v-if="!authStore.token" to="/register">Register</RouterLink>

      <RouterLink v-if="authStore.token && isClient" to="/appointments">Appointments</RouterLink>
      <RouterLink v-if="authStore.token && isProvider" to="/my-services">My services</RouterLink>

      <span v-if="authStore.user" class="font-semibold">
        {{ authStore.user.name }} ({{ isProvider ? authStore.user.role : '' }})
      </span>

      <button
        v-if="authStore.token"
        @click="logout"
        class="bg-red-500 px-3 py-1 rounded text-sm hover:bg-red-700"
      >
        Logout
      </button>
    </nav>
    </div>
  </header>

  <!-- Mobile Menu (shown when hamburger is clicked) -->
  <nav
    v-if="mobileMenuOpen"
    class="md:hidden bg-gray-700 text-white px-6 py-4 flex flex-col gap-2"
  >
    <RouterLink @click="mobileMenuOpen = false" v-if="!authStore.token" to="/login">Login</RouterLink>
    <RouterLink @click="mobileMenuOpen = false" v-if="!authStore.token" to="/register">Register</RouterLink>

    <RouterLink @click="mobileMenuOpen = false" v-if="authStore.token && isClient" to="/appointments">Appointments</RouterLink>
    <RouterLink @click="mobileMenuOpen = false" v-if="authStore.token && isProvider" to="/my-services">My services</RouterLink>

    <span v-if="authStore.user" class="font-semibold mt-6">
      {{ authStore.user.name }} ({{ isProvider ? authStore.user.role : '' }})
    </span>

    <button
      v-if="authStore.token"
      @click="handleLogout"
      class="bg-red-500 px-3 py-1 rounded text-sm hover:bg-red-700"
    >
      Logout
    </button>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter, RouterLink } from 'vue-router'
import { computed, ref } from 'vue'

const authStore = useAuthStore()
const router = useRouter()

const isProvider = computed(() => authStore.user?.role === 'provider')
const isClient = computed(() => authStore.user?.role === 'client')
const mobileMenuOpen = ref(false)

const logout = async () => {
  await authStore.logout()
  router.push('/login')
}

const handleLogout = async () => {
  mobileMenuOpen.value = false
  await logout()
}
</script>
