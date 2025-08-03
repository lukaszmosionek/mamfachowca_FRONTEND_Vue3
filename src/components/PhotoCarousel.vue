<template>
  <div class="relative w-full overflow-hidden rounded-2xl shadow-lg">
    <!-- Images -->
    <div
      class="flex transition-transform duration-500 ease-in-out"
      :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
    >
      <div
        v-for="(image, index) in (images.length ? images : ['noPhoto'])"
        :key="index"
        class="w-full flex-shrink-0"
      >
        <img
          :src="image[imageKey] ?? noPhoto"
          :srcset="`
            ${image.thumbnail} 480w,
            ${image.medium} 768w,
            ${image.large} 1200w
          `"
          sizes="(max-width: 480px) 100vw,
                (max-width: 768px) 100vw,
                1200px"
          class="w-full object-cover"
          :class="height"
          :alt="`Image ${index + 1}`"
        />
      </div>
    </div>

    <!-- Navigation buttons -->
    <button
      v-if="showButtons && images.length > 1"
      class="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow"
      @click="prev"
    >
      <ChevronLeftIcon class="w-5 h-5 text-gray-700" />
    </button>

    <button
      v-if="showButtons && images.length > 1"
      class="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow"
      @click="next"
    >
      <ChevronRightIcon class="w-5 h-5 text-gray-700" />
    </button>

    <!-- Dots -->
    <div
      v-if="showDots && images.length > 1"
      class="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2"
    >
      <button
        v-for="(image, index) in images"
        :key="index"
        class="w-3 h-3 rounded-full"
        :class="currentIndex === index ? 'bg-white' : 'bg-white/50'"
        @click="goTo(index)"
      ></button>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect, onMounted, onUnmounted } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid'
import noPhoto from '@/assets/no-photo.jpg';

const props = defineProps({
  images: {
    type: Array,
    required: true,
    default: () => []
  },
  imageKey: {
    type: String,
    default: 'thumbnail'
  },
  height: {
    type: String,
    default: 'h-64'
  },
  autoplay: {
    type: Boolean,
    default: false
  },
  interval: {
    type: Number,
    default: 3000
  },
  showDots: {
    type: Boolean,
    default: true
  },
  showButtons: {
    type: Boolean,
    default: true
  }
})

const currentIndex = ref(0)

const prev = () => {
  currentIndex.value =
    (currentIndex.value - 1 + props.images.length) % props.images.length
}

const next = () => {
  currentIndex.value = (currentIndex.value + 1) % props.images.length
}

const goTo = (index) => {
  currentIndex.value = index
}

let intervalId = null

onMounted(() => {
  if (props.autoplay) {
    intervalId = setInterval(next, props.interval)
  }
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>
