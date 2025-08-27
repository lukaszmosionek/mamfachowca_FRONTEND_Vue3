<template>
  <div>
      <!-- <h2></h2> -->
      <div  class="photo-gallery">
          <div v-for="photo in localPhotos" v-if="localPhotos.length" :key="photo.id" class="photo-item relative" :class="{ 'opacity-50' : photo.isLoading }">
              <img :src="photo.medium ?? noPhoto" alt="Uploaded Photo" />
              <BaseButton @click="deletePhoto(photo.id)" :data-id="photo.id" :disabled="photo.isLoading" :makeRed="true">Delete</BaseButton>
              <div class="spinner absolute inset-0 z-50" v-if="photo.isLoading"></div>
          </div>
          <form @submit.prevent="uploadPhotos" class="relative">
              <label for="fileUpload" class="flex-center w-[150px] h-[150px] rounded-lg shadow-md cursor-pointer transition duration-200">
                  <input type="file" multiple @change="handleFiles" accept="image/*" class="hidden" id="fileUpload"/>
                  <div class="flex-center flex-col"><font-awesome-icon :icon="['fas', 'plus']" class="mt-2" />{{ $t('Add new photo') }}</div>
              </label>
                <!-- <button type="submit">Upload</button> -->
              <div class="spinner absolute inset-0" v-if="isLoading"></div>
          </form>
      </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import api from '@/services/api'
import { toast } from 'vue3-toastify'
import { useI18n } from 'vue-i18n'
import BaseButton from '@/components/BaseButton.vue'
import noPhoto from '@/assets/no-photo.jpg';

const emits = defineEmits(['update:photos']);

const { t } = useI18n()
const props = defineProps({
  photos: {
    type: Array,
    required: true,
    default: () => []
  },
  serviceId: {
    type: Number,
  },
  isEditView: {
    type: Boolean,
    default: false
  }

})

const selectedFiles = ref([])
const localPhotos  = props.photos
const isLoading = ref(false)

const handleFiles = (event) => {
  selectedFiles.value = Array.from(event.target.files)
  if (props.isEditView) { //edit
    uploadPhotos()
  } else { //new
    const newPhotos = selectedFiles.value.map( (file, index) => ({
      id: index, // Unique ID
      file,
      medium: URL.createObjectURL(file)
    }))
    localPhotos.value.push(...newPhotos)
  }
}

const uploadPhotos = async () => {
  isLoading.value = true

  const formData = new FormData()
  selectedFiles.value.forEach(file => {
    formData.append('photos[]', file)
    localPhotos.value.push({ 'isLoading': true });
  })

  try {
    const res = await api.post('/me/services/'+props.serviceId+'/photos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    localPhotos.value.splice(-selectedFiles.value.length, selectedFiles.value.length);
    localPhotos.value.push(...res.photos)
    toast.success( t('Photo Uploaded!'))
  } catch (err) {
    toast.error( err.message )
  }
  isLoading.value = false
}

// const fetchPhotos = async () => {
//   const res = await api.get('/photos')
//   photos.value = res.data
// }

const deletePhoto = async (id) => {
  if (!props.isEditView) {
    localPhotos.value = localPhotos.value.filter(photo => photo.id !== id)
    return
  }

  const photo = localPhotos.value.find(el => el.id == id)
  photo.isLoading = true
  try {
    await api.delete(`/me/services/photos/${id}`)
    localPhotos.value = localPhotos.value.filter(photo => photo.id !== id)
    toast.success( t('Photo Deleted!'))
  } catch (err) {
    toast.error( t('error-delete-photo') )
  }

  photo.isLoading = false
}


watch( () => localPhotos.value, (newValue, oldValue) => {
  emits('update:photos', { ...newValue });
},
{ deep: true }
 )

// onMounted(fetchPhotos)
</script>

<style>
.photo-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.photo-item {
  position: relative;
}

.photo-item img {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
}

.photo-item button {
  position: absolute;
  top: 5px;
  right: 5px;
}
</style>
