import axios from 'axios'

const baseApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:1337',
  timeout: 10000,
  headers: {
    Accept: 'applications/json',
    'Content-Type': 'application/json'
  }
})

baseApi.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

baseApi.interceptors.response.use(
  async (res) => {
    switch (+res.status) {
      case 200000:
      case 200: // OK
        return await Promise.resolve(res)
      case 401: // Unauthorized:
        return await Promise.reject(res)
      case 404: // Not found
      case 500: // Internal Server Error:
      case 400: // Bad Request
        return await Promise.reject('Failed to fetch data')
      default:
        return await Promise.reject('Failed to fetch data')
    }
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default baseApi
