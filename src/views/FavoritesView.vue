<template>
  <div class="">
    <h1 class="h1">{{ $t('Favorites') }}</h1>
      <div v-if="services.length" class="overflow-x-auto">
          <Filtering :providers="providers" :filters="filters" @update:filters="handleFilters" />
          <HomeTile :services="services" :isLoading="isLoading" @service-toggled="handleServiceToggled"/>
          <div class="flex justify-center mt-6">
            <BaseButton class="text-center px-8" :loading="isLoading" v-if="showLoadMore" @click="loadMore">{{ $t('Load more') }}</BaseButton>
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
import Filtering from '@/components/Filtering.vue';
import HomeTile from '@/components/HomeTile.vue'
import '@vuepic/vue-datepicker/dist/main.css'

const route = useRoute()
const isLoading = ref(false)
const showLoadMore = ref(true)
const services = ref(Array(10).fill({}))
const page = ref(1)
const filters = ref({
  name: route.query.name || '',
  provider_id: 0
  // provider_id: Number(route.query.provider_id) || '0'
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

// const applyFilters = () => {
//   if (filters.value.name && filters.value.name.length < 3) return
//   page.value = 1
//   services.value.data = Array(10).fill({})
//   loadServices()
// }

const loadProviders = async () => {
  try {
    const res = await api.get('/providers')
    providers.value = res.providers
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

const handleFilters = (el) => {
  console.log(el)
  filters.value = el
  page.value = 1
  loadServices();
}

const loadMore = () => {
    page.value++
    loadServices()
}

const handleServiceToggled = (serviceId) => {
  services.value = services.value.filter(el => el.id != serviceId)
};

</script>
