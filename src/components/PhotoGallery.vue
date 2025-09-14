<template>
  <div>
      <!-- <h2></h2> -->
      <div  class="photo-gallery">
          <div v-for="photo in photos" v-if="photos.length" :key="photo.id" class="photo-item relative" :class="{ 'opacity-50' : photo.isLoading }">
              <img :src="photo.medium ?? noPhoto" alt="Uploaded Photo" />
              <BaseButton @click="deletePhoto(photo.id)" :data-id="photo.id" :disabled="photo.isLoading" :makeRed="true">{{ $t('photoGallery.buttons.delete') }}</BaseButton>
              <div class="spinner absolute inset-0 z-50" v-if="photo.isLoading"></div>
          </div>
          <form @submit.prevent="uploadPhotos" class="relative">
              <label for="fileUpload" class="flex-center w-[150px] h-[150px] rounded-lg shadow-md cursor-pointer transition duration-200">
                  <input type="file" multiple @change="handleFiles" accept="image/*" class="hidden" id="fileUpload"/>
                  <div class="flex-center flex-col"><font-awesome-icon :icon="['fas', 'plus']" class="mt-2" />{{ $t('photoGallery.buttons.new') }}</div>
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

const emits = defineEmits(['update:photos', 'delete:photos']);

const { t } = useI18n()
const props = defineProps({
  photos: {
    type: [ Array, Object ],
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


// const localPhotos = computed(() => props.photos)
const isLoading = ref(false)

const handleFiles = (event) => {
    emits('update:photos', event );
}

// const fetchPhotos = async () => {
//   const res = await api.get('/photos')
//   photos.value = res.data
// }

const deletePhoto = (id) => {
    emits('delete:photos', id );
}


// watch( () => localPhotos.value, (newValue, oldValue) => {
//   // emits('update:photos', { ...newValue });
// },
// { deep: true }
//  )

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
