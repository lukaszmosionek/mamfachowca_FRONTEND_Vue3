import { defineStore } from 'pinia'
import { Enums } from '@/enums.ts'

// Define currency structure based on Enums
interface Currency {
  id: string | number
  name: string
  rate: number | string
  default?: boolean
}

// Define the store state type
interface CurrencyState {
  currency: string
  currencyID: string | number
  currencies: string[]
  rates: Record<string, number>
}

export const useCurrencyStore = defineStore('currency', {
  state: (): CurrencyState => {
    const currencies = Enums.Currencies.map((c: Currency) => c.name)

    const rates = Enums.Currencies.reduce((acc: Record<string, number>, c: Currency) => {
      acc[c.name] = parseFloat(String(c.rate))
      return acc
    }, {})

    const defaultCurrency = Enums.Currencies.find((c: Currency) => c.default)?.name || currencies[0]
    const defaultCurrencyId = Enums.Currencies.find((c: Currency) => c.default)?.id || currencies[0]

    return {
      currency: defaultCurrency,
      currencyID: defaultCurrencyId,
      currencies,
      rates
    }
  },

  actions: {
    changeCurrency(currency: string) {
      localStorage.setItem('currency', currency)
      this.currency = currency
    },

    getCurrencies(): string[] {
      return this.currencies
    },

    getCurrency(): string {
      return this.currency
    },

    getCurrencyID(): string | number {
      return this.currencyID
    },

    convert(amount: number, from: string): string {
      if (!this.rates[from]) throw new Error(`Unsupported currency: ${from}`)
      if (!this.rates[this.currency]) throw new Error(`Unsupported target currency: ${this.currency}`)

      if (from === this.currency) {
        return this.formatCurrency(amount, this.currency)
      }

      // Jeśli rates to kursy względem PLN (np. 1 USD = 4.1 PLN):
      const converted = (amount * this.rates[from]) / this.rates[this.currency]

      const rounded = Math.round(converted * 100) / 100
      return this.formatCurrency(rounded, this.currency)
    },

    formatCurrency(amount: number | string, currency: string): string {
      const num = Number(amount)
      if (isNaN(num)) {
        return 'NaN ' + currency
      }

      return num.toFixed(0) + '\u00A0' + currency
    }
  }
})
