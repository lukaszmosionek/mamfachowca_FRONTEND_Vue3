<template>
  <button
    :type="type"
    :disabled="loading"
    v-bind="$attrs"
    class="d-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-2 rounded-md transition-colors flex items-center justify-center disabled:opacity-60 cursor-pointer"
  >
  <span v-if="loading" class="animate-spin rounded-full h-5 w-5 border-t-2 border-white mr-2"></span>
    {{ name }}
  </button>
</template>

<script setup>
defineProps({
  name: {
    type: [String, Boolean],
    default: false,
  },
  nameLoading: {
    type: [String, Boolean],
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: "submit",
  }
});

</script>

