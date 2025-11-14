<template>
  <div>
    <h2>События</h2>
    <div v-if="loading">Загрузка...</div>
    <div v-else>
      <div v-if="error" class="error">{{ error }}</div>
      <div v-else>
        <div v-if="events.length === 0">Нет событий</div>
        <div class="event-list">
          <EventCard v-for="event in events" :key="event.id" :event="event" @join="joinEvent" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { eventService } from '@/api/userService'
import EventCard from './EventCard.vue'

const events = ref([])
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
    participants: apiEvent.eventParticipants?.length || 0,
    description: apiEvent.description,
    players: apiEvent.eventParticipants?.map((p) => p.userName) || [],
    created: new Date(apiEvent.createdAt).toLocaleDateString('ru-RU'),
  }
}

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

const joinEvent = async (event) => {
  alert(`Вы присоединились к событию: ${event.title}`)
}
</script>

<style scoped>
.event-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(340px, 1fr));
  gap: 2rem;
}
.error {
  color: red;
  margin-bottom: 1rem;
}
</style>
