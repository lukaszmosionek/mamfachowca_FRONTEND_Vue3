<script setup>
import { RouterView } from 'vue-router'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'


import { onMounted } from 'vue';
import api from '@/services/api'
    onMounted(async () => {
      try {
        const testAPI = await api.get('/test-api');
        console.log({ testAPI });
      } catch (err) {
        console.error('Błąd API:', err);
        // if (confirm("Cant connect test-api. Reload the page?")) {
        //   window.location.reload()
        // }
      }
    });
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-100 text-gray-900">
    <main class="flex-grow">
        <Header />
        <div class="wrapper">
            <RouterView />
        </div>
    </main>
    <Footer />
  </div>
</template>
