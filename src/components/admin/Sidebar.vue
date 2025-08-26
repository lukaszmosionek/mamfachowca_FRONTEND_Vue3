<template>

  <button class="text-gray-800 text-right w-full block md:hidden" @click="handleSidebarClick()">
    <i class="fas fa-bars h-6 w-6 p-1" alt="Hamburger Icon (Mobile only)"></i>
  </button>

  <aside class=" md:w-64 w-full bg-gray-800 text-white p-4 fixed md:static" v-if="showSidebar" @click="handleSidebarClick">
    <!-- <h2 class="text-xl font-bold mb-6">Admin Panel</h2> -->
    <nav class="flex flex-col space-y-2 mt-10">
      <router-link :to="{ name: 'AdminDashboard' }" class="hover:bg-gray-700 p-2 rounded flex items-center gap-2"><i class="fas fa-tachometer-alt"></i><span class="">Dashboard</span></router-link>
      <router-link :to="{ name: 'AdminUsers' }" class="hover:bg-gray-700 p-2 rounded flex items-center gap-2"><i class="fas fa-users"></i><span class="">Users</span></router-link>
      <router-link :to="{ name: 'AdminServices' }" class="hover:bg-gray-700 p-2 rounded flex items-center gap-2"><i class="fa fa-tasks"></i><span class="">Services</span></router-link>
      <router-link :to="{ name: 'AdminSettings' }" class="hover:bg-gray-700 p-2 rounded flex items-center gap-2"><i class="fas fa-cog"></i><span class="">Settings</span></router-link>

      <router-link :to="{ name: 'Home', params: {}, query: {} }" class="hover:bg-gray-700 p-2 rounded flex items-center gap-2"><i class="fas fa-home"></i><span>Go to site</span></router-link>
      <!-- <router-link to="/admin/settings" class="hover:bg-gray-700 p-2 rounded flex items-center gap-2"><i class="fas fa-sign-out-alt"></i><span>Logout</span></router-link> -->
      <BaseButton @click="logout" :loading="loading" :name="$t('Logout')" class="bg-red-500 px-3 py-1 rounded text-sm hover:bg-red-700" v-if="authStore.token"/>

    </nav>
  </aside>
</template>

<script setup>
import { ref } from 'vue'
import { Enums } from '@/enums.js'
import { useAuthStore } from '@/stores/auth'
import BaseButton from '@/components/BaseButton.vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { toast } from 'vue3-toastify'

const authStore = useAuthStore()

const showSidebar = ref(true)
const loading = ref(false)

const router = useRouter()
const route = useRoute()

function handleSidebarClick() {
  if (window.innerWidth < Enums.TAILWIND_BREAKPOINTS.md) {
    showSidebar.value = !showSidebar.value
  }
}

const logout = async () => {
  loading.value = true
  try {
    await authStore.logout()
    router.push({ name: 'Login', query: { successMessage: 'Logged out successfully' } })
  } catch (error) {
    toast.error('Logout error: ', error?.message)
  }

  loading.value = false

}

</script>
