<template>
<div class="max-w-5xl mx-auto bg-white rounded shadow-md overflow-hidden flex mt-5" v-for="(s, index) in services.data ?? services" :key="s.id">

    <!-- Zdjęcie -->
    <div class="relative w-1/3">
      <img :src="s.photos?.[0]?.photo_path ?? 'src/assets/no-photo.jpg'" alt="Ford S-Max" class="w-full h-full object-cover">
      <div class="absolute bottom-2 left-2 bg-teal-500 text-white text-xs font-bold px-2 py-1 rounded">
        WYRÓŻNIONE
      </div>
    </div>

    <!-- Opis -->
    <div class="w-2/3 p-4 flex flex-col justify-between">

      <div>
        <h2 class="text-lg font-semibold text-gray-800 mb-1">{{ s.name }}</h2>
        <p class="text-sm text-gray-500 mb-2 hidden md:block">{{ s.description }}</p>
        <img v-if="!s.description" src="/src/assets/icons/loading.svg"></img>
        <div class="text-sm text-gray-600">
          <!-- <span>🚗</span> -->
          <div>Service duration: {{ s.duration }} min.</div>
          <div>Provider: <a href="#">{{ s?.provider?.name }}</a></div>
          <BaseButton @click="router.push({ name: 'BookServiceView', params:{serviceId: s.id} })" :name="$t('Book')" class="float-right"/>
        </div>
      </div>

      <!-- Cena i serduszko -->
      <div class="flex justify-between items-center mt-4">
        <span class="text-lg font-bold text-gray-800">{{ s.price }} zł</span>
        <span @click="toggleFavorite(s.id, $event)" class="text-gray-400 hover:text-red-500 cursor-pointer text-3xl">{{ s.is_favorited ? '♥' : '♡' }}</span>
      </div>

    </div>
  </div>

</template>

<script setup>
import { ref } from 'vue';
import BaseButton from './BaseButton.vue';
import { useRouter } from 'vue-router';
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue3-toastify';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const loading = ref(false)
const authStore = useAuthStore()
const router = useRouter();
const props = defineProps({
  services: {
    type: Array,
    required: true
  },
  myFavorites: {
    type: Array
  }
});

const toggleFavorite = async (itemId, event) => {
if( !authStore.token ) return toast(t('Login to add to favorites'))
  const el = event.currentTarget;
  event.currentTarget.classList.add('animate-bounce');

  const res = await api.post(`/favorites/${itemId}`)
  const service = props.services.find(s => s.id === itemId);
  if (service) {
    service.is_favorited = res.data.favorited;
  }
  el.classList.remove('animate-bounce');
}
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
