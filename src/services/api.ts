import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
})

api.interceptors.response.use(
  response => response,
  error => {
    // Log or transform the error
    if (!error.response) {
      // Network error
      return Promise.reject({ message: 'Network Error: Unable to connect to API.' });
    }
    return Promise.reject(error.response.data || { message: 'An error occurred.' });
  }
);

export default api
