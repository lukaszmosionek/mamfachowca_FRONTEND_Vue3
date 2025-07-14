<template>
  <div class="text-center py-4 text-gray-600 flex justify-center gap-4">
    <button @click="changeLanguage('en')" :class="{'opacity-100': locale === 'en', 'opacity-50': locale !== 'en'}">
      <img alt="Flag EN" src="@/assets/icons/flag-en.svg" width="20" height="20" />
    </button>
    <button @click="changeLanguage('pl')" :class="{'opacity-100': locale === 'pl', 'opacity-50': locale !== 'pl'}">
      <img alt="Flag PL" src="@/assets/icons/flag-pl.svg" width="20" height="20" />
    </button>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

// Use vue-i18n locale
const { locale } = useI18n()

// Watch for changes to selectedLocale and update i18n + backend
function changeLanguage(lang){
  locale.value = lang
  localStorage.setItem('lang', lang)
}
</script>

<style scoped>
button {
  font-size: 2rem;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: opacity 0.3s ease;
}
</style>
