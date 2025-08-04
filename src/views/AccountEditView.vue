<template>
  <h1 class="h1">{{ $t('Edit Account') }}</h1>

  <div v-if="isLoading" class="spinner"></div>
  <div v-else class="max-w-md mx-auto p-4">

    <UploadAvatar @avatar-changed="onAvatarChanged" :user="user"></UploadAvatar>

    <form @submit.prevent="updateUser" class="space-y-4">
        <BaseInput :label="$t('Name')" v-model="form.name" :errors="errors?.name"/>
        <BaseInput :label="$t('Email')" v-model="form.email" :errors="errors?.email"/>
        <BaseInput :label="$t('Role')" v-model="form.role" disabled="disabled"/>
        <BaseButton :name="$t('Update')" :loading="loading" type="submit" class="bg-blue-500 text-white px-4 py-2"/>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import { useI18n } from 'vue-i18n'
import UploadAvatar from '@/components/UploadAvatar.vue'

const form = ref({
  name: '',
  email: '',
  role: '',
})

const { t } = useI18n()
const errors = ref({})
const isLoading = ref(false)
const user = ref({})

onMounted(async () => {
  getUser()
})

const getUser = async () => {
  isLoading.value = true
  const res = await api.get('/me')

  user.value = res.data
  form.value.name = res.data.name
  form.value.email = res.data.email
  form.value.role = t(res.data.role ?? 'Client')
  isLoading.value = false
}

const updateUser = async () => {
  errors.value = {}
  isLoading.value = true
  try{
    const res = await api.put('/me', form.value)
    alert('Profile Updated')
  }catch(error){
    errors.value = error?.errors
  }
  isLoading.value = false
}

function onAvatarChanged(newUrl) {
  console.log('tutaj'+newUrl)
  user.value.avatar = newUrl
  // getUser()
}
</script>
