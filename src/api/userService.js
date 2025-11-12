import api from './axios'
import { eventApi } from './axios'

export const userService = {
  async register(userData) {
    const response = await api.post('/User/Registration', userData)
    return response.data
  },

  async login(email, password) {
    const response = await api.post('/User/Authorization', { email, password })
    return response.data
  },

  async getCities() {
    const response = await api.get('/User/GetCity')
    return response.data
  },

  async getProfileById(userId) {
    const response = await api.get(`/User/GetProfile/${userId}`)
    return response.data
  },

  async updateProfile(userId, updateDto) {
    const response = await api.put(`/User/UpdateProfile/${userId}`, updateDto)
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
  async getEventsByCity(city) {
    const response = await eventApi.get(`/GetEventByCity?location=${encodeURIComponent(city)}`)
    return response.data
  },
  async filterEvents(filters) {
    const params = new URLSearchParams()
    // Отправляем текст как есть
    if (filters.game) {
      params.append('gameName', filters.game)
    }
    if (filters.date) params.append('date', filters.date)
    if (filters.players) params.append('playersRange', filters.players)
    if (filters.status) params.append('status', filters.status)
    if (filters.search) params.append('search', filters.search)
    const response = await eventApi.get(`/FilterEvents?${params.toString()}`)
    return response.data
  },
  async getEventStats(id) {
    const response = await eventApi.get(`/GetEventStats/${id}`)
    return response.data
  },
  async getGames() {
    // Используем основной api, чтобы получить /api/Game/GetGames
    const response = await api.get('/Game/GetGames')
    return response.data
  },
}
