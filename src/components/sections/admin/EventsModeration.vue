<template>
  <div class="events-moderation">
    <div class="page-header">
      <h1 class="page-title">Модерация событий</h1>
      <div class="page-subtitle">Управление событиями пользователей</div>
    </div>

    <div class="report-section">
      <div class="report-header">
        <h2>Генерация отчета</h2>
        <p>Сформируйте отчет о проведенных мероприятиях за выбранный период</p>
      </div>

      <div class="report-controls">
        <div class="date-inputs">
          <div class="input-group">
            <label for="start-date">Дата начала:</label>
            <input id="start-date" type="date" v-model="reportStartDate" class="date-input">
          </div>
          <div class="input-group">
            <label for="end-date">Дата окончания:</label>
            <input id="end-date" type="date" v-model="reportEndDate" class="date-input">
          </div>
        </div>

        <div class="report-actions">
          <button class="btn btn-primary" @click="generateReport" :disabled="generatingReport">
            <i class="fas fa-chart-bar"></i>
            {{ generatingReport ? 'Формирование...' : 'Сформировать отчет' }}
          </button>

          <button v-if="reportData" class="btn btn-success" @click="downloadWordReport" :disabled="downloadingReport">
            <i class="fas fa-download"></i>
            {{ downloadingReport ? 'Скачивание...' : 'Скачать Word' }}
          </button>
        </div>
      </div>

      <div v-if="reportData" class="report-preview">
        <h3>Предпросмотр отчета</h3>
        <div class="preview-content">
          <div class="preview-section">
            <h4>Основные показатели</h4>
            <div class="preview-stats">
              <div class="preview-stat">
                <span class="stat-label">Общее количество мероприятий:</span>
                <span class="stat-value">{{ reportData.totalEvents }}</span>
              </div>
              <div class="preview-stat">
                <span class="stat-label">Среднее кол-во игроков:</span>
                <span class="stat-value">{{ reportData.averagePlayers }}</span>
              </div>
            </div>
          </div>

          <div class="preview-section">
            <h4>Статусы мероприятий</h4>
            <div class="preview-stats">
              <div class="preview-stat">
                <span class="stat-label">Успешно проведено:</span>
                <span class="stat-value">{{ reportData.statusStats.completed }}</span>
              </div>
              <div class="preview-stat">
                <span class="stat-label">Отменено:</span>
                <span class="stat-value">{{ reportData.statusStats.cancelled }}</span>
              </div>
              <div class="preview-stat">
                <span class="stat-label">Активно:</span>
                <span class="stat-value">{{ reportData.statusStats.active }}</span>
              </div>
            </div>
          </div>

          <div class="preview-section">
            <h4>Топ 5 городов</h4>
            <ol class="top-list">
              <li v-for="(city, index) in reportData.topCities" :key="index">
                {{ city.cityName }} ({{ city.eventCount }} мероприятий)
              </li>
              <li v-if="reportData.topCities.length === 0" class="no-data">Нет данных</li>
            </ol>
          </div>

          <div class="preview-section">
            <h4>Топ 5 игр</h4>
            <ol class="top-list">
              <li v-for="(game, index) in reportData.topGames" :key="index">
                {{ game.gameName }} ({{ game.eventCount }} мероприятий)
              </li>
              <li v-if="reportData.topGames.length === 0" class="no-data">Нет данных</li>
            </ol>
          </div>
        </div>
      </div>
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

    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Загрузка событий...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <h2>Ошибка загрузки</h2>
      <p>{{ error }}</p>
      <button class="btn btn-primary" @click="loadEvents">Попробовать снова</button>
    </div>

    <div v-else class="events-table-container">
      <div class="table-header">
        <div class="table-stats">Найдено событий: {{ filteredEvents.length }}</div>
        <div class="table-actions">
          <div class="filter-group">
            <label for="status-filter" class="filter-label">Статус:</label>
            <select id="status-filter" v-model="selectedStatus" class="status-filter">
              <option value="all">Все статусы</option>
              <option value="Активно">Активно</option>
              <option value="Отменено">Отменено</option>
              <option value="Закончено">Завершено</option>
            </select>
          </div>
        </div>
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

        <div v-if="filteredEvents.length === 0" class="empty-state">
          <i class="fas fa-calendar-times"></i>
          <p>События не найдены</p>
          <p v-if="selectedStatus !== 'all'" class="empty-state-hint">
            Попробуйте выбрать другой статус
          </p>
        </div>

        <div v-else v-for="event in filteredEvents" :key="event.eventId" class="table-row">
          <div class="table-cell">
            <span class="event-id">#{{ event.eventId }}</span>
          </div>

          <div class="table-cell event-name">
            <div class="event-title">{{ event.eventName }}</div>
            <div class="event-meta">
              <span class="game">{{ getGameName(event.gameId) }}</span>
              <span class="location">{{ event.location }}</span>
              <span class="participants">{{ event.eventParticipants ? event.eventParticipants.length : 0 }}/{{
                event.maxParticipants
                }}
                участ.</span>
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
            <button v-if="event.status === 'Активно'" class="btn btn-cancel"
              @click="cancelEvent(event.eventId, event.eventName)" :disabled="cancelingEventId === event.eventId">
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

