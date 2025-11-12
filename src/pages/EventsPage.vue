<template>
  <div class="events-page">
    <AppHeader />
    <main class="catalog-section">
      <!-- Заголовок каталога -->
      <div class="catalog-header">
        <h1 class="catalog-title">Каталог событий</h1>
        <div class="catalog-subtitle">Найдите идеальное игровое событие для себя</div>

        <!-- Фильтры -->
        <EventsFilters
          :filters="filters"
          @filter-change="handleFilterChange"
          @search="handleSearch"
        />
      </div>

      <div v-if="loading">Загрузка...</div>
      <div v-else>
        <div v-if="error" class="error">{{ error }}</div>

        <!-- Сетка событий -->
        <EventsGrid :events="filteredEvents" @view-event="viewEvent" @join-event="joinEvent" />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppHeader from '@/components/ui/AppHeader.vue'
import EventsFilters from '@/components/sections/events/EventsFilters.vue'
import EventsGrid from '@/components/sections/events/EventsGrid.vue'
import { eventService } from '@/api/userService'
import { useRouter } from 'vue-router'

const router = useRouter()

const events = ref([])
const loading = ref(true)
const error = ref('')

// Фильтры
const filters = ref({
  city: '',
  game: '',
  date: '',
  players: '',
  status: '',
  search: '',
})

// Преобразование данных события из API в нужный формат
function mapEvent(apiEvent) {
  const dateObj = new Date(apiEvent.eventDatetime)
  return {
    id: apiEvent.eventId,
    title: apiEvent.eventName,
    game: apiEvent.game,
    date: dateObj.toLocaleDateString('ru-RU'),
    time: dateObj.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    location: apiEvent.location,
    city: apiEvent.city,
    gameType: apiEvent.gameType,
    playerCount: apiEvent.playerCount,
    status: apiEvent.status,
    participants: apiEvent.eventParticipants?.length || 0,
    description: apiEvent.description,
    players: apiEvent.eventParticipants?.map((p) => p.userName) || [],
    created: new Date(apiEvent.createdAt).toLocaleDateString('ru-RU'),
  }
}

// Загрузка событий из API
onMounted(async () => {
  try {
    const data = await eventService.getEvents()
    events.value = Array.isArray(data) ? data.map(mapEvent) : []
  } catch (e) {
    error.value = 'Ошибка загрузки событий: ' + (e?.message || e)
    events.value = []
  } finally {
    loading.value = false
  }
})

// Фильтрация событий
const filteredEvents = computed(() => {
  let result = events.value

  if (filters.value.city) {
    result = result.filter((event) => event.city === filters.value.city)
  }

  if (filters.value.game) {
    result = result.filter((event) => event.gameType === filters.value.game)
  }

  if (filters.value.players) {
    result = result.filter((event) => event.playerCount === filters.value.players)
  }

  if (filters.value.status) {
    result = result.filter((event) => event.status === filters.value.status)
  }

  // Поиск по тексту
  if (filters.value.search) {
    const searchTerm = filters.value.search.toLowerCase()
    result = result.filter(
      (event) =>
        event.title.toLowerCase().includes(searchTerm) ||
        event.description.toLowerCase().includes(searchTerm) ||
        event.game.toLowerCase().includes(searchTerm),
    )
  }

  return result
})

// Обработчики событий
const handleFilterChange = (newFilters) => {
  filters.value = { ...filters.value, ...newFilters }
}

const handleSearch = (searchTerm) => {
  filters.value.search = searchTerm
}

const joinEvent = (event) => {
  if (confirm(`Вы хотите присоединиться к событию "${event.title}"?`)) {
    alert('Запрос на участие отправлен организатору!')
  }
}

const viewEvent = (event) => {
  router.push(`/event/${event.id}`)
}
</script>

<style scoped>
.events-page {
  min-height: 100vh;
  background: var(--light);
}

.catalog-section {
  padding: 6rem 4rem 2rem;
}

.catalog-header {
  top: 20px;
  background: white;
  border-radius: 20px;
  padding: 2.5rem 3rem;
  box-shadow: var(--shadow);
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
}

.catalog-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, var(--primary), var(--accent));
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

@media (max-width: 992px) {
  .catalog-title {
    font-size: 2rem;
  }

  .catalog-section {
    padding: 6rem 2rem 2rem;
  }
}

@media (max-width: 768px) {
  .catalog-section {
    padding: 5rem 1.5rem 1.5rem;
  }

  .catalog-header {
    padding: 2rem 1.5rem;
  }
}

@media (max-width: 576px) {
  .catalog-title {
    font-size: 1.8rem;
  }

  .catalog-section {
    padding: 5rem 1rem 1rem;
  }
}
</style>
