<template>
  <div class="wrapper flex justify-evenly mt-6">
    <div v-if="isLoading" class="spinner"></div>
    <div v-else>
      <div class="space-y-4">
        <h2 class="text-xl text-center font-bold mb-4 text-gray-600">{{ $t('Profile') }}</h2>
          <div>{{ $t('Name') }}: {{ user.name }}</div>
          <div>{{ $t('Email') }}: {{ user.email }}</div>
          <div>{{ $t('Role') }}: {{ user.role }}</div>
          <div>{{ $t('Role') }}: {{ user.role }}</div>
      </div>
      <Availabilities :availabilities="user.availabilities"/>
      <HomeTile :services="user?.services?.data" />
      <Pagination :currentPage="Number(user?.services?.current_page)" :totalPages="Number(user?.services?.last_page)" @page-changed="handlePageChange"/>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import HomeTile from '@/components/HomeTile.vue';
import Availabilities from '@/components/Availabilities.vue'
import Pagination from '@/components/Pagination.vue';

const user = ref({})

const { t } = useI18n()
const errors = ref({})
const isLoading = ref(false)
const route = useRoute()

onMounted(async () => {
  loadUser( parseInt(route.query.page) || 1 )
})

async function loadUser(page){
  isLoading.value = true
  const res = await api.get('/users/'+parseInt(route.params.userId), {
      params: {
        page: parseInt(page) || 1 ,
        per_page: parseInt(route.query.per_page) || 1,
        name: filters.value.name || null,
        provider_id: filters.value.providerId || null,
        user_id: user ? user.id : null
      }
    })
  user.value = res.data
  isLoading.value = false
}

const handlePageChange = (page) => {
  user.value.services = Array(user.value?.services?.data).fill({});
  loadUser(page)
};

</script>
