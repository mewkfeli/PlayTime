<template>
  <div>
    <h2>События</h2>
    <div v-if="loading">Загрузка...</div>
    <div v-else>
      <div v-if="error" class="error">{{ error }}</div>
      <div v-else>
        <div v-if="events.length === 0">Нет событий</div>
        <div class="event-list">
          <EventCard
            v-for="event in events"
            :key="event.id"
            :event="event"
            @join="handleJoinEvent"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { eventService } from '@/api/userService'
import { userState } from '@/composables/userSession'
import EventCard from './EventCard.vue'

const events = ref([])
const loading = ref(true)
const error = ref('')

function mapEvent(apiEvent) {
  const dateObj = new Date(apiEvent.eventDatetime)

  // записан ли текущий пользователь на событие
  const currentUserId = userState.userId
  const isJoined =
    apiEvent.eventParticipants?.some((participant) => participant.userId === currentUserId) || false

  return {
    id: apiEvent.eventId,
    title: apiEvent.eventName,
    game: apiEvent.game,
    date: dateObj.toLocaleDateString('ru-RU'),
    time: dateObj.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    location: apiEvent.location,
    participants: apiEvent.eventParticipants?.length || 0,
    maxParticipants: apiEvent.maxParticipants || 0,
    description: apiEvent.description,
    players: apiEvent.eventParticipants?.map((p) => p.userName || p.name) || [],
    created: new Date(apiEvent.createdAt).toLocaleDateString('ru-RU'),
    isJoined: isJoined,
    isFull: (apiEvent.eventParticipants?.length || 0) >= (apiEvent.maxParticipants || 0),
    status: apiEvent.status || 'Активно',
  }
}

const loadEvents = async () => {
  try {
    loading.value = true
    const data = await eventService.getEvents()
    events.value = Array.isArray(data) ? data.map(mapEvent) : []
  } catch (e) {
    error.value = 'Ошибка загрузки событий: ' + (e?.message || e)
    events.value = []
  } finally {
    loading.value = false
  }
}

const handleJoinEvent = (updatedEvent) => {
  const index = events.value.findIndex((e) => e.id === updatedEvent.id)
  if (index !== -1) {
    events.value[index] = { ...events.value[index], ...updatedEvent }
  }
}

onMounted(async () => {
  await loadEvents()
})
</script>

<style scoped>
.event-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 2rem;
}
.error {
  color: red;
  margin-bottom: 1rem;
}
</style>
