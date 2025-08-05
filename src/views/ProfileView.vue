<template>
  <div class="">
    <h1 class="h1">{{ $t('Profile') }}</h1>

    <div v-if="isLoading" class="spinner"></div>
    <div v-else>
      <div class="flex gap-4 flex-col items-center md:flex-row">
          <img :src="user.avatar || defaultAvatar" alt="User Avatar" class="rounded-full w-60 h-60" />
          <div class="space-y-4">
              <div>{{ $t('Name') }}: {{ user.name }}</div>
              <div>{{ $t('Email') }}: {{ user.email }}</div>
              <div>{{ $t('Role') }}: {{ user.role }}</div>
          </div>
          <Availabilities :availabilities="user?.availabilities" class="ml-0 md:ml-6" />
      </div>
      <h2 class="text-xl text-center font-bold mb-4 text-gray-600 mt-3">{{ $t('Services list') }}</h2>
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
import defaultAvatar from '@/assets/default-avatar.svg';

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
