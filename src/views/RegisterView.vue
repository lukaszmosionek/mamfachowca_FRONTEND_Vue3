<template>
  <div class="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-xl">
    <h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">{{ $t('Registration') }}</h2>
    <form @submit.prevent="handleRegister" class="space-y-4">
      <BaseInput v-model="form.name" type="text" :label="$t('Name')" placeholder="e.g. John Due" :errors="errors?.name"/>
      <BaseInput v-model="form.email" type="text" :label="$t('Email')" placeholder="e.g. john.due@example.com" :errors="errors?.email"/>
      <BaseInput v-model="form.password" type="password" :label="$t('Password')" placeholder="e.g. secretpassword" :errors="errors?.password"/>
      <BaseInput v-model="form.password_confirmation" type="password" placeholder="e.g. secretpassword" :label="$t('Password confirmation')" :errors="errors?.password_confirmation"/>
      <BaseSelect v-model="form.role" :label="$t('Role')" :options="{ 'client': $t('Client'), 'provider': $t('Provider') }"/>

      <div v-if="form.role == 'provider'">
        <h2 class="text-gray-600 text-xl text-center">Dostępność</h2>
        <div class="availability space-y-4 mt-4">
          <div v-for="(day, index) in daysOfWeek" :key="index" class="flex space-x-4 ">
            <BaseInput v-model="form.availability.start[day]" :max="form.availability.end[day]" type="time" class=" w-full" :label="$t(day)+$t('from')" />
            <BaseInput v-model="form.availability.end[day]" :min="form.availability.start[day]" type="time" class=" w-full" :label="$t('To')" />
          </div>
        </div>
      </div>

      <BaseButton :name="$t('Register')" :loading="loading" />
    </form>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseSelect from '@/components/BaseSelect.vue'
import { validateRegister } from '@/utils/validators.js'

const store = useAuthStore()
const router = useRouter()

const errors = ref({})
const loading = ref(false)

const form = ref({
  availability: {
    start: {},
    end: {}
  },
  role: 'client'
})

const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

daysOfWeek.forEach(day => {
  form.value.availability.start[day] = ''
  form.value.availability.end[day] = ''
})

const handleRegister = async () => {
  errors.value = {} // reset errors before submit

  errors.value = validateRegister(form)
  if( Object.keys(errors.value).length ) return;

  loading.value = true

  try {
    await store.register( form.value )
    router.push('/')
  } catch (error) {
    errors.value = error.errors
  }

  loading.value = false
}
</script>
