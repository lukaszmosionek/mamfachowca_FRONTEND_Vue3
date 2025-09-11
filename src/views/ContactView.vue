<template>
  <div class="mt-4 flex items-center justify-center p-6">
    <form @submit.prevent="submitForm" class="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full space-y-6">
      <h1 class="h1 mb-4">{{ $t('contact.title') }}</h1>
        <BaseInput name="name" v-model="form.name" :label="$t('contact.name')" :errors="errors?.name"></BaseInput>
        <BaseInput name="email" v-model="form.email" :label="$t('contact.email')" :errors="errors?.email"></BaseInput>
        <BaseInput name="message" v-model="form.message" :label="$t('contact.message')"  :errors="errors?.message" :isTextarea="true" rows="3"></BaseInput>
        <div class="flex justify-center">
            <BaseButton :isSubmit="true" :loading="loading"><font-awesome-icon :icon="['fas', 'paper-plane']" />&nbsp;{{ loading ? $t('contact.submiting') : $t('contact.submit') }}</BaseButton>
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
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()

const user = ref( authStore.user )

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

  if( !localStorage.getItem('backendValidation') ){
    errors.value = validateContact(form)
    if( Object.keys(errors.value).length > 0 ) return
  }

  loading.value = true;
  try {
    const response = await api.post('/contact', form.value );

    Swal.fire( t('contact.successMessage'),'','ok')
    form.value = {}
  } catch (error) {
    errors.value = error.errors
  }
  loading.value = false;
}
</script>
