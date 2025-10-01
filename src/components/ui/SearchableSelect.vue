<template>
  <div class="relative w-64">
    <!-- Search box -->
    <input
      type="text"
      v-model="search"
      :placeholder="inputPlaceholder"
      class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      @focus="open = true; search = ''"
    />

    <!-- Dropdown options -->
    <div
      v-if="open"
      class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
    >
      <div
        v-for="(option, index) in filteredOptions"
        :key="index"
        class="px-3 py-2 cursor-pointer hover:bg-blue-500 hover:text-white"
        @click="selectOption(option)"
      >
       {{ option.name }}
      </div>
      <!-- <div v-if="filteredOptions.length === 0" class="px-3 py-2 text-gray-400">
        No results found
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const props = defineProps({
  options: {
    type: Array,
    required: true,
  },
  addFirstOption: {
    type: String,
    default: '',
  },
  inputPlaceholder: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(["update:modelValue"]);

const search = ref("");
const open = ref(false);
const selected = ref("");

const filteredOptions = computed(() => {
  const baseOptions = props.options.filter((opt) =>
    opt.name.toLowerCase().includes(search.value.toLowerCase())
  );

  if (props.addFirstOption && search.value === '') {
    // Only add "All providers" if search is empty
    return [{ name: props.addFirstOption, id: "" }, ...baseOptions];
  }

  return baseOptions;
});

function selectOption(option) {
  selected.value = option;
  search.value = option.name;
  emit("update:modelValue", option.id);
  open.value = false;
}

onMounted(() => {
  // close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!(e.target.closest(".relative"))) {
      open.value = false;
    }
  });
});
</script>
