<!-- ResetPassword.vue -->
<template>
  <div class="reset-password-container wrapper">
    <h1>Reset Password</h1>
    <p>Please enter your new password.</p>

    <div class="form-container">
      <form @submit.prevent="submit">
        <BaseInput v-model="email" type="email" :label="$t('Email')" :value="route.query.email" disabled />
        <BaseInput v-model="password" type="password" :label="$t('New Password')" />
        <BaseInput v-model="password_confirmation" type="password" :label="$t('Confirm Password')" />
        <BaseButton class="mt-4" :name="$t('Reset Password')" />
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

const email = ref('')
const password = ref('')
const password_confirmation = ref('')
const token = ref('')
const message = ref('')
const route = useRoute()

onMounted(() => {
  token.value = route.query.token || ''
  email.value = route.query.email || ''
})

const submit = async () => {
  try {
    const res = await api.post('/reset-password', {
      email: email.value,
      password: password.value,
      password_confirmation: password_confirmation.value,
      token: token.value,
    })
    message.value = res.data.message
  } catch (err) {
    message.value = err.response.data.message
  }
}
</script>