const loading = ref(false)
const error = ref('')
const events = ref([])
const users = ref([])
const games = ref([])
const cancelingEventId = ref(null)
const selectedStatus = ref('all')

const reportStartDate = ref('')
const reportEndDate = ref('')
const reportData = ref(null)
const generatingReport = ref(false)
const downloadingReport = ref(false)

const initializeDates = () => {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 30)

  reportEndDate.value = endDate.toISOString().split('T')[0]
  reportStartDate.value = startDate.toISOString().split('T')[0]
}


const generateReport = async () => {
  if (!reportStartDate.value || !reportEndDate.value) {
    alert('Пожалуйста, выберите даты начала и окончания периода')
    return
  }

  try {
    generatingReport.value = true
    error.value = ''

    const params = new URLSearchParams({
      startDate: reportStartDate.value,
      endDate: reportEndDate.value
    })

    console.log('Запрос отчета с параметрами:', params.toString())

    const response = await fetch(`http://localhost:5119/api/Admin/GenerateEventsReport?${params}`)

    if (!response.ok) {
      throw new Error(`Ошибка генерации отчета: ${response.status}`)
    }

    const data = await response.json()
    console.log('Получены данные отчета:', data)
    reportData.value = data
  } catch (err) {
    error.value = 'Не удалось сгенерировать отчет'
    console.error('Ошибка при генерации отчета:', err)
    alert('Ошибка при генерации отчета: ' + err.message)
  } finally {
    generatingReport.value = false
  }
}

