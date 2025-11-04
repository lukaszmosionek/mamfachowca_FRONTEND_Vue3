<template>
  <div class="">
    <div class="my-6 block md:flex gap-4 justify-center md:mx-0 mx-4">
      <BaseInput type="" name="search-box" :placeholder="$t('filtering.searchByName')" v-model="filters.name" @input="applyFilters" wrapperClass="md:!w-1/4 !w-full" />
      <!-- <BaseSelect v-model="filters.provider_id" name="select-provider" @update:modelValue="applyFilters" :options="providersObj" :isAssociativeArray="false" :addFirstOption="$t('filtering.all-providers')" wrapperClass="mt-2 md:!w-1/4 !w-full h-10" class="" /> -->

      <SearchableSelect
        :options="providers"
        name="select-provider"
        v-model="filters.provider_id"
        :inputPlaceholder="$t('filtering.inputPlaceholder')"
        @update:modelValue="applyFilters"
        :addFirstOption="$t('filtering.allProviders')"
        class="mt-1 md:!w-1/4 !w-full h-10"
      />

      <BaseInput type="" name="search-box" :placeholder="$t('filtering.priceFrom')" v-model="filters.priceFrom" @input="applyFilters" wrapperClass="md:!w-1/4 !w-full" />
      <BaseInput type="" name="search-box" :placeholder="$t('filtering.priceTo')" v-model="filters.priceTo" @input="applyFilters" wrapperClass="md:!w-1/4 !w-full" />
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue';
import BaseSelect from "./BaseSelect.vue"
import BaseInput from "./BaseInput.vue"
import SearchableSelect from "./ui/SearchableSelect.vue"

const router = useRouter()
const route = useRoute()
const props = defineProps({
  providers: {
    type: [Object, Array],
    required: true
  },
  filters: {
    type: Object,
    required: true
  }
});

const providersObj = computed(() =>
  props.providers.map(c => ({
    label: c.id,  // usually the display name
    value: c.name     // usually the identifier
  }))
);

const emits = defineEmits(['update:filters'])

const applyFilters = () => {
  // if (props.filters.name && props.filters.name.length < 3) return
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
