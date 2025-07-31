<template>
<!-- Provider Availability -->
      <div class="mt-16">
        <span class="font-medium">{{ $t('Provider Availability') }}:</span>
        <table class="min-w-full border border-gray-200 rounded">
          <thead>
            <tr class="bg-gray-50">
              <th class="px-2 py-1 text-left">{{ $t('Day') }}</th>
              <th class="px-2 py-1 text-left">{{ $t('Start Time') }}</th>
              <th class="px-2 py-1 text-left">{{ $t('End Time') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(a, index) in availabilities" :key="index">
              <td class="px-2 py-1">{{ $t(a.day_of_week) }}</td>
              <td class="px-2 py-1">{{ a.start_time }}</td>
              <td class="px-2 py-1">{{ a.end_time }}</td>
            </tr>
          </tbody>
        </table>
      </div>
<!-- Provider Availability -->
</template>

<script setup>
const props = defineProps({
  availabilities: {
    type: Object,
    required: true
  }
});
</script>
