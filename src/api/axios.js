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

// Логирование для отладки
api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('Ошибка API', error)

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

      console.error(`Статус: ${error.response.status}, Сообщение: ${message}`)
      throw message
    } else if (error.request) {
      console.error('Сервер не ответил')
      throw 'Сервер не отвечает. Проверьте подключение.'
    } else {
      throw 'Ошибка настройки запроса: ' + error.message
    }
  },
)

export default api
export { eventApi }
