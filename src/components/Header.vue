<template>
  <header class="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
    <h1 class="text-xl font-bold">
      <RouterLink to="/">Moja Aplikacja</RouterLink>
    </h1>
    <nav class="flex items-center gap-4">
      <RouterLink v-if="!authStore.token" to="/login">Zaloguj</RouterLink>
      <RouterLink v-if="!authStore.token" to="/register">Rejestracja</RouterLink>

      <RouterLink v-if="authStore.token && isClient" to="/appointments">Moje wizyty</RouterLink>
      <RouterLink v-if="authStore.token && isProvider" to="/my-services">Moje usługi</RouterLink>

      <span v-if="authStore.user" class="font-semibold">{{ authStore.user.name }}</span>
      <button
        v-if="authStore.token"
        @click="logout"
        class="bg-red-500 px-3 py-1 rounded text-sm"
      >
        Wyloguj
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
