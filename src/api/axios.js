import axios from 'axios'

const API_BASE = 'http://localhost:5119/api'
const EVENT_API_BASE = 'http://localhost:5119/api/Event'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

const eventApi = axios.create({
  baseURL: EVENT_API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      let message = 'Ошибка сервера'

      if (error.response.data) {
        if (typeof error.response.data === 'string') {
          message = error.response.data
        } else if (error.response.data.message) {
          message = error.response.data.message
        } else if (error.response.data.title) {
          message = error.response.data.title
        }
      }
      throw message
    } else if (error.request) {
      throw 'Сервер не отвечает'
    } else {
      throw 'Ошибка настройки запроса: ' + error.message
    }
  },
)

export default api
export { eventApi }
