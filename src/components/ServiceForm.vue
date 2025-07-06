<template>
  <div class=" p-6 bg-white rounded-2xl shadow-md fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
    <h3 class="text-gray-600 text-xl font-semibold mb-4 text-center">
      {{ service ? 'Edytuj usługę' : 'Nowa usługa' }}
    </h3>
    <form @submit.prevent="submit" class="space-y-4">
      <BaseInput v-model="form.name" label="Name" placeholder="e.g. John Due" :errors="errors.errors?.name" />
      <BaseInput v-model="form.price" label="Price" placeholder="e.g. John Due" :errors="errors.errors?.price" type="number"/>
      <BaseInput v-model="form.duration_minutes" label="Time(minutes)" placeholder="e.g. John Due" :errors="errors.errors?.duration_minutes" type="number"/>

      <textarea
        v-model="form.description"
        placeholder="Opis"
        rows="4"
        class="text-gray-600 w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
      ></textarea>

      <div class="flex justify-end space-x-2 pt-4">
        <!-- <button
          type="button"
          @click="$emit('close')"
          class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
        >
          Anuluj
        </button> -->
        <BaseButton name="Cancel" class="w-fit bg-gray-200 text-gray-800 hover:bg-gray-300" @click="$emit('close')"/>
        <BaseButton name="Save" :loading="loading" type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"/>
        <!-- <button
          type="submit"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Zapisz
        </button> -->
      </div>
    </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import api from '@/services/api'
import { defineProps, defineEmits } from 'vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'

const props = defineProps()
const emit = defineEmits(['saved', 'close'])
const loading = ref(false)

const errors = ref({})

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
  loading.value = true

  try {
    if (props.service) {
      await api.put(`/services/${props.service.id}`, form.value)
    } else {
      await api.post('/services', form.value)
    }
       emit('saved')
    emit('close')
  } catch (error) {
    // alert('API call error:', error.response?.data.data.message || error.message)
    console.log(error)
    if (error && error.message) {
      errors.value = error
    } else {
      console.error('Unexpected error:', error)
    }
  } finally {
    loading.value = false
    // emit('saved')
    // emit('close')
  }
}
</script>
