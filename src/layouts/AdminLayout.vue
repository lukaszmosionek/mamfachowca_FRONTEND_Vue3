<template>
  <div class="flex-none md:flex min-h-screen">
    <!-- Sidebar -->
    <Sidebar class=""/>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <Navbar class="hidden md:flex" />
      <main class="md:p-6 p-1 bg-gray-50 min-h-screen text-gray-800">
        <router-view /> <!-- Page content loads here -->
      </main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '@/components/admin/Sidebar.vue'
import Navbar from '@/components/admin/Navbar.vue'
</script>
