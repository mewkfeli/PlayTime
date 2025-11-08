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

      <!-- Сетка событий -->
      <EventsGrid :events="filteredEvents" @view-event="viewEvent" @join-event="joinEvent" />

      <!-- Пагинация -->
      <EventsPagination
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-change="changePage"
      />
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppHeader from '@/components/ui/AppHeader.vue'
import EventsFilters from '@/components/sections/events/EventsFilters.vue'
import EventsGrid from '@/components/sections/events/EventsGrid.vue'
import EventsPagination from '@/components/sections/events/EventsPagination.vue'

// Данные событий
const events = ref([
  {
    id: 1,
    title: 'Вечер настольных игр',
    game: 'Колонизаторы',
    date: '15.11.2025',
    time: '18:30 - 21:30',
    location: 'Кафе "Игровая зона", ул. Центральная, 15',
    players: ['АП', 'МС', '+2'],
    participants: '4/6',
    description:
      'Приглашаю всех любителей настольных игр на вечернюю сессию по классической игре "Колонизаторы". Отличная возможность провести время в приятной компании и насладиться стратегической игрой.',
    city: 'ufa',
    gameType: 'catan',
    playerCount: '4-6',
    status: 'open',
  },
  {
    id: 2,
    title: 'Турнир по Мафии',
    game: 'Мафия',
    date: '18.11.2025',
    time: '19:00 - 22:00',
    location: 'Коворкинг "Пространство", пр. Ленина, 45',
    players: ['ИП', 'ОК', 'СМ', '+5'],
    participants: '8/12',
    description:
      'Организую турнир по Мафии для всех желающих. Будем играть в несколько раундов с разными составами игроков. Призы для победителей! Отличная возможность проявить свои актерские способности.',
    city: 'ufa',
    gameType: 'mafia',
    playerCount: '6+',
    status: 'open',
  },
  {
    id: 3,
    title: 'Игровой вечер в парке',
    game: 'Каркассон',
    date: '20.11.2025',
    time: '15:00 - 18:00',
    location: 'Центральный парк, главная аллея',
    players: ['ДК', '+1'],
    participants: '2/5',
    description:
      'Приглашаю на игровую сессию в парке. Будем играть в Каркассон на свежем воздухе. Отличная возможность совместить игру и прогулку. Приносите пледы и хорошее настроение!',
    city: 'ufa',
    gameType: 'carcassonne',
    playerCount: '2-4',
    status: 'open',
  },
  {
    id: 4,
    title: 'Ночной Манчкин',
    game: 'Манчкин',
    date: '22.11.2025',
    time: '20:00 - 23:30',
    location: 'Антикафе "Время игр", ул. Геймерская, 12',
    players: ['АР', 'ЕС', 'МВ', '+3'],
    participants: '6/8',
    description:
      'Ночная сессия по Манчкину с расширениями. Приносите свои колоды и хорошее настроение! Будет весело и безумно. Кофе и чай предоставляются. Приготовьтесь к эпическим сражениям!',
    city: 'ufa',
    gameType: 'munchkin',
    playerCount: '6+',
    status: 'open',
  },
])

// Фильтры
const filters = ref({
  city: '',
  game: '',
  date: '',
  players: '',
  status: '',
})

// Пагинация
const currentPage = ref(1)
const itemsPerPage = 6
const totalPages = computed(() => Math.ceil(filteredEvents.value.length / itemsPerPage))

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
  currentPage.value = 1
}

const handleSearch = (searchTerm) => {
  filters.value.search = searchTerm
  currentPage.value = 1
}

const viewEvent = (event) => {
  alert(`Просмотр события: ${event.title}`)
  //  переход на страницу события
}

const joinEvent = (event) => {
  if (confirm(`Вы хотите присоединиться к событию "${event.title}"?`)) {
    alert('Запрос на участие отправлен организатору!')
  }
}

const changePage = (page) => {
  currentPage.value = page
}

onMounted(() => {
  console.log('Events page mounted')
})
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
