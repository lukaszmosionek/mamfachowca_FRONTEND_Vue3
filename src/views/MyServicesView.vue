<template>
  <div class="">
    <h1 class="h1">{{ $t('My Services') }}</h1>

    <!-- <ServiceForm v-if="showForm" :service="selectedService" @close="closeForm" @saved="loadServices" /> -->

    <div class="md:text-right text-center mt-2 mb-2">
      <!-- <button type="button" @click="createNew"class="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"><font-awesome-icon :icon="['fas', 'plus']" class="mr-2" />{{ $t('Add new service') }}</button> -->
      <RouterLink :to="{ name: 'MyServiceView', params: { serviceId: null } }" class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"><font-awesome-icon :icon="['fas', 'eye']" /><span class="md:inline hidden">{{ $t('Add new service') }}</span></RouterLink>&nbsp;
    </div>

    <div class="overflow-x-auto">
      <div v-if="loading" class="spinner"></div>
      <table v-if="services.length" class="min-w-full bg-white border border-gray-200 rounded-lg shadow" :class="{'opacity-50':loading}">
        <thead>
          <tr class="bg-gray-100 text-left text-sm uppercase text-gray-600">
            <th class="px-4 py-3">{{ $t('Name') }}</th>
            <th class="px-4 py-3">{{ $t('Price') }}</th>
            <th class="px-4 py-3 text-right"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in services" :key="s.id" class="border-t hover:bg-gray-50">
            <td class="px-4 py-2 text-gray-600 font-medium">{{ s.translations.find(el => el.language.code === locale)?.name ?? '---'  }}</td>
            <td class="px-4 py-2 text-gray-600">{{ s.price }}</td>
            <td class="px-4 py-2 md:text-right h-full">
              <div class="md:block flex-center space-x-2">
                  <RouterLink :to="{ name: 'BookServiceView', params: { serviceId: s.id } }" class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"><font-awesome-icon :icon="['fas', 'eye']" /><span class="md:inline hidden">{{ $t('View') }}</span></RouterLink>&nbsp;
                  <RouterLink :to="{ name: 'MyServiceView', params: { serviceId: s.id } }" class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"><font-awesome-icon :icon="['fas', 'edit']" /><span class="md:inline hidden">{{ $t('Edit') }}</span></RouterLink>&nbsp;
                  <!-- <button @click="editService(s)" class="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"><font-awesome-icon :icon="['fas', 'edit']" /><span class="md:inline hidden">{{ $t('Edit') }}</span></button>&nbsp; -->
                  <button @click="deleteService(s.id)" class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"><font-awesome-icon :icon="['fas', 'trash']" /><span class="md:inline hidden">{{ $t('Delete') }}</span></button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="flex justify-center mt-6">
          <BaseButton class="text-center px-8" :loading="loading" v-if="showLoadMore" @click="loadMore">{{ $t('Load more') }}</BaseButton>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import ServiceForm from '@/components/ServiceForm.vue'
import { toast } from 'vue3-toastify'
import BaseButton from '@/components/BaseButton.vue'
import { useI18n } from 'vue-i18n'
import { emptyStructureFromExample } from '@/helpers/createEmptyStructure'
// import { myServicesSchema } from '@/api/schemas/myServicesSchema'

const services = ref({})
const selectedService = ref(null)
const showForm = ref(false)
const loading = ref(false)
const showLoadMore = ref(true)
const page = ref(1)
const { locale } = useI18n()

const loadServices = async () => {
  loading.value = true
  try {
    const res = await api.get('/me/services')

    // console.log(emptyStructureFromExample(res.services))

    if( page.value === 1 ){
        services.value = res.services
    }else{
        services.value.push( ...res.services )
    }

    if (page.value >= res.last_page) {
        showLoadMore.value = false
    }

  }catch(err){
      toast.error('Failed to show services.'+' Try again later.')
  }
  loading.value = false
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
    loading.value = true
    try {
        await api.delete(`/me/services/${id}`)
    }catch(err){
        toast.error('Failed to delete service.'+' Try again later.')
    }
    loadServices()
  }
}

const closeForm = () => {
  selectedService.value = null
  showForm.value = false
}

onMounted(async () => {
  loadServices()
})

const loadMore = () => {
    page.value++
    loadServices()
}
</script>
