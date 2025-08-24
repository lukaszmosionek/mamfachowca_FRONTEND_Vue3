<template>
  <div class="flex min-h-screen">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <Navbar />
      <main class="p-6 bg-gray-50 min-h-screen text-gray-800">
        <router-view /> <!-- Page content loads here -->
      </main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '@/components/admin/Sidebar.vue'
import Navbar from '@/components/admin/Navbar.vue'
</script>
