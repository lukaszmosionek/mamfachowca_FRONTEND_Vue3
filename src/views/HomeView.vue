<template>
  <div>
    <Header />

    <main class="p-6 text-center">
      <h2 class="text-3xl  text-gray-700 font-bold mb-4">Witamy w naszej aplikacji!</h2>
      <p class="text-lg text-gray-700">
        Tutaj możesz umówić wizytę lub zarządzać swoimi usługami.
      </p>

      <div class="mt-8">
        <RouterLink
          v-if="isClient"
          to="/appointments"
          class="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Przeglądaj dostępne usługi
        </RouterLink>

        <RouterLink
          v-if="isProvider"
          to="/my-services"
          class="bg-green-600 text-white px-4 py-2 rounded"
        >
          Zarządzaj swoimi usługami
        </RouterLink>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Header from '@/components/Header.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const isProvider = computed(() => authStore.user?.role === 'provider')
const isClient = computed(() => authStore.user?.role === 'client')
</script>
