<template>
  <Header />
  <div class="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
    <h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">Login</h2>

    <div class="text-center text-gray-800 space-y-1 mb-4">
      <div class="text-gray-800 font-bold text-center mt-3">Default credentials </div>
      <div class="text-gray-800 text-center mt-3">provider@onet.pl | password </div>
      <div class="text-gray-800 text-center mt-3 mb-3">client@onet.pl | password</div>
    </div>

    <form @submit.prevent="handleLogin" class="space-y-4">
      <BaseInput v-model="email" type="email" label="Email" :errors="errors?.errors?.email" />
      <BaseInput v-model="password" type="password" label="Password" :errors="errors.errors?.password"/>

      <div v-if="!errors.errors && errors?.message" class="text-red-500">
        <span>{{ errors.message }}</span>
      </div>

      <BaseButton name="Login" :loading="loading"/>
    </form>

  </div>
</template>


<script setup>
import { ref } from 'vue'
import api from '@/services/api'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Header from '@/components/Header.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'

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
