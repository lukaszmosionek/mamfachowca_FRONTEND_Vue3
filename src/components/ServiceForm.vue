<template>
  <div class="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-md">
    <h3 class="text-gray-600 text-xl font-semibold mb-4 text-center">
      {{ service ? 'Edytuj usługę' : 'Nowa usługa' }}
    </h3>
    <form @submit.prevent="submit" class="space-y-4">
      <input
        v-model="form.name"
        placeholder="Nazwa"
        class="text-gray-600 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        v-model.number="form.price"
        placeholder="Cena"
        type="number"
        class="text-gray-600 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        v-model.number="form.duration_minutes"
        placeholder="Czas (minuty)"
        type="number"
        class="text-gray-600 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <textarea
        v-model="form.description"
        placeholder="Opis"
        rows="4"
        class="text-gray-600 w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
      ></textarea>

      <div class="flex justify-end space-x-2 pt-4">
        <button
          type="button"
          @click="$emit('close')"
          class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
        >
          Anuluj
        </button>
        <button
          type="submit"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Zapisz
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import api from '@/services/api'
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{ service: any | null }>()
const emit = defineEmits(['saved', 'close'])

const form = ref({
  name: '',
  price: 0,
  duration_minutes: 30,
  description: '',
})

watch(() => props.service, (val) => {
  if (val) {
    form.value = { ...val }
  } else {
    form.value = {
      name: '',
      price: 0,
      duration_minutes: 30,
      description: '',
    }
  }
}, { immediate: true })

const submit = async () => {
  if (props.service) {
    await api.put(`/services/${props.service.id}`, form.value)
  } else {
    await api.post('/services', form.value)
  }
  emit('saved')
  emit('close')
}
</script>
