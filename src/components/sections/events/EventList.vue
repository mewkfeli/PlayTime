<template>
  <div class="events-container">
    <h2 class="page-title">События</h2>
    
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Загрузка событий...</p>
    </div>

    <div v-else>
      <div v-if="error" class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        {{ error }}
        <button class="btn-retry" @click="loadEvents">Попробовать снова</button>
      </div>

      <div v-else>
        <div v-if="events.length === 0" class="empty-state">
          <i class="fas fa-calendar-times"></i>
          <p>Нет доступных событий</p>
        </div>

        <div v-else class="event-list">
          <EventCard 
            v-for="event in paginatedEvents" 
            :key="event.id" 
            :event="event" 
            @join="joinEvent" 
          />
        </div>

        <div class="pagination-container" v-if="totalPages > 1">
          <div class="pagination">
            <button 
              class="pagination-btn pagination-prev"
              :disabled="currentPage === 1"
              @click="goToPage(currentPage - 1)"
            >
              <i class="fas fa-chevron-left"></i>
              Назад
            </button>

            <div class="pagination-pages">
              <button
                v-for="page in visiblePages"
                :key="page"
                class="pagination-page"
                :class="{ 
                  'active': page === currentPage,
                  'ellipsis': page === '...'
                }"
                @click="page !== '...' && goToPage(page)"
                :disabled="page === '...'"
              >
                {{ page }}
              </button>
            </div>

            <button 
              class="pagination-btn pagination-next"
              :disabled="currentPage === totalPages"
              @click="goToPage(currentPage + 1)"
            >
              Вперед
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { eventService } from '@/api/userService'
import EventCard from './EventCard.vue'

const events = ref([])
const loading = ref(true)
const error = ref('')
const currentPage = ref(1)
const pageSize = ref(9)

// вычиляем свойства для пагинации
const totalEvents = computed(() => events.value.length)

const totalPages = computed(() => Math.ceil(totalEvents.value / pageSize.value))

const startIndex = computed(() => (currentPage.value - 1) * pageSize.value)

const endIndex = computed(() => {
  const end = startIndex.value + pageSize.value
  return end > totalEvents.value ? totalEvents.value : end
})

const paginatedEvents = computed(() => {
  return events.value.slice(startIndex.value, endIndex.value)
})

const visiblePages = computed(() => {
  const pages = []
  const delta = 2
  
  for (let i = 1; i <= totalPages.value; i++) {
    if (
      i === 1 || 
      i === totalPages.value || 
      (i >= currentPage.value - delta && i <= currentPage.value + delta)
    ) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }
  
  return pages
})

function mapEvent(apiEvent) {
  const dateObj = new Date(apiEvent.eventDatetime)
  return {
    id: apiEvent.eventId,
    title: apiEvent.eventName,
    game: apiEvent.game,
    date: dateObj.toLocaleDateString('ru-RU'),
    time: dateObj.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    location: apiEvent.location,
    participants: apiEvent.eventParticipants?.length || 0,
    maxParticipants: apiEvent.maxParticipants || 10,
    description: apiEvent.description,
    players: apiEvent.eventParticipants?.map((p) => p.userName) || [],
    created: new Date(apiEvent.createdAt).toLocaleDateString('ru-RU'),
    organizer: apiEvent.organizer || 'Неизвестно'
  }
}

const loadEvents = async () => {
  try {
    loading.value = true
    error.value = ''
    const data = await eventService.getEvents()
    events.value = Array.isArray(data) ? data.map(mapEvent) : []
    currentPage.value = 1
  } catch (err) {
    error.value = 'Ошибка загрузки событий: ' + (err.message || 'Неизвестная ошибка')
    events.value = []
  } finally {
    loading.value = false
  }
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const joinEvent = async (event) => {
  alert(`Вы присоединились к событию: ${event.title}`)
}

onMounted(() => {
  loadEvents()
})
</script>

<style scoped>
.events-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--secondary);
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
}

.page-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: var(--primary);
  border-radius: 2px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}
.error-message {
  background: #fff5f5;
  border: 1px solid #fed7d7;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  color: #c53030;
  margin-bottom: 2rem;
}

.error-message i {
  margin-right: 0.5rem;
}

.btn-retry {
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  margin-top: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-retry:hover {
  background: var(--primary-dark);
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
}

.empty-state i {
  font-size: 4rem;
  margin-bottom: 1rem;
  color: #ccc;
}

.empty-state p {
  font-size: 1.2rem;
  margin: 0;
}

.pagination-info {
  margin-bottom: 1.5rem;
  text-align: center;
}

.pagination-stats {
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
}

.event-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.pagination {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.pagination-btn:hover:not(:disabled) {
  border-color: var(--primary);
  color: var(--primary);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-pages {
  display: flex;
  gap: 0.25rem;
}

.pagination-page {
  min-width: 44px;
  height: 44px;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.pagination-page:hover:not(:disabled) {
  border-color: var(--primary);
  color: var(--primary);
}

.pagination-page.active {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
}

.pagination-page.ellipsis {
  border: none;
  background: transparent;
  cursor: default;
}

.pagination-page.ellipsis:hover {
  background: transparent;
  color: inherit;
}

.page-size-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

.page-size-selector select {
  padding: 0.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.page-size-selector select:focus {
  outline: none;
  border-color: var(--primary);
}
</style>