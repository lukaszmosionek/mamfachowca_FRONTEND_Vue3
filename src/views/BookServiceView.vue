<template>
  <div class="wrapper">

      {{ $t('Date and time of service') }}
      <h1 class="text-4xl">{{ services.name ?? '...' }}</h1>

      <!-- <BaseInput v-model="form.time" :min="minTime" :max="maxTime" type="time" class="mt-2":errors="errors.errors?.start_time" required/> -->

      <h2 class="mt-2 text-2xl">Book a service</h2>
      <div class="flex gap-4 mt-2">
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

      <div class="flex">
        <button @click="router.back()" class="px-4 py-2 bg-gray-300 rounded text-gray-600 mt-2">⬅ {{ $t('Go Back') }}</button>
        <BaseButton @click="bookService" :loading="loading" :name="$t('Book')" class="ml-2 mt-2 px-4 py-2 bg-blue-500 text-white rounded"/>
      </div>

  </div>
</template>


<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, computed, onMounted, watch, nextTick } from "vue";
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'
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
    const res = await api.get('/services/'+parseInt(route.params.serviceId))
    services.value = res.data
    availability.value = res.data.provider.availabilities;
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
  setTimeout(() => {
    nextTick(() => {
      if (route.query.modal_id) {
        modalBook(route.query.modal_id, route.query.modal_index);
      }
    });
  }, 4000);
})


watch(() => form.value.date, () => {
  const date = new Date(form.value.date).getDay(); // Get the day of the week (0-6, where 0 is Sunday)
  console.log('date:', date);

  form.value.timeHour = ''
  form.value.timeMinute = ''
})

watch(() => form.value.timeHour, () =>  { form.value.timeMinute = '' })


</script>
