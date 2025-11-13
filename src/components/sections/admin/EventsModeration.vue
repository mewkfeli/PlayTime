<template>
  <div class="events-moderation">
    <div class="page-header">
      <h1 class="page-title">Модерация событий</h1>
      <div class="page-subtitle">Управление событиями пользователей</div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">{{ events.length }}</div>
        <div class="stat-label">Всего событий</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ activeEventsCount }}</div>
        <div class="stat-label">Активных</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ canceledEventsCount }}</div>
        <div class="stat-label">Отмененных</div>
      </div>
    </div>

    <!-- Состояния загрузки и ошибок -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Загрузка событий...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <div class="error-icon">⚠️</div>
      <h2>Ошибка загрузки</h2>
      <p>{{ error }}</p>
      <button class="btn btn-primary" @click="loadEvents">Попробовать снова</button>
    </div>

    <div v-else class="events-table-container">
      <div class="table-header">
        <div class="table-stats">Найдено событий: {{ events.length }}</div>
        <div class="table-actions"></div>
      </div>

      <div class="events-table">
        <div class="table-row header-row">
          <div class="table-cell">№</div>
          <div class="table-cell">Название</div>
          <div class="table-cell">Организатор</div>
          <div class="table-cell">Дата и время</div>
          <div class="table-cell">Статус</div>
          <div class="table-cell">Действия</div>
        </div>

        <div v-if="events.length === 0" class="empty-state">
          <i class="fas fa-calendar-times"></i>
          <p>События не найдены</p>
        </div>

        <div v-else v-for="event in events" :key="event.eventId" class="table-row">
          <div class="table-cell">
            <span class="event-id">#{{ event.eventId }}</span>
          </div>

          <div class="table-cell event-name">
            <div class="event-title">{{ event.eventName }}</div>
            <div class="event-meta">
              <span class="game">{{ getGameName(event.gameId) }}</span>
              <span class="location">{{ event.location }}</span>
              <span class="participants"
                >{{ event.eventParticipants ? event.eventParticipants.length : 0 }}/{{
                  event.maxParticipants
                }}
                участ.</span
              >
            </div>
            <div v-if="event.description" class="event-description">
              {{ event.description }}
            </div>
          </div>

          <div class="table-cell">
            <span class="organizer">
              ID: {{ event.organizerId }}<br />
              <span class="organizer-name" v-if="getOrganizerName(event.organizerId)">
                ({{ getOrganizerName(event.organizerId) }})
              </span>
            </span>
          </div>

          <div class="table-cell">
            <span class="event-datetime">
              {{ formatDateTime(event.eventDatetime) }}
            </span>
          </div>

          <div class="table-cell">
            <span class="status-badge" :class="getStatusClass(event.status)">
              {{ event.status }}
            </span>
          </div>

          <div class="table-cell actions">
            <button
              v-if="event.status === 'Активно'"
              class="btn btn-cancel"
              @click="cancelEvent(event.eventId, event.eventName)"
              :disabled="cancelingEventId === event.eventId"
            >
              <i class="fas fa-ban"></i>
              {{ cancelingEventId === event.eventId ? '...' : 'Отменить' }}
            </button>
            <span v-else class="no-actions">—</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Состояния
const loading = ref(false)
const error = ref('')
const events = ref([])
const users = ref([])
const games = ref([])
const cancelingEventId = ref(null)

// Computed свойства
const activeEventsCount = computed(() => {
  return events.value.filter((event) => event.status === 'Активно').length
})

const canceledEventsCount = computed(() => {
  return events.value.filter((event) => event.status === 'Отменено').length
})

// Загрузка событий
const loadEvents = async () => {
  try {
    loading.value = true
    error.value = ''

    const response = await fetch('http://localhost:5119/api/Admin/GetEventsAdmin')

    if (!response.ok) {
      throw new Error(`Ошибка загрузки: ${response.status}`)
    }

    const data = await response.json()
    events.value = Array.isArray(data) ? data : []

    await loadUsers()
    await loadGames()
  } catch {
    error.value = 'Не удалось загрузить список событий'
  } finally {
    loading.value = false
  }
}

// Загрузка пользователей
const loadUsers = async () => {
  try {
    const response = await fetch('http://localhost:5119/api/User/GetUsers')
    if (response.ok) {
      const data = await response.json()
      users.value = Array.isArray(data) ? data : []
    }
  } catch {
    // Игнорируем ошибку загрузки пользователей
  }
}

// Загрузка игр
const loadGames = async () => {
  try {
    const response = await fetch('http://localhost:5119/api/Game/GetGames')
    if (response.ok) {
      const data = await response.json()
      games.value = Array.isArray(data) ? data : []
    }
  } catch {
    // Игнорируем ошибку загрузки игр
  }
}

// Получение имени организатора
const getOrganizerName = (organizerId) => {
  const user = users.value.find((u) => u.userId === organizerId)
  return user ? user.name : null
}

// Получение названия игры
const getGameName = (gameId) => {
  const game = games.value.find((g) => g.gameId === gameId)
  return game ? game.gameName : `Игра #${gameId}`
}

