<template>
  <aside class="w-64 bg-gray-800 text-white p-4">
    <h2 class="text-xl font-bold mb-6">Admin Panel</h2>
    <nav class="flex flex-col space-y-2">
      <router-link to="/dashboard" class="hover:bg-gray-700 p-2 rounded">Dashboard</router-link>
      <router-link to="/users" class="hover:bg-gray-700 p-2 rounded">Users</router-link>
      <router-link to="/settings" class="hover:bg-gray-700 p-2 rounded">Settings</router-link>
    </nav>
  </aside>
</template>
