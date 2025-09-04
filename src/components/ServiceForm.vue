<template>
  <div class="p-6 bg-white rounded-2xl shadow-md fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-2xl shadow-lg p-6 w-full max-w-5xl overflow-x-scroll">
      <h3 class="text-gray-600 text-xl font-semibold mb-4 text-center">
        {{ service ? $t('Edit service') : $t('New service') }}
      </h3>
      <form @submit.prevent="submit" class="space-y-4">

        <button type="button" @click="changeLanguage('en')" class="flex justify-center items-center gap-2 hover:opacity-50">
          <img alt="Flag EN" src="@/assets/icons/flag-en.svg" width="20" height="20" /> <span class="text-sm">EN</span>
        </button>
        <button  type="button"  @click="changeLanguage('pl')" class="flex justify-center items-center gap-2 hover:opacity-50">
          <img alt="Flag PL" src="@/assets/icons/flag-pl.svg" width="20" height="20" /> <span class="text-sm">PL</span>
        </button>

        <div v-for="(t, index) in form.translations">
            <BaseInput v-model="t.name" v-if="lang === t.language.code" :label="$t('Name')+' - '+t.language.code" placeholder="e.g. John Doe" :errors="errors.errors?.name" />
        </div>

        <BaseInput v-model="form.price" :label="$t('Price')" placeholder="e.g. 100" :errors="errors.errors?.price" type="number"/>
        <BaseInput v-model="form.duration_minutes" :label="$t('Time (minutes)')" placeholder="e.g. 60" :errors="errors.errors?.duration_minutes" type="number"/>

        <div v-for="(t, index) in form.translations">
            <BaseInput  v-model="t.description" v-if="lang === t.language.code" :label="$t('Description')+' - '+t.language.code" :placeholder="$t('Description')" rows="4" :isTextarea="true"  :key="index" class="text-gray-600 w-full rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"></BaseInput>
        </div>

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
import { useI18n } from 'vue-i18n'
import { myServicesSchema } from '@/api/schemas/myServicesSchema'
import { deepClone } from '@/helpers/deepClone.js'
import { toast } from 'vue3-toastify'

const service = ref(null)
const { locale } = useI18n()
const emit = defineEmits(['saved', 'close'])
const loading = ref(false)
const errors = ref({})
const lang = ref('en')
const form = ref()
const serviceID = ref( route.params.serviceId || null )

const loadService = async () => {
  loading.value = true

  try {
    const res = await api.get('/me/services/'+ parseInt(serviceID.value) )
    service.value = res.service
  }catch(err){
      toast.error('Failed to show services.'+' Try again later.')
  }
  loading.value = false
}

watch(() => props.service, (val) => {
  if (val) { //update service
    form.value = { ...myServicesSchema, ...val}
  } else { // new servive
    form.value = deepClone(myServicesSchema)
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
      toast.error('Unexpected error:', error)
  } finally {
    loading.value = false
  }
}

const handlePhotos = (photos) => {
  if (!props.service) {
    form.value.photos = photos
  }
}

function changeLanguage(newlang){
  lang.value = newlang
}
</script>
