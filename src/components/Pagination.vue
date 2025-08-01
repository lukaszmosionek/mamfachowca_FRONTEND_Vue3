<template>
  <div class="relative mt-4" v-if="isShow">

    <nav class="flex justify-center" v-if="pagination.last_page > 1">
      <ul class="inline-flex items-center -space-x-px">
        <li>
          <button @click="changePage(pagination.page - 1)" :disabled="pagination.page === 1"
            class="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50">
            {{ $t('Prev') }}
          </button>
        </li>
        <li v-for="page in pagesToShow" :key="page">
          <button @click="changePage(page)" :class="[
            'px-3 py-2 leading-tight border',
            pagination.page === page
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-100 hover:text-gray-700',
          ]">
            {{ page }}
          </button>
        </li>

        <li>
          <button @click="changePage(pagination.page + 1)" :disabled="pagination.page === pagination.last_page"
            class="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50">
            {{ $t('Next') }}
          </button>
        </li>
      </ul>
    </nav>

    <select :value="pagination.per_page" @change="updatePerPage" v-if="pagination.last_page > 1"
      class="absolute right-0 top-0 border px-4 py-2 rounded w-full  w-1/12">
      <option v-for="(s, index) in [5, 10, 15]" :key="index" :value="s" selected="selected">{{ s }} - {{ $t('Per Page')
        }}
      </option>
    </select>

  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const props = defineProps({
  pagination: {
    type: Object,
    required: true,
  },
  isShow: {
    type: Boolean,
    required: false,
    default: true
  }
});

const emit = defineEmits(['page-changed'])
// const { updateQueryParam } = updateQueryParam()

const changePage = (page) => {
  if (page >= 1 && page <= props.pagination.last_page) {
    emit('page-changed', { page });
    updateQueryParams({page})
  }
}

const pagesToShow = computed(() => {
  const range = [];
  const start = Math.max(props.pagination.page - 3, 2);
  const end = Math.min(props.pagination.page + 3, props.pagination.last_page);
  range.push(1); // Always add page 1
  for (let i = start; i <= end; i++) {
    range.push(i);
  }
  return range;
});

function updatePerPage(event) {
  const perPage = parseInt(event.target.value)

  // Emit the new value to parent
  emit('page-changed', { perPage });

  // Update query string
  updateQueryParams({perPage})
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
