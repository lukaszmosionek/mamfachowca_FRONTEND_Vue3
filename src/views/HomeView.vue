<template>
  <div class="wrapper">
    <!-- <main class="p-6 text-center"> -->
      <!-- <h2 class="text-3xl text-gray-700 font-bold mb-4">{{ $t('Welcome to our app!') }}</h2>
      <p class="text-lg text-gray-700">{{ $t('Here you can make an appointment or manage your services.') }}</p>

      <div class="mt-8">
        <RouterLink v-if="isClient" to="/appointments" class="bg-blue-600 text-white px-4 py-2 rounded">{{ $t('Browse available services') }}</RouterLink>
        <RouterLink v-if="isProvider" to="/my-services" class="bg-green-600 text-white px-4 py-2 rounded">{{ $t('Manage your services') }}</RouterLink>
      </div> -->
    <!-- </main> -->

    <div class="overflow-x-auto">
      <!-- add filtering -->
      <div class="my-6 flex flex-wrap gap-4 justify-center">
        <input v-model="filters.name" @input="applyFilters" type="text" :placeholder="$t('Search by name')" class="border px-4 py-2 rounded text-gray-600"/>
        <select v-model="filters.providerId"  @change="applyFilters" class="border px-4 py-2 rounded text-gray-600">
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
            <th class="px-4 py-3">{{ $t('Duration') }}</th>
            <th class="px-4 py-3 text-right"></th>
          </tr>
        </thead>
        <tbody :class="loading ? 'opacity-50' : ''">
          <tr v-for="(s, index) in services.data ?? services" :key="s.id" :title="s.description" class="border-t hover:bg-gray-50">
            <td class="px-4 py-2 text-gray-600 font-medium">{{ s.name ?? 'loading..' }}</td>
            <td class="px-4 py-2 text-gray-600">{{ s.provider?.name ?? 'loading..' }} <RouterLink :to="{ name: 'Chats', params: { id: s.provider?.id ?? 0 } }" class="text-blue-500 hover:underline">{{ $t('Send Message') }}</RouterLink></td>
            <td class="px-4 py-2 text-gray-600">{{ s.price ? s.price + ' USD' : 'loading..' }}</td>
            <td class="px-4 py-2 text-gray-600">{{ s.duration ?? 'loading...' }} min.</td>
            <td class="px-4 py-2 text-gray-600">
              <a href="#" :data-id="s.id" @click="modalBook(s.id, index)">{{ $t('Book') }}</a>
            </td>
          </tr>
        </tbody>
      </table>

      <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-changed="handlePageChange"/>
    </div>

    <BaseModal :show="showModal" :title="$t('Date and time of service')" @close="showModal = false" class="space-y-4">
      <BaseInput v-model="form.date" type="date" :min="today" :errors="errors.errors?.date"/>
      <BaseInput v-model="form.time" :min="minTime" :max="maxTime" type="time" class="mt-2":errors="errors.errors?.start_time" required/>

      Dostepność usługodawcy:
      <ul>
        <li v-for="(a, index) in availability" :key="index">{{ $t(a.day_of_week) }}: {{ a.start_time }} - {{ a.end_time }}</li>
      </ul>

      <template #footer>
        <button @click="showModal = false" class="px-4 py-2 bg-gray-300 rounded text-gray-600">{{ $t('Cancel') }}</button>
        <BaseButton @click="bookService" :loading="loading" :name="$t('Book')" class="px-4 py-2 bg-blue-500 text-white rounded"/>
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
import { toast } from 'vue3-toastify'

const showModal = ref(false)
const router = useRouter();
const route = useRoute()
const minTime = ref('')
const maxTime = ref('')

const today = new Date().toISOString().split('T')[0] // Format: YYYY-MM-DD

const loading = ref(false)
const perPage = ref(Number(route.query.perPage) || 10);
const services = ref(Array(perPage.value).fill({}));
const currentPage = ref(Number(route.query.currentPage) || 1);
const totalPages = ref(10);
const errors = ref('');
const availability = ref({});

const authStore = useAuthStore()
const isProvider = computed(() => authStore.user?.role === 'provider')
const isClient = computed(() => authStore.user?.role === 'client')

const form = ref({});

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
    services.value = res.data.data
    totalPages.value = res.data.total_pages;
  } finally {
    loading.value = false
  }
}

const modalBook = async (serviceId, index) => {
  if(!authStore.token){
    router.push('login')
    return
  }
  if(authStore.user.role == 'provider'){
     toast.error('Login as Client')
    return
  }
  showModal.value = true
  availability.value = services.value[index].provider.availabilities
  form.value.serviceId = serviceId
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

const bookService = async () => {
  try {
    loading.value = true
    const res = await api.post('/appointments', {
        service_id: form.value.serviceId,
        start_time: form.value.time,
        date: form.value.date
    })
    showModal.value = false
    toast.success('Reservation booked succesfully')
  } catch (error) {
    errors.value = error
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

watch(() => form.value.date, () => {
  const date = new Date(form.value.date);
  const daysArray = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const chosenDay = daysArray[date.getDay()]
  availability.value.forEach(el => {
      if(el.day_of_week == chosenDay){
        minTime.value = el.start_time
        maxTime.value = el.end_time
      }
  });
  form.value.time = ''
})

const handlePageChange = (page) => {
  currentPage.value = page;
  services.value.data = Array(perPage.value).fill({});
  loadServices(page, perPage.value);
};



</script>
