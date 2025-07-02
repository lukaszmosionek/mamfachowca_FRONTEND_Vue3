<template>
  <div class="">
 

    <h2 class="text-gray-600 text-3xl font-bold mb-4 text-center mt-4">Moje wizyty</h2>

    <div v-if="loading" class="text-center py-10 text-gray-500">
        Ładowanie usług...
    </div>
    <div v-if="appointments.length && !loading" class="overflow-x-auto">
      <table class="min-w-full table-auto border border-gray-200 rounded-lg shadow-sm">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">Usługa</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">Usługodawca</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">Data</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="appointment in appointments"
            :key="appointment.id"
            class="border-t hover:bg-gray-50 transition"
          >
            <td class="px-4 py-2 text-sm font-semibold text-gray-800">
              {{ appointment.service.name }}
            </td>
            <td class="px-4 py-2 text-sm text-gray-700">
              {{ appointment.provider.name }}
            </td>
            <td class="px-4 py-2 text-sm text-gray-700">
              {{ formatDate(appointment.date) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-else class="text-gray-500">Nie masz jeszcze umówionych wizyt.</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import Header from '@/components/Header.vue'
const loading = ref(false)

const appointments = ref<any[]>([])

const loadAppointments = async () => {
  loading.value = true
  try {
    const res = await api.get('/appointments')
    appointments.value = res.data
  } finally {
    loading.value = false
  }
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
