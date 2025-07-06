import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  // baseURL: 'http://api.mamfachowca.mosioneklukasz.pl/api',
  withCredentials: true,
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
      alert('Network Error: Unable to connect to API.');
      return Promise.reject({ message: 'Network Error: Unable to connect to API.' });
    }
    return Promise.reject(error.response.data || { message: 'An error occurred.' });
  }
);

export default api
