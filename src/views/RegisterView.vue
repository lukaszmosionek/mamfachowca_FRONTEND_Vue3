<template>
  <Header />
  <div class="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-xl">
    <h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">Registration</h2>
    <form @submit.prevent="handleRegister" class="space-y-4">

      <BaseInput v-model="name" type="text" label="Name" :errors="errors.errors?.name" />
      <BaseInput v-model="email" type="email" label="Email" :errors="errors.errors?.email" />
      <BaseInput v-model="password" type="password" label="Password" :errors="errors.errors?.password" />
      <BaseInput v-model="password_confirmation" type="password" label="Password confirmation" :errors="errors.errors?.password_confirmation" />
      <BaseSelect v-model="role" label="Rola" :options="{'client': 'Klient', 'provider':'Usługodawca'}" />
      <BaseButton name="Register" :loading="loading" />
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import Header from '@/components/Header.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseSelect from '@/components/BaseSelect.vue'

const name = ref('')
const email = ref('')
const password = ref('')
const password_confirmation = ref('')
const role = ref('client')

const store = useAuthStore()
const router = useRouter()

const errors = ref({})
const loading = ref(false)

const handleRegister = async () => {
  errors.value = {} // reset errors before submit
  loading.value = true

  try {
    await store.register({
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: password_confirmation.value,
      role: role.value,
    })
    router.push('/')
  } catch (error) {
    // alert('API call error:', error.response?.data.data.message || error.message)
    if (error && error.message) {
      errors.value = error
    } else {
      console.error('Unexpected error:', error)
    }
  } finally {
    loading.value = false
  }
}
</script>
