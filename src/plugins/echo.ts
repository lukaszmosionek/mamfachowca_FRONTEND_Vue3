import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { useAuthStore } from '@/stores/auth.ts'

window.Pusher = Pusher

export function initEcho() {
    const authStore = useAuthStore()

    const {
      VITE_PUSHER_APP_KEY,
      VITE_PUSHER_APP_CLUSTER,
      VITE_BACKEND_URL,
      VITE_PUSHER_APP_STATUS
    } = import.meta.env;

    if (VITE_PUSHER_APP_STATUS !== "enabled") {
      console.warn("Pusher is disabled via VITE_PUSHER_APP_STATUS.");
    } else if (!VITE_PUSHER_APP_KEY || !VITE_PUSHER_APP_CLUSTER) {
      console.warn("Pusher environment variables are missing.");
    } else {
      try {
        window.Echo = new Echo({
          broadcaster: 'pusher',
          key: VITE_PUSHER_APP_KEY,
          cluster: VITE_PUSHER_APP_CLUSTER,
          encrypted: true,
          forceTLS: true,
          authEndpoint: `${VITE_BACKEND_URL}/api/broadcasting/auth`,
          auth: {
            headers: {
              Authorization: `Bearer ${authStore.token}`
            }
          }
        });
        console.log("Echo initialized successfully.");
      } catch (err) {
        console.error("Failed to initialize Echo:", err);
      }
    }
}
