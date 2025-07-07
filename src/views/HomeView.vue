<template>
  <div class="wrapper">
    <main class="p-6 text-center">
      <h2 class="text-3xl  text-gray-700 font-bold mb-4">Welcome to our app!</h2>
      <p class="text-lg text-gray-700">
        Here you can make an appointment or manage your services.
      </p>

      <div class="mt-8">
        <RouterLink
          v-if="isClient"
          to="/appointments"
          class="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Browse available services
        </RouterLink>

        <RouterLink
          v-if="isProvider"
          to="/my-services"
          class="bg-green-600 text-white px-4 py-2 rounded"
        >
          Manage your services
        </RouterLink>
      </div>
    </main>

    <div class="overflow-x-auto">
      <!-- <div v-if="loading" class="text-center py-10 text-gray-500">
        Services loading...
      </div> -->
      <!-- <table v-if="!loading" class="min-w-full bg-white border border-gray-200 rounded-lg shadow"> -->
      <table  class="min-w-full bg-white border border-gray-200 rounded-lg shadow">
        <thead>
          <tr class="bg-gray-100 text-left text-sm uppercase text-gray-600">
            <th class="px-4 py-3">Name</th>
            <th class="px-4 py-3">Price</th>
            <th class="px-4 py-3">Provider</th>
            <th class="px-4 py-3 text-right"></th>
          </tr>
        </thead>
        <tbody :class="loading ? 'opacity-50' : ''">
          <tr
            v-for="s in services.data ?? services"
            :key="s.id"
            class="border-t hover:bg-gray-50"
          >
            <!-- <td class="px-4 py-2  text-white-600  font-medium rounded ">{{ s.name }}</td> -->
            <td class="px-4 py-2 text-gray-600 font-medium">{{ s.name ?? 'loading..' }}</td>
            <td class="px-4 py-2 text-gray-600">{{ s.price ?? 'loading..' }}</td>
            <td class="px-4 py-2 text-gray-600">{{ s.provider?.name ?? 'loading..' }}</td>
            <td class="px-4 py-2 space-x-2 text-right">
              <!-- <button
                @click="editService(s)"
                class="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
              >
                Edytuj
              </button>
              <button
                @click="deleteService(s.id)"
                class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Usuń
              </button> -->
            </td>
          </tr>
        </tbody>
      </table>

    <!-- Pagination component -->
    <Pagination
      :currentPage="currentPage"
      :totalPages="totalPages"
      @page-changed="handlePageChange"
    />

    </div>


  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, computed, onMounted, watch } from "vue";
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import Pagination from '@/components/Pagination.vue';

const router = useRouter();
const route = useRoute()

const loading = ref(false)
const perPage = ref(Number(route.query.perPage) || 10);
const services = ref(Array(perPage.value).fill({}));
const currentPage = ref(Number(route.query.currentPage) || 1);
const totalPages = ref(10);


const loadServices = async (page, perPage) => {
  loading.value = true
  try {
    const res = await api.get('/services/all', { params: {page, per_page: perPage} } )
    services.value = res.data
    totalPages.value = Math.ceil(res.data.meta.total / perPage);
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadServices(currentPage.value, perPage.value)
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

const authStore = useAuthStore()
const isProvider = computed(() => authStore.user?.role === 'provider')
const isClient = computed(() => authStore.user?.role === 'client')
</script>
