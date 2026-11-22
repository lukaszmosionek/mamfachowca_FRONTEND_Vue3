<script setup>
import { computed, ref, onMounted } from 'vue'
import { useCurrencyStore } from '@/stores/useCurrencyStore.ts'
import { Enums } from '@/enums.ts'

const currencyStore = useCurrencyStore()
const props = defineProps({
  modelValue: {
    type: String,
    default: () => Enums.Currencies.find(c => c.default)?.name
  },
  currencies: {
    type: Array,
    default: () => Enums.Currencies.map(c => c.name)
  },
  label: {
    type: String,
    default: ''
  }
})

onMounted(() => {
  selectedCurrency.value = localStorage.getItem('currency') ?? Enums.Currencies.find(c => c.default)?.name
  currencyStore.changeCurrency(selectedCurrency.value)
})

const emit = defineEmits(['update:modelValue'])

const selectedCurrency = ref(props.modelValue)
const currencyOptions = computed(() => props.currencies.map(code => {
  const currency = Enums.Currencies.find(option => option.name === code)
  return {
    code,
    symbol: currency?.symbol || code
  }
}))

function changeCurrency(currency) {
  selectedCurrency.value = currency

  currencyStore.changeCurrency(currency)

  // emit('update:modelValue', currency)
}
</script>

<template>
  <div class="flex flex-wrap gap-2" role="group" :aria-label="label || undefined">
    <button
      v-for="currency in currencyOptions"
      :id="`currency-option-${currency.code.toLowerCase()}`"
      :key="currency.code"
      type="button"
      :aria-label="`${currency.code} (${currency.symbol})`"
      :aria-pressed="selectedCurrency === currency.code"
      :class="selectedCurrency === currency.code
        ? 'border-white bg-white text-gray-900 shadow-sm'
        : 'border-gray-500 bg-transparent text-white hover:border-gray-300 hover:bg-white/10'"
      class="flex min-h-10 min-w-14 flex-col items-center justify-center rounded-md border px-3 py-1 transition-colors"
      @click="changeCurrency(currency.code)"
    >
      <span class="text-sm font-semibold">{{ currency.symbol }}</span>
      <span class="text-[10px] leading-none">{{ currency.code }}</span>
    </button>
  </div>
</template>
