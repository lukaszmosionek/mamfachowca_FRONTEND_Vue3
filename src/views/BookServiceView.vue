<template>
  <div class="">

    <h1 class="h1">{{ $t('bookService.title') }}</h1>

    <div class="flex md:flex-row  flex-col">
        <div class="md:w-3/4 w-full p-2">
            <PhotoCarousel :images="service.photos" height="h-[300px] md:h-[600px]" imageKey="large" class=""></PhotoCarousel>
            <p class="mt-4 p-4 hidden md:block">{{ translatedDescription }}</p> <!-- only desktop-->
            <h2 class="text-xl mt-4 text-center md:hidden">{{ translatedName }}</h2> <!-- only mobile-->
        </div>

        <div class="md:w-1/4  w-full p-2 flex flex-col">
            <h2 class="text-xl mt-4 text-center hidden md:block">{{ translatedName }}</h2>  <!-- only desktop-->
            <p class=" md:hidden">{{ translatedDescription }}</p> <!-- only mobile-->

              <div class="mt-4">
                  <div class=" p-4">
                      <div class="text-gray-600" v-if="service?.provider">
                          <div class="mt-2 flex"><span class="">{{ $t('bookService.serviceDuration') }}:&nbsp;</span><span>{{ service.duration }} min.</span></div>
                          <div class="flex items-center"><span class="">{{ $t('bookService.provider') }}:&nbsp;</span> <RouterLink class="" :to="{ name: 'Profile', params: { userId: service?.provider?.id ?? 0 } }">{{service?.provider?.name }}</RouterLink><RouterLink class="text-lg md:text-2lg" :to="{ name: 'Messages', params: { userId: service?.provider?.id ?? 0 } }"><font-awesome-icon :icon="['far', 'envelope']" /></RouterLink></div>
                      </div>
                  </div>
                <Availabilities class="" :availabilities="availability"/>
              </div>
              <h2 class="mt-8 text-xl text-center">{{ $t('bookService.makeReservation') }}</h2>

              <div class="flex gap-1 mt-2 w-full mx-auto items-center justify-center md:flex-col flex-col">
                  <div class="w-full">
                    <label for="date">{{ $t('bookService.date') }}</label>
                        <Datepicker v-model="form.date" :disabled-dates="disabledDates" :min-date="new Date()" :enable-time-picker="false" :auto-apply="true" class="select-date rounded-md"/>
                        <div v-if="errors?.date && Object.keys(errors?.date).length > 0" class="text-red-500 mt-1 font-black">
                            <span v-for="(msg, i) in errors?.date" :key="i">{{ msg }}</span>
                        </div>
                  </div>
                  <div class="w-full">
                      <label class="block">{{ $t('bookService.time') }}</label>
                      <div class="flex gap-1">
                          <BaseSelect wrapperClass="md:w-1/2 w-full select-hour" class="" v-model="form.timeHour" :isAssociativeArray="false" :errors="errors?.start_time" :options="hours"/>
                          <span class="text-gray-600 mt-2">:</span>
                          <BaseSelect wrapperClass="md:w-1/2 w-full select-minute" class="" v-model="form.timeMinute" :options="filteredMinutes"/>
                      </div>
                  </div>
                </div>
                <div class="flex-center mt-4">
                    <button @click="router.back()" class="px-4 py-2 bg-gray-300 rounded text-gray-600 mt-2 button-back">⬅ {{ $t('bookService.buttons.back') }}</button>
                    <BaseButton @click="bookService" :loading="loading" class="ml-2 mt-2 px-4 py-2 bg-blue-500 text-white rounded button-book"><font-awesome-icon :icon="['fas', 'calendar-plus']" />&nbsp;{{ $t('bookService.buttons.submit') }}</BaseButton>
                </div>
        </div>
    </div>
  </div>
