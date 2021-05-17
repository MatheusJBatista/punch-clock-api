import axios from 'axios'

const googleAuthApi = axios.create({
  baseURL: 'https://oauth2.googleapis.com',
})

googleAuthApi.interceptors.response.use(
  response => ({ ...response.data, authenticated: true }),
  error => {
    if (error.response.status === 400) return { authenticated: false }
  }
)

export default googleAuthApi
