<template>
  <div>
    <h2>Zarejestruj się</h2>
    <form @submit.prevent="handleRegister">
      <input v-model="name" placeholder="Imię i nazwisko" />
      <input v-model="email" type="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Hasło" />
      <input v-model="password_confirmation" type="password" placeholder="Powtórz hasło" />

      <select v-model="role">
        <option value="client">Klient</option>
        <option value="provider">Usługodawca</option>
      </select>

      <button type="submit">Zarejestruj</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const name = ref('')
const email = ref('')
const password = ref('')
const password_confirmation = ref('')
const role = ref('client')

const store = useAuthStore()
const router = useRouter()

const handleRegister = async () => {
  await store.register({
    name: name.value,
    email: email.value,
    password: password.value,
    password_confirmation: password_confirmation.value,
    role: role.value,
  })
  router.push('/')
}
</script>
