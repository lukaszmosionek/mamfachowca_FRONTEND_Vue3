<template>
  <div class="flex items-center justify-center">
    <div class="p-6 w-full">
      <h3 class="text-gray-600 text-xl font-semibold mb-4 text-center">
        {{ isEditView ? $t('Edit service') : $t('New service') }}
      </h3>
      <form @submit.prevent="submit" class="space-y-4">

        <button type="button" @click="changeLanguage('en')" class="flex justify-center items-center gap-2 hover:opacity-50">
          <img alt="Flag EN" src="@/assets/icons/flag-en.svg" width="20" height="20" /> <span class="text-sm">EN</span>
        </button>
        <button  type="button"  @click="changeLanguage('pl')" class="flex justify-center items-center gap-2 hover:opacity-50">
          <img alt="Flag PL" src="@/assets/icons/flag-pl.svg" width="20" height="20" /> <span class="text-sm">PL</span>
        </button>

        <!-- <BaseInput v-model="form.name" :label="$t('Name')" placeholder="e.g. John Doe" :errors="errors.errors?.name" /> -->
        <div v-for="(t, index) in form.translations">
            <BaseInput v-model="t.name" v-if="lang === t.language.code" :label="$t('Name')+' - '+t.language.code" placeholder="e.g. John Doe" :errors="errors.errors?.name" class="input-name" />
        </div>
        <!-- <BaseInput v-model="form.translations.pl.name" v-if="lang === 'pl'" :label="$t('Name')" placeholder="e.g. John Doe" :errors="errors.errors?.name" /> -->

        <BaseInput v-model="form.price" :label="$t('Price')" placeholder="e.g. 100" :errors="errors.errors?.price" type="number" class="input-price"/>
        <BaseInput v-model="form.duration_minutes" :label="$t('Time (minutes)')" placeholder="e.g. 60" :errors="errors.errors?.duration_minutes" type="number" class="input-duration-minutes"/>

        <div v-for="(t, index) in form.translations">
            <BaseInput  v-model="t.description" v-if="lang === t.language.code" :label="$t('Description')+' - '+t.language.code" :placeholder="$t('Description')" rows="4" :isTextarea="true"  :key="index" class="input-description text-gray-600 w-full rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"></BaseInput>
        </div>
        <!-- <BaseInput v-model="form.translation[1].description" v-if="lang === 'pl'" :label="$t('Description')" :placeholder="$t('Description')" rows="4" :isTextarea="true" class="text-gray-600 w-full rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"></BaseInput> -->

        <div class="flex items-center justify-center">
            <PhotoGallery :photos="form.photos" :serviceId="form?.id ?? null" :isEditView="form?.id ? true : false" @update:photos="handlePhotos" @delete:photos="handleDeletePhotos"></PhotoGallery>
        </div>

        <div class="flex justify-end space-x-2 pt-4">
          <router-link  class="px-4 py-2 bg-gray-300 rounded text-gray-600 mt-2 button-back" :to="{ name: 'MyServices' }">⬅ {{ $t('Go Back') }}</router-link>
          <BaseButton :name="$t('Save')" :loading="loading" type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition" />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import api from '@/services/api'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import PhotoGallery from '@/components/PhotoGallery.vue'
import { useI18n } from 'vue-i18n'
import { myServicesSchema } from '@/api/schemas/myServicesSchema'
import { deepClone } from '@/helpers/deepClone.js'
import { useRouter, useRoute } from 'vue-router'
import { toast } from 'vue3-toastify'
import Swal from 'sweetalert2'


const route = useRoute()
const router = useRouter()
const service = ref({})
const { locale, t } = useI18n()
const loading = ref(false)
const isLoading = ref(false)
const errors = ref({})
const selectedFiles = ref([])
const lang = ref('en')
const form = ref({
  photos:{}
})
const serviceID = ref( route.params.serviceId || null )
const isEditView= ref(serviceID.value !== 'new' ? true : false)

const loadService = async () => {
  loading.value = true

  try {
    const res = await api.get('/me/services/'+ parseInt(serviceID.value) )
    form.value = res.service
    // console.log(emptyStructureFromExample(res.services))

    // if( page.value === 1 ){
    //     services.value = res.services
    // }else{
    //     services.value.push( ...res.services )
    // }

    // if (page.value >= res.last_page) {
    //     showLoadMore.value = false
    // }

  }catch(err){
      toast.error('Failed to show services.'+' Try again later.')
  }
  loading.value = false
}

// watch(() => service.value, (val) => {
//   console.log(val)
//   if (val) { //update service
//     form.value = { ...myServicesSchema, ...val}
//     // Object.assign(form.value, val)
//     // form.value = { ...val }
//   } else { // new servive
//     form.value = deepClone(myServicesSchema)
//   }
// }, { immediate: true })

const submit = async () => {
  loading.value = true

  try {
    if (isEditView.value) {
      await api.put(`/me/services/${serviceID.value}`, form.value)
    } else {
      await api.post('/me/services', form.value, {
          headers: { 'Content-Type': 'multipart/form-data' }
      })
    }
    await Swal.fire(t('success'))
    router.push({ name: 'MyServices' })
  } catch (error) {
      toast.error('Unexpected error:', error.message)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
    form.value = deepClone(myServicesSchema)
    if( isEditView.value ){
        await loadService()
    }
});

const handlePhotos = (photos) => {
  // if (!serviceID.value) {
    // form.value.photos = photos
    handleFiles(photos)
  // }
}

const handleDeletePhotos = (photoID) => {
  // if (!serviceID.value) {
      // console.log(photoID)
        // form.value.photos = form.value.photos.filter(photo => photo.id !== photoID)
        deletePhoto(photoID)
  // }
}

function changeLanguage(newlang){
  lang.value = newlang
}

const deletePhoto = async (photoID) => {
  if (!isEditView.value) {
      form.value.photos = form.value.photos.filter(photo => photo.id !== photoID)
    return
  }

  const photo = form.value.photos.find(el => el.id == photoID)
  photo.isLoading = true

  try {
    await api.delete(`/me/services/photos/${photoID}`)
    form.value.photos = form.value.photos.filter(photo => photo.id !== photoID)
    toast.success( t('Photo Deleted!'))
  } catch (err) {
    toast.error( t('error-delete-photo') )
  }

  photo.isLoading = false
}

const handleFiles = (event) => {
  selectedFiles.value = Array.from(event.target.files)
  if (isEditView.value) { //edit
    uploadPhotos()
  } else { //new
    const newPhotos = selectedFiles.value.map( (file, index) => ({
      id: index, // Unique ID
      file,
      medium: URL.createObjectURL(file)
    }))
    form.value.photos.push(...newPhotos)
  }
}

const uploadPhotos = async () => {
  isLoading.value = true

  const formData = new FormData()
  selectedFiles.value.forEach(file => {
    formData.append('photos[]', file)
    form.value.photos.push({ 'isLoading': true });
  })

  try {
    const res = await api.post('/me/services/'+serviceID.value+'/photos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    form.value.photos.splice(-selectedFiles.value.length, selectedFiles.value.length);
    form.value.photos.push(...res.photos)
    toast.success( t('Photo Uploaded!'))
  } catch (err) {
    toast.error( err.message )
  }
  isLoading.value = false
}
</script>
