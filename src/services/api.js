import axios from 'axios'
import i18n from '@/i18n'

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL+'/api',
  withCredentials: true,
})

api.interceptors.request.use(config => {
  config.headers['Accept-Language'] = localStorage.getItem('lang') ?? 'en'

    const token = localStorage.getItem('token');
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

        // if (confirm(isCors
        //   ? 'CORS Error: The request was blocked. Reload the page?'
        //   : 'Network Error: Unable to connect. Reload the page?'
        // )){
        // }
        window.location.reload()

        return Promise.reject(error);
    }

    if (error.response && error.response.status === 404 && error.response?.data?.error_code === 'API_ROUTE_NOT_FOUND' ) {
        alert(error.response?.data?.message + i18n.global.t('Please try again later') );
    }

    if (error.response.status === 500) {
        alert( i18n.global.t('[500] A server error occurred.') + i18n.global.t('Please try again later') );
    }

    const errorData = error.response?.data?.data ?? error?.response.data

    return Promise.reject(errorData);
  }
);

export default api
