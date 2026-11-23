<!-- ResetPassword.vue -->
<template>
  <div class="reset-password-container">
    <div class="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h1 class="h1">{{ $t('login.reset-password') }}</h1>
      <p class="text-gray-600 mt-2">{{ $t('login.forgot-password-description') }}</p>

      <form @submit.prevent="submit" class="mt-4 space-y-4">
        <BaseInput
          v-model="form.email"
          type="email"
          :errors="errors?.email"
          :label="$t('login.email')"
          :value="route.query.email"
          disabled
        />
        <BaseInput
          v-model="form.password"
          :type="passwordVisible ? 'text' : 'password'"
          :errors="errors?.password"
          :label="$t('login.new-password')"
        />
        <BaseInput
          v-model="form.password_confirmation"
          :type="passwordVisible ? 'text' : 'password'"
          :errors="errors?.password_confirmation"
          :label="$t('login.confirm-password')"
        />

        <div class="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            id="password-toggle"
            v-model="passwordVisible"
            class="rounded"
          />
          <label for="password-toggle" class="text-sm text-gray-600 cursor-pointer">
            {{ passwordVisible ? 'Hide Password' : 'Show Password' }}
          </label>
        </div>
        <p class="text-xs text-gray-500 mt-1">{{ $t('login.password-requirements') }}</p>

        <BaseButton type="submit" class="mt-4" :loading="loading">
          {{ $t('login.reset-password') }}
        </BaseButton>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api.ts'
import { useRoute } from 'vue-router'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import { validatePasswordReset } from '@/utils/validators.ts'
import Swal from 'sweetalert2'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const form = ref({})
const errors = ref({})
const message = ref('')
const loading = ref(false)
const passwordVisible = ref(false)
const route = useRoute()

onMounted(() => {
  form.value.token = route.query.token || ''
  form.value.email = route.query.email || ''
})

const submit = async () => {
  errors.value = validatePasswordReset(form)
  if (Object.keys(errors.value).length > 0) return

  loading.value = true
  try {
    const res = await api.post('/reset-password', form.value)
    Swal.fire({
      title: 'OK',
      text: res.data.message,
      icon: 'success',
      confirmButtonText: t('other.buttons.ok')
    })
  } catch (err) {
    errors.value = err.response?.data?.errors || {}
    if (Object.keys(errors.value).length === 0) {
      Swal.fire('Error', err.response?.data?.message + '. Failed to reset password. Please try again.', 'error')
    }
  } finally {
    loading.value = false
  }
}
</script>