</template>
<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, reactive, computed, onMounted, watch } from "vue"
import api from '@/services/api'
import BaseButton from '@/components/BaseButton.vue'
import BaseSelect from '@/components/BaseSelect.vue'
import { toast } from 'vue3-toastify'
import { useI18n } from 'vue-i18n'
import Availabilities from '@/components/Availabilities.vue'
import PhotoCarousel from '@/components/PhotoCarousel.vue'
import { Enums } from '@/enums.js'
import { useAuthStore } from '@/stores/auth'

import { serviceSchema } from '@/api/schemas/servicesSchema'

import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import Swal from 'sweetalert2'
import { deepClone } from '@/helpers/deepClone.js'

const router = useRouter();
const route = useRoute()
const { t, d, locale } = useI18n()
const authStore = useAuthStore()

const loading = ref(false)
const errors = reactive({});
const availability = ref([]);

const form = reactive({
  // date: '',
  // timeHour: '',
  // timeMinute: '',
});
const service = ref({})

const filteredMinutes =  ref([])

const disabledDates = ref((date) => {});

const minutes = ref(['05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'])
const hours = ref([]);

const loadService = async () => {
  loading.value = true
  try {
    const res = await api.get('/services/'+parseInt(route.params.serviceId))
    service.value = res.service
    availability.value = res.service.provider.availabilities

    const dayNumbers = availability.value.map(el => Number(el.day_of_week_number) )

    disabledDates.value = (date) => {
      return !Object.values(dayNumbers).includes(date.getDay())
    }

  } catch(err) {
    toast.error(t('bookService.errors.loadService')+' '+t('errors.tryAgainLater'))
  }
  loading.value = false
}

const bookService = async () => {
  if( !authStore.isClient ) toast.info(t('bookService.validation.notClient'))

  if(!form.date) errors.date = t('bookService.validation.date')
  if(!form.timeHour || !form.timeMinute) errors.start_time = t('bookService.validation.time')

  if (Object.values(errors).some(Boolean)) return

  try {
    loading.value = true
    const res = await api.post('/appointments', {
        service_id: route.params.serviceId,
        start_time: form.timeHour && form.timeMinute ? form.timeHour + ':' + form.timeMinute : null,
        date: form.date ? form.date.toISOString().split("T")[0] : null
    })
    await Swal.fire('', t('bookService.successMessage'), 'success')
    router.push({ name: 'Appointments' })
  } catch (err) {
    errors.value = err.errors
  }
  loading.value = false
}

onMounted(() => {
  service.value = deepClone(serviceSchema[0])

  for (let i = 8; i <= 16; i++) {
    hours.value.push({ 'label': addLeadingZero(i), 'value': convertTime(i) })
  }
  loadService()
  filteredMinutes.value = minutes.value

})


watch(() => form.date, () => {

  if(form.date){
    const time = getTimeFromAvailability(form.date)

    hours.value = []
    for (let i = time['startTime']['hour']; i <= time['endTime']['hour']; i++) {
      hours.value.push({ 'label': addLeadingZero(i), 'value': convertTime(i) })
    }
  }

  form.timeHour = ''
  form.timeMinute = ''
})

watch(() => form.timeHour, () =>  {
  filteredMinutes.value = minutes.value

  if(form.date){
    const time = getTimeFromAvailability(form.date)
    if( form.timeHour == time['startTime']['hour'] ){
      filteredMinutes.value =  minutes.value.filter(n => n >= time['startTime']['minute'] )
    }
    if( form.timeHour == time['endTime']['hour'] ){
      filteredMinutes.value = minutes.value.filter(n => n <= time['endTime']['minute'] )
    }
  }

  form.timeMinute = ''
})

function getTimeFromAvailability(date){
  if(!availability.value.length) return undefined;

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

function  addLeadingZero(n) {
  return n < 10 ? '0' + n : n
}

const translatedDescription = computed(() => service.value?.translations?.find(el => el.language.code === locale.value)?.description ?? '' )
const translatedName = computed(() => service.value?.translations?.find(el => el.language.code === locale.value)?.name ?? '' )
</script>
