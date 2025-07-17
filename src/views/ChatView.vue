<template>
<div class="py-4 wrapper">

    <h2 class="text-2xl font-semibold mb-5 text-gray-800 text-center">{{ $t('Messages') }}</h2>

    <div class="d-flex" style="display: flex;">


      <!-- // Messages List -->
          <div class="mb-4 w-1/4 pr-4">
            <h3 class="text-lg font-medium mb-2 text-gray-800">{{ $t('People you have chatted with') }}</h3>
            <ul class="space-y-2">
              <li v-for="person in messagesPeople" :key="person.id" class="overflow-hidden text-ellipsis whitespace-nowrap">
                <RouterLink :to="{ name: 'Chats', params: { id: person.id ?? 0 } }" class="text-blue-500 hover:underline" :class="user.receiverUser.id === person.id ? 'font-bold' : ''" :title="person.email">
                  {{ person.name }}
                </RouterLink>
              </li>
            </ul>
          </div>


          <div class="w-3/4 spl-4">

              <div class="border p-4 h-96 overflow-y-scroll scroll-smooth space-y-2 text-gray-700" ref="scrollRef">

                <div class="font-bold text-lg text-center">{{ user.receiverUser.name }}</div>
                <div v-for="msg in messages" :key="msg.id" class="text-sm">
                    <div v-if="msg?.sender_id === user.currentUser.id" class="text-right">
                      <strong>{{ $t('You') }}:</strong> {{ msg.body }}
                    </div>

                    <div v-if="msg?.sender_id !== user.currentUser.id" class="text-left">
                      <strong>{{ user.receiverUser.name }}:</strong> {{ msg.body }}
                    </div>
                </div>
                <!-- <div v-if="messages.length === 0" class="text-center text-gray-500">
                  {{ $t('No messages yet') }}
                </div> -->

                <div v-if="loading" class="flex items-center justify-center bg-gray-100">
                  <div class="flex flex-col items-center space-y-4">
                    <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p class="text-gray-700 text-lg font-medium">{{ $t('Loading...') }}</p>
                  </div>
                </div>

              </div>
              <form @submit.prevent="sendMessage" class="mt-4 flex">
                <BaseInput v-model="newMessage" type="text" max="1000" :placeholder="$t('Message')" :errors="errors.message" class="flex-1 border rounded p-2 text-gray-700" />
                <BaseButton :name="$t('Send')" :loading="loading" class="ml-2 bg-blue-500 text-white px-4 py-2 rounded"/>
              </form>
        </div>
    </div>


</div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import api from '@/services/api'
import '@/plugins/echo'
import { useRoute } from 'vue-router'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import { toast } from 'vue3-toastify'
// const props = defineProps({ receiverId, currentUser })
import { useI18n } from 'vue-i18n'
import notificationSound from '@/assets/notification.wav'


const { t } = useI18n()

const messages = ref([])
const newMessage = ref('')
const route = useRoute()
const loading = ref(false)
const errors = ref({})
const scrollRef = ref(null)
const messagesPeople = ref([])

const user = ref({
  receiverUser: {}, //provider@onet.pl
  currentUser: {} //client@onet.pl
})

const fetchMessages = async () => {
  loading.value = true
  try{
    const res = await api.get('/chats/'+route.params.id);
    messages.value = res.data.messages
    user.value.receiverUser = res.data.receiver
    loading.value = false
    scrollToBottom()
  } catch (error) {
    alert(error.message)
    loading.value = false
  }
}

const fetchMessagedPeople = async () => {
  const res = await api.get('/chats')
  messagesPeople.value = res.data
}


const sendMessage = async () => {
  errors.value = {} // reset errors before submit
  loading.value = true
  try {
    const res = await api.post('/chats', {
      message: newMessage.value,
      receiver_id: user.value.receiverUser.id
    })
    newMessage.value = ''
    messages.value.push(res.data)
  } catch (error) {
    errors.value = error;
  }
  loading.value = false
}

watch(route, (newRoute) => {
  if (newRoute.params.id !== user.value.receiverUser.id) {
    fetchMessages()
  }
})

onMounted(() => {
  user.value.currentUser = JSON.parse(localStorage.getItem('user'))

  if(route.params.id == user.value.currentUser.id) {
    alert('You are chatting with yourself')
  }

  fetchMessages()
  fetchMessagedPeople()

  window.Echo.private(`private-chat.${user.value.currentUser.id}`)
    .listen('MessageSent', (e) => {
      if (e.message.sender_id === user.value.receiverUser.id) {
        messages.value.push(e.message)
        toast.success( t('New message received:') + ' ' + e.message.body.slice(0, 20) + '...')
        scrollToBottom()
        playSound()
      }
    })
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
