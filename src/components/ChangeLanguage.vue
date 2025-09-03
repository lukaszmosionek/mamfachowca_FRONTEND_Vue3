<template>
  <div class="text-center py-4 text-gray-600 flex justify-center items-center">
    <button id="changeLanguage-en" v-if="locale !== 'en'" @click="changeLanguage('en')" class="flex justify-center items-center gap-2 hover:opacity-50">
      <img alt="Flag EN" src="@/assets/icons/flag-en.svg" width="20" height="20" /> <span class="text-sm">EN</span>
    </button>
    <button  id="changeLanguage-pl" v-if="locale !== 'pl'" @click="changeLanguage('pl')" class="flex justify-center items-center gap-2 hover:opacity-50">
      <img alt="Flag PL" src="@/assets/icons/flag-pl.svg" width="20" height="20" /> <span class="text-sm">PL</span>
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
