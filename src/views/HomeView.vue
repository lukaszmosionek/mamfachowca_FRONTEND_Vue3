<template>
  <div class="h-screen overflow-y-auto hide-scrollbar scrollContainer" ref="scrollContainer" @scroll="handleScroll">
    <Filtering :providers="providers" :filters="filters" @update:filters="handleFilters" />
      <HomeTile :services="services" :isLoading="isLoading" />
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted, watch } from "vue"
import api from '@/services/api.ts'
import '@vuepic/vue-datepicker/dist/main.css'
import HomeTile from '@/components/HomeTile.vue'
import Filtering from '@/components/Filtering.vue'
import { useHeaderStore } from '@/stores/useHeaderStore.ts'
import { toast } from 'vue3-toastify'
import { serviceSchema } from '@/api/schemas/servicesSchema'
import { useI18n } from 'vue-i18n'
import { deepClone } from '@/helpers/deepClone.ts'
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
  currency: route.query.currency || localStorage.getItem('currency') || 'PLN',
  sortBy: route.query.sortBy || 'price_asc'
})

const page = ref(1)
const isLoading = ref(false)
const services = ref([])
const providers = ref([])
const hasMore = ref(true)
let debounceTimeout;
let pendingLoad = false
let filtersVersion = 0

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
  const sortBy = filters.value.sortBy || 'price_asc'
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

const loadServices = async () => {
  if (isLoading.value) {
    pendingLoad = true
    return
  }
  if (!hasMore.value) return

  isLoading.value = true
  const requestPage = page.value
  const requestFiltersVersion = filtersVersion

  try {
    const user = authStore.user
    const { priceFrom, priceTo, ...otherFilters } = filters.value
    const res = await api.get('/services', {
      params: {
        page: requestPage,
        ...otherFilters,
        ...(priceFrom !== null && priceFrom !== '' ? { price_from: priceFrom } : {}),
        ...(priceTo !== null && priceTo !== '' ? { price_to: priceTo } : {}),
        user_id: user ? user.id : null
      }
    })

    if (requestFiltersVersion !== filtersVersion) return

    const matchingServices = filterServicesByPrice(res.services)
    if (requestPage === 1) {
        services.value = sortServices(matchingServices)
    } else {
        services.value = sortServices([...services.value, ...matchingServices])
    }

    if (requestPage >= res.last_page) {
        hasMore.value = false
    } else {
        page.value = requestPage + 1
    }

    const hasPriceFilter = filters.value.priceFrom !== null && filters.value.priceFrom !== ''
      || filters.value.priceTo !== null && filters.value.priceTo !== ''
    if (
      hasMore.value &&
      ((hasPriceFilter && matchingServices.length === 0) || Boolean(filters.value.sortBy))
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
    services.value = sortServices(services.value)
    return
  }

  filtersVersion++
  page.value = 1
  hasMore.value = true
  services.value = []
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
  services.value = deepClone(serviceSchema)

  loadServices()
  loadProviders()
})

//Home Clicked
watch(
  () => headerStore.homeClicked,
  (newVal) => {
          page.value =  1
          filters.value.name =  null
          filters.value.provider_id =  null

          const container = scrollContainer.value
          if (container) {
            container.scrollTop = 0 // Scroll to top
          }

          headerStore.resetHomeClick()
          loadServices()
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
