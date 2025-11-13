<template>
  <div class="event-card">
    <div class="event-card-header">
      <div>
        <h3 class="event-card-title">{{ event.title || event.event_name }}</h3>
        <div class="event-card-game">{{ event.game || event.game_name || event.game_id }}</div>
      </div>
      <div class="event-card-date">
        <i class="calendar-alt"></i> {{ formatDate(getEventDateTime()) }}
      </div>
    </div>

    <div class="players-preview">
      <div class="players-avatars">
        <div
          v-for="(player, index) in event.players"
          :key="index"
          class="player-avatar-small"
          :style="{ zIndex: event.players ? event.players.length - index : 0 }"
        >
          {{ player }}
        </div>
      </div>
      <div class="players-count">
        {{ event.participants }}/{{ event.maxParticipants }} участников
      </div>
    </div>

    <div class="event-card-meta">
      <div class="event-meta-item">
        <div class="event-meta-icon">
          <i class="map-marker-alt"></i>
        </div>
        <div class="event-meta-content">
          <h4>Место</h4>
          <p>{{ event.location }}</p>
        </div>
      </div>
      <div class="event-meta-item">
        <div class="event-meta-icon">
          <i class="calendar-day"></i>
        </div>
        <div class="event-meta-content">
          <h4>Дата и время проведения</h4>
          <p>{{ formatDateTime(getEventDateTime(), getEventTime()) }}</p>
        </div>
      </div>
      <div class="event-meta-item">
        <div class="event-meta-icon">
          <i class="user-tie"></i>
        </div>
        <div class="event-meta-content">
          <h4>Организатор</h4>
          <p>
            {{ event.organizer || 'Неизвестно' }}
          </p>
        </div>
      </div>
    </div>

    <div class="event-card-description">
      {{ event.description }}
    </div>

    <div class="event-card-actions">
      <button class="btn btn-outline btn-small" @click="emit('join', event)">
        <i class="user-plus"></i> Присоединиться
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  event: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['view', 'join'])

const getEventDateTime = () => {
  return props.event.event_datetime || props.event.date || props.event.datetime
}

const getEventTime = () => {
  return props.event.time || props.event.event_time || '18:00'
}

const parseDate = (dateString, timeString = '18:00') => {
  if (!dateString) {
    return null
  }

  const dotFormatMatch = dateString.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/)
  if (dotFormatMatch) {
    const day = parseInt(dotFormatMatch[1])
    const month = parseInt(dotFormatMatch[2]) - 1
    const year = parseInt(dotFormatMatch[3])

    let hours = 18
    let minutes = 0

    if (timeString) {
      const timeMatch = timeString.match(/^(\d{1,2}):(\d{1,2})$/)
      if (timeMatch) {
        hours = parseInt(timeMatch[1])
        minutes = parseInt(timeMatch[2])
      }
    }

    const date = new Date(year, month, day, hours, minutes)
    if (!isNaN(date.getTime())) {
      return date
    }
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'Дата не указана'

  const date = parseDate(dateString)
  if (!date) return `Неверный формат: ${dateString}`

  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const formatDateTime = (dateString, timeString = '18:00') => {
  if (!dateString) return 'Дата и время не указаны'

  const date = parseDate(dateString, timeString)
  if (!date) return `Неверный формат: ${dateString}`

  return date.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>
