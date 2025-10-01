<template>
  <div class="provider-availability w-full max-w-sm">
    <div class="font-medium text-center">{{ t('Provider Availability') }}:</div>

    <table class="min-w-full border border-gray-200 rounded mt-2">
      <thead>
        <tr class="bg-gray-50">
          <th class="px-2 py-1 text-left">{{ t('Day') }}</th>
          <th class="py-1 text-left">{{ t('Start Time') }}</th>
          <th class="py-1 text-left">{{ t('End Time') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(availability, index) in formattedAvailabilities" :key="index">
          <td class="px-2 py-1">{{ t(availability.day_of_week) }}</td>
          <td>{{ availability.start }}</td>
          <td>{{ availability.end }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

// --- Props ---
interface Availability {
  day_of_week: string
  start_time: string
  end_time: string
}

const props = defineProps<{
  availabilities: Availability[]
}>()

// --- i18n ---
const { t, d } = useI18n()

// --- Helpers ---
const formatTime = (time: string) => {
  const today = new Date().toISOString().split('T')[0]
  return d(new Date(`${today}T${time}`), 'timeOnly')
}

// --- Computed: Preformatted availabilities ---
const formattedAvailabilities = computed(() =>
  props.availabilities.map(a => ({
    ...a,
    start: formatTime(a.start_time),
    end: formatTime(a.end_time),
  }))
)
</script>

<style scoped>
.provider-availability table {
  border-collapse: collapse;
}
</style>
