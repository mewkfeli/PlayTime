<template>
  <div class="events-page">
    <AppHeader />
    <main class="catalog-section">
      <div class="catalog-header">
        <div class="header-top">
          <div class="header-text">
            <h1 class="catalog-title">Каталог событий</h1>
            <div class="catalog-subtitle">Найдите идеальное игровое событие для себя</div>
          </div>
          <button class="btn btn-primary create-event-btn" @click="openModal">
            <i class="plus"></i>
            Создать событие
          </button>
        </div>

        <EventsFilters
          :filters="filters"
          :games="games"
          :cities="cities"
          @filter-change="handleFilterChange"
          @search="handleSearch"
        />
      </div>

      <div v-if="loading">Загрузка...</div>
      <div v-else>
        <div v-if="error" class="error">{{ error }}</div>
        <EventsGrid :events="filteredEvents" @view-event="viewEvent" @join-event="joinEvent" />
      </div>
    </main>

    <div
      v-if="showCreateModal"
      class="modal-overlay"
      @click.self="showCreateModal = false"
      style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
      "
    >
      <div
        class="modal-container"
        style="
          background: white;
          border-radius: 12px;
          width: 90%;
          max-width: 700px;
          max-height: 100vh;
          overflow: auto;
          padding: 0;
        "
      >
        <div
          class="modal-header"
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem 2rem;
            border-bottom: 1px solid #e0e0e0;
          "
        >
          <h2 style="margin: 0; color: #333">Создание нового события</h2>
          <button
            @click="showCreateModal = false"
            style="background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #666"
          >
            <i class="times"></i>
          </button>
        </div>

        <div class="modal-body" style="padding: 2rem">
          <form @submit.prevent="createEvent">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Название события (мин. 10 знаков) *</label>
                <input
                  type="text"
                  class="form-input"
                  v-model="newEvent.eventName"
                  placeholder="Введите название события"
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label">Игра *</label>
                <select class="form-input" v-model="newEvent.gameId" required>
                  <option value="">Выберите игру</option>
                  <option v-for="game in games" :key="game.gameId" :value="game.gameId">
                    {{ game.gameName }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Дата и время *</label>
                <input
                  type="datetime-local"
                  class="form-input"
                  v-model="newEvent.eventDatetime"
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label">Место проведения *</label>
                <input
                  type="text"
                  class="form-input"
                  v-model="newEvent.location"
                  placeholder="Укажите место проведения"
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label">Максимальное количество участников *</label>
                <input
                  type="number"
                  class="form-input"
                  v-model="newEvent.maxParticipants"
                  min="2"
                  max="50"
                  placeholder="От 2 до 50"
                  required
                />
              </div>

              <div class="form-group full-width">
                <label class="form-label">Описание события</label>
                <textarea
                  class="form-textarea"
                  v-model="newEvent.description"
                  placeholder="Опишите ваше событие, правила, особенности..."
                  rows="4"
                ></textarea>
              </div>
            </div>

            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" @click="showCreateModal = false">
                <i class="times"></i>
                Отменить
              </button>
              <button type="submit" class="btn btn-primary" :disabled="isCreating">
                <i class="plus" v-if="!isCreating"></i>
                {{ isCreating ? 'Создание...' : 'Создать событие' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import AppHeader from '@/components/ui/AppHeader.vue'
import EventsFilters from '@/components/sections/events/EventsFilters.vue'
import EventsGrid from '@/components/sections/events/EventsGrid.vue'
import { eventService, userService } from '@/api/userService'
import { useRouter } from 'vue-router'
import { userState } from '@/composables/userSession.js'
import { initUserSession } from '@/composables/userSession.js'

const router = useRouter()

const events = ref([])
const loading = ref(true)
const error = ref('')
const showCreateModal = ref(false)
const isCreating = ref(false)

const filters = ref({
  city: '',
  game: '',
  date: '',
  players: '',
  status: '',
  search: '',
})

const games = ref([])
const cities = ref([])

const newEvent = ref({
  eventName: '',
  gameId: '',
  eventDatetime: '',
  location: '',
  maxParticipants: 6,
  description: '',
})

const openModal = () => {
  if (!userState.isAuthenticated) {
    alert('Для создания события необходимо авторизоваться')
    return
  }
  showCreateModal.value = true
}

const fetchGames = async () => {
  try {
    const data = await eventService.getGames()
    games.value = Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Ошибка загрузки игр:', error)
    games.value = []
  }
}

const fetchCities = async () => {
  try {
    const data = await userService.getCities()
    cities.value = Array.isArray(data) ? data : []

    if (data && typeof data === 'object' && !Array.isArray(data)) {
      cities.value = Object.values(data)
    }
  } catch (error) {
    console.error('Ошибка загрузки городов:', error)
    cities.value = []
  }
}

async function fetchEventStats(eventId) {
  try {
    const response = await eventService.getEventStats(eventId)
    return {
      participants: response.participantsCount ?? 0,
      organizer: response.organizerName ?? 'Неизвестно',
    }
  } catch (e) {
    console.warn('Ошибка получения информации о событии', eventId, e)
    return {
      participants: 0,
      organizer: 'Неизвестно',
    }
  }
}

function checkIfUserJoined(apiEvent) {
  if (!userState.isAuthenticated) {
    return false
  }

  const currentUserId = userState.userId
  const isJoined =
    apiEvent.eventParticipants?.some((participant) => participant.userId === currentUserId) || false

  return isJoined
}

async function mapEventWithStats(apiEvent) {
  const dateObj = new Date(apiEvent.eventDatetime)
  const stats = await fetchEventStats(apiEvent.eventId)

  const isJoined = checkIfUserJoined(apiEvent)

  const participantsCount = apiEvent.eventParticipants?.length || stats.participants || 0
  const maxParticipants = apiEvent.maxParticipants || 0
  const isFull = participantsCount >= maxParticipants

  let gameName = 'Неизвестная игра'

  if (apiEvent.game && apiEvent.game.gameName) {
    gameName = apiEvent.game.gameName
  } else if (apiEvent.gameName) {
    gameName = apiEvent.gameName
  } else if (apiEvent.gameId) {
    const game = games.value.find((g) => g.gameId === apiEvent.gameId)
    if (game) {
      gameName = game.gameName
    }
  }

  return {
    id: apiEvent.eventId,
    title: apiEvent.eventName,
    game: gameName,
    gameId: apiEvent.gameId,
    date: dateObj.toLocaleDateString('ru-RU'),
    time: dateObj.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    location: apiEvent.location,
    city: apiEvent.city,
    gameType: apiEvent.gameType,
    playerCount: apiEvent.playerCount,
    status: apiEvent.status,
    participants: participantsCount,
    maxParticipants: maxParticipants,
    organizer: stats.organizer,
    description: apiEvent.description,
    players: apiEvent.eventParticipants?.map((p) => p.userName || p.name) || [],
    created: new Date(apiEvent.createdAt).toLocaleDateString('ru-RU'),
    isJoined: isJoined,
    isFull: isFull,
  }
}

const fetchEvents = async () => {
  loading.value = true
  error.value = ''
  try {
    let data = []

    if (
      filters.value.city &&
      !filters.value.game &&
      !filters.value.date &&
      !filters.value.players &&
      !filters.value.status &&
      !filters.value.search
    ) {
      data = await eventService.getEventsByCity(filters.value.city)
    } else if (hasActiveFilters()) {
      data = await eventService.filterEvents(filters.value)
    } else {
      data = await eventService.getEvents()
    }

    events.value = Array.isArray(data) ? await Promise.all(data.map(mapEventWithStats)) : []
  } catch {
    events.value = []
  } finally {
    loading.value = false
  }
}
const hasActiveFilters = () => {
  return (
    filters.value.city ||
    filters.value.game ||
    filters.value.date ||
    filters.value.players ||
    filters.value.status ||
    filters.value.search
  )
}

const createEvent = async () => {
  if (!validateEventForm()) return

  isCreating.value = true
  try {
    const currentUserId = userState.userId

    if (!currentUserId) {
      throw new Error('Пользователь не авторизован')
    }

    const eventData = {
      ...newEvent.value,
      organizerId: currentUserId,
    }

    await eventService.addEvent(eventData)

    alert('Событие успешно создано!')
    showCreateModal.value = false
    resetEventForm()
    await fetchEvents()
  } catch (error) {
    console.error('Ошибка создания события:', error)

    let errorMessage = 'Ошибка при создании события'

    if (error.response) {
      const serverError = error.response.data

      if (error.response.status === 400) {
        errorMessage = 'Некорректные данные события'
        if (serverError.errors) {
          const validationErrors = Object.values(serverError.errors).join(', ')
          errorMessage += `: ${validationErrors}`
        } else if (serverError.message) {
          errorMessage = serverError.message
        }
      } else if (error.response.status === 401) {
        errorMessage = 'Необходима авторизация'
      } else if (error.response.status === 403) {
        errorMessage = 'Недостаточно прав'
      } else if (error.response.status === 409) {
        errorMessage = 'Событие уже существует'
      } else if (error.response.status >= 500) {
        errorMessage = 'Ошибка сервера, попробуйте позже'
      }
    } else if (error.request) {
      errorMessage = 'Ошибка соединения с сервером'
    } else if (error.message) {
      errorMessage = error.message
    }

    alert(errorMessage)
  } finally {
    isCreating.value = false
  }
}
const validateEventForm = () => {
  const errors = []

  if (!newEvent.value.eventName.trim()) {
    errors.push('Введите название события')
  } else if (newEvent.value.eventName.trim().length < 3) {
    errors.push('Название события должно содержать минимум 3 символа')
  }

  if (!newEvent.value.gameId) {
    errors.push('Выберите игру')
  }

  if (!newEvent.value.eventDatetime) {
    errors.push('Укажите дату и время')
  } else {
    const selectedDate = new Date(newEvent.value.eventDatetime)
    const now = new Date()

    if (isNaN(selectedDate.getTime())) {
      errors.push('Некорректная дата события')
    } else if (selectedDate <= now) {
      errors.push('Дата события должна быть в будущем')
    } else {
      const eventYear = selectedDate.getFullYear()
      if (eventYear < 2020) {
        errors.push('Дата события не может быть раньше 2020 года')
      } else if (eventYear > 2030) {
        errors.push('Дата события не может быть позже 2030 года')
      }
    }
  }

  if (!newEvent.value.location.trim()) {
    errors.push('Укажите место проведения')
  }

  if (!newEvent.value.maxParticipants || newEvent.value.maxParticipants < 2) {
    errors.push('Максимальное количество участников должно быть не менее 2')
  } else if (newEvent.value.maxParticipants > 50) {
    errors.push('Максимальное количество участников не должно превышать 50')
  }

  if (errors.length > 0) {
    alert(errors.join('\n'))
    return false
  }

  return true
}

const resetEventForm = () => {
  newEvent.value = {
    eventName: '',
    gameId: '',
    eventDatetime: '',
    location: '',
    maxParticipants: 6,
    description: '',
  }
}

onMounted(async () => {
  initUserSession()
  console.log('Состояние пользователя после инициализации:', {
    isAuthenticated: userState.isAuthenticated,
    userId: userState.userId,
    userName: userState.userName,
  })
  await fetchGames()
  await fetchCities()
  await fetchEvents()
})

watch(filters, fetchEvents, { deep: true })

const filteredEvents = computed(() => events.value)

const handleFilterChange = (newFilters) => {
  filters.value = { ...filters.value, ...newFilters }
}

const handleSearch = (searchTerm) => {
  filters.value.search = searchTerm
}

const viewEvent = (event) => {
  router.push(`/event/${event.id}`)
}

const joinEvent = async (event) => {
  try {
    if (!userState.isAuthenticated) {
      alert('Для присоединения к событию необходимо авторизоваться')
      return
    }

    const userId = userState.userId
    if (!userId) {
      alert('Ошибка авторизации. Пожалуйста, войдите заново.')
      return
    }

    if (event.isJoined) {
      alert('Вы уже присоединились к этому событию')
      return
    }

    if (event.isFull) {
      alert('Это событие уже заполнено')
      return
    }

    const confirmed = confirm(`Вы действительно хотите присоединиться к событию "${event.title}"?`)
    if (!confirmed) return

    await eventService.joinEvent(event.id, userId)
    alert('Вы успешно присоединились к событию!')
    await fetchEvents()
  } catch (error) {
    console.error('Ошибка присоединения:', error)

    // Ошибка приходит как строка, а не как объект
    const errorText = String(error)

    console.log('Текст ошибки от сервера:', errorText)

    let errorMessage = 'Ошибка при присоединении к событию'

    if (errorText.includes('уже записан')) {
      errorMessage = 'Вы уже записаны на это событие'
    } else if (errorText.includes('максимальное количество')) {
      errorMessage = 'На это событие нет свободных мест'
    } else if (errorText.includes('не найдено')) {
      errorMessage = 'Событие не найдено'
    } else if (errorText.includes('неактивное')) {
      errorMessage = 'Нельзя записаться на неактивное событие'
    } else if (errorText.includes('Пользователь не найден')) {
      errorMessage = 'Ошибка авторизации. Пожалуйста, войдите заново.'
    } else {
      errorMessage = errorText
    }

    alert(errorMessage)
    await fetchEvents()
  }
}
</script>
<style scoped>
* {
  font-size: 18px;
}
.events-page {
  min-height: 100vh;
  background: var(--light);
  position: relative;
}

.catalog-section {
  padding: 6rem 4rem 2rem;
}

.catalog-header {
  background: white;
  border-radius: 20px;
  padding: 2.5rem 3rem;
  box-shadow: var(--shadow);
  margin-bottom: 2rem;
  position: relative;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.header-text {
  flex: 1;
}

.create-event-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
  margin-left: 2rem;
}

.catalog-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  color: var(--secondary);
}

.catalog-subtitle {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
  font-weight: 500;
}

.error {
  color: red;
  margin-bottom: 1rem;
}

.modal-overlay {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  background: rgba(0, 0, 0, 0.5) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  z-index: 10000 !important;
  padding: 20px;
  opacity: 1 !important;
  visibility: visible !important;
  backdrop-filter: none !important;
}

.modal-content {
  background: white !important;
  border-radius: 20px !important;
  width: 90% !important;
  max-width: 700px !important;
  max-height: 90vh !important;
  overflow-y: auto !important;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3) !important;
  position: relative !important;
  transform: translateY(0) !important;
  opacity: 1 !important;
}

.modal-header {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  padding: 1.5rem 2rem !important;
  border-bottom: 1px solid #e0e0e0 !important;
  background: #f8f9fa !important;
  border-radius: 20px 20px 0 0 !important;
}

.modal-header h2 {
  margin: 0 !important;
  color: var(--secondary) !important;
  font-size: 1.5rem !important;
  font-weight: 600 !important;
}

.modal-close {
  background: none !important;
  border: none !important;
  font-size: 1.2rem !important;
  cursor: pointer !important;
  color: #666 !important;
  width: 40px !important;
  height: 40px !important;
  border-radius: 50% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: all 0.3s ease !important;
}

.modal-close:hover {
  background: #e9ecef !important;
  color: #333 !important;
}

.modal-body {
  padding: 2rem !important;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--secondary);
  font-size: 0.9rem;
}

.form-input,
.form-textarea {
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  width: 100%;
  box-sizing: border-box;
  background: #fff;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary);
  background: white;
  box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  font-weight: 600;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: var(--primary);
  color: white;
  border-radius: 36.5px;
  font-size: 18px;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--primary-dark);
  transform: translateY(-1px);
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #545b62;
  transform: translateY(-1px);
}
</style>
