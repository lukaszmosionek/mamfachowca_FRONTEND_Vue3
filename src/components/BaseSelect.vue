<template>
  <div class="input-wrap">
    <label v-if="label" class="text-gray-800">{{ label }}</label>
    <select
    :value="modelValue"
    class="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <option v-for="(value, i) in options" :key="i" :value="i">{{value}}</option>
  </select>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: [String, Boolean],
    default: false,
  },
  modelValue: {
    type: String,
    default: "",
  },
  options: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['update:modelValue']);
</script>

