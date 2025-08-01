<template>
  <div class="wrapper relative">
    <h2 class="text-gray-600 text-3xl font-bold mb-4 text-center mt-4">
      {{ $t('My appointments') }}
    </h2>

    <!-- <div v-else> -->
    <!-- <div v-if="appointments.length && !loading" class=""> -->
    <table v-if="appointments" class="min-w-full table-auto border border-gray-200 rounded-lg shadow-sm"
      :class="{ 'opacity-50': loading }">
      <thead class="bg-gray-100">
        <tr>
          <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">{{ $t('Service') }}</th>
          <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">{{ isClient ? $t('Provider')
            : $t('Client') }}
          </th>
          <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">{{ $t('Start Time') }}</th>
          <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">{{ $t('Status') }}</th>
          <th v-if="isProvider" class="px-4 py-2 text-left text-sm font-medium text-gray-600"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="appointment in appointments" :key="appointment.id" class="border-t hover:bg-gray-50 transition">
          <td class="px-4 py-2 text-sm font-semibold text-gray-800">
            <RouterLink class=""
              :to="{ name: 'BookServiceView', params: { serviceId: appointment?.service?.id ?? 0 } }">{{
                appointment.service.name }}</RouterLink>
          </td>
          <td class="px-4 py-2 text-sm flex items-center">
            <RouterLink class="" :title="appointment.provider?.role ?? appointment.client?.role ?? $t('Unknown')"
              :to="{ name: 'Profile', params: { userId: appointment?.provider?.id ?? appointment?.client?.id ?? 0 } }">
              {{
                appointment.provider?.name ?? appointment.client?.name ?? $t('Unknown') }}</RouterLink>
            <RouterLink class="text-2xl"
              :to="{ name: 'Messages', params: { userId: appointment?.provider?.id ?? appointment?.client?.id ?? 0 } }">
              &#9993;</RouterLink>
          </td>
          <td class="px-4 py-2 text-sm">
            {{ formatDate(appointment.date) + ' ' + appointment.start_time }}
          </td>
          <td class="px-4 py-2 text-sm" :class="{
            'text-yellow-500': appointment.status === Enums.AppointmentStatus.Pending,
            'text-green-500': appointment.status === Enums.AppointmentStatus.Confirmed,
            'text-red-500': appointment.status === Enums.AppointmentStatus.Cancelled,
          }">
            <div v-if="changeStatusLoadingId.includes(appointment.id)" class="spinner !w-4 !h-4 !my-1"></div>
            <span v-else>{{ $t(appointment.status) }}</span>
          </td>
          <th v-if="isProvider && appointment.id" class="px-4 py-2 text-sm flex gap-2">
            <BaseButton
              :class="{ 'invisible': appointment.status === Enums.AppointmentStatus.Confirmed, 'pointer-events-none opacity-30': changeStatusLoadingId.includes(appointment.id) }"
              @click="changeStatus(appointment.id, 'accept')">{{
                t('Accept') }}
            </BaseButton>
            <BaseButton
              :class="{ 'invisible': appointment.status === Enums.AppointmentStatus.Cancelled, 'pointer-events-none opacity-30': changeStatusLoadingId.includes(appointment.id) }"
              :makeRed="true" @click="changeStatus(appointment.id, 'decline')">{{ t('Decline') }}</BaseButton>
          </th>
        </tr>
      </tbody>
    </table>

    <div v-if="loading" class="absolute  inset-0 flex items-center justify-center">
      <div class="spinner"></div>
    </div>

    <Pagination :currentPage="pagination.page" :totalPages="pagination.total" @page-changed="handlePageChange"
      :perPage="pagination.per_page" />

    <!-- </div> -->

    <!-- <p v-else class="text-gray-500 text-center mt-3">
      {{ $t("You don't have appointments yet.") }}
    </p> -->
    <!-- </div> -->
  </div>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import BaseButton from '@/components/BaseButton.vue'
import Pagination from '@/components/Pagination.vue'
import { useI18n } from 'vue-i18n'
import { Enums } from '@/enums.js'
import { toast } from 'vue3-toastify'
import { useRoute } from 'vue-router'

const loading = ref(false)
const route = useRoute()
const changeStatusLoadingId = ref([])
const { t, d, n } = useI18n()
const pagination = ref({
  'page': 10,
  'total': 10,
  'per_page': 10,
})
// const appointments = ref(Array(10).fill({}));
const appointments = ref({});

const loadAppointments = async (loadingState = true) => {
  if (loadingState) loading.value = true
  try {
    const res = await api.get('/appointments', { params: pagination.value })
    appointments.value = res.data.appointments
    pagination.value.total = res.data.last_page
  } catch (error) {
    toast(t('Can\'t load appointments. Try again later'))
  } finally {
    loading.value = false
  }
}

const authStore = useAuthStore()
const isProvider = computed(() => authStore.user?.role === Enums.Role.Provider)
const isClient = computed(() => authStore.user?.role === Enums.Role.Client)

const changeStatus = async (id, action) => {
  changeStatusLoadingId.value.push(id)
  try {
    await api.post(`/appointments/${id}/${action}`)
    await loadAppointments(false)
  } catch (error) {
    toast(t('Can\'t perform this action. Try again later'))
  }
  changeStatusLoadingId.value = changeStatusLoadingId.value.filter(item => item !== id);
}

const formatDate = (iso) => {
  const d = new Date(iso)
  return d.toLocaleString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

onMounted(() => {
  const query = route.query

  // Use Number() and fallback defaults
  pagination.value.page = Number(query.page) || 1
  pagination.value.per_page = Number(query.per_page) || 10
  pagination.value.total = Number(query.total) || 10

  loadAppointments()
})

const handlePageChange = ({ page, perPage }) => {
  if (perPage) pagination.value.per_page = perPage
  if (page) pagination.value.page = page
  // appointments.value = Array(Number(pagination.value.per_page)).fill({});
  loadAppointments()
};
</script>
