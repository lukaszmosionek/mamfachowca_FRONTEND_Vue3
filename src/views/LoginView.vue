<template>
  <div class="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
    <h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">{{ $t('Login') }}</h2>

    <div class="text-center text-gray-800 space-y-1 mb-4">
      <div class="text-gray-800 font-bold text-center mt-3">{{ $t('Default credentials') }}</div>
      <div class="text-gray-800 text-center mt-3">provider@onet.pl | password</div>
      <div class="text-gray-800 text-center mt-3 mb-3">client@onet.pl | password</div>
    </div>

    <form @submit.prevent="handleLogin" class="space-y-4">
      <BaseInput v-model="form.email" type="text" :label="$t('Email')" :errors="errors?.email" />
      <BaseInput v-model="form.password" type="password" :label="$t('Password')" :errors="errors?.password"/>
      <small class="text-gray-600">big letter, small letter, number</small>
      <BaseButton :name="$t('Login')" :loading="loading"/>
    </form>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import { validateLogin } from '@/utils/validators.js'

const form = ref({})
const router = useRouter()
const store = useAuthStore()

const errors = ref({})
const loading = ref(false)

const handleLogin = async () => {
  errors.value = {} // reset errors before submit

  errors.value = validateLogin(form)
  if( Object.keys(errors.value).length > 0 ) return

  loading.value = true
  try {
    await store.login(form.value)
    router.push('/')
  } catch (error) {
    errors.value = error.errors
  }

  loading.value = false

}
</script>
