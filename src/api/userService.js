import api from './axios'
import { eventApi } from './axios'

export const userService = {
  async register(userData) {
    const response = await api.post('/Registration', userData)
    return response.data
  },

  async login(email, password) {
    const response = await api.post('/Authorization', { email, password })
    return response.data
  },
}

export const eventService = {
  async getEvents() {
    const response = await eventApi.get('/GetEvent')
    return response.data
  },
  async getEventById(id) {
    const response = await eventApi.get(`/GetEventById?id=${id}`)
    return response.data
  },
}
