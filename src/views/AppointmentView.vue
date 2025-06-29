<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">Moje wizyty</h2>

    <ul v-if="appointments.length">
      <li
        v-for="appointment in appointments"
        :key="appointment.id"
        class="mb-4 border p-4 rounded shadow-sm"
      >
        <div class="font-semibold text-lg">{{ appointment.service.name }}</div>
        <div>Usługodawca: {{ appointment.provider.name }}</div>
        <div>Data: {{ formatDate(appointment.date) }}</div>
      </li>
    </ul>

    <p v-else>Nie masz jeszcze umówionych wizyt.</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const appointments = ref<any[]>([])

const loadAppointments = async () => {
  const res = await api.get('/appointments')
  appointments.value = res.data
}

const formatDate = (iso: string) => {
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
  loadAppointments()
})
</script>
