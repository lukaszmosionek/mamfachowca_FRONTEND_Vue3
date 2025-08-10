<template>
  <h1 class="h1">{{ $t('Edit Account') }}</h1>

  <div v-if="isLoading" class="spinner"></div>
  <div v-else class="max-w-md mx-auto p-4">

    <UploadAvatar @avatar-changed="onAvatarChanged" :user="form"></UploadAvatar>

    <form @submit.prevent="updateUser" class="space-y-4" :disabled="isSaving">
        <BaseInput :label="$t('Name')" v-model="form.name" :errors="errors?.name" :disabled="isSaving"/>
        <BaseInput :label="$t('Email')" v-model="form.email" :errors="errors?.email" :disabled="isSaving"/>
        <BaseSelect v-model="form.role" :options="Enums.Role" :hasTranslation="true" :label="$t('Role')" disabled="disabled" />
        <BaseSelect v-model="form.lang" :options="Enums.Languages" :isAssociativeArray="true" :label="$t('Language')"  :disabled="isSaving"  />

        <div class="flex justify-center mt-2">
            <BaseButton :loading="isSaving" type="submit" class="bg-blue-500 text-white px-4 py-2"><font-awesome-icon :icon="['fas', 'user-gear']" />&nbsp;{{ $t('Update Account') }}</BaseButton>
        </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import UploadAvatar from '@/components/UploadAvatar.vue'
import BaseSelect from '@/components/BaseSelect.vue'
import { useI18n } from 'vue-i18n'
import Swal from 'sweetalert2'
import { Enums } from '@/enums.js'
const form = ref({})

const { t, locale } = useI18n()
const errors = ref({})
const isLoading = ref(false)
const isSaving = ref(false)

onMounted(async () => {
  getUser()
})

const getUser = async () => {
  isLoading.value = true
  const res = await api.get('/me')

  form.value = res.user
  isLoading.value = false
}

const updateUser = async () => {
  errors.value = {}
  isSaving.value = true
  try{
    const res = await api.put('/me', form.value)

    localStorage.setItem('lang', form.value.lang)
    locale.value = form.value.lang

    Swal.fire( t('Profile Updated') )
  }catch(error){
    errors.value = error?.errors
  }
  isSaving.value = false
}

function onAvatarChanged(newUrl) {
  form.value.avatar = newUrl
}
</script>
