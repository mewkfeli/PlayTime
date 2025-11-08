<template>
  <div class="event-detail-page">
    <AppHeader />

    <div class="container">
      <section class="event-section" v-if="event">
        <!-- Заголовок события -->
        <div class="event-header">
          <h1 class="event-title">{{ event.title }}</h1>
          <div class="event-game">{{ event.game }}</div>

          <!-- Мета-информация -->
          <div class="event-meta">
            <div class="meta-item">
              <div class="meta-icon">
                <i class="fas fa-user"></i>
              </div>
              <div class="meta-content">
                <h3>Организатор</h3>
                <p>{{ event.organizer }}</p>
              </div>
            </div>

            <div class="meta-item">
              <div class="meta-icon">
                <i class="fas fa-calendar-alt"></i>
              </div>
              <div class="meta-content">
                <h3>Дата и время</h3>
                <p>{{ event.date }}, {{ event.time }}</p>
              </div>
            </div>

            <div class="meta-item">
              <div class="meta-icon">
                <i class="fas fa-map-marker-alt"></i>
              </div>
              <div class="meta-content">
                <h3>Место проведения</h3>
                <p>{{ event.location }}</p>
              </div>
            </div>

            <div class="meta-item">
              <div class="meta-icon">
                <i class="fas fa-calendar-plus"></i>
              </div>
              <div class="meta-content">
                <h3>Дата создания</h3>
                <p>{{ event.createdDate }}</p>
              </div>
            </div>

            <div class="meta-item">
              <div class="meta-icon">
                <i class="fas fa-users"></i>
              </div>
              <div class="meta-content">
                <h3>Участники</h3>
                <p>{{ event.participants.current }} из {{ event.participants.max }} мест занято</p>
              </div>
            </div>

            <div class="meta-item">
              <div class="meta-icon">
                <i class="fas fa-clock"></i>
              </div>
              <div class="meta-content">
                <h3>Продолжительность</h3>
                <p>{{ event.duration }}</p>
              </div>
            </div>
          </div>

          <!-- Кнопки действий -->
          <div class="header-actions">
            <button class="btn" @click="joinEvent" v-if="!isJoined && !isOrganizer">
              <i class="fas fa-user-plus"></i> Присоединиться к событию
            </button>
            <button class="btn btn-outline" @click="leaveEvent" v-if="isJoined && !isOrganizer">
              <i class="fas fa-user-minus"></i> Покинуть событие
            </button>
            <button class="btn btn-secondary" @click="editEvent" v-if="isOrganizer">
              <i class="fas fa-edit"></i> Редактировать событие
            </button>
            <button class="btn btn-outline" @click="shareEvent">
              <i class="fas fa-share-alt"></i> Поделиться
            </button>
          </div>
        </div>

        <!-- Основной контент -->
        <div class="event-content">
          <div class="main-content">
            <!-- Описание события -->
            <div class="content-card">
              <h2 class="card-title"><i class="fas fa-info-circle"></i> О событии</h2>
              <div class="event-description" v-html="formattedDescription"></div>
            </div>

            <!-- Участники -->
            <div class="content-card">
              <h2 class="card-title">
                <i class="fas fa-users"></i> Участники ({{ event.participants.current }}/{{
                  event.participants.max
                }})
              </h2>
              <div class="players-grid">
                <div
                  v-for="player in displayedPlayers"
                  :key="player.id"
                  class="player-card"
                  :class="{ organizer: player.isOrganizer }"
                >
                  <div class="player-avatar">{{ player.avatar }}</div>
                  <div class="player-name">{{ player.name }}</div>
                  <div class="player-status" :class="getStatusClass(player)">
                    {{ getStatusText(player) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="sidebar">
            <!-- Местоположение -->
            <div class="content-card">
              <h2 class="card-title"><i class="fas fa-map-marked-alt"></i> Местоположение</h2>
              <div class="map-container">
                <i class="fas fa-map-marker-alt"></i>
                <span>{{ event.location }}</span>
              </div>
              <button class="btn btn-outline btn-small" style="margin-top: 1rem; width: 100%">
                <i class="fas fa-directions"></i> Построить маршрут
              </button>
            </div>

            <!-- Контакты организатора -->
            <div class="content-card">
              <h2 class="card-title"><i class="fas fa-envelope"></i> Контакты</h2>
              <p style="color: #555; margin-bottom: 1rem">
                По вопросам участия обращайтесь к организатору:
              </p>
              <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem">
                <div class="organizer-avatar">{{ event.organizerAvatar }}</div>
                <div>
                  <div style="font-weight: 600; color: var(--secondary)">{{ event.organizer }}</div>
                  <div style="color: #666; font-size: 0.9rem">Организатор</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Загрузка -->
      <div v-else class="loading">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Загрузка события...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '@/components/ui/AppHeader.vue'

const route = useRoute()
const router = useRouter()

const event = ref(null)
const isJoined = ref(false)
const currentUserId = 'current_user'

// Заглушка данных события
const eventData = {
  1: {
    id: 1,
    title: 'Вечер настольных игр',
    game: 'Колонизаторы',
    date: '15 ноября 2025',
    time: '18:30',
    location: 'Кафе "Игровая зона", ул. Центральная, 15',
    organizer: 'Алексей Петров',
    organizerAvatar: 'АП',
    createdDate: '10 ноября 2025',
    duration: '3 часа',
    participants: {
      current: 2,
      max: 6,
    },
    description: `Приглашаю всех любителей настольных игр на вечернюю сессию по классической игре "Колонизаторы" (Catan). Это отличная возможность провести время в приятной компании, познакомиться с новыми людьми и насладиться стратегической игрой.

Мы будем играть в базовую версию игры, подходящую как для новичков, так и для опытных игроков. Я объясню правила всем желающим, так что если вы никогда не играли в Колонизаторы - это отличный шанс научиться!

Место встречи - уютное кафе "Игровая зона" в центре города, где есть все необходимое для комфортной игры: просторные столы, удобные кресла и приятная атмосфера. В кафе можно заказать напитки и закуски.`,
    players: [
      { id: 'organizer', name: 'Алексей П.', avatar: 'АП', isOrganizer: true, isJoined: true },
      { id: 'player1', name: 'Мария С.', avatar: 'МС', isOrganizer: false, isJoined: true },
      { id: 'slot1', name: 'Свободно', avatar: '?', isOrganizer: false, isJoined: false },
      { id: 'slot2', name: 'Свободно', avatar: '?', isOrganizer: false, isJoined: false },
      { id: 'slot3', name: 'Свободно', avatar: '?', isOrganizer: false, isJoined: false },
      { id: 'slot4', name: 'Свободно', avatar: '?', isOrganizer: false, isJoined: false },
    ],
    cost: 'Бесплатно',
    foodInfo: 'Доступны в кафе',
    parkingInfo: 'Есть парковка',
  },
  2: {
    id: 2,
    title: 'Турнир по Мафии',
    game: 'Мафия',
    date: '18 ноября 2025',
    time: '19:00',
    location: 'Коворкинг "Пространство", пр. Ленина, 45',
    organizer: 'Иван Сидоров',
    organizerAvatar: 'ИС',
    createdDate: '12 ноября 2025',
    duration: '3 часа',
    participants: {
      current: 8,
      max: 12,
    },
    description: `Организую турнир по Мафии для всех желающих. Будем играть в несколько раундов с разными составами игроков. Призы для победителей! Отличная возможность проявить свои актерские способности и логическое мышление.

Турнир подойдет как для опытных игроков, так и для новичков. Перед началом проведем краткий инструктаж по правилам игры.`,
    players: [
      { id: 'organizer2', name: 'Иван С.', avatar: 'ИС', isOrganizer: true, isJoined: true },
      { id: 'player2', name: 'Ольга К.', avatar: 'ОК', isOrganizer: false, isJoined: true },
      { id: 'player3', name: 'Сергей М.', avatar: 'СМ', isOrganizer: false, isJoined: true },
      { id: 'player4', name: 'Дмитрий К.', avatar: 'ДК', isOrganizer: false, isJoined: true },
      { id: 'slot5', name: 'Свободно', avatar: '?', isOrganizer: false, isJoined: false },
      { id: 'slot6', name: 'Свободно', avatar: '?', isOrganizer: false, isJoined: false },
    ],
    cost: '200 рублей',
    foodInfo: 'Чай/кофе включены',
    parkingInfo: 'Платная парковка',
  },
}

// Computed свойства
const formattedDescription = computed(() => {
  if (!event.value) return ''
  return event.value.description.replace(/\n/g, '<br>')
})

const displayedPlayers = computed(() => {
  if (!event.value) return []
  return event.value.players
})

const isOrganizer = computed(() => {
  if (!event.value) return false
  return event.value.organizerAvatar === 'АП' // сравнивать с текущим пользователем
})

// Методы
const getStatusClass = (player) => {
  if (player.isOrganizer) return 'status-organizer'
  if (player.isJoined) return 'status-joined'
  return 'status-available'
}

const getStatusText = (player) => {
  if (player.isOrganizer) return 'Организатор'
  if (player.isJoined) return 'Участник'
  return 'Присоединяйтесь!'
}

const joinEvent = () => {
  if (event.value && event.value.participants.current < event.value.participants.max) {
    isJoined.value = true
    event.value.participants.current++
    alert('Вы успешно присоединились к событию!')
  } else {
    alert('К сожалению, все места заняты!')
  }
}

const leaveEvent = () => {
  isJoined.value = false
  if (event.value) {
    event.value.participants.current--
  }
  alert('Вы покинули событие')
}

const editEvent = () => {
  alert('Редактирование события')
}

const shareEvent = () => {
  const eventUrl = window.location.href
  navigator.clipboard
    .writeText(eventUrl)
    .then(() => alert('Ссылка на событие скопирована в буфер обмена!'))
    .catch(() => alert('Не удалось скопировать ссылку'))
}

// Хуки жизненного цикла
onMounted(() => {
  const eventId = route.params.id
  event.value = eventData[eventId]

  if (!event.value) {
    router.push('/events')
    return
  }

  // Проверяем, присоединен ли текущий пользователь к событию
  const currentUserPlayer = event.value.players.find(
    (player) => player.id === currentUserId || player.name.includes('Текущий'),
  )
  isJoined.value = currentUserPlayer ? currentUserPlayer.isJoined : false
})
</script>

<style scoped>
.event-detail-page {
  min-height: 100vh;
  background: var(--light);
}

.container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
}

.event-section {
  padding: 6rem 3rem 2rem;
}

.event-header {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: var(--shadow);
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
}

.event-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, var(--primary), var(--accent));
}

