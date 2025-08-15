<template>

  <header class="bg-gray-800 text-white py-4"  ref="container">
    <div class="wrapper flex justify-between items-center">
      <h1 class="md:text-xl  font-bold">
        <RouterLink :to="{ name: 'Home', params: {}, query: {} }" @click="headerStore.triggerHomeClick()"><font-awesome-icon :icon="['fas', 'hammer']" />&nbsp;Mam Fachowca</RouterLink>
      </h1>

      <div class="md:hidden flex gap-2 items-center">
        <CurrencySwitcher/>
        <ChangeLanguage />
        <RouterLink v-if="isLogged" :to="{ name: 'Favorites' }"><font-awesome-icon  class="md:text-2xl" :icon="['far', 'heart']" /></RouterLink>
        <NotificationDropdown v-if="isLogged" />

        <!-- Hamburger Icon (Mobile only) -->
        <button class="" @click="mobileMenuOpen = !mobileMenuOpen">
          <img src="@/assets/icons/hamburger-icon.svg" class="h-6 w-6" alt="Hamburger Icon (Mobile only)">
        </button>
      </div>

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

        <RouterLink v-if="isLogged" :to="{ name: 'Appointments' }">{{ $t('Appointments') }}</RouterLink>
        <RouterLink v-if="isLogged && isProvider" :to="{ name: 'MyServices' }">{{ $t('My services') }}</RouterLink>

        <RouterLink v-if="isLogged" :to="{ name: 'Account' }" :title="authStore.user.name+' #'+authStore.user.id+'('+authStore.user.role+')'">{{ $t('Account') }}</RouterLink>
        <BaseButton v-if="isLogged" @click="logout" :loading="loading" class="bg-red-500 px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-60 cursor-pointer w-fit">
        <font-awesome-icon :icon="['fas', 'right-from-bracket']" />&nbsp;{{ $t('Logout') }}</BaseButton>

      </nav>
    </div>
  </header>

  <!-- Mobile Menu (shown when hamburger is clicked) -->
  <nav v-if="mobileMenuOpen" class="md:hidden bg-gray-700 text-white px-6 py-4 flex flex-col gap-2">

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
import { computed, ref, watch, onBeforeUnmount, onMounted } from 'vue'
import { toast } from 'vue3-toastify'
import { useAuthStore } from '@/stores/auth'
import BaseButton from '@/components/BaseButton.vue'
import ChangeLanguage from './ChangeLanguage.vue'
import CurrencySwitcher from './CurrencySwitcher.vue'
import NotificationDropdown from '@/components/NotificationDropdown.vue'
import { useHeaderStore } from '@/stores/useHeaderStore'


const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const headerStore = useHeaderStore()

const isProvider = computed(() => authStore.user?.role === 'provider')
const isClient = computed(() => authStore.user?.role === 'client')
const isLogged = computed(() => authStore.user )
const mobileMenuOpen = ref(false)
const container = ref(null)
const loading = ref(false)

onMounted(async () => {
      document.addEventListener('click', handleClickOutside)
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

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
