<template>
  <header class="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
    <h1 class="text-xl font-bold">
      <RouterLink to="/">Home</RouterLink>
    </h1>
    <nav class="flex items-center gap-4">
      <RouterLink v-if="!authStore.token" to="/login">Login</RouterLink>
      <RouterLink v-if="!authStore.token" to="/register">Register</RouterLink>

      <RouterLink v-if="authStore.token && isClient" to="/appointments">Appointments</RouterLink>
      <RouterLink v-if="authStore.token && isProvider" to="/my-services">My services</RouterLink>

      <span v-if="authStore.user" class="font-semibold">{{ authStore.user.name }}({{ isProvider ? authStore.user.role : '' }})</span>
      <button
        v-if="authStore.token"
        @click="logout"
        class="bg-red-500 px-3 py-1 rounded text-sm cursor-pointer hover:bg-red-700"
      >
        Logout
      </button>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter, RouterLink } from 'vue-router'
import { computed } from "vue";

const authStore = useAuthStore()
const router = useRouter()

const logout = async () => {
  await authStore.logout()
  router.push('/login')
}

const isProvider = computed(() => authStore.user?.role === 'provider')
const isClient = computed(() => authStore.user?.role === 'client')
</script>
