<template>
  <div class="flex-1 overflow-y-auto hide-scrollbar scrollContainer" ref="scrollContainer" @scroll="handleScroll">
    <div class="grid grid-cols-1 gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside class="min-w-0 rounded-lg bg-white p-4 shadow-sm lg:sticky lg:top-4 lg:self-start">
        <Filtering
          :providers="providers"
          :filters="filters"
          vertical
          :show-name-filter="false"
          :show-sorting="false"
          show-duration-filters
          @update:filters="handleFilters"
        />
      </aside>
      <section class="min-w-0">
        <Filtering
          :providers="providers"
          :filters="filters"
          :per-page="offersPerPage"
          :per-page-options="offerPageSizes"
          :show-provider-filter="false"
          :show-price-filters="false"
          show-products-count
          @update:filters="handleFilters"
          @update:per-page="changeOffersPerPage"
        />
        <div
          v-if="(isLoading || isDebouncingFilters) && services.length === 0"
          class="flex flex-col items-center gap-3 py-12 text-gray-600"
          role="status"
          aria-live="polite"
        >
          <div class="spinner" aria-hidden="true"></div>
          <span>{{ $t('homeTile.loadingServices') }}</span>
        </div>
        <HomeTile v-else :services="visibleServices" :isLoading="isLoading" />
        <p
          v-if="hasLoadedServices && !isLoading && !hasMore && services.length === 0"
          class="mt-8 rounded-lg bg-white py-8 text-center text-gray-600"
          role="status"
        >
          {{ $t('homeTile.noServices') }}
        </p>
        <Pagination
          :pagination="offerPagination"
          :is-show="services.length > offersPerPage"
          hide-per-page
          @page-changed="changeOfferPage"
        />
      </section>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed, ref, onMounted, watch } from "vue"
import api from '@/services/api.ts'
import '@vuepic/vue-datepicker/dist/main.css'
import HomeTile from '@/components/HomeTile.vue'
import Filtering from '@/components/Filtering.vue'
import Pagination from '@/components/Pagination.vue'
import { useHeaderStore } from '@/stores/useHeaderStore.ts'
import { toast } from 'vue3-toastify'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth.ts'
import { useCurrencyStore } from '@/stores/useCurrencyStore.ts'

const authStore = useAuthStore()
const currencyStore = useCurrencyStore()
const headerStore = useHeaderStore()
const scrollContainer = ref(null)
const route = useRoute()
const { locale } = useI18n()

const filters = ref({
  name: route.query.name || null,
  provider_id: Number(route.query.provider_id) || null,
  priceFrom: route.query.priceFrom || null,
  priceTo: route.query.priceTo || null,
  durationFrom: route.query.durationFrom || null,
  durationTo: route.query.durationTo || null,
  currency: route.query.currency || localStorage.getItem('currency') || 'PLN',
  sortBy: route.query.sortBy || 'popularity'
})

const page = ref(1)
const currentOfferPage = ref(Math.max(1, Number(route.query.page) || 1))
const offerPageSizes = [30, 60, 90]
const getOfferPageSize = (value) => {
  const pageSize = Number(value)
  return offerPageSizes.includes(pageSize) ? pageSize : offerPageSizes[0]
}
const offersPerPage = ref(getOfferPageSize(route.query.perPage))
const isLoading = ref(false)
const isDebouncingFilters = ref(false)
const hasLoadedServices = ref(false)
const services = ref([])
const servicesInApiOrder = ref([])
const providers = ref([])
const hasMore = ref(true)
let debounceTimeout;
let pendingLoad = false
let filtersVersion = 0

const offerPageCount = computed(() => Math.max(1, Math.ceil(services.value.length / offersPerPage.value)))
const offerPagination = computed(() => ({
  page: currentOfferPage.value,
  last_page: offerPageCount.value,
  per_page: offersPerPage.value
}))
const visibleServices = computed(() => {
  const firstItem = (currentOfferPage.value - 1) * offersPerPage.value
  return services.value.slice(firstItem, firstItem + offersPerPage.value)
})

watch(offerPageCount, (lastPage) => {
  if (currentOfferPage.value > lastPage) currentOfferPage.value = lastPage
})

watch(() => route.query.page, (pageFromRoute) => {
  const pageNumber = Number(pageFromRoute)
  if (Number.isInteger(pageNumber) && pageNumber > 0) {
    currentOfferPage.value = Math.min(pageNumber, offerPageCount.value)
  }
})

watch(() => route.query.perPage, (pageSizeFromRoute) => {
  offersPerPage.value = getOfferPageSize(pageSizeFromRoute)
  currentOfferPage.value = 1
})

