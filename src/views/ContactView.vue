<template>
  <div class="mt-4 flex items-center justify-center p-6">
    <form @submit.prevent="submitForm" class="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full space-y-6">
      <h2 class="text-3xl font-bold mb-4 text-gray-800">{{ $t('Contact Us') }}</h2>
        <BaseInput v-model="form.name" label="Name" :errors="errors?.name"></BaseInput>
        <BaseInput v-model="form.email" label="Email" :errors="errors?.email"></BaseInput>
        <BaseInput v-model="form.message" label="Message"  :errors="errors?.message" :isTextarea="true" rows="3"></BaseInput>
        <div class="flex justify-center">
            <BaseButton :isSubmit="true" :loading="loading" :isTextarea="true" rows="3"><font-awesome-icon :icon="['fas', 'paper-plane']" />&nbsp;{{ loading ? 'Sending...' : 'Send Message' }}</BaseButton>
        </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import api from '@/services/api'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import { validateContact } from '@/utils/validators.js'
import Swal from 'sweetalert2';
import { useI18n } from 'vue-i18n'

const user = ref( JSON.parse(localStorage.getItem('user')) )

const { t } = useI18n()
const form = ref({
  'name': user.value ? user.value.name : '',
  'email': user.value ? user.value.email : '',
  'message': '',
});
const errors = ref({})
const loading = ref(false);

async function submitForm() {

  errors.value = {} // reset errors before submit

  if( import.meta.env.VITE_TURN_ON_VUE_VALIDATION === 'true'){
    errors.value = validateContact(form)
    if( Object.keys(errors.value).length > 0 ) return
  }

  loading.value = true;
  try {
    const response = await api.post('/contact', form.value );

    Swal.fire('Message sent successfully! Thank you.','','ok')
    form.value = {}
  } catch (error) {
    // Swal.fire(error.response.message,'','error')
    errors.value = error.response.data.errors
  }
  loading.value = false;
}
</script>
