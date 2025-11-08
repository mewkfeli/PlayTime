<template>
  <div class="event-card">
    <div class="event-card-header">
      <div>
        <h3 class="event-card-title">{{ event.title }}</h3>
        <div class="event-card-game">{{ event.game }}</div>
      </div>
      <div class="event-card-date"><i class="fas fa-calendar-alt"></i> {{ event.date }}</div>
    </div>

    <div class="players-preview">
      <div class="players-avatars">
        <div
          v-for="(player, index) in event.players"
          :key="index"
          class="player-avatar-small"
          :style="{ zIndex: event.players.length - index }"
        >
          {{ player }}
        </div>
      </div>
      <div class="players-count">{{ event.participants }} участников</div>
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
          <i class="fas fa-clock"></i>
        </div>
        <div class="event-meta-content">
          <h4>Время</h4>
          <p>{{ event.time }}</p>
        </div>
      </div>
    </div>

    <div class="event-card-description">
      {{ event.description }}
    </div>

    <div class="event-card-actions">
      <button class="btn btn-small" @click="viewEvent"><i class="fas fa-eye"></i> Подробнее</button>
      <button class="btn btn-outline btn-small" @click="emit('join', event)">
        <i class="fas fa-user-plus"></i> Присоединиться
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
  event: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['view', 'join'])

const viewEvent = () => {
  router.push(`/event/${props.event.id}`)
}
</script>

<style scoped>
.event-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: var(--shadow);
  transition: var(--transition);
  position: relative;
  overflow: hidden;
}

.event-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, var(--primary), var(--accent));
}

.event-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(41, 42, 87, 0.15);
}

.event-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.event-card-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--secondary);
  margin-bottom: 0.5rem;
}

.event-card-game {
  font-size: 1.1rem;
  color: var(--primary);
  font-weight: 600;
}

.event-card-date {
  background: rgba(108, 99, 255, 0.1);
  color: var(--accent);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
}

.players-preview {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.players-avatars {
  display: flex;
  margin-right: 1rem;
}

.player-avatar-small {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(45deg, var(--gradient-start), var(--gradient-end));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  color: white;
  font-weight: 700;
  margin-right: -8px;
  border: 2px solid white;
}

.players-count {
  font-size: 0.9rem;
  color: #666;
  font-weight: 600;
}

.event-card-meta {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.event-meta-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.event-meta-icon {
  width: 40px;
  height: 40px;
  background: #f8f9ff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: var(--secondary);
  flex-shrink: 0;
}

.event-meta-content h4 {
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 0.2rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.event-meta-content p {
  color: var(--secondary);
  font-size: 0.9rem;
  font-weight: 600;
}

.event-card-description {
  color: #555;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.event-card-actions {
  display: flex;
  gap: 1rem;
}

.event-card-actions .btn {
  flex: 1;
}

@media (max-width: 768px) {
  .event-card-meta {
    grid-template-columns: 1fr;
  }

  .event-card-actions {
    flex-direction: column;
  }

  .event-card {
    padding: 1.5rem;
  }
}
</style>
