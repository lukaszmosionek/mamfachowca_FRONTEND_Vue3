<script setup>
import { ref, onMounted } from 'vue'
import { useCurrencyStore } from '@/stores/useCurrencyStore.ts'
import BaseSelect from './BaseSelect.vue'
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
  }
})

onMounted(() => {
  selectedCurrency.value = localStorage.getItem('currency') ?? Enums.Currencies.find(c => c.default)?.name
  currencyStore.changeCurrency(selectedCurrency.value)
})

const emit = defineEmits(['update:modelValue'])

const selectedCurrency = ref(props.modelValue)

function changeCurrency(currency) {
  selectedCurrency.value = currency

  currencyStore.changeCurrency(currency)

  // emit('update:modelValue', currency)
}
</script>

<template>
  <div class="flex gap-2">
      <BaseSelect class="!p-0 h-5 bg-white-600 text-xs changeCurrency" :modelValue="selectedCurrency" :options="currencies" @update:modelValue="changeCurrency"></BaseSelect>
  </div>
</template>
