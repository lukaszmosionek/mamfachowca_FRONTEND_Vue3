<template>
  <div class="text-center py-4 flex justify-center items-center">
    <button
      id="changeLanguage-pl"
      type="button"
      data-lang="pl"
      v-if="locale === 'en'"
      @click="changeLanguage('pl')"
      :aria-label="t('header.switchToPolish')"
      class="changeLanguage flex justify-center items-center gap-2 hover:opacity-80"
    >
      <img alt="Flag PL" src="@/assets/icons/flag-pl.svg" width="20" height="20" />
      <span class="text-sm">{{ t('header.switchToPolish') }}</span>
    </button>
    <button
      id="changeLanguage-en"
      type="button"
      data-lang="en"
      v-if="locale === 'pl'"
      @click="changeLanguage('en')"
      :aria-label="t('header.switchToEnglish')"
      class="changeLanguage flex justify-center items-center gap-2 hover:opacity-80"
    >
      <img alt="Flag EN" src="@/assets/icons/flag-en.svg" width="20" height="20" />
      <span class="text-sm">{{ t('header.switchToEnglish') }}</span>
    </button>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

// Use vue-i18n locale
const { locale, t } = useI18n()

// Watch for changes to selectedLocale and update i18n + backend
function changeLanguage(lang){
  locale.value = lang
  localStorage.setItem('lang', lang)
}
</script>
