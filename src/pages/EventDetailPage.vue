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
        <div v-if="error" class="error">{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '@/components/ui/AppHeader.vue'
import { eventService } from '@/api/userService'

const route = useRoute()
const router = useRouter()

const event = ref(null)
const isJoined = ref(false)
const loading = ref(true)
const error = ref('')

function mapEvent(apiEvent) {
  const dateObj = new Date(apiEvent.eventDatetime)
  return {
    id: apiEvent.eventId,
    title: apiEvent.eventName,
    game: apiEvent.game,
    date: dateObj.toLocaleDateString('ru-RU'),
    time: dateObj.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    location: apiEvent.location,
    organizer: apiEvent.organizerName || 'Организатор',
    organizerAvatar:
      apiEvent.organizerAvatar ||
      (apiEvent.organizerName ? apiEvent.organizerName.slice(0, 2) : 'О'),
    createdDate: new Date(apiEvent.createdAt).toLocaleDateString('ru-RU'),
    duration: apiEvent.duration || '',
    participants: {
      current: apiEvent.eventParticipants?.length || 0,
      max: apiEvent.maxParticipants || 0,
    },
    description: apiEvent.description,
    players:
      apiEvent.eventParticipants?.map((p) => ({
        id: p.userId,
        name: p.userName,
        avatar: p.avatar || (p.userName ? p.userName.slice(0, 2) : '?'),
        isOrganizer: p.isOrganizer || false,
        isJoined: true,
      })) || [],
    cost: apiEvent.cost || '',
    foodInfo: apiEvent.foodInfo || '',
    parkingInfo: apiEvent.parkingInfo || '',
  }
}

const formattedDescription = computed(() => {
  if (!event.value) return ''
  return event.value.description.replace(/\n/g, '<br>')
})

const displayedPlayers = computed(() => {
  if (!event.value) return []
  return event.value.players
})

const isOrganizer = computed(() => {
  // Здесь можно добавить проверку на текущего пользователя
  return false
})

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
  alert('Вы успешно присоединились к событию!')
}

const leaveEvent = () => {
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

onMounted(async () => {
  const eventId = route.params.id
  loading.value = true
  try {
    const data = await eventService.getEventById(eventId)
    if (Array.isArray(data) && data.length > 0) {
      event.value = mapEvent(data[0])
    } else {
      error.value = 'Событие не найдено'
      router.push('/events')
    }
  } catch {
    error.value = 'Ошибка загрузки события'
    router.push('/events')
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.error {
  color: red;
  margin-top: 1rem;
}
</style>
