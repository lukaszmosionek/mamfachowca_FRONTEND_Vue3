<template>
  <Header />
  <div class="max-w-4xl mx-auto p-6">
    <h2 class="text-2xl font-semibold mb-4">Moje Usługi</h2>

    <ServiceForm v-if="showForm" :service="selectedService" @close="closeForm" @saved="loadServices" />

    <button
      @click="createNew"
      class="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Dodaj nową usługę
    </button>

    <div class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-200 rounded-lg shadow">
        <thead>
          <tr class="bg-gray-100 text-left text-sm uppercase text-gray-600">
            <th class="px-4 py-3">Nazwa</th>
            <th class="px-4 py-3">Cena (zł)</th>
            <th class="px-4 py-3">Akcje</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="s in services"
            :key="s.id"
            class="border-t hover:bg-gray-50"
          >
            <td class="px-4 py-2 text-gray-600 font-medium">{{ s.name }}</td>
            <td class="px-4 py-2 text-gray-600">{{ s.price }}</td>
            <td class="px-4 py-2 space-x-2">
              <button
                @click="editService(s)"
                class="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
              >
                Edytuj
              </button>
              <button
                @click="deleteService(s.id)"
                class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Usuń
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>



<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import ServiceForm from '@/components/ServiceForm.vue'
import Header from '@/components/Header.vue'

const services = ref([])
const selectedService = ref(null)
const showForm = ref(false)

const loadServices = async () => {
  const res = await api.get('/services')
  services.value = res.data
}

const createNew = () => {
  selectedService.value = null
  showForm.value = true
}

const editService = (s: any) => {
  selectedService.value = s
  showForm.value = true
}

const deleteService = async (id: number) => {
  if (confirm('Na pewno chcesz usunąć?')) {
    await api.delete(`/services/${id}`)
    loadServices()
  }
}

const closeForm = () => {
  showForm.value = false
}

onMounted(() => {
  loadServices()
})
</script>
