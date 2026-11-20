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
  currency: route.query.currency || localStorage.getItem('currency') || 'PLN'
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
    const price = Number(service.price)
    if (!Number.isFinite(price)) return false

    const sourceCurrency = service.currency?.code
    const sourceRate = currencyStore.rates[sourceCurrency]
    if (!sourceRate || !targetRate) return true

    const convertedPrice = price * sourceRate / targetRate
    return (minPrice === null || !Number.isFinite(minPrice) || convertedPrice >= minPrice)
      && (maxPrice === null || !Number.isFinite(maxPrice) || convertedPrice <= maxPrice)
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
        services.value = matchingServices
    } else {
        services.value.push(...matchingServices)
    }

    if (requestPage >= res.last_page) {
        hasMore.value = false
    } else {
        page.value = requestPage + 1
    }

    const hasPriceFilter = filters.value.priceFrom !== null && filters.value.priceFrom !== ''
      || filters.value.priceTo !== null && filters.value.priceTo !== ''
    if (hasPriceFilter && matchingServices.length === 0 && hasMore.value) {
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
  filters.value = el
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
