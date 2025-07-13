<template>
  <div class="text-center py-4 text-gray-600 flex justify-center gap-4">
    <button @click="changeLanguage('en')" :class="{'opacity-100': locale === 'en', 'opacity-50': locale !== 'en'}">
      🇬🇧
    </button>
    <button @click="changeLanguage('pl')" :class="{'opacity-100': locale === 'pl', 'opacity-50': locale !== 'pl'}">
      🇵🇱
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
