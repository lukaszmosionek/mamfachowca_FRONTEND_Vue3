<template>
  <footer class="mt-16 bg-gray-900 text-white py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Logo and Description -->
      <div>
        <h2 class="text-xl font-bold mb-2">Mam fachowca</h2>
        <p class="text-gray-400 text-sm">© 2025 Mam fachowca, Inc. {{ $t('footer.allRightReserved') }}</p>
        <p class="text-gray-400 text-sm mt-2">{{ $t('footer.pageDesignedBy') }} <a href="https://mosioneklukasz.pl"> Łukasz Mosionek</a></p>
      </div>

      <!-- Navigation Links -->
      <div>
        <h3 class="text-sm font-semibold mb-3 uppercase tracking-wider">{{ $t('footer.quickLinks') }}</h3>
        <ul class="space-y-2 text-gray-400">
          <li><RouterLink :to="{ name: 'Home', params: {}, query: {} }" class="hover:text-white" @click="headerStore.triggerHomeClick()">{{ $t('footer.pages.home') }}</RouterLink></li>
          <li><RouterLink :to="{ name: 'About', }" class="hover:text-white">{{ $t('footer.pages.about') }}</RouterLink></li>
          <li v-if="authStore.isProvider"><RouterLink :to="{ name: 'MyServices', }" class="hover:text-white">{{ $t('footer.pages.services') }}</RouterLink></li>
          <li><RouterLink :to="{ name: 'Contact', }" class="hover:text-white">{{ $t('footer.pages.contact') }}</RouterLink></li>
          <li class="w-fit"><ChangeLanguage/></li>
        </ul>
      </div>

      <!-- Social Media -->
      <div>
        <h3 class="text-sm font-semibold mb-3 uppercase tracking-wider">{{ $t('footer.followUs') }}</h3>
        <div class="flex space-x-4">
            <a href="#" class="text-gray-400 hover:text-white">
              <font-awesome-icon :icon="['fab', 'facebook-f']" />
            </a>
            <a href="#" class="text-gray-400 hover:text-white">
              <font-awesome-icon :icon="['fab', 'twitter']" />
            </a>
            <a href="#" class="text-gray-400 hover:text-white">
              <font-awesome-icon :icon="['fab', 'instagram']" />
            </a>
            <a href="#" class="text-gray-400 hover:text-white">
              <font-awesome-icon :icon="['fab', 'linkedin-in']" />
            </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
  import ChangeLanguage from './ChangeLanguage.vue'
  import { useHeaderStore } from '@/stores/useHeaderStore.ts'
  import { useAuthStore } from '@/stores/auth.ts'

  const headerStore = useHeaderStore()
  const authStore = useAuthStore()
</script>

<style scoped>
/* Make sure to include Font Awesome or use your own icons */
</style>
