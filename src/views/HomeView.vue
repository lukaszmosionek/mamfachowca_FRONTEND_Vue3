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
            <td class="px-4 py-2 text-gray-600">{{ s.provider?.name ?? 'loading..' }} <RouterLink :to="{ name: 'Messages', params: { userId: s.provider?.id ?? 0 } }" class="text-blue-500 hover:underline">{{ $t('Send Message') }}</RouterLink></td>
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
      <!-- <BaseInput v-model="form.time" :min="minTime" :max="maxTime" type="time" class="mt-2":errors="errors.errors?.start_time" required/> -->

      <div class="flex gap-4 mt-4">
        <!-- <BaseInput v-model="form.date" type="date" :label="$t('Date')" :min="today" :errors="errors.errors?.date"/> -->

        <div class="w-1/4">
        <label for="date">{{ $t('Date') }}</label>
          <Datepicker v-model="form.date" :disabled-dates="disabledDates" :enable-time-picker="false" :auto-apply="true"/>
        </div>

        <BaseSelect class="w-1/4" v-model="form.timeHour" :label="$t('Time')" :options="[8, 9, 10, 11, 12, 13, 14, 15, 16]"/>
        <span class="text-gray-600 mt-8">:</span>
        <BaseSelect class="w-1/4" v-model="form.timeMinute" label="&nbsp;" :options="[5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]"/>
      </div>

      <div class="mt-4">
        <span class="font-medium">{{ $t('Provider Availability') }}:</span>
        <table class="min-w-full border border-gray-200 rounded">
          <thead>
            <tr class="bg-gray-50">
              <th class="px-2 py-1 text-left">{{ $t('Day') }}</th>
              <th class="px-2 py-1 text-left">{{ $t('Start Time') }}</th>
              <th class="px-2 py-1 text-left">{{ $t('End Time') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(a, index) in availability" :key="index">
              <td class="px-2 py-1">{{ $t(a.day_of_week) }}</td>
              <td class="px-2 py-1">{{ a.start_time }}</td>
              <td class="px-2 py-1">{{ a.end_time }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <template #footer>
        <button @click="showModal = false" class="px-4 py-2 bg-gray-300 rounded text-gray-600">{{ $t('Cancel') }}</button>
        <BaseButton @click="bookService" :loading="loading" :name="$t('Book')" class="px-4 py-2 bg-blue-500 text-white rounded"/>
      </template>
    </BaseModal>
  </div>
</template>


<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, computed, onMounted, watch, nextTick } from "vue";
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import Pagination from '@/components/Pagination.vue';
import BaseModal from '@/components/BaseModal.vue';
import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseSelect from '@/components/BaseSelect.vue';
import { toast } from 'vue3-toastify'

import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

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

// const disabledDates = (date) => { // Sunday (0) and Saturday (6)
//   const day = date.getDay()
//   return !( day === 0 || day === 5 )
// }

const disabledDates = ref((date) => {
  // const dayNumbers = availability.value.map(el => el.day_of_week_number);
  // return !dayNumbers.includes(date.getDay());
});

const loadServices = async (page, perPage) => {
  loading.value = true
  try {
    const res = await api.get('/services', {
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

    const params = new URLSearchParams({
      ...route.query,
      modal_id: serviceId,
      modal_index: index
    }).toString()

    router.push({
      name: 'Login',
      query: { 'redirect': encodeURIComponent('/?' + params) }
    })
    return
  }
  if(authStore.user.role == 'provider'){
     toast.error('Login as Client')
    return
  }

  showModal.value = true
  availability.value = services.value[Number(index)].provider.availabilities
  form.value.serviceId = serviceId
  form.value.index = index


  const dayNumbers = availability.value.map(el => el.day_of_week_number);
  console.log('dayNumbers:', dayNumbers);

  disabledDates.value = (date) => {
    // return true
    // console.log('date.getDay():', date.getDay());
    return !dayNumbers.includes(date.getDay());
  };

  router.push({ query: { ...route.query, modal_id: serviceId, modal_index: index } })
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
  setTimeout(() => {
    nextTick(() => {
      if (route.query.modal_id) {
        modalBook(route.query.modal_id, route.query.modal_index);
      }
    });
  }, 4000);
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
  const date = new Date(form.value.date).getDay(); // Get the day of the week (0-6, where 0 is Sunday)
  console.log('date:', date);

  form.value.timeHour = ''
  form.value.timeMinute = ''
})

watch(() => form.value.timeHour, () =>  { form.value.timeMinute = '' })

const handlePageChange = (page) => {
  currentPage.value = page;
  services.value.data = Array(perPage.value).fill({});
  loadServices(page, perPage.value);
};

  function generateTimes(start, end, stepMinutes) {
    const times = [];
    let [startHour, startMin] = start.split(":").map(Number);
    let [endHour, endMin] = end.split(":").map(Number);

    let current = new Date();
    current.setHours(startHour, startMin, 0, 0);

    const endTime = new Date();
    endTime.setHours(endHour, endMin, 0, 0);

    while (current <= endTime) {
      let hours = String(current.getHours()).padStart(2, '0');
      let minutes = String(current.getMinutes()).padStart(2, '0');
      times.push(`${hours}:${minutes}`);
      current.setMinutes(current.getMinutes() + stepMinutes);
    }

    return times;
  }

</script>
