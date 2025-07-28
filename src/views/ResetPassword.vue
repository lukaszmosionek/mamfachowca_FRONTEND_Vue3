<!-- ResetPassword.vue -->
<template>
  <div class="reset-password-container wrapper">
    <h1>Reset Password</h1>
    <p>Please enter your new password.</p>

    <div class="form-container">
      <form @submit.prevent="submit">
        <BaseInput v-model="form.email" :errors="errors.email" type="email" :label="$t('Email')" :value="route.query.email" disabled />
        <BaseInput v-model="form.password" :errors="errors.password" :type="passwordVisible ? 'text' : 'password'" :label="$t('New Password')" />
        <BaseInput v-model="form.password_confirmation" :errors="errors.password_confirmation" :type="passwordVisible ? 'text' : 'password'" :label="$t('Confirm Password')" />

        <input
          type="checkbox"
          @click="passwordVisible = !passwordVisible"
          class="mt-4" id="password-toggle"
        />
        <label for="password-toggle" class="text-sm text-gray-600 cursor-pointer">
          {{ passwordVisible ? ' Hide Password' : ' Show Password' }}
        </label>
        <p class="text-xs text-gray-500 mt-1">Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.</p>

        <BaseButton class="mt-4" :name="$t('Reset Password')" :loading="loading" />
        <p v-if="message">{{ message }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { useRoute } from 'vue-router'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import { validatePasswordReset } from '@/utils/validators.js'
import Swal from 'sweetalert2'

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
  if( Object.keys(errors.value).length > 0 ) return

  loading.value = true
  try {
    const res = await api.post('/reset-password', form.value)
    message.value = res.data.message
  } catch (err) {
    console.error(err)
    // Swal.fire('Error', 'Failed to reset password. Please try again.', 'error');
    errors.value = err.response.data.errors
    if( Object.keys(errors.value).length == 0 ) Swal.fire('Error', err.response.data.message+'. Failed to reset password. Please try again.', 'error');
  } finally {
    loading.value = false
  }
}
</script>
