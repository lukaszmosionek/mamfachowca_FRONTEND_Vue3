<template>
  <div class="md:p-6 p-1">
    <h1 class="h1">Users</h1>
    <div v-if="isLoading" class="spinner"></div>
    <div v-else-if="users.length === 0">No users found.</div>

    <div v-else class="overflow-x-auto">
      <table class="min-w-full border border-gray-300 divide-y divide-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-2 text-left">ID</th>
            <th class="px-4 py-2 text-left">Name</th>
            <th class="px-4 py-2 text-left">Email</th>
            <th class="px-4 py-2 text-left">Role</th>
            <th class="px-4 py-2 text-left"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
            <td class="px-4 py-2">#{{ user.id }}</td>
            <td class="px-4 py-2"><RouterLink class="" :to="{ name: 'Profile', params: { userId: user.id } }">{{user.name }}</RouterLink></td>
            <td class="px-4 py-2">{{ user.email }}</td>
            <td class="px-4 py-2">{{ user.role }}</td>
            <td class="px-4 py-2 text-right space-x-2">
              <!-- <button class="text-blue-500 hover:underline">Edit</button> -->

              <button v-if="!user.deleted_at" class="text-red-500 hover:underline" @click="deleteUser(user)">Delete</button>
              <button v-if="user.deleted_at" class="text-green-500 hover:underline" @click="restoreUser(user.id)">Restore</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>


  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { toast } from 'vue3-toastify'
import { useAuthStore } from '@/stores/auth'
import { Enums } from '@/enums.js'

const users = ref([])
const isLoading = ref(false)
const authStore = useAuthStore()

onMounted(() => {
  loadUsers()
})

async function loadUsers() {
  isLoading.value = true
  try{
    const res = await api.get('/admin/users')
    users.value = res.users
  } catch (error) {
    toast.error('Failed to load user')
  }
  isLoading.value = false
}

async function deleteUser(user) {
  if( user.role == Enums.Role.Admin && import.meta.env.VITE_TURN_ON_VUE_VALIDATION === 'true' ) return alert('Admin cannot be deleted')

  try {
    await api.delete(`/admin/users/${user.id}`)
    users.value.find(userA => userA.id === user.id).deleted_at = true
    toast.success('User deleted successfully')
  } catch (error) {
    toast.error('Failed to delete user')
  }
}

async function restoreUser(userId) {
  try {
    await api.delete(`/admin/users/${userId}`)
    users.value.find(user => user.id === userId).deleted_at = null
    toast.success('User restored successfully')
  } catch (error) {
    toast.error('Failed to restore user')
  }
}
</script>
