<template>
    <div class="flex flex-col items-center">
        <div class="relative">
            <img :src="user.avatar || defaultAvatar" alt="User Avatar" class="rounded-full w-60 h-60" loading="lazy" :class="{ 'opacity-50':  isLoading}" />
            <div class="absolute left-1/2 top-1/2 -ml-[20px] -mt-[20px] z-50" v-if="isLoading">
                <div class="spinner"></div>
            </div>
          </div>

          <label for="fileUpload" class="mt-2 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md cursor-pointer hover:bg-blue-700 transition duration-200">
              <font-awesome-icon :icon="['fas', 'image']" /> {{ $t('Change avatar') }}
              <input type="file" @change="onFileChange" accept="image/*" id="fileUpload" class="hidden" />
          </label>

    </div>
</template>

<script setup>
import api from '@/services/api'
import Swal from 'sweetalert2'
import { ref } from 'vue'
import { toast } from 'vue3-toastify'
import BaseButton from './BaseButton.vue'
import defaultAvatar from '@/assets/default-avatar.svg';

defineProps({
  user: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['avatar-changed'])
const file = ref(null)
const isLoading = ref(false)

function onFileChange(e) {
  file.value = e.target.files[0]
  uploadAvatar()
}

async function uploadAvatar() {
  isLoading.value = true
  const formData = new FormData()
  formData.append('avatar', file.value)

  try {
    const response = await api.post('me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    toast.success('Avatar uploaded!')
    emit('avatar-changed', response.avatar_url) // 🔥 Emit the new avatar URL
    console.log('avatar_url'+response.avatar_url)
  } catch (err) {
    Swal.fire(err.response.data.message, 'error', 'error')
    console.error(err)
  }
  isLoading.value = false
}
</script>
