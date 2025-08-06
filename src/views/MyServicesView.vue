<template>
  <div class="">
    <h1 class="h1">{{ $t('My Services') }}</h1>

    <ServiceForm v-if="showForm" :service="selectedService" @close="closeForm" @saved="loadServices" />

    <div class="md:text-right text-center mt-2 mb-2">
      <button @click="createNew"class="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"><font-awesome-icon :icon="['fas', 'plus']" class="mr-2" />{{ $t('Add new service') }}</button>
    </div>

    <div class="overflow-x-auto">
      <div v-if="loading" class="text-center py-10 text-gray-500">{{ $t('Loading services...') }}</div>
      <table v-if="!loading" class="min-w-full bg-white border border-gray-200 rounded-lg shadow">
        <thead>
          <tr class="bg-gray-100 text-left text-sm uppercase text-gray-600">
            <th class="px-4 py-3">{{ $t('Name') }}</th>
            <th class="px-4 py-3">{{ $t('Price (PLN)') }}</th>
            <th class="px-4 py-3 text-right"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in services" :key="s.id" class="border-t hover:bg-gray-50">
            <td class="px-4 py-2 text-gray-600 font-medium">{{ s.name }}</td>
            <td class="px-4 py-2 text-gray-600">{{ s.price }}</td>
            <td class="px-4 py-2 md:text-right h-full">
              <div class="md:block flex justify-right items-center justify-center space-x-2">
              <button @click="editService(s)" class="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"><font-awesome-icon :icon="['fas', 'edit']" /><span class="md:inline hidden">{{ $t('Edit') }}</span></button>
              <button @click="deleteService(s.id)" class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"><font-awesome-icon :icon="['fas', 'trash']" /><span class="md:inline hidden">{{ $t('Delete') }}</span></button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import ServiceForm from '@/components/ServiceForm.vue'

const services = ref([])
const selectedService = ref(null)
const showForm = ref(false)
const loading = ref(false)

const loadServices = async () => {
  loading.value = true
  try {
    const res = await api.get('/me/services')
    services.value = res.data
  } finally {
    loading.value = false
  }
}

const createNew = () => {
  selectedService.value = null
  showForm.value = true
}

const editService = (s) => {
  selectedService.value = s
  showForm.value = true
}

const deleteService = async (id) => {
  if (confirm('Na pewno chcesz usunąć?')) {
    await api.delete(`/me/services/${id}`)
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
