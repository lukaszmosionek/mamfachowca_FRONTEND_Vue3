<template>
  <header class="bg-white shadow p-4 flex justify-between text-gray-800">
    <div class="flex items-center space-x-4">
        <h1 class="text-lg font-bold">Admin Panel</h1>
        <RouterLink :to="{ name: 'Home', params: {}, query: {} }">Go to site</RouterLink>
    </div>
    <button class="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
  </header>
</template>
