<template>
  <nav class="flex justify-center mt-4" v-if="totalPages > 1">
    <ul class="inline-flex items-center -space-x-px">
      <li>
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
        >
          {{ $t('Prev') }}
        </button>
      </li>

      <li v-for="page in pagesToShow" :key="page">
        <button
          @click="changePage(page)"
          :class="[
            'px-3 py-2 leading-tight border',
            currentPage === page
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-100 hover:text-gray-700',
          ]"
        >
          {{ page }}
        </button>
      </li>

      <li>
        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
        >
          {{ $t('Next') }}
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['page-changed']);

const changePage = (page,) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('page-changed', page,);
  }
};

const pagesToShow = computed(() => {
  const range = [];
  const start = Math.max(props.currentPage - 2, 1);
  const end = Math.min(props.currentPage + 2, props.totalPages);
  for (let i = start; i <= end; i++) {
    range.push(i);
  }
  return range;
});
</script>
