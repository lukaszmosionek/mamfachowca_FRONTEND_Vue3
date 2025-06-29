<template>
  <div>
    <h3>{{ service ? 'Edytuj usługę' : 'Nowa usługa' }}</h3>
    <form @submit.prevent="submit">
      <input v-model="form.name" placeholder="Nazwa" />
      <input v-model.number="form.price" placeholder="Cena" />
      <input v-model.number="form.duration_minutes" placeholder="Czas (minuty)" />
      <textarea v-model="form.description" placeholder="Opis"></textarea>

      <button type="submit">Zapisz</button>
      <button type="button" @click="$emit('close')">Anuluj</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import api from '@/services/api'
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{ service: any | null }>()
const emit = defineEmits(['saved', 'close'])

const form = ref({
  name: '',
  price: 0,
  duration_minutes: 30,
  description: '',
})

watch(() => props.service, (val) => {
  if (val) {
    form.value = { ...val }
  } else {
    form.value = {
      name: '',
      price: 0,
      duration_minutes: 30,
      description: '',
    }
  }
}, { immediate: true })

const submit = async () => {
  if (props.service) {
    await api.put(`/services/${props.service.id}`, form.value)
  } else {
    await api.post('/services', form.value)
  }
  emit('saved')
  emit('close')
}
</script>
