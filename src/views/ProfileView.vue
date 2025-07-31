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
      <HomeTile :services="user.services" />
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

const user = ref({})

const { t } = useI18n()
const errors = ref({})
const isLoading = ref(false)
const route = useRoute()

onMounted(async () => {
  isLoading.value = true
  const res = await api.get('/users/'+parseInt(route.params.userId))
  user.value = res.data
  isLoading.value = false
})

</script>
