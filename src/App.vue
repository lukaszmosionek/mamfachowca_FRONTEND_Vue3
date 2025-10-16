<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import api from '@/services/api.ts'
import axios from 'axios'
import { useAuthStore } from './stores/auth.ts'

const authStore = useAuthStore()

onMounted(async () => {
  try {
    axios.get(import.meta.env.VITE_BACKEND_URL+'/sanctum/csrf-cookie', { withCredentials: true })
    const testAPI = await api.get('/test-api')
    console.log('API Connection:', testAPI)
  } catch (err) {
    console.error('API error (/test-api) :', err)
  }

  if (authStore.token && !authStore.user) {
    authStore.fetchUser()
  }
})

</script>

<template>
  <RouterView />
</template>
