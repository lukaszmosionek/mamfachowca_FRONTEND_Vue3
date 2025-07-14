import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
})

api.interceptors.request.use(config => {
  config.headers['Accept-Language'] = localStorage.getItem('lang') ?? 'en'
  return config
})

api.interceptors.response.use(
  response => {
    // Flatten deeply nested data
    response.data = response?.data?.data ?? response.data
    return response
  },
  error => {
    // Log or transform the error
    if (!error.response) {
      // Network error
      setInterval(() => {
        location.reload()
      },2000);
      // alert('Network Error: Unable to connect to API.'+error);
      return Promise.reject({ message: 'Network Error: Unable to connect to API.' });
    }
    return Promise.reject(error.response.data || { message: 'An error occurred.' });
  }
);

export default api
