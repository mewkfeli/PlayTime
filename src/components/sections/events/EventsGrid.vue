<template>
  <div class="events-grid">
    <EventCard
      v-for="event in events"
      :key="event.id"
      :event="event"
      @join="joinEvent"
      @view="viewEvent"
    />

    <div v-if="events.length === 0" class="no-events-message">
      <i class="fas fa-calendar-times"></i>
      <h3>События не найдены</h3>
      <p>Попробуйте изменить параметры фильтрации</p>
    </div>
  </div>
</template>

<script setup>
import EventCard from './EventCard.vue'

defineProps({
  events: {
    type: Array,
    required: true,
    default: () => [],
  },
})

const emit = defineEmits(['join-event', 'view-event'])

const joinEvent = (event) => {
  emit('join-event', event)
}

const viewEvent = (event) => {
  emit('view-event', event)
}
</script>
