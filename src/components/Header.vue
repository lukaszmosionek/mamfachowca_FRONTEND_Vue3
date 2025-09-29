<template>

  <header class="bg-gray-800 text-white py-4"  ref="container">
    <div class="wrapper flex justify-between items-center">
      <h1 class="md:text-xl  font-bold">
        <RouterLink class="link-home" :to="{ name: 'Home', params: {}, query: {} }" @click="headerStore.triggerHomeClick()"><font-awesome-icon :icon="['fas', 'hammer']" title="Home Page" />&nbsp;Mam Fachowca</RouterLink>
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

        <RouterLink :to="{ name: 'Contact' }">{{ $t('header.contact') }}</RouterLink>
        <RouterLink :to="{ name: 'About' }">{{ $t('header.about') }}</RouterLink>

        <RouterLink v-if="!isLogged" :to="{ name: 'Login' }">{{ $t('header.login') }}</RouterLink>
        <RouterLink v-if="!isLogged" :to="{ name: 'Register' }">{{ $t('header.register') }}</RouterLink>

        <div class="relative  inline-block" v-if="isLogged" @mouseenter="openDropdown" @mouseleave="closeDropdown">
          <RouterLink v-if="isLogged" class="gap-2" :to="{ name: 'Account' }" :title="authStore.user.name+' #'+authStore.user.id+'('+authStore.user.role+')'">{{ $t('header.account') }}<font-awesome-icon :icon="['fa', 'fa-chevron-down']" /> </RouterLink>
          <transition name="fade">
            <div v-if="isOpen" class="text-gray-800 flex-center gap-4 flex-col absolute right-0 p-2 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-50">
              <RouterLink v-if="authStore.isAdmin" class="hidden md:inline" :to="{ name: 'AdminDashboard', params: {}, query: {} }" @click="headerStore.triggerHomeClick()" title="Admin Panel">Admin Panel</RouterLink>
              <RouterLink v-if="isLogged" :to="{ name: 'Appointments' }">{{ $t('header.appointments') }}</RouterLink>
              <RouterLink v-if="isLogged && isProvider" :to="{ name: 'MyServices' }">{{ $t('header.my-services') }}</RouterLink>
              <BaseButton v-if="isLogged" @click="logout" :loading="loading" class="bg-red-500 px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-60 cursor-pointer w-fit btn-logout"> <font-awesome-icon :icon="['fas', 'right-from-bracket']" />&nbsp;{{ $t('header.logout') }}</BaseButton>
            </div>
          </transition>
        </div>
      </nav>
      <!-- END Desktop Nav -->
    </div>
  </header>

  <!-- Mobile Menu (shown when hamburger is clicked) -->
  <nav v-if="mobileMenuOpen && isMobile" class="md:hidden bg-gray-700 text-white px-6 py-4 flex flex-col gap-2">

    <RouterLink v-if="authStore.isAdmin" class="inline md:hidden" :to="{ name: 'AdminDashboard', params: {}, query: {} }" @click="headerStore.triggerHomeClick()">Admin Panel</RouterLink>

    <RouterLink @click="mobileMenuOpen = false" v-if="!isLogged" :to="{ name: 'Login' }">{{ $t('header.login') }}</RouterLink>
    <RouterLink @click="mobileMenuOpen = false" v-if="!isLogged" :to="{ name: 'Register' }">{{ $t('header.register') }}</RouterLink>

    <RouterLink @click="mobileMenuOpen = false" v-if="isLogged" :to="{ name: 'Messages', params: {'userId': 1} }">{{ $t('header.messages') }}</RouterLink>
    <RouterLink @click="mobileMenuOpen = false" v-if="isLogged && isClient" :to="{ name: 'Appointments' }">{{$t('header.appointments') }}</RouterLink>
    <RouterLink @click="mobileMenuOpen = false" v-if="isLogged && isProvider" :to="{ name: 'MyServices' }">{{$t('header.my-services') }}</RouterLink>

    <RouterLink @click="mobileMenuOpen = false" v-if="isLogged" :to="{ name: 'Account' }"> {{ authStore.user.name }} #{{ authStore.user.id}} ({{ authStore.user.role }})</RouterLink>

    <BaseButton @click="logout" :loading="loading" :name="$t('header.logout')" class="bg-red-500 px-3 py-1 rounded text-sm hover:bg-red-700 btn-logout" v-if="authStore.token"/>

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
import { useI18n } from 'vue-i18n'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const headerStore = useHeaderStore()
const { t } = useI18n()

const isProvider = computed(() => authStore.isProvider)
const isClient = computed(() => authStore.isClient)
const isLogged = computed(() => authStore.isLoggedIn )
const mobileMenuOpen = ref(false)
const container = ref(null)
const loading = ref(false)
const isMobile = ref(window.innerWidth < Enums.TAILWIND_BREAKPOINTS.md); // md breakpoint in Tailwind

const isOpen = ref(false);
let timeoutId = null;

onMounted(async () => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('resize', handleResize)
})

const logout = async () => {
  loading.value = true
  try {
    await authStore.logout()
    router.push({ name: 'Login', query: { successMessage: 'header.logged-out-successfully' } })
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
    toast.success(t(route.query.successMessage))
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

function openDropdown() {
  clearTimeout(timeoutId);
  isOpen.value = true;
}

function closeDropdown() {
  // Delay before closing (e.g., 300ms)
  timeoutId = setTimeout(() => {
    isOpen.value = false;
  }, 300);
}
</script>
