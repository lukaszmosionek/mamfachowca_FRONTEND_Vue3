<template>
  <div
    role="group"
    :aria-label="t('header.language')"
    class="text-center py-4 flex justify-center items-center gap-2"
  >
    <button
      v-for="language in languages"
      :key="language.code"
      type="button"
      :data-lang="language.code"
      :aria-label="language.name"
      :aria-pressed="locale === language.code"
      :title="language.name"
      :class="locale === language.code
        ? 'border-white bg-white text-gray-900 shadow-sm'
        : 'border-gray-500 text-white hover:bg-white/10'"
      class="changeLanguage flex items-center justify-center gap-2 rounded-md border px-3 py-2 transition-colors"
      @click="changeLanguage(language.code)"
    >
      <img alt="" :src="languageFlags[language.code]" width="20" height="14" />
      <span class="text-sm">{{ language.code.toUpperCase() }}</span>
    </button>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { Enums } from '@/enums.ts'
import flagEn from '@/assets/icons/flag-en.svg'
import flagPl from '@/assets/icons/flag-pl.svg'
import flagEs from '@/assets/icons/flag-es.svg'

const { locale, t } = useI18n()
const languages = Enums.Languages
const languageFlags = {
  en: flagEn,
  pl: flagPl,
  es: flagEs
}

function changeLanguage(lang) {
  locale.value = lang
  localStorage.setItem('lang', lang)
}
</script>
