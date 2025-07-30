<template>
  <div class="wrapper">

    <h1 class="text-4xl mt-2 text-center">{{ service.name ?? '...' }}</h1>
    <p class="mt-4">{{ service.description }}</p>

    <!-- <BaseInput v-model="form.time" :min="minTime" :max="maxTime" type="time" class="mt-2":errors="errors.errors?.start_time" required/> -->

    <h2 class="mt-2 text-2xl">{{ $t('Book a service') }}</h2>
    <div class="flex gap-4 mt-2 w-full mx-auto">
      <!-- <BaseInput v-model="form.date" type="date" :label="$t('Date')" :min="today" :errors="errors.errors?.date"/> -->

      <div class="w-48">
        <label for="date">{{ $t('Date') }}</label>
          <Datepicker v-model="form.date" :disabled-dates="disabledDates" :min-date="new Date()" :enable-time-picker="false" :auto-apply="true" class="mt-1.5 rounded-md"/>
          <div v-if="errors && Object.keys(errors?.date).length > 0" class="text-red-500 mt-1 font-black">
              <span v-for="(msg, i) in errors?.date" :key="i">{{ msg }}</span>
          </div>
      </div>

        <BaseSelect class="w-24" v-model="form.timeHour" :errors="errors?.start_time" :label="$t('Time')" :options="hours"/>
        <span class="text-gray-600 mt-8">:</span>
        <BaseSelect class="w-24" v-model="form.timeMinute" :errors="errors?.start_time" label="&nbsp;" :options="filteredMinutes"/>
    </div>

      <div class="flex mt-4 float-right">
        <button @click="router.back()" class="px-4 py-2 bg-gray-300 rounded text-gray-600 mt-2">⬅ {{ $t('Go Back') }}</button>
        <BaseButton @click="bookService" :loading="loading" :name="$t('Book')" class="ml-2 mt-2 px-4 py-2 bg-blue-500 text-white rounded"/>
      </div>

      <div class="mt-16">
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

  </div>
</template>


<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, computed, onMounted, watch } from "vue";
import api from '@/services/api'
import BaseButton from '@/components/BaseButton.vue';
import BaseSelect from '@/components/BaseSelect.vue';
import { toast } from 'vue3-toastify'
import { useI18n } from 'vue-i18n'

import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import Swal from 'sweetalert2';

const router = useRouter();
const route = useRoute()
const { t } = useI18n()

const loading = ref(false)
const errors = ref('');
const availability = ref({});

const form = ref({});
const service = ref({});

const filteredMinutes =  ref([]);

const disabledDates = ref((date) => {});

const minutes = ref(['05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55']);
const hours = ref(['08', '09', '10', '11', '12', '13', '14', '15', '16']);

const loadService = async () => {
  loading.value = true
  try {
    const res = await api.get('/services/'+parseInt(route.params.serviceId))
    service.value = res.data
    availability.value = res.data.provider.availabilities;

    const dayNumbers = availability.value.map(el => Number(el.day_of_week_number) );

    disabledDates.value = (date) => {
      return !Object.values(dayNumbers).includes(date.getDay());
    };

  } finally {
    loading.value = false
  }
}

const bookService = async () => {
  try {
    loading.value = true
    const res = await api.post('/appointments', {
        service_id: route.params.serviceId,
        start_time: form.value.timeHour+':'+form.value.timeMinute,
        date: form.value.date
    })
    await Swal.fire('', t('Reservation booked succesfully'), 'success')
    router.push({ name: 'Appointments' })
    // toast.success('Reservation booked succesfully')
  } catch (error) {
    errors.value = error.response.data.errors
  }
  loading.value = false
}

onMounted(() => {
  loadService()
  filteredMinutes.value = minutes.value
})


watch(() => form.value.date, () => {

  if(form.value.date){
    const time = getTimeFromAvailability(form.value.date)

    hours.value = [];
    for (let i = time['startTime']['hour']; i <= time['endTime']['hour']; i++) {
      hours.value.push(i.toString().padStart(2, '0'));
    }
  }

  form.value.timeHour = ''
  form.value.timeMinute = ''
})

watch(() => form.value.timeHour, () =>  {
  filteredMinutes.value = minutes.value

  if(form.value.date){
    const time = getTimeFromAvailability(form.value.date)
    if( form.value.timeHour == time['startTime']['hour'] ){
      filteredMinutes.value =  minutes.value.filter(n => n >= time['startTime']['minute'] );
    }
    if( form.value.timeHour == time['endTime']['hour'] ){
      filteredMinutes.value = minutes.value.filter(n => n <= time['endTime']['minute'] );
    }
  }

  form.value.timeMinute = ''
})

function getTimeFromAvailability(date){
  const dayNumber = new Date(date).getDay(); // Get the day of the week (0-6, where 0 is Sunday)
  const day = availability.value.find(item => Number(item.day_of_week_number) === dayNumber);

  const startTime = (day.start_time.split(":")) // 10:10
  const endTime = (day.end_time.split(":")) // 16:10

  return{
    'startTime' : { 'hour' : Number(startTime[0]), 'minute': Number(startTime[1]) },
    'endTime' : { 'hour' : Number(endTime[0]), 'minute': Number(endTime[1]) }
  };
}


</script>
