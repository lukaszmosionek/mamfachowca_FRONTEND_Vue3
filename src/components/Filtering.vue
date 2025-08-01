<template>
  <div class="">
    <!-- add filtering -->
    <div class="my-6 flex flex-wrap gap-4 justify-center">
      <input v-model="filters.name" @input="applyFilters" type="text" :placeholder="$t('Search by name')"
        class="border px-4 py-2 rounded w-full  md:w-1/4" />
      <select v-model="filters.provider_id" @change="applyFilters" class="border px-4 py-2 rounded w-full  md:w-1/4">
        <option value="">{{ $t('All Providers') }}</option>
        <option v-for="p in providers" :key="p.id" :value="p.id">
          {{ p.name }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const props = defineProps({
  providers: {
    type: Array,
    required: true
  },
  filters: {
    type: Object,
    required: true
  }
});

const emits = defineEmits(['update:filters']);

const applyFilters = () => {
  if (props.filters.name && props.filters.name.length < 3) return;
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
