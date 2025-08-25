<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue';
import api from '@/services/api'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()

    onMounted(async () => {
      try {
        const testAPI = await api.get('/test-api');
        console.log({ testAPI });
      } catch (err) {
        console.error('Błąd API:', err);
        if (confirm("Cant connect test-api. Reload the page?")) {
          window.location.reload()
        }
      }

      if (authStore.token && !authStore.user) {
        authStore.fetchUser()
      }
    });
</script>

<template>
  <RouterView />
</template>
