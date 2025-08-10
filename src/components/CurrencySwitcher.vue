<script setup>
import { ref, onMounted } from 'vue'
import { useCurrencyStore } from '@/stores/useCurrencyStore'

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
    <template v-for="currency in currencies" :key="currency">
      <button
        @click="changeCurrency(currency)"
        :class="[
          'px-4 py-2 rounded border transition',
          selectedCurrency === currency
            ? 'bg-blue-500 text-white border-blue-500'
            : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
        ]"
      >
        {{ currency }}
      </button>
    </template>
  </div>
</template>
