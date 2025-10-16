import { createI18n, type I18nOptions } from 'vue-i18n'
import langs from '@/locales/index.js'
import { Enums } from '@/enums'

// --- Types ---
interface LanguageEnum {
  code: string
  defaultCurrency?: string
}

// --- Determine messages and supported locales ---
const messages = localStorage.getItem('useValidationsKey') ? {} : langs
const supportedLocales = Object.keys(messages)

const defaultLocale = 'en'
let selectedLocale = localStorage.getItem('lang')

// --- Locale detection and initialization ---
if (!selectedLocale) {
  // Detect browser language
  const browserLanguage = navigator.language || (navigator as any).userLanguage // fallback for old browsers
  const locale = browserLanguage.split('-')[0]

  // If not supported, fallback to default
  selectedLocale = supportedLocales.includes(locale) ? locale : defaultLocale
  localStorage.setItem('lang', selectedLocale as string)

  const matchedLang = (Enums.Languages as LanguageEnum[]).find(
    (el) => el.code === selectedLocale
  )
  const defaultCurrency = matchedLang?.defaultCurrency ?? 'PLN'
  localStorage.setItem('currency', defaultCurrency)
}

// --- i18n configuration ---
const i18n = createI18n({
  legacy: false,
  locale: selectedLocale,
  fallbackLocale: defaultLocale,
  messages,
  datetimeFormats: {
    en: {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      },
      long: {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      },
      timeOnly: {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      },
      hourOnly: {
        hour: 'numeric',
        hour12: true,
      },
    },
    pl: {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: false,
      },
      long: {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: false,
      },
      timeOnly: {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      },
      hourOnly: {
        hour: 'numeric',
        hour12: false,
      },
    },
  },
  numberFormats: {
    en: {
      currency: {
        style: 'currency',
        currency: 'USD',
      },
    },
    pl: {
      currency: {
        style: 'currency',
        currency: 'PLN',
      },
    },
  },
} as I18nOptions)

export default i18n
export { supportedLocales as languages }
