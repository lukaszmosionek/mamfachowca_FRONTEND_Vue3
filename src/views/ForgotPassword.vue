<!-- ForgotPassword.vue -->
<template>
  <div class="forgot-password-container">
    <div class="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h1 class="h1">{{ $t('Forgot Password') }}</h1>
      <p>Please enter your email address to receive a password reset link.</p>

      <div class="form-container mt-4">
        <form @submit.prevent="submit">
          <!-- <input v-model="email" type="email" class="border border-gray-300 p-2 rounded" placeholder="Enter your email" required /> -->
          <BaseInput v-model="email" type="email" :errors="error.email" label="Email" />
          <BaseButton class="mt-4" :disabled="!email" name="Send Reset Link" />
          <p v-if="message">{{ message }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import { onMounted, ref } from 'vue'
import api from '@/services/api.ts'
import { useRoute } from 'vue-router';

const email = ref('')
const message = ref('')
const error = ref({})
const route = useRoute();

onMounted(() => {
  email.value = route.query.email || '';
});

const submit = async () => {
  try {
    const res = await api.post('/forgot-password', { email: email.value })
    message.value = res.data.message
  } catch (err) {
    console.error(err)
    error.value = err.response.data.errors
  }
}
</script>
