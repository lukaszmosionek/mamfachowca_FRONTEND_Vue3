<template>
  <div :class="wrapperClass" class="input-wrap flex flex-col">
    <label v-if="label" :for="name ?? computedId" class="">{{ label }} <slot /> <div v-if="isLoading" class="spinner !w-2 !h-2 inline-block"></div></label>

    <input
      v-if="!isTextarea"
      :id="name ?? computedId"
      :name="name"
      :disabled="isLoading"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      v-bind="$attrs"
      class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
    />
    <textarea
        v-if="isTextarea"
        :id="name ?? computedId"
        :disabled="isLoading"
        :name="name"
        class="w-full border border-gray-300 rounded-md px-4 py-2"
        v-bind="$attrs"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"></textarea>

    <div :class="'error-container error-for-'+name">
      <span v-if="Array.isArray(errors)" v-for="(msg, i) in errors" :key="i" class="text-red-500 mt-1 block input-error">{{ $t(msg) }}</span>
      <span v-if="typeof errors === 'string'" class="text-red-500 mt-1 block input-error">{{ $t(errors) }}</span>
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
  isLoading: {
    type: [Boolean],
    default: false,
  },
  modelValue: {
    type: [ String, Number ],
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

