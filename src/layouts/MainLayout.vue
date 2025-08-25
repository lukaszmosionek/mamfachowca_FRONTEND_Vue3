<script setup>
  import { RouterView } from 'vue-router'
  import Header from '@/components/Header.vue'
  import Footer from '@/components/Footer.vue'
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
