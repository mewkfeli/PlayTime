<template>
  <div class="events-page">
    <AppHeader />
    <main class="catalog-section">
      <div class="catalog-header">
        <h1 class="catalog-title">Каталог событий</h1>
        <div class="catalog-subtitle">Найдите идеальное игровое событие для себя</div>

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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import AppHeader from '@/components/ui/AppHeader.vue'
import EventsFilters from '@/components/sections/events/EventsFilters.vue'
import EventsGrid from '@/components/sections/events/EventsGrid.vue'
import { eventService, userService } from '@/api/userService'
import { useRouter } from 'vue-router'

const router = useRouter()

const events = ref([])
const loading = ref(true)
const error = ref('')

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

const fetchGames = async () => {
  try {
    console.log('Загрузка игр...')
    const data = await eventService.getGames()
    console.log('Игры загружены:', data)
    games.value = Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Ошибка загрузки игр:', error)
    games.value = []
  }
}

const fetchCities = async () => {
  try {
    console.log('Загрузка городов...')
    const data = await userService.getCities()
    console.log('Города загружены:', data)
    cities.value = Array.isArray(data) ? data : []

    if (data && typeof data === 'object' && !Array.isArray(data)) {
      console.log('Данные пришли как объект, преобразуем в массив:', data)
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

async function mapEventWithStats(apiEvent) {
  const dateObj = new Date(apiEvent.eventDatetime)
  const stats = await fetchEventStats(apiEvent.eventId)
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
    participants: stats.participants,
    maxParticipants: apiEvent.maxParticipants,
    organizer: stats.organizer,
    description: apiEvent.description,
    players: apiEvent.eventParticipants?.map((p) => p.userName) || [],
    created: new Date(apiEvent.createdAt).toLocaleDateString('ru-RU'),
  }
}

// Загрузка событий с сервера по фильтрам
const fetchEvents = async () => {
  loading.value = true
  error.value = ''
  try {
    let data = []
    console.log('Фильтры для запроса:', filters.value)
    if (
      filters.value.city &&
      !filters.value.game &&
      !filters.value.date &&
      !filters.value.players &&
      !filters.value.status &&
      !filters.value.search
    ) {
      data = await eventService.getEventsByCity(filters.value.city)
    } else {
      data = await eventService.filterEvents(filters.value)
    }
    events.value = Array.isArray(data) ? await Promise.all(data.map(mapEventWithStats)) : []
  } catch (e) {
    error.value = 'Ошибка загрузки событий: ' + (e?.message || e)
    events.value = []
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  console.log('Компонент монтируется...')
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
  z-index: 1;
}

.catalog-header select,
.catalog-header .dropdown,
.catalog-header .v-select,
.catalog-header .el-select,
.catalog-header .custom-select {
  z-index: 10 !important;
  position: relative;
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
</style>
