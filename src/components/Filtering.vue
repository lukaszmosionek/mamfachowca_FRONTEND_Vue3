<template>
  <div class="">
    <div :class="vertical ? 'flex flex-col gap-4' : 'my-6 block md:flex gap-4 justify-center md:mx-0 mx-4'">
      <BaseInput
        v-if="showNameFilter"
        type="text"
        name="search-box"
        :placeholder="$t('filtering.searchByName')"
        :model-value="filters.name"
        @update:modelValue="value => updateFilter('name', value)"
        :wrapperClass="vertical ? 'w-full' : toolbarLayout ? 'md:!w-2/5 !w-full' : 'md:!w-1/4 !w-full'"
      />
      <!-- <BaseSelect v-model="filters.provider_id" name="select-provider" @update:modelValue="applyFilters" :options="providersObj" :isAssociativeArray="false" :addFirstOption="$t('filtering.all-providers')" wrapperClass="mt-2 md:!w-1/4 !w-full h-10" class="" /> -->

      <SearchableSelect
        v-if="showProviderFilter"
        :options="providers"
        name="select-provider"
        :model-value="filters.provider_id"
        :inputPlaceholder="$t('filtering.inputPlaceholder')"
        @update:modelValue="value => updateFilter('provider_id', value)"
        :addFirstOption="$t('filtering.allProviders')"
        :class="vertical ? 'w-full' : 'mt-1 md:!w-1/4 !w-full h-10'"
      />

      <fieldset v-if="showSorting" :class="vertical ? 'w-full' : toolbarLayout ? 'md:!w-1/4 !w-full' : 'md:!w-1/5 !w-full'" class="min-w-0 rounded border border-gray-400 px-3 pb-1">
        <legend class="px-1 text-xs text-gray-700">{{ $t('filtering.sortBy') }}</legend>
        <select
          id="sort-by"
          name="sortBy"
          :value="filters.sortBy || 'popularity'"
          class="h-7 w-full border-0 bg-transparent p-0 text-sm text-gray-800 focus:ring-0"
          @change="event => updateFilter('sortBy', event.target.value)"
        >
          <option value="popularity">{{ $t('filtering.sortPopularity') }}</option>
          <option value="price_asc">{{ $t('filtering.sortPriceAsc') }}</option>
          <option value="price_desc">{{ $t('filtering.sortPriceDesc') }}</option>
          <option value="name_asc">{{ $t('filtering.sortNameAsc') }}</option>
          <option value="name_desc">{{ $t('filtering.sortNameDesc') }}</option>
          <option value="newest">{{ $t('filtering.sortNewest') }}</option>
        </select>
      </fieldset>

      <fieldset v-if="showProductsCount" :class="vertical ? 'w-full' : 'md:!w-1/4 !w-full'" class="min-w-0 rounded border border-gray-400 px-3 pb-1">
        <legend class="px-1 text-xs text-gray-700">{{ $t('filtering.showProducts') }}</legend>
        <select
          id="offers-per-page"
          :value="perPage"
          class="h-7 w-full border-0 bg-transparent p-0 text-sm text-gray-800 focus:ring-0"
          @change="event => updatePerPage(event.target.value)"
        >
          <option v-for="count in perPageOptions" :key="count" :value="count">
            {{ $t(`filtering.products${count}`) }}
          </option>
        </select>
      </fieldset>

      <template v-if="showPriceFilters">
        <BaseInput type="number" name="price-from" :placeholder="$t('filtering.priceFrom')" :model-value="filters.priceFrom" :suffix="filters.currency || defaultCurrency" @update:modelValue="value => updateFilter('priceFrom', value)" :wrapperClass="vertical ? 'w-full' : 'md:!w-1/6 !w-full'" />
        <BaseInput type="number" name="price-to" :placeholder="$t('filtering.priceTo')" :model-value="filters.priceTo" :suffix="filters.currency || defaultCurrency" @update:modelValue="value => updateFilter('priceTo', value)" :wrapperClass="vertical ? 'w-full' : 'md:!w-1/6 !w-full'" />
      </template>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'
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
  },
  showSorting: {
    type: Boolean,
    default: true
  },
  showNameFilter: {
    type: Boolean,
    default: true
  },
  showProviderFilter: {
    type: Boolean,
    default: true
  },
  showPriceFilters: {
    type: Boolean,
    default: true
  },
  showProductsCount: {
    type: Boolean,
    default: false
  },
  perPage: {
    type: Number,
    default: 30
  },
  perPageOptions: {
    type: Array,
    default: () => [30, 60, 90]
  },
  vertical: {
    type: Boolean,
    default: false
  }
});

const toolbarLayout = computed(() =>
  !props.vertical && !props.showProviderFilter && !props.showPriceFilters
)

const defaultCurrency = localStorage.getItem('currency')
  || Enums.Currencies.find(currency => currency.default)?.name

const emits = defineEmits(['update:filters', 'update:perPage'])

const updateFilter = (key, value) => {
  const updatedFilters = { ...props.filters, [key]: value }
  updateQueryParams(updatedFilters)
  emits('update:filters', updatedFilters)
}

const updatePerPage = (value) => {
  const perPage = Number(value)
  emits('update:perPage', perPage)
  router.push({
    query: {
      ...route.query,
      perPage,
      page: 1
    }
  })
}

function updateQueryParams(params) {
  router.push({
    query: {
      ...route.query,
      ...params,
      page: 1
    }
  })
}

</script>
