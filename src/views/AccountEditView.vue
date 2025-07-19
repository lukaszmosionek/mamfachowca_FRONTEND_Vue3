<template>
  <div class="max-w-md mx-auto p-4">
    <h2 class="text-xl font-bold mb-4 text-gray-600">{{ $t('Edit Account') }}</h2>

    <form @submit.prevent="updateUser" class="space-y-4">
        <BaseInput :label="$t('Name')" v-model="form.name" :errors="errors?.name"/>
        <BaseInput :label="$t('Email')" v-model="form.email" :errors="errors?.email"/>
        <BaseInput :label="$t('Role')" v-model="form.role" disabled="disabled"/>
        <BaseButton :name="$t('Update')" :loading="loading" type="submit" class="bg-blue-500 text-white px-4 py-2"/>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import { useI18n } from 'vue-i18n'

const form = ref({
  name: '',
  email: '',
  role: '',
})

const { t } = useI18n()
const errors = ref({})
const loading = ref(false)

onMounted(async () => {
  const res = await api.get('/me')
// cl(res)
  form.value.name = res.data.name
  form.value.email = res.data.email
  form.value.role = t(res.data.role)
})

const updateUser = async () => {
  errors.value = {}
  loading.value = true
  try{
    const res = await api.put('/me', form.value)
    alert('Profile Updated')
  }catch(error){
    errors.value = error?.errors
  }
  loading.value = false
}
</script>
