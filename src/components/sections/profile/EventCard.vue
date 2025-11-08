<template>
  <div class="event-card">
    <div class="event-header">
      <div>
        <h3 class="event-title">{{ event.title }}</h3>
        <div class="event-game">{{ event.game }}</div>
      </div>
      <div class="event-date">
        <i class="fas fa-calendar-alt"></i> {{ event.date }}
      </div>
    </div>

    <div class="event-details">
      <div class="event-detail">
        <i class="fas fa-clock"></i>
        <span>{{ event.time }}</span>
      </div>
      <div class="event-detail">
        <i class="fas fa-map-marker-alt"></i>
        <span>{{ event.location }}</span>
      </div>
      <div class="event-detail">
        <i class="fas fa-users"></i>
        <span>{{ event.participants }} участников</span>
      </div>
      <div class="event-detail">
        <i class="fas fa-calendar-plus"></i>
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
          <i class="fas fa-user"></i> {{ player }}
        </div>
      </div>
    </div>

    <div class="event-actions">
      <button class="btn btn-small" @click="$emit('edit', event)">
        <i class="fas fa-edit"></i> Редактировать
      </button>
      <button class="btn btn-small btn-outline" @click="$emit('share', event)">
        <i class="fas fa-share-alt"></i> Поделиться
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
      required: true
    }
  },
  emits: ['edit', 'share']
}
</script>

<style scoped>
.event-card {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: var(--shadow);
  margin-bottom: 1.5rem;
  transition: var(--transition);
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.event-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--secondary);
}

.event-game {
  font-size: 1.1rem;
  color: var(--primary);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.event-date {
  background: rgba(108, 99, 255, 0.1);
  color: var(--accent);
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.event-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.event-detail {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.event-detail i {
  color: var(--primary);
  width: 20px;
}

.event-description {
  color: #555;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.event-actions {
  margin-top: 20px;
  display: flex;
  gap: 0.8rem;
}

.players-list {
  margin-top: 1rem;
}

.players-title {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--secondary);
}

.players-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.player-badge {
  background: #f0f0f0;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.player-badge i {
  color: #4caf50;
}

@media (max-width: 768px) {
  .event-details {
    grid-template-columns: 1fr;
  }

  .event-actions {
    flex-direction: column;
  }
}
</style>