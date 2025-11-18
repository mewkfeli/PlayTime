<template>
  <div class="event-card">
    <div class="event-card-header">
      <div>
        <h3 class="event-card-title">{{ event.title || event.event_name }}</h3>
        <div class="event-card-game">{{ event.game || event.game_name || event.game_id }}</div>
      </div>
    </div>

    <div class="players-preview">
      <div class="players-avatars">
        <div
          v-for="(player, index) in event.players"btn-outline
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
          <i class="fas fa-map-marker-alt"></i>
        </div>
        <div class="event-meta-content">
          <h4>Место</h4>
          <p>{{ event.location }}</p>
        </div>
      </div>
      <div class="event-meta-item">
        <div class="event-meta-icon">
          <i class="fas fa-calendar-day"></i>
        </div>
        <div class="event-meta-content">
          <h4>Дата и время проведения</h4>
          <p>{{ formatDateTime(getEventDateTime(), getEventTime()) }}</p>
        </div>
      </div>
      <div class="event-meta-item">
        <div class="event-meta-icon">
          <i class="fas fa-user-tie"></i>
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
        <i class="fas fa-user-plus"></i> Присоединиться
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

<style scoped>
.event-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #eaeaea;
  transition: all 0.3s ease;
  height: fit-content;
}

.event-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.event-card-header {
  margin-bottom: 16px;
}

.event-card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.event-card-game {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin: 10px 0;
}

.players-preview {
  display: flex;
  justify-content: left;
  align-items: center;
  border-radius: 8px;
}

.players-avatars {
  display: flex;
}

.player-avatar-small {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #ec407a;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 500;
  margin-left: -8px;
  border: 2px solid white;
}

.player-avatar-small:first-child {
  margin-left: 0;
}

.players-count {
  font-size: 0.85rem;
  color: #6c757d;
  font-weight: 500;
}

.event-card-meta {
  margin-bottom: 20px;
}

.event-meta-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
}

.event-meta-item:last-child {
  margin-bottom: 0;
}

.event-meta-icon {
  width: 20px;
  margin-right: 12px;
  color: #ec407a;
  text-align: center;
  flex-shrink: 0;
}

.event-meta-content h4 {
  margin: 0 0 4px 0;
  font-size: 0.85rem;
  font-weight: 600;
  color: #2c3e50;
}

.event-meta-content p {
  margin: 0;
  font-size: 0.9rem;
  color: #5a6c7d;
  line-height: 1.4;
}

.event-card-description {
  color: #6c757d;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.event-card-actions {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex: 1;
}

.btn-small {
  padding: 8px 12px;
  font-size: 0.8rem;
}

.btn-outline {
  background: transparent;
  border-radius: 36.2px;
  border: 1px solid #ec407a;
  color: #ec407a; 
}

.btn-outline:hover {
  background: var(--primary);
  color: white;
}

.btn-primary {
  background: #ec407a;
  color: white;
}

.btn-primary:hover {
  background: #d81b60;
}
</style>