<template>
  <div class="">
    <!-- add filtering -->
    <div class="my-6 block md:flex gap-4 justify-center md:mx-0 mx-4">
      <BaseInput type="search" :placeholder="$t('Search by name')" v-model="filters.name" @input="applyFilters" wrapperClass="mt-1 md:!w-1/4 !w-full" />
      <BaseSelect v-model="filters.provider_id" @update:modelValue="applyFilters" :options="providers" :isAssociativeArray="true" :addFirstOption="$t('All Providers')" wrapperClass="mt-2 md:!w-1/4 !w-full" />
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import BaseSelect from "./BaseSelect.vue"
import BaseInput from "./BaseInput.vue"

const router = useRouter()
const route = useRoute()
const props = defineProps({
  providers: {
    type: Object,
    required: true
  },
  filters: {
    type: Object,
    required: true
  }
});

const emits = defineEmits(['update:filters'])

const applyFilters = () => {
  if (props.filters.name && props.filters.name.length < 3) return
  updateQueryParams(props.filters)
  emits('update:filters', { ...props.filters });
}

function updateQueryParams(params) {
  router.push({
    query: {
      ...route.query,
      ...params
    }
  })
}

</script>