const changeOfferPage = ({ page: nextPage }) => {
  if (nextPage < 1 || nextPage > offerPageCount.value) return
  currentOfferPage.value = nextPage
  if (scrollContainer.value) scrollContainer.value.scrollTop = 0
}

const changeOffersPerPage = (pageSize) => {
  offersPerPage.value = getOfferPageSize(pageSize)
  currentOfferPage.value = 1
  if (scrollContainer.value) scrollContainer.value.scrollTop = 0
}

const filterServicesByPrice = (serviceList) => {
  const minPrice = filters.value.priceFrom === null || filters.value.priceFrom === ''
    ? null
    : Number(filters.value.priceFrom)
  const maxPrice = filters.value.priceTo === null || filters.value.priceTo === ''
    ? null
    : Number(filters.value.priceTo)
  const hasPriceFilter = Number.isFinite(minPrice) || Number.isFinite(maxPrice)

  if (!hasPriceFilter) return serviceList

  const targetCurrency = filters.value.currency || currencyStore.currency
  const targetRate = currencyStore.rates[targetCurrency]

  return serviceList.filter((service) => {
    const convertedPrice = getPriceInFilterCurrency(service, targetCurrency, targetRate)
    if (convertedPrice === null) return true

    return (minPrice === null || !Number.isFinite(minPrice) || convertedPrice >= minPrice)
      && (maxPrice === null || !Number.isFinite(maxPrice) || convertedPrice <= maxPrice)
  })
}

const filterServicesByDuration = (serviceList) => {
  const minDuration = filters.value.durationFrom === null || filters.value.durationFrom === ''
    ? null
    : Number(filters.value.durationFrom)
  const maxDuration = filters.value.durationTo === null || filters.value.durationTo === ''
    ? null
    : Number(filters.value.durationTo)
  const hasDurationFilter = Number.isFinite(minDuration) || Number.isFinite(maxDuration)

  if (!hasDurationFilter) return serviceList

  return serviceList.filter((service) => {
    const duration = Number(service.duration_minutes)
    if (!Number.isFinite(duration)) return true

    return (minDuration === null || !Number.isFinite(minDuration) || duration >= minDuration)
      && (maxDuration === null || !Number.isFinite(maxDuration) || duration <= maxDuration)
  })
}

const getPriceInFilterCurrency = (service, targetCurrency, targetRate = currencyStore.rates[targetCurrency]) => {
  const price = Number(service.price)
  if (!Number.isFinite(price)) return null

  const sourceCurrency = service.currency?.code
  if (sourceCurrency === targetCurrency) return price

  const sourceRate = currencyStore.rates[sourceCurrency]
  if (!sourceRate || !targetRate) return null

  return price * sourceRate / targetRate
}

const sortServices = (serviceList) => {
  const sortBy = filters.value.sortBy || 'popularity'
  if (sortBy === 'popularity') return [...serviceList]

  const targetCurrency = filters.value.currency || currencyStore.currency

  return [...serviceList].sort((first, second) => {
    if (sortBy === 'price_asc' || sortBy === 'price_desc') {
      const firstPrice = getPriceInFilterCurrency(first, targetCurrency)
      const secondPrice = getPriceInFilterCurrency(second, targetCurrency)
      if (firstPrice === null && secondPrice !== null) return 1
      if (secondPrice === null && firstPrice !== null) return -1
      if (firstPrice !== null && secondPrice !== null && firstPrice !== secondPrice) {
        return sortBy === 'price_asc' ? firstPrice - secondPrice : secondPrice - firstPrice
      }
    } else if (sortBy === 'name_asc' || sortBy === 'name_desc') {
      const nameOrder = String(first.name ?? '').localeCompare(
        String(second.name ?? ''),
        locale.value,
        { numeric: true, sensitivity: 'base' }
      )
      if (nameOrder !== 0) return sortBy === 'name_asc' ? nameOrder : -nameOrder
    } else if (sortBy === 'newest') {
      const firstDate = Date.parse(first.created_at ?? '')
      const secondDate = Date.parse(second.created_at ?? '')
      if (Number.isFinite(firstDate) && Number.isFinite(secondDate) && firstDate !== secondDate) {
        return secondDate - firstDate
      }
      const idOrder = Number(second.id) - Number(first.id)
      if (Number.isFinite(idOrder) && idOrder !== 0) return idOrder
    }

    return String(first.id ?? '').localeCompare(String(second.id ?? ''), undefined, { numeric: true })
  })
}

