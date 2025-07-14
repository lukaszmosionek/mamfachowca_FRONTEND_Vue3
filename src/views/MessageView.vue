<template>
  <div class="p-4">
    <div class="border p-4 h-96 overflow-y-scroll scroll-smooth space-y-2 text-gray-700" ref="scrollRef">

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
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import api from '@/services/api'
import '@/plugins/echo'
import { useRoute } from 'vue-router'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import { toast } from 'vue3-toastify'
// const props = defineProps({ receiverId, currentUser })
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const messages = ref([])
const newMessage = ref('')
const route = useRoute()
const loading = ref(false)
const errors = ref({})
const scrollRef = ref(null)

const user = ref({
  receiverUser: {}, //provider@onet.pl
  currentUser: {} //client@onet.pl
})

const fetchMessages = async () => {
  loading.value = true
  const res = await api.get(`/messages/${parseInt(route.params.id)}`)
  messages.value = res.data.messages
  user.value.receiverUser = res.data.receiver
  loading.value = false
}

const sendMessage = async () => {
  errors.value = {} // reset errors before submit
  loading.value = true
  try {
    const res = await api.post(`/messages/${user.value.receiverUser.id}`, {
      message: newMessage.value
    })
    newMessage.value = ''
    messages.value.push(res.data)
  } catch (error) {
    errors.value = error;
  }
  loading.value = false
}

onMounted(() => {
  user.value.currentUser = JSON.parse(localStorage.getItem('user'))

  fetchMessages()

  window.Echo.private(`private-chat.${user.value.currentUser.id}`)
    .listen('MessageSent', (e) => {
      if (e.message.sender_id === user.value.receiverUser.id) {
        messages.value.push(e.message)
        toast.success( t('New message received:') + ' ' + e.message.body.slice(0, 20) + '...')
        scrollToBottom()
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
</script>
