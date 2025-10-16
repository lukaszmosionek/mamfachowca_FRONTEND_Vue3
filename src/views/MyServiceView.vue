<template>
  <div class="flex items-center justify-center">
    <div class="p-6 w-full">
      <h3 class="text-gray-600 text-xl font-semibold mb-4 text-center">
        {{ isEditView ? $t('myService.titleEditService') : $t('myService.titleNewService') }}
      </h3>
      <form @submit.prevent="submit" class="space-y-4">
        <div v-for="(t, index) in form.translations" :key="index">
          <BaseInput v-model="t.name" :isLoading="loading" :label="$t('myService.name')+' - '+t.language.code" placeholder="e.g. John Doe" :errors="errors?.translations?.[index]?.name" class="input-name" :name="'name-'+t.language.code" ></BaseInput>
        </div>

        <div class="flex gap-2 ">
          <BaseInput wrapperClass="w-1/2" class="input-price" :isLoading="loading" v-model="form.price" name="price" :label="$t('myService.price')" placeholder="e.g. 100" :errors="errors?.price" type="number"/>
          <BaseSelect wrapperClass="w-1/2 " :isLoading="loading" :modelValue="form.currency_id" :options="currencies" :isAssociativeArray="false" @update:modelValue="val => form.currency_id = val" :label="$t('myService.currency')"></BaseSelect>
        </div>
        <BaseInput v-model="form.duration_minutes" :isLoading="loading" name="duration_minutes" :label="$t('myService.timeMinutes')" placeholder="e.g. 60" :errors="errors?.duration_minutes" type="number" class="input-duration-minutes"/>

        <div v-for="(t, index) in form.translations" :key="index">
            <BaseInput v-model="t.description" :isLoading="loading"  :errors="errors?.translations?.[index]?.description" :label="$t('myService.description')+' - '+t.language.code" :placeholder="$t('myService.description')" rows="4" :isTextarea="true"  :key="index" class="input-description text-gray-600 w-full rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" :name="'description-'+t.language.code"></BaseInput>
        </div>

        <div class="flex items-center justify-center">
            <PhotoGallery :isLoading="loading" :photos="form.photos" :serviceId="form?.id ?? null" :isEditView="form?.id ? true : false" @update:photos="handlePhotos" @delete:photos="handleDeletePhotos"></PhotoGallery>
        </div>

        <div class="flex justify-end space-x-2 pt-4">
          <router-link  class="px-4 py-2 bg-gray-300 rounded text-gray-600 mt-2 button-back" :to="{ name: 'MyServices' }">⬅ {{ $t('myService.goBack') }}</router-link>
          <BaseButton :name="$t('myService.save')" :isLoading="loading" type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition" />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import api from '@/services/api.ts'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseSelect from '@/components/BaseSelect.vue'
import PhotoGallery from '@/components/PhotoGallery.vue'
import { useI18n } from 'vue-i18n'
import { myServicesSchema } from '@/api/schemas/myServicesSchema'
import { deepClone } from '@/helpers/deepClone.ts'
import { useRouter, useRoute } from 'vue-router'
import { toast } from 'vue3-toastify'
import Swal from 'sweetalert2'
import { validateService } from '@/utils/validators.ts'
import { useErrors } from "@/composables/useErrors"
import { Enums } from '@/enums.ts'
import { useCurrencyStore } from '@/stores/useCurrencyStore.ts'

const currencyStore = useCurrencyStore()
const { hasErrors } = useErrors()
const route = useRoute()
const router = useRouter()
const service = ref({})
const { locale, t } = useI18n()
const loading = ref(false)
const isLoading = ref(false)
const errors = ref()
const selectedFiles = ref([])
const lang = ref('en')
const form = ref({
  photos:{}
})
const serviceID = ref( route.params.serviceId || null )
const isEditView= ref(serviceID.value !== 'new' ? true : false)
const currencies = Enums.Currencies.map(c => ({
  label: c.id,
  value: c.name
}))

const loadService = async () => {
  loading.value = true

  try {
    const res = await api.get('/me/services/'+ parseInt(serviceID.value) )
    form.value = res.service
  }catch(err){
      toast.error(t('myService.errors.loadService')+t('errors.tryAgainLater'))
  }
  loading.value = false
}

const submit = async () => {
  if( import.meta.env.VITE_TURN_ON_VUE_VALIDATION === 'true'){
    errors.value = validateService(form.value)
    if( hasErrors(errors.value) ) return
  }

  loading.value = true

  try {
    if (isEditView.value) {
      await api.put(`/me/services/${serviceID.value}`, form.value)
    } else {
      await api.post('/me/services', form.value, {
          headers: { 'Content-Type': 'multipart/form-data' }
      })
    }
    await Swal.fire(t('myService.success.messageSaved'))
    router.push({ name: 'MyServices' })
  } catch (error) {
      errors.value = error.errors
  }

  loading.value = false

}

onMounted(async () => {
    form.value = deepClone(myServicesSchema)

    form.value.currency_id = currencyStore.getCurrencyID()

    if( isEditView.value ){
        await loadService()
    }
});

const handlePhotos = (photos) => {
    handleFiles(photos)
}

const handleDeletePhotos = (photoID) => {
        deletePhoto(photoID)
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
    toast.success( t('myService.success.photoDeleted') )
  } catch (err) {
    toast.error( t('errors.deletePhoto')+t('other.tryAgainLater') )
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
    toast.success( t('myService.success.photoUploaded') )
  } catch (err) {
    toast.error( t('myService.errors.deletePhoto')+t('errors.tryAgainLater') )
  }
  isLoading.value = false
}
</script>
