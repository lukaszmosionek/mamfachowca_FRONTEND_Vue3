import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { useAuthStore } from '@/stores/auth'

window.Pusher = Pusher

export function initEcho() {
    const authStore = useAuthStore()

    window.Echo = new Echo({
        broadcaster: 'pusher',
        key: import.meta.env.VITE_PUSHER_APP_KEY,
        cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
        encrypted: true,
        forceTLS: true,
        authEndpoint: import.meta.env.VITE_BACKEND_URL+'/api/broadcasting/auth',
        auth: {
            headers: {
                Authorization: `Bearer ${authStore.token}`
            }
        }
    });
}
