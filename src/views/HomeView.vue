<template>
  <div class="wrapper">

    <div class="overflow-x-auto">
      <!-- add filtering -->
      <div class="my-6 flex flex-wrap gap-4 justify-center">
        <input v-model="filters.name" @input="applyFilters" type="text" :placeholder="$t('Search by name')" class="border px-4 py-2 rounded w-full  md:w-1/4"/>
        <select v-model="filters.providerId"  @change="applyFilters" class="border px-4 py-2 rounded w-full  md:w-1/4">
          <option value="">{{ $t('All Providers') }}</option>
          <option v-for="p in providers" :key="p.id" :value="p.id">
            {{ p.name }}
          </option>
        </select>
      </div>

      <HomeTile :services="services" />
      <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-changed="handlePageChange"/>
    </div>

  </div>
</template>


<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted, watch } from "vue";
import api from '@/services/api'
import Pagination from '@/components/Pagination.vue';

import '@vuepic/vue-datepicker/dist/main.css'
import HomeTile from '@/components/HomeTile.vue';
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const router = useRouter();
const route = useRoute()

const loading = ref(false)
const perPage = ref(Number(route.query.perPage) || 10);
const services = ref(Array(perPage.value).fill({}));
const currentPage = ref(Number(route.query.currentPage) || 1);
const totalPages = ref(10);
const myFavorites = ref({});

const filters = ref({
  name: '',
  providerId: ''
});

const providers = ref([]);

const loadServices = async (page, perPage) => {
  loading.value = true
  try {
    const user = JSON.parse(localStorage.getItem('user'))
    const res = await api.get('/services', {
      params: {
        page,
        per_page: perPage,
        name: filters.value.name || undefined,
        provider_id: filters.value.providerId || undefined,
        user_id: user ? user.id : null
      }
    })

    services.value = res.data.data
    totalPages.value = res.data.total_pages;


  } finally {
    loading.value = false
  }
}


const applyFilters = () => {
  if (filters.value.name && filters.value.name.length < 3) return;
  currentPage.value = 1;
  services.value.data = Array(perPage.value).fill({});
  loadServices(currentPage.value, perPage.value);
};

const loadProviders = async () => {
  try {
    const res = await api.get('/providers')
    providers.value = res.data
  } catch (err) {
    console.error('Failed to load providers', err)
  }
}

onMounted(() => {
  loadServices(currentPage.value, perPage.value)
  loadProviders()
})

watch([perPage, currentPage], () => {
  router.push({
    query: {
      ...route.query,
      currentPage: currentPage.value,
      perPage: perPage.value,
    }
  })
})

const handlePageChange = (page) => {
  currentPage.value = page;
  services.value.data = Array(perPage.value).fill({});
  loadServices(page, perPage.value);
};

</script>
