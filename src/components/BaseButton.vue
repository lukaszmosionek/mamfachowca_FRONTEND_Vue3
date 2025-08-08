<template>
  <button :type="isSubmit ? 'submit' : 'button'" :disabled="loading" v-bind="$attrs"
    class="d-block bg-blue-600 active:scale-95 hover:bg-blue-700 text-white font-semibold py-2 px-2 rounded-md transition-colors flex items-center justify-center disabled:opacity-60 cursor-pointer"
    :class="{ 'bg-red-600 hover:bg-red-700': makeRed }">
    {{ name }}
    <slot />
    <span v-if="loading" class="spinner ml-1 !h-5 !w-5"></span>
  </button>
</template>

<script setup>
defineProps({
  name: {
    type: [String, Boolean],
    default: '',
  },
  nameLoading: {
    type: [String, Boolean],
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  isSubmit: {
    type: Boolean,
    default: false,
  },
  makeRed: {
    type: Boolean,
    default: false
  }
});

</script>
