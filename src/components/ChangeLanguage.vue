<template>
  <div class="text-center p-4 text-gray-600">
    <select v-model="selectedLocale" @change="changeLanguage" class="p-2 bg-black-500 border rounded">
      <option value="en">English</option>
      <option value="pl">Polski</option>
    </select>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { ref, watch } from 'vue'
import api from '@/services/api'

// Use vue-i18n locale
const { locale } = useI18n()
const selectedLocale = ref(locale.value)

// Watch for changes to selectedLocale and update i18n + backend
const changeLanguage = async () => {
  locale.value = selectedLocale.value
  localStorage.setItem('lang', locale.value)
}
</script>
