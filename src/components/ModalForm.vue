<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Submit Info</h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-red-500">
          ✕
        </button>
      </div>

      <form @submit.prevent="submitForm">
        <div class="mb-4">
          <label class="block mb-1 text-sm font-medium">Name</label>
          <input v-model="form.name" type="text" class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring" required>
        </div>
        <div class="mb-4">
          <label class="block mb-1 text-sm font-medium">Email</label>
          <input v-model="form.email" type="email" class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring" required>
        </div>

        <div class="flex justify-end gap-2">
          <button type="button" @click="$emit('close')" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            Cancel
          </button>
          <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const props = defineProps({
  show: Boolean
})

const emit = defineEmits(['close', 'submit'])

const form = reactive({
  name: '',
  email: ''
})

function submitForm() {
  emit('submit', { ...form })
  emit('close')
}
</script>
