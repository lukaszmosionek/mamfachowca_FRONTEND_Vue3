<template>
  <div class="h-screen overflow-y-auto scrollContainer" ref="scrollContainer" @scroll="handleScroll">
    <Filtering :providers="providers" :filters="filters" @update:filters="handleFilters" />
      <HomeTile :services="services" :isLoading="isLoading" />
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted, watch } from "vue"
import api from '@/services/api'
import '@vuepic/vue-datepicker/dist/main.css'
import HomeTile from '@/components/HomeTile.vue'
import Filtering from '@/components/Filtering.vue'
import { useHeaderStore } from '@/stores/useHeaderStore'
import { toast } from 'vue3-toastify'
import { serviceSchema } from '@/api/schemas/servicesSchema'
import { useI18n } from 'vue-i18n'
import { deepClone } from '@/helpers/deepClone.js'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const headerStore = useHeaderStore()
const scrollContainer = ref(null)
const route = useRoute()
const { locale } = useI18n()

const filters = ref({
  name: route.query.name || '',
  provider_id: Number(route.query.provider_id) || '0'
});

const page = ref(1)
const isLoading = ref(false)
const services = ref([])
const providers = ref([])
const hasMore = ref(true)
let debounceTimeout;

const loadServices = async () => {
  if (isLoading.value || !hasMore.value) return
  isLoading.value = true

  try {
    const user = authStore.user
    const res = await api.get('/services', {
      params: {
        page: page.value,
        ...filters.value,
        user_id: user ? user.id : null
      }
    })

    if( page.value === 1 ){
        services.value = []
        Object.assign(services.value, res.services)
    }else{
        services.value.push( ...res.services )
    }

    if (page.value >= res.last_page) {
        hasMore.value = false
    } else {
        page.value++
    }

  } catch(err) {
    toast.error('Fail to load services. Try again later.')
  }
  isLoading.value = false
}

const handleFilters = (el) => {
  filters.value = el
  page.value = 1
  hasMore.value = true
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
          filters.value.name =  ''
          filters.value.provider_id =  ''

          const container = scrollContainer.value
          if (container) {
            container.scrollTop = 0 // Scroll to top
          }

          headerStore.resetHomeClick()
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
