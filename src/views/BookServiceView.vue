<template>
  <div class="">

    <h1 class="h1">{{ $t('Book a service') }}</h1>

    <div class="text-4xl mt-2 text-center">{{ service.name }}</div>
    <p class="mt-4">{{ service.description }}</p>

    <h2 class="mt-2 text-2xl text-center">{{ $t('Make a reservation') }}</h2>
    <div class="flex gap-4 mt-2 w-full mx-auto items-center justify-center md:flex-row flex-col">

      <div class="w-48">
        <label for="date">{{ $t('Date') }}</label>
          <Datepicker v-model="form.date" :disabled-dates="disabledDates" :min-date="new Date()" :enable-time-picker="false" :auto-apply="true" class="mt-1.5 rounded-md"/>
          <div v-if="errors && Object.keys(errors?.date).length > 0" class="text-red-500 mt-1 font-black">
              <span v-for="(msg, i) in errors?.date" :key="i">{{ msg }}</span>
          </div>
      </div>

      <div class="flex gap-1">
        <BaseSelect class="w-24" v-model="form.timeHour" :isAssociativeArray="true" :errors="errors?.start_time" :label="$t('Time')" :options="hours"/>
        <span class="text-gray-600 mt-8">:</span>
        <BaseSelect class="w-24" v-model="form.timeMinute" :errors="errors?.start_time" label="&nbsp;" :options="filteredMinutes"/>
      </div>
    </div>

      <div class="flex mt-4 justify-end">
        <button @click="router.back()" class="px-4 py-2 bg-gray-300 rounded text-gray-600 mt-2">⬅ {{ $t('Go Back') }}</button>
        <BaseButton @click="bookService" :loading="loading" :name="$t('Book')" class="ml-2 mt-2 px-4 py-2 bg-blue-500 text-white rounded"/>
      </div>

      <Availabilities :availabilities="availability"/>

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
import Availabilities from '@/components/Availabilities.vue'

import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import Swal from 'sweetalert2';

const router = useRouter();
const route = useRoute()
const { t, d } = useI18n()

const loading = ref(false)
const errors = ref('');
const availability = ref({});

const form = ref({});
const service = ref({});

const filteredMinutes =  ref([]);

const disabledDates = ref((date) => {});

const minutes = ref(['05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55']);
const hours = ref({});

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
  for (let i = 8; i <= 16; i++) {
    hours.value[i] = convertTime(i)
  }
  loadService()
  filteredMinutes.value = minutes.value

})


watch(() => form.value.date, () => {

  if(form.value.date){
    const time = getTimeFromAvailability(form.value.date)

    hours.value = [];
    for (let i = time['startTime']['hour']; i <= time['endTime']['hour']; i++) {
      hours.value.push( convertTime(i) );
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

function convertTime(timeString) {
  const today = new Date().toISOString().split('T')[0]
  timeString = timeString.toString().padStart(2, '0')
  const dateISO =  new Date(`${today}T${timeString}:00:00`)
  return d( dateISO, 'hourOnly')
}

</script>
