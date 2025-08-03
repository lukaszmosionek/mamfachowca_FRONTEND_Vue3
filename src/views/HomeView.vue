<template>
  <Filtering :providers="providers" :filters="filters" @update:filters="handleFilters" />
  <div class="wrapper h-screen overflow-y-auto"  ref="scrollContainer" @scroll="handleScroll">
      <HomeTile :services="services" :isLoading="isLoading" />
      <!-- <Pagination :pagination="pagination" @page-changed="handlePageChange" /> -->
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted, watch } from "vue";
import api from '@/services/api'
// import Pagination from '@/components/Pagination.vue';
import '@vuepic/vue-datepicker/dist/main.css'
import HomeTile from '@/components/HomeTile.vue';
import Filtering from '@/components/Filtering.vue';
const scrollContainer = ref(null)

const route = useRoute()

const filters = ref({
  name: route.query.name || '',
  provider_id: Number(route.query.provider_id) || '0'
});

// const pagination = ref({
//   // per_page: Number(route.query.per_page) || 10,
//   page: Number(route.query.page) || 1,
//   last_page: 10
// })

const page = ref(1)

const isLoading = ref(false)
const services = ref(Array(10).fill({}));
// const services = ref([]);
const providers = ref([]);
const hasMore = ref(true)

const loadServices = async () => {
  if (isLoading.value || !hasMore.value) return
  isLoading.value = true

  try {
    const user = JSON.parse(localStorage.getItem('user'))
    const res = await api.get('/services', {
      params: {
        page,
        ...filters.value,
        user_id: user ? user.id : null
      }
    })

    if( page.value === 1 ){
        services.value = res.data.data
    }else{
        services.value.push( ...res.data.data )
    }

    if (res.data.current_page >= res.data.last_page) {
        hasMore.value = false
    } else {
        page.value++
    }

  } finally {
    isLoading.value = false
  }
}

const handleFilters = (el) => {
  filters.value = el
  page.value = 1
  loadServices();
}

const loadProviders = async () => {
  try {
    const res = await api.get('/providers')
    providers.value = res.data
  } catch (err) {
    toast.error('Failed to load providers. Please try again later')
  }
}

onMounted(() => {
  loadServices()
  loadProviders()
})

// const handlePageChange = ({ page, perPage }) => {
//   if (perPage) pagination.value.per_page = perPage
//   if (page) pagination.value.page = page
//   loadServices()
// }

watch(
  () => route.query,
  (newQuery) => {

    // alert(newQuery)

      page.value = Number(newQuery.page) || 1
      filters.value.name = (newQuery.name) || ''
      filters.value.provider_id = Number(newQuery.provider_id) || ''
      loadServices()
  },
  { immediate: true, deep: true }
)

const handleScroll = () => {
  const container = scrollContainer.value
  if (!container) return

  const scrollBottom = container.scrollTop + container.clientHeight
  const scrollHeight = container.scrollHeight

  // Load more when near bottom (e.g., 100px threshold)
  if (scrollBottom + 100 >= scrollHeight) {
    // alert('fetch')
    loadServices()
  }
}

</script>
