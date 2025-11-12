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
      const message = error.response.data || error.response.statusText
      throw typeof message === 'string' ? message : 'Ошибка сервера'
    } else if (error.request) {
      console.error('Сервер не ответил')
    } else {
      throw 'Ошибка настройки запроса ' + error.message
    }
  },
)

export default api
export { eventApi }
