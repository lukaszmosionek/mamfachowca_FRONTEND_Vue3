import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL+'/api',
  withCredentials: true,
})

await api.get('/sanctum/csrf-cookie').catch(error => {
  console.error('Failed to get CSRF cookie:', error);
});

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
      return Promise.reject({
        message: 'Network Error: Unable to connect to API.',
        isNetworkError: true
      });
    }

    const msg = error.response?.data?.message?.toLowerCase() || '';
    if (error.response && error.response.status === 404 && msg.includes('the route') && msg.includes('could not be found')) {
        alert('API route not found (404). Please try again later.');
    }

    if (error.response.status === 500) {
        alert('A server error occurred. Please try again later.');
    }

    return Promise.reject(error);
  }
);

export default api
