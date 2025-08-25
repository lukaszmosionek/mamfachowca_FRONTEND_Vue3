<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Settings</h1>
    <form @submit.prevent="saveSettings">

      <label class="block mb-1">Theme</label>
      <select v-model="theme" class="border p-2 rounded">
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>

      <label class="block mb-1 mt-4">Currency</label>
      <select v-model="theme" class="border p-2 rounded">
        <option value="USD">USD</option>
        <option value="PLN">PLN</option>
        <option value="EUR">EUR</option>
      </select>

      <button type="submit" class="block mt-4 px-4 py-2 bg-blue-600 text-white rounded">
        Save
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const theme = ref('light')

function saveSettings() {
  alert(`Settings saved. Theme: ${theme.value}`)
}
</script>
