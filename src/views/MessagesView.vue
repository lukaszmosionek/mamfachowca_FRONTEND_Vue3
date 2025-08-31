<template>
  <div class="">
    <h1 class="h1">{{ $t('Messages') }}</h1>

    <div class="flex flex-col md:flex-row">

      <!-- // Messages List -->
      <div class="mb-4 md:w-1/4 pr-4">
        <h3 class="text-lg font-medium mb-2 text-gray-800">{{ $t('People you have chatted with') }}</h3>
        <ul class="space-y-2">
          <li v-for="person in messagedPeople" :key="person.id" class="overflow-hidden text-ellipsis whitespace-nowrap">
            <RouterLink :to="{ name: 'Messages', params: { userId: person.id ?? 0 } }"
              class="text-blue-500 hover:underline" :class="{ 'font-bold': user.receiverUser.id === person.id }"
              :title="person.email">
              {{ person.name }}
            </RouterLink>
          </li>
        </ul>
        <span v-if="messagedPeople.length === 0" class="text-gray-500">{{ $t('No messages yet') }}</span>
      </div>
      <!-- // Messages List -->

      <div class="md:w-3/4 spl-4">
        <div class="border p-4 h-96 overflow-y-scroll scroll-smooth space-y-2 text-gray-700" ref="scrollRef">
          <div v-if="isFetchingMessages" class="spinner"></div>
          <div v-else>
            <div class="font-bold text-lg text-center">{{ user.receiverUser.name }}</div>
            <div v-for="msg in messages" :key="msg.id" class="text-sm">
              <div v-if="msg?.sender_id === user.currentUser.id" class="text-right">
                {{ msg.body }} <strong>:{{ $t('You') }}</strong>
              </div>

              <div v-if="msg?.sender_id !== user.currentUser.id" class="text-left">
                <strong>{{ user.receiverUser.name }}:</strong> {{ msg.body }}
              </div>
            </div>
          </div>
          <!-- <div v-if="messages.length === 0" class="text-center text-gray-500">
                  {{ $t('No messages yet') }}
                </div> -->
        </div>
        <form @submit.prevent="sendMessage" class="mt-4 flex gap-4">
          <BaseInput v-model="newMessage" type="text" max="1000" :placeholder="$t('Message')" :errors="errors.message" class="w-full" />
          <BaseButton type="submit" :loading="isSendingMessage" :disabled="isFetchingMessages || isSendingMessage" class="px-5 h-12"><font-awesome-icon :icon="['fas', 'paper-plane']" />&nbsp;{{ $t('Send') }}</BaseButton>
        </form>
      </div>
    </div>


  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import api from '@/services/api'
import { useRoute } from 'vue-router'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import { toast } from 'vue3-toastify'
import { useI18n } from 'vue-i18n'
import notificationSound from '@/assets/notification.wav'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()
const authStore = useAuthStore()

const messages = ref([])
const newMessage = ref('')
const route = useRoute()
const isSendingMessage = ref(false)
const isFetchingMessages = ref(false)
const errors = ref({})
const scrollRef = ref(null)
const messagedPeople = ref([])

const VITE_PUSHER_APP_STATUS = ref( import.meta.env.VITE_PUSHER_APP_STATUS === 'enabled')

const user = ref({
  receiverUser: {}, //provider@onet.pl
  currentUser: {} //client@onet.pl
})

const fetchMessages = async () => {
  isFetchingMessages.value = true
  try {
    const res = await api.get('/users/' + route.params.userId + '/messages');
    messages.value = res.messages
    user.value.receiverUser = res.receiver
    scrollToBottom()
  } catch (error) {
    if (error.response && error.response.status === 404) {
      alert('User not found (404)');
    }else{
      toast.error('Failed to fetch messages. Retrying...')
      setTimeout(fetchMessages, 5000) // retry after 5 seconds
    }
  }
  isFetchingMessages.value = false
}

const fetchMessagedPeople = async () => {
  const res = await api.get('/messaged-users')
  messagedPeople.value = res.usersYouChattedWith
}


const sendMessage = async () => {
  errors.value = {} // reset errors before submit
  isSendingMessage.value = true
  try {
    const res = await api.post('/users/' + user.value.receiverUser.id + '/messages', {
      message: newMessage.value
    })
    newMessage.value = ''
    messages.value.push(res.message)
    if (!messagedPeople.value.find(p => p.id === user.value.receiverUser.id)) {
      messagedPeople.value.unshift(user.value.receiverUser) //add an element to the beginning/end of an array
    }
    scrollToBottom()
    toast.success(t('Message sent successfully'))
  } catch (error) {
    errors.value = error;
  }
  isSendingMessage.value = false
}

watch(route, (newRoute) => {
  if (newRoute.params.id !== user.value.receiverUser.id) {
    fetchMessages()
  }
})

onMounted(() => {
  user.value.currentUser = authStore.user

  if (route.params.id == user.value.currentUser.id) {
    alert('You are chatting with yourself')
  }

  fetchMessages()
  fetchMessagedPeople()

  // try {
  if( VITE_PUSHER_APP_STATUS.value ){
    window.Echo.private(`private-chat.${user.value.currentUser.id}`)
    .listen('MessageSent', (e) => {
      let message = JSON.parse(e.message)
      if (message.sender_id === user.value.receiverUser.id) {
        messages.value.push(message)
        toast.success(t('New message received:') + ' ' + message.body.slice(0, 20) + '...')
        scrollToBottom()
        playSound()
      }
    })
  // } catch (error) {
  } else {
    console.log("Echo not connected, falling back to polling, start fetching from api every 60 seconds")
    // console.log(error)
    // Start polling if Echo fails
    setInterval( fetchMessages, 60 * 1000 ) //miliseconds
  }
})

async function scrollToBottom() {
  await nextTick() // Wait for DOM to update
  const el = scrollRef.value
  if (el) {
    el.scrollTo({
      top: el.scrollHeight,
      behavior: 'smooth'
    })
  }
}

function playSound() {
  const audio = new Audio(notificationSound)
  audio.play().catch(err => {
    console.error("Play failed:", err)
  });
}
</script>
