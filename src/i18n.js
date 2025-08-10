import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import pl from './locales/pl.json'

const messages = { en, pl }

const supportedLocales = Object.keys(messages)

const defaultLocale = 'en'
let selectedLocale = localStorage.getItem('lang')

if(!selectedLocale){
    // Detect browser language
    const browserLanguage = navigator.language || navigator.userLanguage // fallback for old browsers

    // Normalize language code (for example, get just 'en' from 'en-US')
    const locale = browserLanguage.split('-')[0]

    // If the browser language is not supported, fallback to 'en'
    selectedLocale = supportedLocales.includes(locale) ? locale : defaultLocale

    localStorage.setItem('lang', selectedLocale)
}

const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: selectedLocale,
  fallbackLocale: defaultLocale,
  messages,
  datetimeFormats: {
    en: {
      short: {
        year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true  // 12h format
      },
      long: {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
      },
      timeOnly: {
        hour: 'numeric', minute: '2-digit', hour12: true // or false for 24h
      },
      hourOnly: {
        hour: 'numeric', hour12: true // or false for 24h
      }
    },
    pl: {
      short: {
        year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: false // 24h format
      },
      long: {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: false
      },
      timeOnly: {
        hour: '2-digit', minute: '2-digit', hour12: false
      },
      hourOnly: {
        hour: 'numeric', hour12: false // or false for 24h
      }
    }
  },
  numberFormats: {
    en: {
      currency: {
        style: 'currency', currency: 'USD'
      }
    },
    pl: {
      currency: {
        style: 'currency', currency: 'PLN'
      }
    }
  }
})

export default i18n
export { supportedLocales as languages }
