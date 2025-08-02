<template>
  <div class="wrapper flex justify-evenly mt-6">
    <!-- <div v-if="isLoading" class="spinner"></div> -->
    <!-- <div v-else> -->
    <div>
      <div class="space-y-4">
        <h2 class="text-xl text-center font-bold mb-4 text-gray-600">{{ $t('Profile') }}</h2>
        <div>{{ $t('Name') }}: {{ user.name }}</div>
        <div>{{ $t('Email') }}: {{ user.email }}</div>
        <div>{{ $t('Role') }}: {{ user.role }}</div>
        <div>{{ $t('Role') }}: {{ user.role }}</div>
      </div>
      <Availabilities :availabilities="user?.availabilities" />
      <HomeTile :services="services" :isLoading="isLoading" />
      <Pagination :pagination="pagination" @page-changed="handlePageChange" />
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

const user = ref({
  'availabilities': []
})
const services = ref([])

const { t } = useI18n()
const errors = ref({})
const isLoading = ref(false)
const route = useRoute()

const pagination = ref({
  per_page: Number(route.query.per_page) || 5,
  page: Number(route.query.page) || 1,
  last_page: 10
})

onMounted(async () => {
  loadUser()
})

async function loadUser() {
  isLoading.value = true
  const res = await api.get('/users/' + parseInt(route.params.userId), { params: pagination.value })
  user.value = res.data.user
  services.value = res.data.services
  pagination.value.last_page = parseInt(res.data.last_page)
  isLoading.value = false
}

const handlePageChange = ({ page, perPage }) => {
  if (perPage) pagination.value.per_page = perPage
  if (page) pagination.value.page = page
  services.value = Array(pagination.value.per_page).fill({});
  loadUser()
};

</script>
