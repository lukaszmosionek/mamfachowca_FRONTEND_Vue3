<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password" />
      <button type="submit">Zaloguj</button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import api from '@/services/api'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const email = ref('')
const password = ref('')
const router = useRouter()
const store = useAuthStore()

const handleLogin = async () => {
  await store.login(email.value, password.value)
  router.push('/')
}
</script>
