<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="login">
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

const email = ref('')
const password = ref('')
const router = useRouter()

const login = async () => {
  try {
    const response = await api.post('/login', {
      email: email.value,
      password: password.value,
    })

        console.log(response);

    const token = response.data.data.token
    localStorage.setItem('token', token)
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    router.push('/')

  } catch (error) {
    alert('Login failed'+error)
    console.log(error.response.data.message);
    alert(error.response.data.message);
  }
}
</script>
