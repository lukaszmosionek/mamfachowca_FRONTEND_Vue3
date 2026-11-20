<template>
  <div class="">
    <div class="my-6 block md:flex gap-4 justify-center md:mx-0 mx-4">
      <BaseInput
        type="text"
        name="search-box"
        :placeholder="$t('filtering.searchByName')"
        :model-value="filters.name"
        @update:modelValue="value => updateFilter('name', value)"
        wrapperClass="md:!w-1/4 !w-full"
      />
      <!-- <BaseSelect v-model="filters.provider_id" name="select-provider" @update:modelValue="applyFilters" :options="providersObj" :isAssociativeArray="false" :addFirstOption="$t('filtering.all-providers')" wrapperClass="mt-2 md:!w-1/4 !w-full h-10" class="" /> -->

      <SearchableSelect
        :options="providers"
        name="select-provider"
        :model-value="filters.provider_id"
        :inputPlaceholder="$t('filtering.inputPlaceholder')"
        @update:modelValue="value => updateFilter('provider_id', value)"
        :addFirstOption="$t('filtering.allProviders')"
        class="mt-1 md:!w-1/4 !w-full h-10"
      />

      <BaseInput type="number" name="price-from" :placeholder="$t('filtering.priceFrom')" :model-value="filters.priceFrom" :suffix="filters.currency || defaultCurrency" @update:modelValue="value => updateFilter('priceFrom', value)" wrapperClass="md:!w-1/6 !w-full" />
      <BaseInput type="number" name="price-to" :placeholder="$t('filtering.priceTo')" :model-value="filters.priceTo" :suffix="filters.currency || defaultCurrency" @update:modelValue="value => updateFilter('priceTo', value)" wrapperClass="md:!w-1/6 !w-full" />
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import BaseInput from "./BaseInput.vue"
import SearchableSelect from "./ui/SearchableSelect.vue"
import { Enums } from '@/enums.ts'

const router = useRouter()
const route = useRoute()
const props = defineProps({
  providers: {
    type: [Object, Array],
    required: true
  },
  filters: {
    type: Object,
    required: true
  }
});

const defaultCurrency = localStorage.getItem('currency')
  || Enums.Currencies.find(currency => currency.default)?.name

const emits = defineEmits(['update:filters'])

const updateFilter = (key, value) => {
  const updatedFilters = { ...props.filters, [key]: value }
  updateQueryParams(updatedFilters)
  emits('update:filters', updatedFilters)
}

function updateQueryParams(params) {
  router.push({
    query: {
      ...route.query,
      ...params
    }
  })
}

</script>