.event-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  color: var(--secondary);
}

.event-game {
  font-size: 1.5rem;
  color: var(--primary);
  margin-bottom: 2rem;
  font-weight: 600;
}

.event-meta {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.2rem;
  background: #f8f9ff;
  border-radius: 12px;
  transition: var(--transition);
}

.meta-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.meta-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(45deg, var(--gradient-start), var(--gradient-end));
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  color: var(--secondary);
  flex-shrink: 0;
}

.meta-content h3 {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.3rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.meta-content p {
  color: var(--secondary);
  font-size: 1.1rem;
  font-weight: 600;
}

.event-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2.5rem;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.content-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: var(--shadow);
}

.card-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--secondary);
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.card-title i {
  color: var(--primary);
}

.event-description {
  line-height: 1.7;
  color: #555;
  font-size: 1rem;
}

.players-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1.5rem;
}

.player-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.2rem;
  border-radius: 12px;
  background: #f8f9ff;
  transition: var(--transition);
  text-align: center;
}

.player-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.player-card.organizer {
  border: 2px solid var(--primary);
}

.player-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(45deg, var(--gradient-start), var(--gradient-end));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: white;
  font-weight: 700;
  margin-bottom: 0.8rem;
}

.player-name {
  font-weight: 600;
  color: var(--secondary);
  font-size: 0.9rem;
  margin-bottom: 0.3rem;
}

