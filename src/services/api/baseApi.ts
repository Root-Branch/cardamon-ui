import axios from 'axios'

const baseApi = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL, // Ensure you have this in your .env file
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
  async (response) => {
    const res = response.data
    switch (+res.code) {
      case 200000:
      case 200: // OK
        return res
      case 401: // Unauthorized:
        return await Promise.reject(res)
      case 404: // Not found
      case 500: // Internal Server Error:
      case 400: // Bad Request
        return await Promise.reject(res.message)
      default:
        return await Promise.reject(res.message || 'Unknown error occurred')
    }
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default baseApi
