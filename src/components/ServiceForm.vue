<template>
  <div class="p-6 bg-white rounded-2xl shadow-md fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-2xl shadow-lg p-6 w-full max-w-5xl overflow-x-scroll">
      <h3 class="text-gray-600 text-xl font-semibold mb-4 text-center">
        {{ service ? $t('Edit service') : $t('New service') }}
      </h3>
      <form @submit.prevent="submit" class="space-y-4">
        <BaseInput v-model="form.name" :label="$t('Name')" placeholder="e.g. John Doe" :errors="errors.errors?.name" />
        <BaseInput v-model="form.price" :label="$t('Price')" placeholder="e.g. 100" :errors="errors.errors?.price" type="number"/>
        <BaseInput v-model="form.duration_minutes" :label="$t('Time (minutes)')" placeholder="e.g. 60" :errors="errors.errors?.duration_minutes" type="number"/>

        <textarea v-model="form.description" :placeholder="$t('Description')" rows="4" class="text-gray-600 w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>

        <div class="flex items-center justify-center">
            <PhotoGallery :photos="service?.photos ?? []" :serviceId="service?.id ?? null" :isEditView="service?.id ? true : false" @update:photos="handlePhotos"></PhotoGallery>
        </div>

        <div class="flex justify-end space-x-2 pt-4">
          <BaseButton :name="$t('Cancel')" class="w-fit bg-gray-200 text-gray-800 hover:bg-gray-300" @click="$emit('close')" />
          <BaseButton :name="$t('Save')" :loading="loading" type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition" />
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
import PhotoGallery from '@/components/PhotoGallery.vue'


const props = defineProps({
  service: Object
})
const emit = defineEmits(['saved', 'close'])
const loading = ref(false)
const errors = ref({})
const form = ref({})

watch(() => props.service, (val) => {
  if (val) {
    form.value = { ...val }
  } else {
    form.value = {}
  }
}, { immediate: true })

const submit = async () => {
  loading.value = true

  try {
    if (props.service) {
      await api.put(`/me/services/${props.service.id}`, form.value)
    } else {
      await api.post('/me/services', form.value, {
          headers: { 'Content-Type': 'multipart/form-data' }
      })
    }
    emit('saved')
    emit('close')
  } catch (error) {
      console.error('Unexpected error:', error)
  } finally {
    loading.value = false
  }
}

const handlePhotos = (photos) => {
  if (!props.service) {
    form.value.photos = photos
  }
}
</script>
