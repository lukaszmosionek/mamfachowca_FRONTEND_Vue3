<template>
  <div :class="wrapperClass" class="input-wrap">
    <label v-if="label" :for="name ?? computedId" class="">{{ label }}</label>

    <input
      v-if="!isTextarea"
      :id="name ?? computedId"
      :name="name"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      v-bind="$attrs"
      class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
    />
    <textarea
        v-if="isTextarea"
        class="w-full border border-gray-300 rounded-md px-4 py-2"
        v-bind="$attrs"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"></textarea>

    <div v-if="Object.keys(errors).length > 0" class="text-red-500 mt-1 font-black">
      <!-- <span v-for="(msg, i) in errors" :key="i">{{ $t(msg) }}</span> -->
      <span>{{ $t(errors) }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

defineProps({
  label: {
    type: [String, Boolean],
    default: false,
  },
  isTextarea: {
    type: [Boolean],
    default: false,
  },
  modelValue: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
  placeholder: {
    type: String,
    default: "",
  },
  wrapperClass: {
    type: String,
    default: "",
  },
  errors: {
    type: [String, Array],
    default: () => [],
  },
});

const emit = defineEmits(['update:modelValue']);

const computedId = computed(() => {
  return `input-${Math.random().toString(36).substr(2, 9)}`
})
</script>

