<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-600">{{ title }}</h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-red-500">
          ✕
        </button>
      </div>

      <!-- Main content slot -->
      <div class="mb-4 text-gray-600">
        <slot />
      </div>

      <!-- Footer slot (e.g. buttons) -->
      <div v-if="$slots.footer" class="mt-4 flex justify-end gap-2">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const emit =defineEmits(['close', 'submit'])
defineProps({
  show: Boolean,
  title: {
    type: String,
    default: 'Modal'
  }
})

function handleKeydown(event, prop) {
  if (event.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

</script>
