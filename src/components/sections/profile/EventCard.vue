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

<script setup>
import { ref } from 'vue'
import { eventService } from '@/api/userService'
import { userState } from '@/composables/userSession'

const props = defineProps({
  event: {
    type: Object,
    required: true
  }
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
    alert('Пользователь не идентифицирован')
    return
  }

  joining.value = true

  try {
    await eventService.joinEvent(props.event.id, userId)

    // Отправляем событие с ID для обновления
    emit('join', { id: props.event.id })

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
