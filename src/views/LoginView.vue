<template>
  <div class="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
    <h1 class="h1">{{ $t('Login') }}</h1>

    <div class="text-center text-gray-800 space-y-1 mb-4">
      <div class="text-gray-800 font-bold text-center mt-3">{{ $t('Default credentials') }}</div>
      <div class="text-gray-800 text-center mt-3">provider@onet.pl | password <a class="cursor-pointer" @click="loginProvider()">login</a></div>
      <div class="text-gray-800 text-center mt-3 mb-3">client@onet.pl | password <a class="cursor-pointer" @click="loginClient()">login</a></div>
    </div>

    <form @submit.prevent="handleLogin" class="space-y-4">
      <BaseInput v-model="form.email" type="text" :label="$t('Email')" :errors="errors?.email" />
      <BaseInput v-model="form.password" type="password" :label="$t('Password')" :errors="errors?.password"/>
      <BaseButton :name="$t('Login')" :loading="loading"/>
      <div class="text-center text-gray-600 text-sm mt-4">
        <router-link :to="{ name: 'ForgotPassword', query: { email: form.email } }" class="hover:underline">{{ $t('Forgot password?') }}</router-link>
      </div>
      <div class="text-center text-gray-600 text-sm mt-4">
        <router-link :to="{ name: 'Register' }" class="hover:underline">{{ $t('Register') }}</router-link>
      </div>
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
import { useRoute } from 'vue-router'

const form = ref({})
const router = useRouter()
const route = useRoute()

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
    const redirectPath = route.query.redirect ? decodeURIComponent(route.query.redirect) : router.resolve({ name: 'Home' }).href;
    router.push(redirectPath)
  } catch (error) {
    errors.value = error.errors
  }
  loading.value = false
}
const loginProvider = () => {
  form.value.email = 'provider@onet.pl'
  form.value.password = 'password'
  handleLogin()
}

const loginClient = () => {
  form.value.email = 'client@onet.pl'
  form.value.password = 'password'
  handleLogin()
}
</script>
