<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue';
import api from '@/services/api'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()

    onMounted(async () => {
      try {
        const testAPI = await api.get('/test-api');
        console.log('API Connection:', testAPI);
      } catch (err) {
        console.error('API error (/test-api) :', err);
      }

      if (authStore.token && !authStore.user) {
        authStore.fetchUser()
      }
    });
</script>

<template>
  <RouterView />
</template>
