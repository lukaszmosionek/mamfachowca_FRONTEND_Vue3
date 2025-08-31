import axios from 'axios'
import i18n from '@/i18n'
import router from '@/router';
import { useAuthStore } from '@/stores/auth'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://api.mamfachowca.mosioneklukasz.pl'
const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  withCredentials: true,
})

api.interceptors.request.use(config => {
  config.headers['Accept-Language'] = localStorage.getItem('lang') ?? 'en'

    const authStore = useAuthStore()
    const token = authStore.token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

  return config
})

api.interceptors.response.use(
  response => {
    // Flatten deeply nested data
    response = response?.data?.data ?? response.data
    return response
  },
  error => {
    // Log or transform the error
    console.error({error})
    if (!error.response) {
        const isCors = error.message === 'Network Error';

        if (isCors){
          let refreshCount = Number(localStorage.getItem('refreshCount')) || 0;

          if (refreshCount < 5) {
            localStorage.setItem('refreshCount', refreshCount + 1);
            setTimeout(() => {
                window.location.reload();
            }, 500); // 0,5 second delay
          } else {
            console.warn('Maximum refresh limit reached.');
            localStorage.removeItem('refreshCount'); // Optional: reset after limit
            alert('Unable to connect to the server. Please check your internet or try again later.');

          }
        }

        return Promise.reject(error);
    }

    if (error.response && error.response.data.message === 'Unauthenticated.' ) {
        if (router.currentRoute.value.name !== 'Login') {
            router.push({ name: 'Login', query: { redirect: router.currentRoute.value.fullPath, successMessage: 'sesson-expired.login-again' } })
            const authStore = useAuthStore()
            authStore.clear()
        }
    }

    if (error.response && error.response.status === 404 && error.response?.data?.error_code === 'API_ROUTE_NOT_FOUND' ) {
        alert(error.response?.data?.message +' ' + i18n.global.t('Please try again later') );
    }

    if (error.response.status === 500) {
        alert( i18n.global.t('[500] A server error occurred.') + ' ' + i18n.global.t('Please try again later') );
    }

    const errorData = error.response?.data?.data ?? error?.response.data

    return Promise.reject(errorData);
  }
);

export default api
