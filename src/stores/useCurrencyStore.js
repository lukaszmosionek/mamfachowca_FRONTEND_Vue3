import { defineStore } from 'pinia'

export const useCurrencyStore = defineStore('currency', {
  state: () => ({
    currency: 'USD',
    rates: {
      USD: 1,      // base
      PLN: 4.1,    // 1 USD = 4.1 PLN
      EUR: 0.92    // 1 USD = 0.92 EUR
    }
  }),
  actions: {

    changeCurrency(currency) {
      this.currency = currency
    },

    getCurrency() {
      return this.currency
    },

    convert(amount, from, to = this.currency) {
      if (from === to) return amount + ' ' + this.currency // from and to are the same
      if (!this.rates[from] || !this.rates[to]) {
        throw new Error(`Unsupported currency: ${from} or ${to}`)
      }
      // Convert 'from' → USD → 'to'
      const amountInUSD = amount / this.rates[from]
      const converted = amountInUSD * this.rates[to]

      // Round to nearest 0.1
      const rounded = Math.round(converted * 100) / 100

      return this.formatCurrency(rounded, to)
    },

    formatCurrency(amount, currency = this.currency) {
      return amount.toFixed(0) + '\u00A0' + currency
    }

  }
})
