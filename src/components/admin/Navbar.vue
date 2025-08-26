<template>
  <header class="bg-white shadow p-4 justify-between text-gray-800">

    <div class="items-center space-x-4 hidden md:flex w-fit">
        <h1 class="text-lg font-bold">Admin Panel</h1>
        <RouterLink :to="{ name: 'Home', params: {}, query: {} }">Go to site</RouterLink>
    </div>

    <BaseButton @click="logout" :loading="loading" class="bg-red-500 px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-60 cursor-pointer w-fit">
        <font-awesome-icon :icon="['fas', 'right-from-bracket']" />&nbsp;{{ $t('Logout') }}
    </BaseButton>

  </header>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import BaseButton from '@/components/BaseButton.vue'
import { toast } from 'vue3-toastify'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const loading = ref(false)

const logout = async () => {
  loading.value = true
  try {
    await authStore.logout()
    router.push({ name: 'Login', query: { successMessage: 'Logged out successfully' } })
  } catch (error) {
    toast.error('Logout error: ', error?.message)
  }

  loading.value = false

}
</script>
