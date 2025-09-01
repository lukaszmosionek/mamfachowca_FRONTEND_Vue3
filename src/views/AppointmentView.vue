<template>
  <div class="relative">
    <h1 class="h1">{{ $t('My appointments') }}</h1>

    <p v-if="!appointments.length && !loading" class="text-gray-500 text-center mt-3">
      {{ $t("You don't have appointments yet.") }}
    </p>

    <div class="overflow-x-auto"  :class="{'h-[600px]':loading}">
    <table v-if="appointments.length" class="min-w-full table-auto border border-gray-200 rounded-lg shadow-sm"
      :class="{ 'opacity-50': loading }">
      <thead class="bg-gray-100">
        <tr>
          <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">{{ $t('Service') }}</th>
          <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">{{ isClient ? $t('Provider'): $t('Client') }}</th>
          <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">{{ $t('Start Time') }}</th>
          <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">{{ $t('Status') }}</th>
          <th v-if="isProvider" class="px-4 py-2 text-left text-sm font-medium text-gray-600"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="appointment in appointments" :key="appointment.id" :data-id="appointment.id" class="border-t hover:bg-gray-50 transition">
          <td class="px-4 py-2 text-sm font-semibold text-gray-800"><RouterLink class="":to="{ name: 'BookServiceView', params: { serviceId: appointment?.service?.id ?? 0 } }">{{appointment.service?.name ?? 'No name' }}</RouterLink></td>
          <td class="px-4 py-2 text-sm flex-center"><RouterLink class="" :title="appointment.provider?.role ?? appointment.client?.role ?? $t('Unknown')":to="{ name: 'Profile', params: { userId: appointment?.provider?.id ?? appointment?.client?.id ?? 0 } }">{{  appointment.provider?.name ?? appointment.client?.name ?? $t('Unknown') }}</RouterLink><RouterLink class="text-2xl":to="{ name: 'Messages', params: { userId: appointment?.provider?.id ?? appointment?.client?.id ?? 0 } }"><font-awesome-icon :icon="['far', 'envelope']" /></RouterLink></td>
          <td class="px-4 py-2 text-sm">{{ formatDate(appointment.date) + ' ' + appointment.start_time }}</td>
          <td class="px-4 py-2 text-sm">
            <div v-if="changeStatusLoadingId.includes(appointment.id)" class="spinner !w-4 !h-4 !my-1"></div>
            <span :class="'badge badge--'+appointment.status" v-else>{{ $t(appointment.status) }}</span>
          </td>
          <td v-if="isProvider && appointment.id" class="px-4 py-2 text-sm flex gap-2">
            <BaseButton :class="{ 'invisible': appointment.status === Enums.AppointmentStatus.Confirmed, 'pointer-events-none opacity-30': changeStatusLoadingId.includes(appointment.id) }" class="btn-accept" @click="changeStatus(appointment.id, 'accept')"><font-awesome-icon :icon="['fas', 'check']" /> {{t('Accept') }}</BaseButton>
            <BaseButton :class="{ 'invisible': appointment.status === Enums.AppointmentStatus.Cancelled, 'pointer-events-none opacity-30': changeStatusLoadingId.includes(appointment.id) }" class="btn-decline" :makeRed="true" @click="changeStatus(appointment.id, 'decline')"><font-awesome-icon :icon="['fas', 'xmark']" /> {{ t('Decline') }}</BaseButton>
          </td>
        </tr>
      </tbody>
    </table>
    </div>

    <div v-if="loading" class="absolute left-1/2 top-1/2 flex items-center justify-center">
      <div class="spinner"></div>
    </div>

    <Pagination  @page-changed="handlePageChange" :pagination="pagination" :hidePerPage="true" />
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
  page: 1,
  last_page: 10,
  per_page: 10,
})
const appointments = ref({});

const loadAppointments = async (loadingState = true) => {
  if (loadingState) loading.value = true
  try {
    const res = await api.get('/appointments', { params: pagination.value })
    appointments.value = res.appointments
    pagination.value.last_page = res.last_page
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
  pagination.value.last_page = Number(query.last_page) || 0

  loadAppointments()
})

const handlePageChange = ({ page, perPage }) => {
  if (perPage) pagination.value.per_page = perPage
  if (page) pagination.value.page = page
  loadAppointments()
};
</script>