const mergeUniqueServices = (existing, incoming) => {
  const seenIds = new Set(existing.map(service => String(service.id)))
  const merged = [...existing]

  for (const service of incoming) {
    const id = service.id
    if (id === null || id === undefined || id === 0) {
      merged.push(service)
      continue
    }

    const key = String(id)
    if (seenIds.has(key)) continue
    seenIds.add(key)
    merged.push(service)
  }

  return merged
}

const loadServices = async () => {
  if (isLoading.value) {
    pendingLoad = true
    return
  }
  if (!hasMore.value) {
    isDebouncingFilters.value = false
    return
  }

  isDebouncingFilters.value = false
  isLoading.value = true
  const requestPage = page.value
  const requestFiltersVersion = filtersVersion

  try {
    const user = authStore.user
    const res = await api.get('/services', {
      params: {
        page: requestPage,
        name: filters.value.name,
        provider_id: filters.value.provider_id,
        currency: filters.value.currency,
        sortBy: filters.value.sortBy,
        user_id: user ? user.id : null
      }
    })

    if (requestFiltersVersion !== filtersVersion) return

    hasLoadedServices.value = true
    const matchingServices = filterServicesByPrice(filterServicesByDuration(res.services))
    if (requestPage === 1) {
        servicesInApiOrder.value = mergeUniqueServices([], matchingServices)
    } else {
        servicesInApiOrder.value = mergeUniqueServices(servicesInApiOrder.value, matchingServices)
    }
    services.value = sortServices(servicesInApiOrder.value)

    if (requestPage >= res.last_page) {
        hasMore.value = false
    } else {
        page.value = requestPage + 1
    }

    const hasClientSideFilter = filters.value.priceFrom !== null && filters.value.priceFrom !== ''
      || filters.value.priceTo !== null && filters.value.priceTo !== ''
      || filters.value.durationFrom !== null && filters.value.durationFrom !== ''
      || filters.value.durationTo !== null && filters.value.durationTo !== ''
    if (
      hasMore.value &&
      ((hasClientSideFilter && matchingServices.length === 0) || Boolean(filters.value.sortBy))
    ) {
      pendingLoad = true
    }

  } catch (err) {
    if (requestFiltersVersion === filtersVersion) {
      toast.error('Fail to load services. Try again later.')
    }
  } finally {
    isLoading.value = false
    if (pendingLoad) {
      pendingLoad = false
      void loadServices()
    }
  }
}

const handleFilters = (el) => {
  const sortOnlyChanged =
    filters.value.sortBy !== el.sortBy &&
    Object.keys({ ...filters.value, ...el })
      .filter(key => key !== 'sortBy')
      .every(key => filters.value[key] === el[key])

  filters.value = el
  if (sortOnlyChanged) {
    currentOfferPage.value = 1
    services.value = sortServices(servicesInApiOrder.value)
    return
  }

  currentOfferPage.value = 1
  filtersVersion++
  hasLoadedServices.value = false
  page.value = 1
  hasMore.value = true
  services.value = []
  servicesInApiOrder.value = []
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
      loadServices()
  }, 500);
}

const loadProviders = async () => {
  try {
    const res = await api.get('/providers')
    providers.value = res.providers
  } catch (err) {
    toast.error('Failed to load providers. Please try again later')
  }
}

onMounted(() => {
  loadServices()
  loadProviders()
  if (headerStore.homeClicked) headerStore.resetHomeClick()
})

//Home Clicked
watch(
  () => headerStore.homeClicked,
  (homeClicked) => {
    if (!homeClicked) return

    filters.value = {
      name: null,
      provider_id: null,
      priceFrom: null,
      priceTo: null,
      durationFrom: null,
      durationTo: null,
      currency: localStorage.getItem('currency') || currencyStore.currency || 'PLN',
      sortBy: 'popularity'
    }
    filtersVersion++
    page.value = 1
    currentOfferPage.value = 1
    offersPerPage.value = offerPageSizes[0]
    hasMore.value = true
    hasLoadedServices.value = false
    isDebouncingFilters.value = true
    services.value = []
    servicesInApiOrder.value = []
    pendingLoad = false
    isDebouncingFilters.value = false
    clearTimeout(debounceTimeout)

    if (scrollContainer.value) scrollContainer.value.scrollTop = 0

    headerStore.resetHomeClick()
    void loadServices()
  }
)

watch(locale, (newLang, oldLang) => {
  console.log(`Language changed from ${oldLang} to ${newLang}`)
  page.value = 1
  loadServices()
})

const handleScroll = () => {
  const container = scrollContainer.value
  if (!container) return

  const scrollBottom = container.scrollTop + container.clientHeight
  const scrollHeight = container.scrollHeight

  // Load more when near bottom (e.g., 100px threshold)
  if (scrollBottom + 100 >= scrollHeight) {
    loadServices()
  }
}

</script>
