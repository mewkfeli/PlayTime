<template>
  <div class="user-created-events-section">
    <div class="section-header">
      <h2 class="section-title">
        <i class="fas fa-calendar-plus"></i>
        Мои созданные события
      </h2>
      <div class="events-count">
        {{ events.length }} событий
      </div>
    </div>

    <div v-if="isLoading" class="loading-state">
      <i class="fas fa-spinner fa-spin"></i>
      <p>Загрузка ваших созданных событий...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <i class="fas fa-exclamation-triangle"></i>
      <p>{{ error }}</p>
    </div>

    <div v-else-if="events.length === 0" class="empty-state">
      <i class="fas fa-calendar-plus"></i>
      <h3>Вы еще не создали ни одного события</h3>
      <p>Создайте свое первое событие и пригласите других участников!</p>
      <router-link to="/create-event" class="btn btn-primary">
        <i class="fas fa-plus"></i>
        Создать событие
      </router-link>
    </div>

    <div v-else class="events-grid">
      <div 
        v-for="event in events" 
        :key="event.eventId" 
        class="event-card"
        :class="{ 'event-cancelled': event.status === 'Отменено' }"
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
            v-if="event.status === 'Активно'"
            class="btn btn-cancel"
            @click="cancelEvent(event.eventId)"
            :disabled="isCancelling"
          >
            <i class="fas fa-times"></i>
            Отменить событие
          </button>
          <span v-else class="cancelled-text">
            <i class="fas fa-ban"></i>
            Событие отменено
          </span>
        </div>
      </div>
    </div>

    <div v-if="showCancelModal" class="modal-overlay-two">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Отмена события</h3>
          <button class="modal-close" @click="showCancelModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <p>Вы уверены, что хотите отменить событие <strong>"{{ selectedEvent?.eventName }}"</strong>?</p>
          <p class="warning-text">
            <i class="fas fa-exclamation-triangle"></i>
            Это действие нельзя отменить. Все участники будут уведомлены об отмене.
          </p>
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="showCancelModal = false">
            <i class="fas fa-arrow-left"></i>
            Вернуться
          </button>
          <button class="btn btn-danger" @click="confirmCancel" :disabled="isCancelling">
            <i class="fas fa-times"></i>
            {{ isCancelling ? 'Отмена...' : 'Да, отменить событие' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { userState } from '@/composables/userSession'
import { eventService } from '@/api/userService'

const events = ref([])
const isLoading = ref(false)
const error = ref('')
const isCancelling = ref(false)
const showCancelModal = ref(false)
const selectedEvent = ref(null)

const loadCreatedEvents = async () => {
  if (!userState.isAuthenticated || !userState.userId) {
    error.value = 'Пользователь не авторизован'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    const response = await eventService.getUserCreatedEvents(userState.userId)
    events.value = Array.isArray(response) ? response : []
  } catch (err) {
    console.error('Ошибка загрузки созданных событий:', err)
    error.value = typeof err === 'string' ? err : 'Не удалось загрузить ваши созданные события'
  } finally {
    isLoading.value = false
  }
}

const cancelEvent = (eventId) => {
  console.log('Отмена события:', eventId)
  selectedEvent.value = events.value.find(event => event.eventId === eventId)
  showCancelModal.value = true
}

const confirmCancel = async () => {
  if (!selectedEvent.value) return

  isCancelling.value = true

  try {
    console.log('Подтверждение отмены события:', selectedEvent.value.eventId)
    
    await eventService.cancelEvent(selectedEvent.value.eventId)

    const eventIndex = events.value.findIndex(event => event.eventId === selectedEvent.value.eventId)
    if (eventIndex !== -1) {
      events.value[eventIndex].status = 'Отменено'
    }

    showCancelModal.value = false
    selectedEvent.value = null
    
    alert('Событие успешно отменено')
    
  } catch (err) {
    console.error('Ошибка при отмене события:', err)
    const errorMessage = typeof err === 'string' ? err : 'Не удалось отменить событие'
    alert(errorMessage)
  } finally {
    isCancelling.value = false
  }
}

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
  loadCreatedEvents()
})
</script>

<style scoped>
.user-created-events-section {
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
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.event-card:not(.event-cancelled):hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: var(--primary);
}

.event-cancelled {
  opacity: 0.7;
  background-color: #f8f9fa;
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

.btn-cancel {
  background: transparent;
  color: #dc3545;
  border: 2px solid #dc3545;
  width: 100%;
}

.btn-cancel:hover:not(:disabled) {
  background: #dc3545;
  color: white;
}

.btn-cancel:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-danger {
  background: #dc3545;
  color: white;
  border: none;
}

.btn-danger:hover:not(:disabled) {
  background: #c82333;
}

.btn-secondary {
  background: #6c757d;
  color: white;
  border: none;
}

.btn-secondary:hover {
  background: #545b62;
}

.cancelled-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6c757d;
  font-style: italic;
  justify-content: center;
  padding: 0.75rem;
}

/* Модальное окно */
.modal-overlay-two {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h3 {
  margin: 0;
  color: var(--dark);
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #6c757d;
  padding: 0.5rem;
}

.modal-close:hover {
  color: var(--dark);
}

.modal-body {
  margin-bottom: 2rem;
}

.modal-body p {
  margin-bottom: 1rem;
  line-height: 1.5;
}

.warning-text {
  color: #856404;
  background: #fff3cd;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #ffeaa7;
}

.warning-text i {
  margin-right: 0.5rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

/* Адаптивность */
@media (max-width: 768px) {
  .user-created-events-section {
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

  .modal-actions {
    flex-direction: column;
  }

  .modal-content {
    padding: 1.5rem;
  }
}
</style>