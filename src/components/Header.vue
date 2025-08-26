<template>

  <header class="bg-gray-800 text-white py-4"  ref="container">
    <div class="wrapper flex justify-between items-center">
      <h1 class="md:text-xl  font-bold">
        <RouterLink :to="{ name: 'Home', params: {}, query: {} }" @click="headerStore.triggerHomeClick()"><font-awesome-icon :icon="['fas', 'hammer']" title="Home Page" />&nbsp;Mam Fachowca</RouterLink>
      </h1>

      <!-- Mobile -->
      <div class="md:hidden flex gap-2 items-center" v-if="isMobile">
        <CurrencySwitcher/>
        <ChangeLanguage />
        <RouterLink v-if="isLogged" :to="{ name: 'Favorites' }"><font-awesome-icon  class="md:text-2xl" :icon="['far', 'heart']" /></RouterLink>
        <NotificationDropdown v-if="isLogged" />

        <!-- Hamburger Icon (Mobile only) -->
        <button class="" @click="mobileMenuOpen = !mobileMenuOpen">
          <img src="@/assets/icons/hamburger-icon.svg" class="h-6 w-6" alt="Hamburger Icon (Mobile only)">
        </button>
      </div>
      <!-- END Mobile -->

      <!-- Desktop Nav -->
      <nav class="hidden md:flex items-center lg:gap-4 gap-1 md:text-xl text-sm">

        <CurrencySwitcher/>

        <ChangeLanguage />

        <RouterLink v-if="isLogged" :to="{ name: 'Messages', params: {'userId': 1} }"><font-awesome-icon class="md:text-xl" :icon="['fas', 'envelope']" /></RouterLink>
        <RouterLink v-if="isLogged" :to="{ name: 'Favorites', params: {} }"><font-awesome-icon class="md:text-xl" :icon="['far', 'heart']" /></RouterLink>

        <NotificationDropdown v-if="isLogged" />

        <RouterLink :to="{ name: 'Contact' }">{{ $t('Contact') }}</RouterLink>
        <RouterLink :to="{ name: 'About' }">{{ $t('About') }}</RouterLink>

        <RouterLink v-if="!isLogged" :to="{ name: 'Login' }">{{ $t('Login') }}</RouterLink>
        <RouterLink v-if="!isLogged" :to="{ name: 'Register' }">{{ $t('Register') }}</RouterLink>

        <div class="relative group" v-if="isLogged">
          <RouterLink v-if="isLogged" :to="{ name: 'Account' }" :title="authStore.user.name+' #'+authStore.user.id+'('+authStore.user.role+')'">{{ $t('Account') }} <i class="fa fa-chevron-down"></i> </RouterLink>
          <div class="flex-center gap-4 flex-col absolute right-0 p-2 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200">
            <RouterLink v-if="authStore.isAdmin" class="hidden md:inline" :to="{ name: 'AdminDashboard', params: {}, query: {} }" @click="headerStore.triggerHomeClick()" title="Admin Panel">Admin Panel</RouterLink>
            <RouterLink v-if="isLogged" :to="{ name: 'Appointments' }">{{ $t('Appointments') }}</RouterLink>
            <RouterLink v-if="isLogged && isProvider" :to="{ name: 'MyServices' }">{{ $t('My services') }}</RouterLink>
            <BaseButton v-if="isLogged" @click="logout" :loading="loading" class="bg-red-500 px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-60 cursor-pointer w-fit"> <font-awesome-icon :icon="['fas', 'right-from-bracket']" />&nbsp;{{ $t('Logout') }}</BaseButton>
          </div>
        </div>
      </nav>
      <!-- END Desktop Nav -->
    </div>
  </header>

  <!-- Mobile Menu (shown when hamburger is clicked) -->
  <nav v-if="mobileMenuOpen && isMobile" class="md:hidden bg-gray-700 text-white px-6 py-4 flex flex-col gap-2">

    <RouterLink v-if="authStore.isAdmin" class="inline md:hidden" :to="{ name: 'AdminDashboard', params: {}, query: {} }" @click="headerStore.triggerHomeClick()">Admin Panel</RouterLink>

    <RouterLink @click="mobileMenuOpen = false" v-if="!isLogged" :to="{ name: 'Login' }">{{ $t('Login') }}</RouterLink>
    <RouterLink @click="mobileMenuOpen = false" v-if="!isLogged" :to="{ name: 'Register' }">{{ $t('Register') }}</RouterLink>

    <RouterLink @click="mobileMenuOpen = false" v-if="isLogged" :to="{ name: 'Messages', params: {'userId': 1} }">{{ $t('Messages') }}</RouterLink>
    <RouterLink @click="mobileMenuOpen = false" v-if="isLogged && isClient" :to="{ name: 'Appointments' }">{{$t('Appointments') }}</RouterLink>
    <RouterLink @click="mobileMenuOpen = false" v-if="isLogged && isProvider" :to="{ name: 'MyServices' }">{{$t('My services') }}</RouterLink>

    <RouterLink @click="mobileMenuOpen = false" v-if="isLogged" :to="{ name: 'Account' }"> {{ authStore.user.name }} #{{ authStore.user.id}} ({{ authStore.user.role }})</RouterLink>

    <BaseButton @click="logout" :loading="loading" :name="$t('Logout')" class="bg-red-500 px-3 py-1 rounded text-sm hover:bg-red-700" v-if="authStore.token"/>

  </nav>
</template>


<script setup>
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { computed, ref, watch, onBeforeUnmount, onMounted, onUnmounted } from 'vue'
import { toast } from 'vue3-toastify'
import { useAuthStore } from '@/stores/auth'
import BaseButton from '@/components/BaseButton.vue'
import ChangeLanguage from './ChangeLanguage.vue'
import CurrencySwitcher from './CurrencySwitcher.vue'
import NotificationDropdown from '@/components/NotificationDropdown.vue'
import { useHeaderStore } from '@/stores/useHeaderStore'
import { Enums } from '@/enums.js'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const headerStore = useHeaderStore()

const isProvider = computed(() => authStore.isProvider)
const isClient = computed(() => authStore.isClient)
const isLogged = computed(() => authStore.isLoggedIn )
const mobileMenuOpen = ref(false)
const container = ref(null)
const loading = ref(false)
const isMobile = ref(window.innerWidth < Enums.TAILWIND_BREAKPOINTS.md); // md breakpoint in Tailwind

onMounted(async () => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('resize', handleResize)
})

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

watch(() => route.query.successMessage, (newValue) => {
  if (route.query.successMessage) {
    toast.success(route.query.successMessage)
  }
  if (route.query.errorMessage) {
    toast.error(route.query.errorMessage)
  }
})

//click Outside mobile dropdown menu
function handleClickOutside(event) {
  if (container.value && !container.value.contains(event.target)) {
      mobileMenuOpen.value = false
  }
}

const handleResize = () => {
  if (window.innerWidth < Enums.TAILWIND_BREAKPOINTS.md) {
    showSidebar.value = !showSidebar.value
  }
}

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>
