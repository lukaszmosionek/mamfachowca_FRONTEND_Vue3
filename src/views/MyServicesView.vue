<template>
  <div>
    <h2>Moje Usługi</h2>

    <ServiceForm v-if="showForm" :service="selectedService" @close="closeForm" @saved="loadServices" />

    <button @click="createNew">Dodaj nową usługę</button>

    <ul>
      <li v-for="s in services" :key="s.id">
        <strong>{{ s.name }}</strong> – {{ s.price }} zł
        <button @click="editService(s)">Edytuj</button>
        <button @click="deleteService(s.id)">Usuń</button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import ServiceForm from '@/components/ServiceForm.vue'

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
