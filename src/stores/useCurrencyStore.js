import { defineStore } from 'pinia'
import { Enums } from '@/enums.js'

export const useCurrencyStore = defineStore('currency', {
  state: () => {
    const currencies = Enums.Currencies.map(c => c.name);
    const rates = Enums.Currencies.reduce((acc, c) => {
      acc[c.name] = parseFloat(c.rate);
      return acc;
    }, {});
    const defaultCurrency = Enums.Currencies.find(c => c.default)?.name || currencies[0];

    return {
      currency: defaultCurrency,
      currencies,
      rates
    };
  },
  actions: {

    changeCurrency(currency) {
      this.currency = currency
    },

    getCurrencies() {
      return this.currencies
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
