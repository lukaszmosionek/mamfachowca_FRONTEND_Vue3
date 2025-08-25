<template>
  <div class="p-6">
    <h1 class="h1">Services</h1>
    <div v-if="isLoading" class="spinner"></div>
    <div v-else-if="services.length === 0">No services found.</div>

    <table v-else class="min-w-full border border-gray-300 divide-y divide-gray-200">
      <thead class="bg-gray-100">
        <tr>
          <th class="px-4 py-2 text-left">ID</th>
          <th class="px-4 py-2 text-left">Name</th>
          <th class="px-4 py-2 text-left">Description</th>
          <th class="px-4 py-2 text-left"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="service in services" :key="service.id" class="hover:bg-gray-50">
          <td class="px-4 py-2">#{{ service.id }}</td>
          <td class="px-4 py-2"><RouterLink class="" :to="{ name: 'BookServiceView', params: { serviceId: service.id } }">{{service.name }}</RouterLink></td>
          <td class="px-4 py-2">{{ service.description }}</td>
          <!-- <td class="px-4 py-2">{{ service.role }}</td> -->
          <td class="px-4 py-2 text-right space-x-2">
            <!-- <button class="text-blue-500 hover:underline">Edit</button> -->
            <RouterLink class="text-blue-500 hover:underline" :to="{ name: 'AdminMyServiceView', params: { serviceId: service.id } }">Edit</RouterLink>

            <button v-if="!service.deleted_at" class="text-red-500 hover:underline" @click="deleteService(service.id)">Delete</button>
            <button v-if="service.deleted_at" class="text-green-500 hover:underline" @click="restoreService(service.id)">Restore</button>
          </td>
        </tr>
      </tbody>
    </table>


  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { toast } from 'vue3-toastify'

const services = ref([])
const isLoading = ref(false)

onMounted(() => {
  loadServices()
})

async function loadServices() {
  isLoading.value = true
  try {
    const res = await api.get('/admin/services')
    services.value = res.services
  } catch (error) {
    toast.error('Failed to delete service')
  }
  isLoading.value = false
}

async function deleteService(serviceId) {
  try {
    await api.delete(`/admin/services/${serviceId}`)
    services.value.find(service => service.id === serviceId).deleted_at = true
    toast.success('Service deleted successfully')
  } catch (error) {
    toast.error('Failed to delete service')
  }
}

async function restoreService(serviceId) {
  try {
    await api.delete(`/admin/services/${serviceId}`)
    services.value.find(service => service.id === serviceId).deleted_at = null
    toast.success('Service restored successfully')
  } catch (error) {
    toast.error('Failed to restore service')
  }
}
</script>
