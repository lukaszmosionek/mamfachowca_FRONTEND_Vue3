<template>
  <div class="wrapper">
      <Filtering :providers="providers" :filters="filters" @update:filters="handleFilters" />
      <HomeTile :services="services" :isLoading="isLoading" />
      <Pagination :pagination="pagination" @page-changed="handlePageChange" />
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted, watch } from "vue";
import api from '@/services/api'
import Pagination from '@/components/Pagination.vue';
import '@vuepic/vue-datepicker/dist/main.css'
import HomeTile from '@/components/HomeTile.vue';
import Filtering from '@/components/Filtering.vue';

const route = useRoute()

const filters = ref({
  name: route.query.name || '',
  provider_id: Number(route.query.provider_id) || 0
});

const pagination = ref({
  per_page: Number(route.query.per_page) || 10,
  page: Number(route.query.page) || 1,
  last_page: 10
})

const isLoading = ref(false)
const services = ref(Array(pagination.value.per_page).fill({}));
const providers = ref([]);

const loadServices = async () => {
  isLoading.value = true
  try {
    const user = JSON.parse(localStorage.getItem('user'))
    const res = await api.get('/services', {
      params: {
        ...pagination.value,
        ...filters.value,
        user_id: user ? user.id : null
      }
    })

    services.value = res.data.data
    pagination.value.last_page = res.data.total_pages;
  } finally {
    isLoading.value = false
  }
}

const handleFilters = (el) => {
  filters.value = el
  loadServices();
}

const loadProviders = async () => {
  try {
    const res = await api.get('/providers')
    providers.value = res.data
  } catch (err) {
    console.error('Failed to load providers', err)
  }
}

onMounted(() => {
  loadServices()
  loadProviders()
})

const handlePageChange = ({ page, perPage }) => {
  if (perPage) pagination.value.per_page = perPage
  if (page) pagination.value.page = page
  loadServices()
}

watch(
  () => route.query,
  (newQuery) => {
    pagination.value.per_page = Number(newQuery.per_page) || 10
    pagination.value.page = Number(newQuery.page) || 1
    filters.value.name = (newQuery.name) || ''
    filters.value.provider_id = Number(newQuery.provider_id) || ''
    loadServices()
  },
  { immediate: true, deep: true }
)

</script>
