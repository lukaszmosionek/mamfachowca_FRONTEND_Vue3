<template>

  <div class="w-full flex justify-between md:hidden text-white-800 p-4  bg-gray-800">
    <div class="weight-bold">
      <router-link :to="{ name: 'AdminDashboard' }">Admin Panel</router-link>
    </div>
    <button class="text-right " @click="handleSidebarClick()">
      <i class="fas fa-bars h-6 w-6 p-1" alt="Hamburger Icon (Mobile only)"></i>
    </button>
  </div>

  <aside class="hidden md:block absolute md:static md:w-64 w-full bg-gray-800 text-white p-4" :class="{'!block':showSidebar}" @click="handleSidebarClick">
    <!-- <h2 class="text-xl font-bold mb-6">Admin Panel</h2> -->
    <nav class="flex flex-col space-y-2 mt-10">
      <router-link :to="{ name: 'AdminDashboard' }" class="hover:bg-gray-700 p-2 rounded flex items-center gap-2"><font-awesome-icon :icon="['fas', 'tachometer-alt']" /><span class="">Dashboard</span></router-link>
      <router-link :to="{ name: 'AdminUsers' }" class="hover:bg-gray-700 p-2 rounded flex items-center gap-2"><font-awesome-icon :icon="['fas', 'users']" /><span class="">Users</span></router-link>
      <router-link :to="{ name: 'AdminServices' }" class="hover:bg-gray-700 p-2 rounded flex items-center gap-2"><font-awesome-icon :icon="['fas', 'tasks']" /><span class="">Services</span></router-link>
      <router-link :to="{ name: 'AdminSettings' }" class="hover:bg-gray-700 p-2 rounded flex items-center gap-2"><font-awesome-icon :icon="['fas', 'cog']" /><span class="">Settings</span></router-link>

      <router-link :to="{ name: 'Home', params: {}, query: {} }" class="hover:bg-gray-700 p-2 rounded flex items-center gap-2"><font-awesome-icon :icon="['fas', 'home']" /><span>Go to site</span></router-link>
      <!-- <router-link to="/admin/settings" class="hover:bg-gray-700 p-2 rounded flex items-center gap-2"><i class="fas fa-sign-out-alt"></i><span>Logout</span></router-link> -->
      <BaseButton @click="logout" :loading="loading" class="bg-red-500 px-3 py-1 rounded text-sm hover:bg-red-700 gap-1" v-if="authStore.token"><font-awesome-icon :icon="['fas', 'right-from-bracket']" />{{ $t('Logout') }}</BaseButton>

    </nav>
  </aside>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Enums } from '@/enums.ts'
import { useAuthStore } from '@/stores/auth.ts'
import BaseButton from '@/components/BaseButton.vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { toast } from 'vue3-toastify'

const authStore = useAuthStore()

const showSidebar = ref(true)
const loading = ref(false)

const router = useRouter()
const route = useRoute()

function handleSidebarClick() {
  if (window.innerWidth < Enums.TAILWIND_BREAKPOINTS.md) {//mobile sizes
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

onMounted(() => {
  hideSidebarMobile()
  window.addEventListener("resize", hideSidebarMobile)
})

const hideSidebarMobile = () => {
    if (window.innerWidth >= Enums.TAILWIND_BREAKPOINTS.md) { //desktop sizes
      showSidebar.value = true
    } else { //mobile sizes
      showSidebar.value = false
    }
}

</script>