const downloadWordReport = async () => {
  if (!reportData.value) return

  try {
    downloadingReport.value = true

    const requestData = {
      reportData: reportData.value,
      startDate: reportStartDate.value,
      endDate: reportEndDate.value
    }

    const response = await fetch('http://localhost:5119/api/Admin/DownloadEventsReport', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Ошибка скачивания: ${response.status} - ${errorText}`)
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url

    const fileName = `Отчет_мероприятия_${reportStartDate.value}_${reportEndDate.value}.docx`
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

  } catch (err) {
    console.error('Ошибка при скачивании отчета:', err)
    alert('Ошибка при скачивании отчета: ' + err.message)
  } finally {
    downloadingReport.value = false
  }
}

const filteredEvents = computed(() => {
  let filtered = events.value

  if (selectedStatus.value !== 'all') {
    filtered = filtered.filter(event => event.status === selectedStatus.value)
  }

  return filtered.sort((a, b) => {
    const dateA = new Date(a.eventDatetime)
    const dateB = new Date(b.eventDatetime)
    return dateB - dateA
  })
})

const activeEventsCount = computed(() => {
  return events.value.filter((event) => event.status === 'Активно').length
})

const canceledEventsCount = computed(() => {
  return events.value.filter((event) => event.status === 'Отменено').length
})

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

const loadUsers = async () => {
  try {
    const response = await fetch('http://localhost:5119/api/User/GetUsers')
    if (response.ok) {
      const data = await response.json()
      users.value = Array.isArray(data) ? data : []
    }
  } catch {
    // заглушка
  }
}

const loadGames = async () => {
  try {
    const response = await fetch('http://localhost:5119/api/Game/GetGames')
    if (response.ok) {
      const data = await response.json()
      games.value = Array.isArray(data) ? data : []
    }
  } catch {
    // заглушка
  }
}

const getOrganizerName = (organizerId) => {
  const user = users.value.find((u) => u.userId === organizerId)
  return user ? user.name : null
}

const getGameName = (gameId) => {
  const game = games.value.find((g) => g.gameId === gameId)
  return game ? game.gameName : `Игра #${gameId}`
}

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
        errorText = `${response.status}`
      }
      throw new Error(errorText)
    }

    const result = await response.text()

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
    case 'Закончено':
      return 'status-completed'
    default:
      return 'status-default'
  }
}

onMounted(() => {
  loadEvents()
  initializeDates()
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

.report-section {
  background: white;
  border-radius: 12px;
  box-shadow: var(--shadow);
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.report-header {
  margin-bottom: 1.5rem;
}

.report-header h2 {
  color: var(--secondary);
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
}

.report-header p {
  color: #666;
  margin: 0;
}

.report-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.date-inputs {
  display: flex;
  gap: 2rem;
  align-items: end;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  font-weight: 500;
  color: #666;
  font-size: 0.9rem;
}

.date-input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  min-width: 200px;
}

.date-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(var(--primary-rgb), 0.1);
}

.report-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
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

.btn-primary {
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 36.2px;
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-dark);
  transform: translateY(-1px);
}

.btn-success {
  color: white;
  border: none;
}

.btn-success:hover:not(:disabled) {
  background: #45a049;
  transform: translateY(-1px);
}

.report-preview {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;
}

.report-preview h3 {
  color: var(--secondary);
  margin-bottom: 1rem;
}

.preview-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.preview-section {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
}

.preview-section h4 {
  color: var(--secondary);
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
}

.preview-stats {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.preview-stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e0e0e0;
}

.preview-stat:last-child {
  border-bottom: none;
}

.stat-label {
  color: #666;
  font-weight: 500;
}

.stat-value {
  color: var(--primary);
  font-weight: 600;
  font-size: 1.1rem;
}

.top-list {
  margin: 0;
  padding-left: 1.5rem;
}

.top-list li {
  margin-bottom: 0.5rem;
  color: #333;
}

.no-data {
  color: #999;
  font-style: italic;
}

/* Существующие стили */
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

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-label {
  font-weight: 500;
  color: #666;
  font-size: 0.9rem;
}

.status-filter {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  font-size: 0.9rem;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;
}

.status-filter:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(var(--primary-rgb), 0.1);
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

.btn-cancel {
  background: rgba(244, 67, 54, 0.1);
  color: #f44336;
  border: 1px solid rgba(244, 67, 54, 0.3);
  border-radius: 36.2px;
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

.empty-state-hint {
  font-size: 0.9rem;
  color: #999;
  margin-top: 0.5rem;
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

  .filter-group {
    width: 100%;
  }

  .status-filter {
    flex: 1;
    min-width: auto;
  }

  .date-inputs {
    flex-direction: column;
    gap: 1rem;
  }

  .date-input {
    min-width: auto;
    width: 100%;
  }

  .report-actions {
    flex-direction: column;
  }

  .preview-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1200px) {
  .events-table-container {
    overflow-x: auto;
  }
}
</style>
