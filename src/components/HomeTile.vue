<template>
  <!-- <!-- <div v-if="!services" class="text-center mt-4">{{ $t('No services') }}</div> -->
  <div v-if="services">
    <div class="mx-auto bg-white rounded shadow-md overflow-hidden flex mt-5" v-for="(s, index) in services"
      :key="s.id">

      <!-- Zdjęcie -->
      <div class="relative w-80 h-80">
        <img :src="s.photos?.[0]?.photo_path ?? noPhoto" alt="{{ s.name }}" class="w-full h-full object-cover">
        <div class="absolute bottom-2 left-2 bg-teal-500 text-white text-xs font-bold px-2 py-1 rounded">
          WYRÓŻNIONE
        </div>
      </div>

      <!-- Opis -->
      <div class="flex-1 ">
        <div class="p-4 flex flex-col justify-between h-full">

          <div>
            <h2 class="text-lg font-semibold text-gray-800">{{ s.name }}</h2>
            <p v-if="!isLoading" class="text-sm text-gray-500 hidden md:block">{{ s?.description?.slice(0, 200) +
              '...' }}
            </p>
            <div v-if="isLoading" class="spinner"></div>
            <div class="text-sm text-gray-600 mt-4" v-if="s?.provider">
              <!-- <span>🚗</span> -->
              <div>Service duration: {{ s.duration }} min.</div>
              <div>Provider: <RouterLink class="" :to="{ name: 'Profile', params: { userId: s?.provider?.id ?? 0 } }">{{
                s?.provider?.name }}</RouterLink>
                <RouterLink class="text-2xl" :to="{ name: 'Messages', params: { userId: s?.provider?.id ?? 0 } }">
                  &#9993;</RouterLink>
              </div>
              <BaseButton @click="router.push({ name: 'BookServiceView', params: { serviceId: s.id } })"
                :name="$t('Book')" class="float-right" />
            </div>
          </div>

          <!-- Cena i serduszko -->
          <div class="flex justify-between items-center mt-1" v-if="s.price">
            <span class="text-lg font-bold text-gray-800">{{ n(Number(s.price), 'currency') }}</span>
            <span @click="toggleFavorite(s.id, $event)"
              class="text-gray-400 hover:text-red-500 cursor-pointer text-3xl">{{ s.is_favorited ? '♥' : '♡' }}</span>
          </div>

        </div>
      </div>

    </div>
  </div>
  <div v-else class="text-center mt-4">{{ $t('No services') }}</div>

</template>

<script setup>
import { ref, defineEmits } from 'vue';
import BaseButton from './BaseButton.vue';
import { useRouter } from 'vue-router';
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue3-toastify';
import { useI18n } from 'vue-i18n'
import noPhoto from '@/assets/no-photo.jpg';

const emit = defineEmits(['service-toggled']);
const { t, d, n } = useI18n()
const loading = ref(false)
const authStore = useAuthStore()
const router = useRouter();
const props = defineProps({
  services: {
    type: Array,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  }
});

const toggleFavorite = async (itemId, event) => {
  if (!authStore.token) return toast(t('Login to add to favorites'))
  const el = event.currentTarget;
  event.currentTarget.classList.add('animate-bounce');

  const res = await api.post(`/favorites/${itemId}`)
  const service = props.services.find(s => s.id === itemId);
  if (service) {
    service.is_favorited = res.data.favorited;
  }
  el.classList.remove('animate-bounce');
  emit('service-toggled', itemId);
}
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
