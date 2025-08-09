<template>
  <div class="">
    <h1 class="h1">Favorites</h1>

      <div v-if="services.length" class="overflow-x-auto">
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
        <!-- add filtering -->

        <HomeTile :services="services" :isLoading="isLoading" @service-toggled="handleServiceToggled"/>
        <div class="flex justify-center mt-6">
          <BaseButton class="text-center px-8" :loading="isLoading" v-if="showLoadMore" @click="loadMore">Load more</BaseButton>
        </div>
      </div>
      <div v-else class="text-center mt-8">{{ $t('No Favorites yet') }}</div>

  </div>
</template>


<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted, watch } from "vue"
import api from '@/services/api'
import BaseButton from '@/components/BaseButton.vue'

import '@vuepic/vue-datepicker/dist/main.css'
import HomeTile from '@/components/HomeTile.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const router = useRouter()
const route = useRoute()

const isLoading = ref(false)
const showLoadMore = ref(true)
const services = ref(Array(10).fill({}))

const page = ref(1)

const filters = ref({
  name: '',
  providerId: ''
});

const providers = ref([]);

const loadServices = async () => {
  isLoading.value = true
  try {
    const res = await api.get('/favorites', {
      params: {
        page: page.value,
        ...filters.value
      }
    })

    if( page.value === 1 ){
        services.value = res.favorites
    }else{
        services.value.push( ...res.favorites )
    }

    if (page.value >= res.last_page) {
        showLoadMore.value = false
    }

  }catch(err){
    alert(err)
  }

  isLoading.value = false
}

const applyFilters = () => {
  if (filters.value.name && filters.value.name.length < 3) return
  page.value = 1
  services.value.data = Array(10).fill({})
  loadServices()
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

// watch([perPage, currentPage], () => {
//   router.push({
//     query: {
//       ...route.query,
//       currentPage: currentPage.value,
//       perPage: perPage.value,
//     }
//   })
// })

// const handlePageChange = (page) => {
//   currentPage.value = page
//   services.value.data = Array(perPage.value).fill({})
//   loadServices(page, perPage.value)
// }

const loadMore = () => {
    page.value++
    loadServices()
}

const handleServiceToggled = (serviceId) => {
  services.value = services.value.filter(el => el.id != serviceId)
};

</script>
