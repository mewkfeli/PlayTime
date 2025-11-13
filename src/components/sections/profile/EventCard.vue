<template>
  <div class="event-card">
    <div class="event-header">
      <div>
        <h3 class="event-title">{{ event.title }}</h3>
        <div class="event-game">{{ event.game }}</div>
      </div>
      <div class="event-date"><i class="calendar-alt"></i> {{ event.date }}</div>
    </div>

    <div class="event-details">
      <div class="event-detail">
        <i class="clock"></i>
        <span>{{ event.time }}</span>
      </div>
      <div class="event-detail">
        <i class="map-marker-alt"></i>
        <span>{{ event.location }}</span>
      </div>
      <div class="event-detail">
        <i class="users"></i>
        <span>{{ event.participants }} участников</span>
      </div>
      <div class="event-detail">
        <i class="calendar-plus"></i>
        <span>Создано: {{ event.created }}</span>
      </div>
    </div>

    <div class="event-description">
      {{ event.description }}
    </div>

    <div class="players-list">
      <div class="players-title">Участники:</div>
      <div class="players-grid">
        <div v-for="player in event.players" :key="player" class="player-badge">
          <i class="user"></i> {{ player }}
        </div>
      </div>
    </div>

    <div class="event-actions">
      <button class="btn btn-small" @click="$emit('edit', event)">
        <i class="edit"></i> Редактировать
      </button>
      <button class="btn btn-small btn-outline" @click="$emit('share', event)">
        <i class="share-alt"></i> Поделиться
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EventCard',
  props: {
    event: {
      type: Object,
      required: true,
    },
  },
  emits: ['edit', 'share'],
}
</script>
