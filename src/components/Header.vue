<template>

  <header class="bg-gray-800 text-white px-6 py-4">
    <div class="wrapper flex justify-between items-center">
      <h1 class="text-xl font-bold">
        <RouterLink :to="{ name: 'Home', params: {}, query: {'route':'home'} }">{{ $t('Home') }}</RouterLink>
      </h1>

      <div class="md:hidden flex gap-2">
        <ChangeLanguage />
        <RouterLink v-if="authStore.token" :to="{ name: 'Favorites' }" class="text-3xl">♡</RouterLink>
        <!-- Hamburger Icon (Mobile only) -->
        <button class="" @click="mobileMenuOpen = !mobileMenuOpen">
          <img src="@/assets/icons/hamburger-icon.svg" class="h-6 w-6" alt="Hamburger Icon (Mobile only)">
        </button>
      </div>

      <!-- Desktop Nav -->
      <nav class="hidden md:flex items-center gap-4">

        <ChangeLanguage />

        <!-- <button @click="clearCache" class="clear-button">
            {{ $t('Clear Cache') }}
        </button> -->

        <RouterLink v-if="isLogged" :to="{ name: 'Favorites', params: {} }" class="text-3xl">♡</RouterLink>

        <NotificationDropdown v-if="isLogged" />

        <RouterLink v-if="!isLogged" :to="{ name: 'Login' }">{{ $t('Login') }}</RouterLink>
        <RouterLink v-if="!isLogged" :to="{ name: 'Register' }">{{ $t('Register') }}</RouterLink>

        <RouterLink v-if="isLogged" :to="{ name: 'Messages', params: {'userId': 1} }">{{ $t('Messages') }}</RouterLink>
        <RouterLink v-if="isLogged" :to="{ name: 'Appointments' }">{{ $t('Appointments') }}</RouterLink>
        <RouterLink v-if="isLogged && isProvider" :to="{ name: 'MyServices' }">{{ $t('My services') }}</RouterLink>

        <RouterLink v-if="isLogged" :to="{ name: 'Account' }"> {{ authStore.user.name }} #{{ authStore.user.id}} ({{ authStore.user.role }})</RouterLink>
        <BaseButton v-if="isLogged" @click="logout" :loading="loading" :name="$t('Logout')" class="bg-red-500 px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-60 cursor-pointer w-fit"/>

      </nav>
    </div>
  </header>

  <!-- Mobile Menu (shown when hamburger is clicked) -->
  <nav v-if="mobileMenuOpen" class="md:hidden bg-gray-700 text-white px-6 py-4 flex flex-col gap-2">

    <RouterLink @click="mobileMenuOpen = false" v-if="!isLogged" :to="{ name: 'Login' }">{{ $t('Login') }}</RouterLink>
    <RouterLink @click="mobileMenuOpen = false" v-if="!isLogged" :to="{ name: 'Register' }">{{ $t('Register') }}</RouterLink>

    <RouterLink @click="mobileMenuOpen = false" v-if="isLogged && isClient" :to="{ name: 'Appointments' }">{{$t('Appointments') }}</RouterLink>
    <RouterLink @click="mobileMenuOpen = false" v-if="isLogged && isProvider" :to="{ name: 'MyServices' }">{{$t('My services') }}</RouterLink>
    <!-- <span v-if="authStore.user" class="font-semibold mt-6">
      {{ authStore.user.name }} ({{ isProvider ? authStore.user.role : '' }})
    </span> -->
    <RouterLink v-if="isLogged" :to="{ name: 'Account' }">{{ $t('Account') + ' - ' + authStore.user.name }} ({{isProvider ? authStore.user.role : '' }})</RouterLink>
    <BaseButton :loading="loading" :name="$t('Logout')" class="bg-red-500 px-3 py-1 rounded text-sm hover:bg-red-700"v-if="authStore.token" @click="logout" />

    <!-- <button @click="handleLogout" v-if="authStore.token" class="bg-red-500 px-3 py-1 rounded text-sm hover:bg-red-700">{{ $t('Logout') }}</button> -->
  </nav>
</template>


<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter, RouterLink } from 'vue-router'
import { computed, ref, watch } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import ChangeLanguage from './ChangeLanguage.vue'
import { toast } from 'vue3-toastify'
import NotificationDropdown from '@/components/NotificationDropdown.vue'
import { useRoute } from 'vue-router'


const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const isProvider = computed(() => authStore.user?.role === 'provider')
const isClient = computed(() => authStore.user?.role === 'client')
const isLogged = computed(() => authStore.user )
const mobileMenuOpen = ref(false)
const loading = ref(false)

const logout = async () => {
  loading.value = true
  try {
    await authStore.logout()
    router.push({ name: 'Login', query: { successMessage: 'Logged out successfully' } })
  } catch (error) {
    console.error('API call error:', error?.message)
  } finally {
    loading.value = false
  }
}

const handleLogout = async () => {
  mobileMenuOpen.value = false
  await logout()
}

function clearCache() {
  // Remove specific auth/local data
  localStorage.removeItem('token'); // or whatever key you're using

  // OR: Clear all localStorage
  localStorage.clear();

  // Optional: Redirect to login or refresh the app
  window.location.reload(); // or use Vue Router to redirect
}

watch(() => route.query.successMessage, (newValue) => {
  if (route.query.successMessage) {
    toast.success(route.query.successMessage)
  }
  if (route.query.errorMessage) {
    toast.error(route.query.errorMessage)
  }
})
</script>
