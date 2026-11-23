<!-- ForgotPassword.vue -->
<template>
  <div class="forgot-password-container">
    <div class="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h1 class="h1">{{ $t('login.forgot-password-title') }}</h1>
      <p class="text-gray-600 mt-2">{{ $t('login.forgot-password-description') }}</p>

      <form @submit.prevent="submit" class="mt-4 space-y-4">
        <BaseInput v-model="email" type="email" :errors="errors?.email" :label="$t('login.email')" />
        <BaseButton type="submit" class="mt-4" :disabled="!email" :loading="loading">
          {{ $t('login.send-reset-link') }}
        </BaseButton>
      </form>
    </div>
  </div>
</template>

<script setup>
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import { ref } from 'vue'
import api from '@/services/api.ts'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Swal from 'sweetalert2'

const { t } = useI18n()
const email = ref('')
const errors = ref({})
const loading = ref(false)
const route = useRoute()

email.value = route.query.email || ''

const submit = async () => {
  if (!email.value) {
    Swal.fire(t('other.error'), t('validation.email.required'), 'error')
    return
  }
  errors.value = {}
  loading.value = true
  try {
    const res = await api.post('/forgot-password', { email: email.value })
    Swal.fire({
      title: 'OK',
      text: res.data?.message || res.message,
      icon: 'success',
      confirmButtonText: t('other.buttons.ok')
    })
  } catch (err) {
    const errorData = err
    errors.value = errorData?.errors || {}
    const errorCode = errorData?.error_code
    if (errorCode === 'user_not_found') {
      Swal.fire(t('other.error'), t('other.emailNotFound'), 'error')
    } else if (Object.keys(errors.value).length === 0) {
      const serverMessage = errorData?.message || t('other.tryAgainLater')
      Swal.fire(t('other.error'), serverMessage, 'error')
    }
  } finally {
    loading.value = false
  }
}
</script>