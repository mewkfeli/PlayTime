<template>
  <div class="event-card">
    <div class="event-header">
      <h3 class="event-title">{{ event.title }}</h3>
    </div>
    <div class="event-game">
      <i class="game-icon"></i>
      {{ event.game }}
    </div>
    <div class="event-details">
      <div class="event-info">
        <i class="fas fa-calendar"></i>
        <span>{{ event.date }}</span>
      </div>
      <div class="event-info">
        <i class="fas fa-clock"></i>
        <span>{{ event.time }}</span>
      </div>
      <div class="event-info">
        <i class="fas fa-map-marker-alt"></i>
        <span>{{ event.location }}</span>
      </div>
    </div>

    <div class="event-description">
      {{ event.description }}
    </div>

    <div class="event-participants">
      <div class="participants-count">
        <i class="fas fa-users"></i>
        <span>Участники: {{ event.participants }}/{{ event.maxParticipants }}</span>
      </div>
      <div class="participants-list" v-if="event.players.length > 0">
        <span class="players-label">Игроки:</span>
        <div class="players-tags">
          <span v-for="player in event.players" :key="player" class="player-tag">
            {{ player }}
          </span>
        </div>
      </div>
    </div>

    <div class="event-footer">
      <div class="event-created">Создано: {{ event.created }}</div>
      <button
        v-if="!event.isJoined && !event.isFull"
        class="join-btn"
        @click="handleJoin"
        :disabled="joining"
      >
        <i class="fas fa-plus"></i>
        {{ joining ? 'Записываем...' : 'Записаться' }}
      </button>
      <button v-else-if="event.isJoined" class="joined-btn" disabled>
        <i class="fas fa-check"></i>
        Вы записаны
      </button>
      <button v-else class="full-btn" disabled>
        <i class="fas fa-times"></i>
        Мест нет
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { eventService } from '@/api/userService'
import { userState } from '@/composables/userSession'

const props = defineProps({
  event: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['viewEvent', 'join'])

const joining = ref(false)

const handleJoin = async () => {
  if (!userState.isAuthenticated) {
    alert('Для записи на событие необходимо авторизоваться')
    return
  }

  const userId = userState.userId
  if (!userId) {
    alert('Ошибка: пользователь не идентифицирован')
    return
  }

  joining.value = true

  try {
    await eventService.joinEvent(props.event.id, userId)
    emit('join', props.event)
    alert(`Вы успешно записались на событие: ${props.event.title}`)
  } catch (error) {
    const errorMessage = getErrorMessage(error)
    alert(errorMessage)
  } finally {
    joining.value = false
  }
}

const getErrorMessage = (error) => {
  const message = error.message || error.toString()

  if (message.includes('уже записан')) {
    return 'Вы уже записаны на это событие'
  } else if (message.includes('максимальное количество')) {
    return 'Достигнуто максимальное количество участников. Мест больше нет.'
  } else if (message.includes('неактивное')) {
    return 'Нельзя записаться на неактивное событие'
  } else if (message.includes('не найдено')) {
    return 'Событие не найдено'
  } else if (message.includes('Пользователь не найден')) {
    return 'Ошибка авторизации. Пожалуйста, войдите в систему заново.'
  } else {
    return 'Ошибка при записи на событие: ' + message
  }
}
</script>

<style scoped>
.event-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
}

.event-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.event-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  flex: 1;
}

.event-game {
  font-weight: 600;
  color: var(--primary);
  margin-bottom: 0.5rem;
}

.event-details {
  margin-bottom: 1rem;
}

.event-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.event-info i {
  width: 16px;
  color: #667eea;
}

.event-description {
  color: #555;
  line-height: 1.5;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.event-participants {
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 36.5px;
}

.participants-count {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.participants-list {
  margin-top: 0.5rem;
}

.players-label {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.25rem;
  display: block;
}

.players-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.player-tag {
  background: #e9ecef;
  color: #495057;
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
}

.event-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.event-created {
  font-size: 0.8rem;
  color: #999;
}

.join-btn,
.joined-btn,
.full-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.join-btn {
  background: #dc3545;
  color: white;
  border-radius: 36.5px;
}

.joined-btn {
  background: #6c757d;
  color: white;
  cursor: not-allowed;
}

.full-btn {
  background: #333;
  color: white;
  cursor: not-allowed;
  border-radius: 36.5px;
}
</style>
