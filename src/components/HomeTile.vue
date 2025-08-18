<template>
  <div>
    <div :class="{ 'opacity-50': isLoading }" v-for="(s, index) in services" :key="s.id"  class="mx-auto bg-white rounded shadow-md overflow-hidden flex mt-5 w-full relative" >

      <!-- Zdjęcie -->
      <div class="w-40 h-40 md:w-80 md:h-80">
        <PhotoCarousel  :images="s.photos" height="h-40 md:h-80" imageKey="medium" class=""></PhotoCarousel>
      </div>
      <!-- Zdjęcie -->

      <!-- Opis -->
      <div class="flex-1 w-full">
        <div class="md:p-4 p-2 flex flex-col justify-between h-full">
            <div class="flex flex-col justify-between">
              <h2 class="font-semibold text-gray-800 md:text-xl text-xs md:mr-0 mr-6  whitespace-normal">{{ s.name }}</h2>
              <p class="max-h-[150px] overflow-hidden text-gray-500 hidden md:block text-xs md:text-sm">{{ s.description }}</p>
              <div class="text-gray-600 text-xs md:text-sm" v-if="s.provider">
                <div class="mt-2 flex"><span class="hidden md:block">{{ $t('Service duration') }}:&nbsp;</span><span>{{ s.duration }} min.</span></div>
                <div class="flex items-center"><span class="hidden md:block">{{ $t('Provider') }}:&nbsp;</span> <RouterLink class="" :to="{ name: 'Profile', params: { userId: s.provider.id } }">{{s.provider.name }}</RouterLink><RouterLink class="text-lg md:text-2lg" :to="{ name: 'Messages', params: { userId: s.provider.id } }"><font-awesome-icon :icon="['far', 'envelope']" /></RouterLink></div>
              </div>
            </div>
            <!-- Opis -->
            <!-- Cena i serduszko -->
            <div class="flex flex-row justify-between items-end">
              <span class=" font-bold text-gray-800  text-xs md:text-sm" :title="'Original price: '+s.price+' '+s.currency?.code"><span class="hidden md:inline">{{ $t('Price') }}:</span> {{ s.currency ? currencyStore.convert( s.price, s.currency.code) : 'No data' }}</span>
              <BaseButton @click="router.push({ name: 'BookServiceView', params: { serviceId: s.id } })" class="ml-4 w-fit"><font-awesome-icon :icon="['fas', 'calendar-plus']" /><span class="hidden md:inline">&nbsp;{{$t('Book')}}</span></BaseButton>
            </div>
            <!-- Cena i serduszko -->
            <div @click="toggleFavorite(s.id, $event)" class="absolute top-2 right-2 text-gray-400 hover:text-red-500 cursor-pointer text-2xl"><font-awesome-icon :icon="[s.is_favorited ? 'fas' : 'far', 'heart']" /></div>
            <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center">
              <div class="spinner"></div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, watch } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue3-toastify'
import { useI18n } from 'vue-i18n'
import BaseButton from '@/components/BaseButton.vue'
import PhotoCarousel from '@/components/PhotoCarousel.vue'
import { useCurrencyStore } from '@/stores/useCurrencyStore'
const currencyStore = useCurrencyStore()
const emit = defineEmits(['service-toggled']);
const { t, d, n } = useI18n()
const loading = ref(false)
const authStore = useAuthStore()
const router = useRouter();
const props = defineProps({
  services: {
    type: [Array, Object],

    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  }
});

const toggleFavorite = async (itemId, event) => {
  if (!authStore.token) return toast.info(t('Login to add to favorites'))
  const el = event.currentTarget;
  event.currentTarget.classList.add('animate-bounce');

  try{
    const res = await api.post(`/favorites/${itemId}/toggle`)
    const service = props.services.find(s => s.id === itemId)
    if (service) {
      service.is_favorited = res.favorited
      service.is_favorited ? toast.success(t('favorites.added')) : toast.warning(t('favorites.removed'))
    }
  }catch(err){
    toast.error(t('Error toggling favorite')+t('Try again later.'))
  }
  el.classList.remove('animate-bounce');
  emit('service-toggled', itemId);
}

</script>

<style scoped>
/* Add any component-specific styles here */
</style>
