<template>
  <div class="wrapper">
    <main class="p-6 text-center">
      <h2 class="text-3xl text-gray-700 font-bold mb-4">{{ $t('Welcome to our app!') }}</h2>
      <p class="text-lg text-gray-700">
        {{ $t('Here you can make an appointment or manage your services.') }}
      </p>

      <div class="mt-8">
        <RouterLink
          v-if="isClient"
          to="/appointments"
          class="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {{ $t('Browse available services') }}
        </RouterLink>

        <RouterLink
          v-if="isProvider"
          to="/my-services"
          class="bg-green-600 text-white px-4 py-2 rounded"
        >
          {{ $t('Manage your services') }}
        </RouterLink>
      </div>
    </main>

    <div class="overflow-x-auto">
      <!-- add filtering -->
      <div class="my-6 flex flex-wrap gap-4 justify-center">
        <input
          v-model="filters.name"
          @input="applyFilters"
          type="text"
          :placeholder="$t('Search by name')"
          class="border px-4 py-2 rounded text-gray-600"
        />
        <select
          v-model="filters.providerId"
          @change="applyFilters"
          class="border px-4 py-2 rounded text-gray-600"
        >
          <option value="">{{ $t('All Providers') }}</option>
          <option v-for="p in providers" :key="p.id" :value="p.id">
            {{ p.name }}
          </option>
        </select>
      </div>

      <table class="min-w-full bg-white border border-gray-200 rounded-lg shadow">
        <thead>
          <tr class="bg-gray-100 text-left text-sm uppercase text-gray-600">
            <th class="px-4 py-3">{{ $t('Name') }}</th>
            <th class="px-4 py-3">{{ $t('Provider') }}</th>
            <th class="px-4 py-3">{{ $t('Price') }}</th>
            <th class="px-4 py-3 text-right"></th>
          </tr>
        </thead>
        <tbody :class="loading ? 'opacity-50' : ''">
          <tr
            v-for="s in services.data ?? services"
            :key="s.id"
            class="border-t hover:bg-gray-50"
          >
            <td class="px-4 py-2 text-gray-600 font-medium">{{ s.name ?? 'loading..' }}</td>
            <td class="px-4 py-2 text-gray-600">{{ s.provider?.name ?? 'loading..' }}</td>
            <td class="px-4 py-2 text-gray-600">{{ s.price ? s.price + ' USD' : 'loading..' }}</td>
            <td class="px-4 py-2 text-gray-600">
              <a href="#" @click="modalBook(s.id)">{{ $t('Book') }}</a>
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

    <BaseModal
      :show="showModal"
      :title="$t('Date and time of service')"
      @close="showModal = false"
      class="space-y-4"
    >
      <BaseInput
        v-model="form.date"
        type="date"
        :min="today"
        :errors="errors.errors?.date"
      />
      <BaseInput
        v-model="form.time"
        type="time"
        class="mt-2"
        :errors="errors.errors?.start_time"
      />

      <template #footer>
        <button
          @click="showModal = false"
          class="px-4 py-2 bg-gray-300 rounded text-gray-600"
        >
          {{ $t('Cancel') }}
        </button>
        <BaseButton
          @click="bookService(form.serviceId, form.date, form.time)"
          :loading="loading"
          :name="$t('Book')"
          class="px-4 py-2 bg-blue-500 text-white rounded"
        />
      </template>
    </BaseModal>
  </div>
</template>


<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, computed, onMounted, watch } from "vue";
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import Pagination from '@/components/Pagination.vue';
import BaseModal from '@/components/BaseModal.vue';
import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';

const showModal = ref(false)
const router = useRouter();
const route = useRoute()

const today = new Date().toISOString().split('T')[0] // Format: YYYY-MM-DD

const loading = ref(false)
const perPage = ref(Number(route.query.perPage) || 10);
const services = ref(Array(perPage.value).fill({}));
const currentPage = ref(Number(route.query.currentPage) || 1);
const totalPages = ref(10);

const errors = ref('');

const authStore = useAuthStore()
const isProvider = computed(() => authStore.user?.role === 'provider')
const isClient = computed(() => authStore.user?.role === 'client')

const form = ref({
  providerId: '',
  time: '',
  time: '',
});

const filters = ref({
  name: '',
  providerId: ''
});

const providers = ref([]);


const loadServices = async (page, perPage) => {
  loading.value = true
  try {
    const res = await api.get('/services/all', {
      params: {
        page,
        per_page: perPage,
        name: filters.value.name || undefined,
        provider_id: filters.value.providerId || undefined
      }
    })
    services.value = res.data
    totalPages.value = Math.ceil(res.data.meta.total / perPage);
  } finally {
    loading.value = false
  }
}

const modalBook = async (serviceId) => {
  if(!authStore.token){
    router.push('login')
    return
  }
  if(authStore.user.role == 'provider'){
    alert('Login as Client')
    return
  }
  showModal.value = true
  form.serviceId = serviceId
}

const applyFilters = () => {
  if (filters.value.name && filters.value.name.length < 3) return;
  currentPage.value = 1;
  services.value.data = Array(perPage.value).fill({});
  loadServices(currentPage.value, perPage.value);
};

const loadProviders = async () => {
  try {
    const res = await api.get('/providers/all')
    providers.value = res.data
  } catch (err) {
    console.error('Failed to load providers', err)
  }
}

const bookService = async (serviceId, formDate, formTime) => {
  try {
    loading.value = true
    const res = await api.post('/appointments', {
        service_id: serviceId,
        start_time: formTime,
        date: formDate
    })
    showModal.value = false
    alert('Reservation booked succesfully')
    // providers.value = res.data
  } catch (error) {
    errors.value = error
    console.error('Failed to load providers', error)
  }
  loading.value = false
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
