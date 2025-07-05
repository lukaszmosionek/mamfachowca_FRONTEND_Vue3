<template>
  <div class="wrapper">
    <main class="p-6 text-center">
      <h2 class="text-3xl  text-gray-700 font-bold mb-4">Welcome to our app!</h2>
      <p class="text-lg text-gray-700">
        Here you can make an appointment or manage your services.
      </p>

      <div class="mt-8">
        <RouterLink
          v-if="isClient"
          to="/appointments"
          class="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Browse available services
        </RouterLink>

        <RouterLink
          v-if="isProvider"
          to="/my-services"
          class="bg-green-600 text-white px-4 py-2 rounded"
        >
          Manage your services
        </RouterLink>
      </div>
    </main>

    <div class="overflow-x-auto">
      <div v-if="loading" class="text-center py-10 text-gray-500">
        Services loading...
      </div>
      <table v-if="!loading" class="min-w-full bg-white border border-gray-200 rounded-lg shadow">
        <thead>
          <tr class="bg-gray-100 text-left text-sm uppercase text-gray-600">
            <th class="px-4 py-3">Name</th>
            <th class="px-4 py-3">Price</th>
            <th class="px-4 py-3">Provider</th>
            <th class="px-4 py-3 text-right"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="s in services"
            :key="s.id"
            class="border-t hover:bg-gray-50"
          >
            <td class="px-4 py-2 text-gray-600 font-medium">{{ s.name }}</td>
            <td class="px-4 py-2 text-gray-600">{{ s.price }} zł</td>
            <td class="px-4 py-2 text-gray-600">{{ s.provider.name }}</td>
            <td class="px-4 py-2 space-x-2 text-right">
              <!-- <button
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
              </button> -->
            </td>
          </tr>
        </tbody>
      </table>
    </div>


  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const services = ref([])
const loading = ref(false)

const loadServices = async () => {
  loading.value = true
  try {
    const res = await api.get('/services/all')
    services.value = res.data
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadServices()
})

const authStore = useAuthStore()
const isProvider = computed(() => authStore.user?.role === 'provider')
const isClient = computed(() => authStore.user?.role === 'client')
</script>
