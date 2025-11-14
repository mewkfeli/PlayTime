<template>
  <div class="user-events-section">
    <div class="section-header">
      <h2 class="section-title">
        Предстоящие события
      </h2>
      <div class="events-count">
        {{ events.length }} событий
      </div>
    </div>

    <!-- Состояние загрузки -->
    <div v-if="isLoading" class="loading-state">
      <i class="fas fa-spinner fa-spin"></i>
      <p>Загрузка ваших событий...</p>
    </div>

    <!-- Состояние ошибки -->
    <div v-else-if="error" class="error-state">
      <i class="fas fa-exclamation-triangle"></i>
      <p>{{ error }}</p>
      <button class="btn btn-retry" @click="loadUserEvents">
        <i class="fas fa-redo"></i>
        Попробовать снова
      </button>
    </div>

    <!-- Состояние пустого списка -->
    <div v-else-if="events.length === 0" class="empty-state">
      <i class="fas fa-calendar-times"></i>
      <h3>Вы еще не записаны ни на одно событие</h3>
      <p>Найдите интересные события и присоединяйтесь!</p>
      <router-link to="/events" class="btn btn-primary">
        <i class="fas fa-search"></i>
        Найти события
      </router-link>
    </div>

    <!-- Список событий -->
    <div v-else class="events-grid">
      <div 
        v-for="event in events" 
        :key="event.eventId" 
        class="event-card"
        @click="viewEventDetails(event.eventId)"
      >
        <div class="event-header">
          <h3 class="event-title">{{ event.eventName }}</h3>
          <span class="event-status" :class="getStatusClass(event.status)">
            {{ event.status }}
          </span>
        </div>

        <div class="event-details">
          <div class="event-info">
            <div class="info-item">
              <i class="fas fa-gamepad"></i>
              <span>{{ event.gameName }}</span>
            </div>
            <div class="info-item">
              <i class="fas fa-user"></i>
              <span>Организатор: {{ event.organizerName }}</span>
            </div>
            <div class="info-item">
              <i class="fas fa-map-marker-alt"></i>
              <span>{{ event.location }}</span>
            </div>
            <div class="info-item">
              <i class="fas fa-clock"></i>
              <span>{{ formatDateTime(event.eventDateTime) }}</span>
            </div>
            <div class="info-item">
              <i class="fas fa-users"></i>
              <span>Участников: {{ event.maxParticipants }}</span>
            </div>
          </div>

          <div class="event-description">
            <p>{{ event.description || 'Описание отсутствует' }}</p>
          </div>
        </div>

        <div class="event-actions">
          <button 
            class="btn btn-outline"
            @click.stop="leaveEvent(event.eventId)"
            :disabled="isLeaving"
          >
            <i class="fas fa-sign-out-alt"></i>
            Покинуть событие
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { userState } from '@/composables/userSession'
import { eventApi } from '@/api/axios'

const events = ref([])
const isLoading = ref(false)
const error = ref('')
const isLeaving = ref(false)
const router = useRouter()

// Загрузка событий пользователя
const loadUserEvents = async () => {
  if (!userState.isAuthenticated || !userState.userId) {
    error.value = 'Пользователь не авторизован'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    console.log('Загрузка событий для пользователя:', userState.userId)
    
    // Используем правильный endpoint - без префикса /Event, так как он уже в baseURL
    const response = await eventApi.get(`/GetEventByUser/${userState.userId}`)
    
    console.log('Получены события:', response.data)
    events.value = Array.isArray(response.data) ? response.data : []
    
  } catch (err) {
    console.error('Ошибка загрузки событий пользователя:', err)
    
    if (err.response?.status === 404) {
      events.value = []
      error.value = ''
    } else if (err.response?.data) {
      // Обрабатываем ошибку из интерцептора
      error.value = typeof err === 'string' ? err : 'Не удалось загрузить ваши события'
    } else {
      error.value = 'Не удалось загрузить ваши события. Проверьте подключение к интернету.'
    }
  } finally {
    isLoading.value = false
  }
}

// Покинуть событие
const leaveEvent = async (eventId) => {
  if (!confirm('Вы уверены, что хотите покинуть это событие?')) {
    return
  }

  isLeaving.value = true

  try {
    await eventApi.delete(`/RemoveParticipant?eventId=${eventId}&userId=${userState.userId}`)

    // Удаляем событие из списка
    events.value = events.value.filter(event => event.eventId !== eventId)
    
    alert('Вы успешно покинули событие')
    
  } catch (err) {
    console.error('Ошибка при выходе из события:', err)
    
    const errorMessage = typeof err === 'string' ? err : 'Не удалось покинуть событие. Попробуйте позже.'
    alert(errorMessage)
  } finally {
    isLeaving.value = false
  }
}

// Просмотр деталей события
const viewEventDetails = (eventId) => {
  router.push(`/events/${eventId}`)
}

// Форматирование даты и времени
const formatDateTime = (dateTimeString) => {
  try {
    const date = new Date(dateTimeString)
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateTimeString
  }
}

// Получение класса для статуса
const getStatusClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'активно':
      return 'status-active'
    case 'завершено':
      return 'status-completed'
    case 'отменено':
      return 'status-cancelled'
    default:
      return 'status-default'
  }
}

onMounted(() => {
  loadUserEvents()
})
</script>

<style scoped>
.user-events-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin: 2rem 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 1200px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--light);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--dark);
  margin: 0;
  font-size: 1.5rem;
}

.events-count {
  background: var(--primary);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

/* Состояния */
.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  color: var(--gray);
}

.loading-state i,
.error-state i,
.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--primary);
}

.error-state i {
  color: #dc3545;
}

.empty-state i {
  color: var(--gray);
}

.btn-retry {
  background: var(--primary);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1rem;
}

.btn-retry:hover {
  background: var(--primary-dark);
}

/* Сетка событий */
.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.event-card {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.event-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: var(--primary);
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.event-title {
  margin: 0;
  color: var(--dark);
  font-size: 1.2rem;
  line-height: 1.3;
  flex: 1;
  margin-right: 1rem;
}

.event-status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
}

.status-active {
  background: #d4edda;
  color: #155724;
}

.status-completed {
  background: #e2e3e5;
  color: #383d41;
}

.status-cancelled {
  background: #f8d7da;
  color: #721c24;
}

.status-default {
  background: #fff3cd;
  color: #856404;
}

.event-details {
  flex: 1;
  margin-bottom: 1.5rem;
}

.event-info {
  margin-bottom: 1rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: var(--gray);
  font-size: 0.9rem;
}

.info-item i {
  width: 16px;
  color: var(--primary);
}

.event-description {
  border-top: 1px solid #f8f9fa;
  padding-top: 1rem;
}

.event-description p {
  margin: 0;
  color: var(--gray);
  font-size: 0.9rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.event-actions {
  margin-top: auto;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  justify-content: center;
}

.btn-outline {
  background: transparent;
  color: #dc3545;
  border: 2px solid #dc3545;
  width: 100%;
}

.btn-outline:hover:not(:disabled) {
  background: #dc3545;
  color: white;
}

.btn-outline:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--primary);
  color: white;
  border: none;
}

.btn-primary:hover {
  background: var(--primary-dark);
}

/* Адаптивность */
@media (max-width: 768px) {
  .user-events-section {
    padding: 1.5rem;
    margin: 1rem 0;
  }

  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .events-grid {
    grid-template-columns: 1fr;
  }

  .event-header {
    flex-direction: column;
    gap: 0.5rem;
  }

  .event-title {
    margin-right: 0;
  }
}
</style>