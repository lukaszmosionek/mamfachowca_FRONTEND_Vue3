<template>
  <div class="input-wrap">
      <label v-if="label" class="text-gray-800 mb-1">{{ label }}</label>
      <select
      :value="modelValue"
      @change="event => emit('update:modelValue', event.target.value)"
      class="w-full h-full px-4 py-2 border border-gray-300 rounded-md text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option v-if="addFirstOption" value="">{{addFirstOption}}</option>
      <option v-for="(value, i) in options" :key="i" :value="isAssociativeArray ? i : value">{{value}}</option>
    </select>
    <div v-if="Object.keys(errors).length > 0" class="text-red-500 mt-1 font-black">
        <span v-for="(msg, i) in errors" :key="i">{{ msg }}</span>
    </div>
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
    type: [Array, Object],
    default: () => [],
  },
  errors: {
    type: [String, Array],
    default: () => [],
  },
  isAssociativeArray: {
    type: Boolean,
    default: false,
  },
  addFirstOption: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);
</script>

