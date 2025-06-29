<template>
  <div class="max-w-md mx-auto mt-20 p-6 bg-white shadow-lg rounded-xl">
    <h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">Login</h2>
    <form @submit.prevent="handleLogin" class="space-y-4">
      <input
        v-model="email"
        placeholder="Email"
        class="mt-3 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="pt-3 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
      />
      <button
        type="submit"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition-colors"
      >
        Zaloguj
      </button>
    </form>
  </div>
</template>


<script lang="ts" setup>
import { ref } from 'vue'
import api from '@/services/api'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const email = ref('')
const password = ref('')
const router = useRouter()
const store = useAuthStore()

const handleLogin = async () => {
  await store.login(email.value, password.value)
  router.push('/')
}
</script>