// Отмена события
const cancelEvent = async (eventId, eventTitle) => {
  const event = events.value.find((e) => e.eventId === eventId)
  if (!event) {
    return
  }

  const confirmation = confirm(
    `Вы уверены, что хотите отменить событие "${eventTitle}"?\n\nЭто действие нельзя отменить.`,
  )

  if (!confirmation) {
    return
  }

  try {
    cancelingEventId.value = eventId

    const eventData = {
      Status: 'Отменено',
      EventName: event.eventName,
      GameName: getGameName(event.gameId),
      Location: event.location,
      Description: event.description || '',
      OrganizerName: getOrganizerName(event.organizerId) || `Пользователь ${event.organizerId}`,
      OrganizerId: event.organizerId,
      GameId: event.gameId,
      EventDatetime: event.eventDatetime,
      MaxParticipants: event.maxParticipants,
    }

    const response = await fetch(`http://localhost:5119/api/Admin/CancelEvent/${eventId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    })

    if (!response.ok) {
      let errorText = 'Неизвестная ошибка'
      try {
        errorText = await response.text()
      } catch {
        errorText = `Ошибка: ${response.status}`
      }
      throw new Error(errorText)
    }

    const result = await response.text()

    // Обновляем статус события локально
    const eventIndex = events.value.findIndex((e) => e.eventId === eventId)
    if (eventIndex !== -1) {
      events.value[eventIndex].status = 'Отменено'
    }

    alert(result || 'Событие успешно отменено!')
  } catch (err) {
    try {
      const errorObj = JSON.parse(err.message)
      if (errorObj.errors) {
        const errorMessages = Object.values(errorObj.errors).flat().join('\n')
        alert(`Ошибка при отмене события:\n${errorMessages}`)
      } else {
        alert('Ошибка при отмене события: ' + errorObj.title)
      }
    } catch {
      alert('Ошибка при отмене события: ' + err.message)
    }
  } finally {
    cancelingEventId.value = null
  }
}

// Вспомогательные функции
const formatDateTime = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateString
  }
}

const getStatusClass = (status) => {
  switch (status) {
    case 'Активно':
      return 'status-active'
    case 'Отменено':
      return 'status-canceled'
    case 'Завершено':
      return 'status-completed'
    default:
      return 'status-default'
  }
}

// Инициализация
onMounted(() => {
  loadEvents()
})
</script>

<style scoped>
.events-moderation {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--secondary);
  margin: 0 0 0.5rem 0;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #666;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: var(--shadow);
  text-align: center;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #666;
  font-weight: 500;
}

.events-table-container {
  background: white;
  border-radius: 12px;
  box-shadow: var(--shadow);
  overflow: hidden;
  margin: 0 auto;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  background: #f8f9fa;
}

.table-stats {
  color: #666;
  font-weight: 500;
}

.table-actions {
  display: flex;
  gap: 1rem;
}

.events-table {
  width: 100%;
}

.table-row {
  display: grid;
  grid-template-columns: 80px 2fr 1fr 1.5fr 120px 130px;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
}

.table-row.header-row {
  background: #f8f9ff;
  font-weight: 600;
  color: var(--secondary);
  border-bottom: 2px solid #e0e0e0;
}

.table-cell {
  display: flex;
  align-items: center;
}

.event-id {
  font-weight: 600;
  color: #666;
  font-family: monospace;
  font-size: 0.9rem;
}

.event-name {
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}

.event-title {
  font-weight: 600;
  color: var(--secondary);
  font-size: 1rem;
  line-height: 1.3;
}

.event-meta {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  font-size: 0.8rem;
  color: #666;
}

.game {
  color: var(--accent);
  font-weight: 500;
}

.location {
  color: #666;
}

.participants {
  color: #888;
}

.event-description {
  font-size: 0.8rem;
  color: #666;
  line-height: 1.3;
  font-style: italic;
  margin-top: 0.3rem;
}

.organizer {
  color: #666;
  font-weight: 500;
  font-size: 0.9rem;
}

.organizer-name {
  font-size: 0.8rem;
  color: #888;
  font-style: italic;
}

.event-datetime {
  font-weight: 600;
  color: var(--secondary);
  font-size: 0.9rem;
}

.status-badge {
  padding: 0.4rem 0.6rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  text-align: center;
  display: inline-block;
  min-width: 90px;
}

.status-active {
  background: rgba(76, 175, 80, 0.1);
  color: var(--success);
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.status-canceled {
  background: rgba(244, 67, 54, 0.1);
  color: #f44336;
  border: 1px solid rgba(244, 67, 54, 0.3);
}

.status-completed {
  background: rgba(33, 150, 243, 0.1);
  color: #2196f3;
  border: 1px solid rgba(33, 150, 243, 0.3);
}

.status-default {
  background: rgba(158, 158, 158, 0.1);
  color: #9e9e9e;
  border: 1px solid rgba(158, 158, 158, 0.3);
}

.actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.8rem;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  white-space: nowrap;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-cancel {
  background: rgba(244, 67, 54, 0.1);
  color: #f44336;
  border: 1px solid rgba(244, 67, 54, 0.3);
}

.btn-cancel:hover:not(:disabled) {
  background: rgba(244, 67, 54, 0.2);
  transform: translateY(-1px);
}

.no-actions {
  color: #999;
  font-style: italic;
  font-size: 0.9rem;
}

.empty-state {
  padding: 3rem;
  text-align: center;
  color: #666;
  grid-column: 1 / -1;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #ccc;
}

/* Состояния загрузки */
.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  text-align: center;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-container h2 {
  color: var(--secondary);
  margin-bottom: 1rem;
}

.error-container p {
  color: #666;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .events-moderation {
    padding: 1rem;
  }

  .table-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    padding: 1rem;
  }

  .table-row.header-row {
    display: none;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .table-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}

@media (max-width: 1200px) {
  .events-table-container {
    overflow-x: auto;
  }
}
</style>
