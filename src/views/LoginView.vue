<template>
  <Header />
  <div class="max-w-md mx-auto mt-20 p-6 bg-white shadow-lg rounded-xl">
    <h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">Login</h2>

    <div class="text-center text-gray-800 space-y-1 mb-4">
      <div class="text-gray-800 text-center mt-3">provider@onet.pl | password </div>
      <div class="text-gray-800 text-center mt-3 mb-3">client@onet.pl | password</div>
    </div>

    <form @submit.prevent="handleLogin" class="space-y-4">
      <input
        v-model="email"
        placeholder="Email"
        class="mt-3 inline-block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
      />
      <div v-if="errors.errors?.email" class="text-red-500">
        <span v-for="(msg, i) in errors.errors.email" :key="i">{{ msg }}</span>
      </div>

      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="mt-3 inline-block pt-3 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
      />
      <div v-if="errors.errors?.password" class="text-red-500">
        <span v-for="(msg, i) in errors.errors.password" :key="i">{{ msg }}</span>
      </div>

      <div v-if="!errors.errors && errors?.message" class="text-red-500">
        <span>{{ errors.message }}</span>
      </div>

      <button
        type="submit"
        :disabled="loading"
        class=" d-block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition-colors flex items-center justify-center disabled:opacity-60 cursor-pointer ml-2"
      >
        <span v-if="loading" class="animate-spin rounded-full h-5 w-5 border-t-2 border-white mr-2"></span>
        {{ loading ? 'Logowanie...' : 'Zaloguj' }}
      </button>


    </form>

  </div>
</template>


<script lang="ts" setup>
import { ref } from 'vue'
import api from '@/services/api'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Header from '@/components/Header.vue'

const email = ref('')
const password = ref('')
const router = useRouter()
const store = useAuthStore()

const errors = ref({})
const loading = ref(false)

const handleLogin = async () => {
  errors.value = {} // reset errors before submit
  loading.value = true
  try {
    await store.login(email.value, password.value)
    router.push('/')
  } catch (error) {
    // alert('API call error:', error.response?.data.data.message || error.message)
    if (error && error.message) {
      errors.value = error
    } else {
      console.error('Unexpected error:', error)
    }
  } finally {
    loading.value = false
  }

}
</script>