.player-status {
  font-size: 0.75rem;
  color: #666;
}

.status-joined {
  color: #4caf50;
  font-weight: 600;
}

.status-organizer {
  color: var(--primary);
  font-weight: 600;
}

.status-available {
  color: #ff9800;
  font-weight: 600;
}

.map-container {
  height: 200px;
  background: linear-gradient(45deg, #e0edfe, #eee9ff);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--secondary);
  font-weight: 600;
  font-size: 1.1rem;
  flex-direction: column;
  gap: 1rem;
}

.map-container i {
  font-size: 2rem;
  color: var(--accent);
}

.organizer-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(45deg, var(--gradient-start), var(--gradient-end));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
}

.additional-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: #555;
  font-size: 0.9rem;
}

.info-item i {
  color: var(--accent);
  width: 20px;
}

.header-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: var(--secondary);
}

.loading i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--primary);
}

/* Адаптивность */
@media (max-width: 1200px) {
  .container {
    max-width: 100%;
    padding: 0 2rem;
  }
}

@media (max-width: 992px) {
  .event-content {
    grid-template-columns: 1fr;
  }

  .event-meta {
    grid-template-columns: repeat(2, 1fr);
  }

  .event-title {
    font-size: 2rem;
  }

  .event-game {
    font-size: 1.3rem;
  }

  .event-section {
    padding: 6rem 2rem 2rem;
  }

  .header-actions {
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 768px) {
  .event-section {
    padding: 5rem 1.5rem 1.5rem;
  }

  .event-header {
    padding: 2rem 1.5rem;
  }

  .content-card {
    padding: 1.5rem;
  }

  .players-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }

  .meta-item {
    flex-direction: column;
    text-align: center;
    gap: 0.8rem;
  }

  .event-meta {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 576px) {
  .event-title {
    font-size: 1.8rem;
  }

  .players-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .event-section {
    padding: 5rem 1rem 1rem;
  }
}
</style>
