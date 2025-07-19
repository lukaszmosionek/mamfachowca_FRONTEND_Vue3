<template>
  <div class="relative inline-block text-left" ref="container">
    <!-- Dropdown Button -->
    <button
      @click="isOpen = !isOpen"
      class="flex items-center p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring"
    >
      <!-- You can use a bell icon here -->
      🔔
            <!-- Notification Count Badge -->
      <!-- Notification Count Badge -->
        <span
          v-if="notifications.unread_count > 0"
          class="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full"
        >
          {{ notifications.unread_count }}
        </span>
    </button>

    <!-- Dropdown Panel -->
    <div
      v-if="isOpen"
      class="origin-top-right absolute right-0 mt-2 w-64 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
    >
      <div class="p-4">
        <h3 class="text-sm font-semibold text-gray-700 mb-2">Notifications - <button @click="markAllAsRead" class="text-xs text-gray-500">mark all as read</button></h3>
        <ul class="max-h-60 overflow-y-auto">
          <li
            v-for="n in notifications.data?.slice().reverse() || []"
            :key="n.data.id"
            @click="clickNotification(n.data)"
            class="py-2 px-3 hover:bg-gray-100 rounded-md cursor-pointer" :class="[n.read_at ? '' : '', n.isNew ? 'animate-pulse' : '']"
          >
            <p class="text-sm text-gray-500 font-medium">{{ n.data.title+(n.read_at ? '' : ' - unread') }}</p>
            <p class="text-xs text-gray-500">{{ n.data.body }}</p>
            <p class="text-xs text-gray-500 mt-1 border-b border-gray-200 pb-2">{{ n.created_at_human ?? 'Now' }}</p>
          </li>
        </ul>
        <span class="block text-xs text-gray-500 text-center mt-2">{{ notifications.data?.length === 0 ? 'No notifications' : '' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
// import { useNotificationStore } from '@/stores/notifications';
// const { notifications } = useNotificationStore();
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import clickOutside from '@/utils/useClickOutside'

import api from '@/services/api'

const notifications = ref({})
const user = ref({})
const isOpen = ref(false)
const router = useRouter()
const container = ref(null)

onMounted(async () => {
      document.addEventListener('click', handleClickOutside)
      user.value = JSON.parse(localStorage.getItem('user'))

      const res = await api.get('/notifications');
      notifications.value = res.data;

      window.Echo.private(`App.Models.User.${user.value.id}`)
        .notification((e) => {
            notifications.value.data.push({data: e, read_at: null, isNew: true})
            notifications.value.unread_count++
        });
});

const markAllAsRead = async () => {
  await api.post('/notifications/mark-all-as-read');
  notifications.value.data.forEach(n => n.read_at = new Date());
  notifications.value.unread_count = 0;
}

const clickNotification = async (data) => {
  // Mark the notification as read
  await api.post(`/notifications/${data.id}/mark-as-read`);
  const notification = notifications.value.data.find(n => n.data.id === data.id);
  if (notification) {
    notification.read_at = new Date();
    notification.isNew = false;
    notifications.value.unread_count--;
  }

  isOpen.value = false; // Close the dropdown after clicking a notification

  if (data.path) {
    router.push({ path: data.path });
  }

  //emit('notification-clicked', data);



}

function handleClickOutside(event) {
  if (container.value && !container.value.contains(event.target)) {
    isOpen.value = false
  }
}

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})


</script>
