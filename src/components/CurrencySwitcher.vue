<script setup>
import { ref, onMounted } from 'vue'
import { useCurrencyStore } from '@/stores/useCurrencyStore'
import BaseSelect from './BaseSelect.vue'

const currencyStore = useCurrencyStore()
const props = defineProps({
  modelValue: {
    type: String,
    default: 'USD'
  },
  currencies: {
    type: Array,
    default: () => ['USD', 'EUR', 'PLN']
  }
})

onMounted(() => {
  selectedCurrency.value = localStorage.getItem('currency') ?? 'USD'
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
      <BaseSelect class="!p-0 h-5 bg-white-600 text-xs" :modelValue="selectedCurrency" :options="currencies" @update:modelValue="changeCurrency"></BaseSelect>
  </div>
</template>
