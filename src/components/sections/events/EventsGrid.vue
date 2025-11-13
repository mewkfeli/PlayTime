<template>
  <div class="events-grid">
    <div v-if="events.length === 0" class="no-events">
      <i class="fas fa-calendar-times"></i>
      <h3>Событий не найдено</h3>
      <p>Попробуйте изменить параметры фильтрации</p>
    </div>

    <div v-else class="grid-container">
      <EventCard
        v-for="event in events"
        :key="event.id"
        :event="event"
        @view-event="$emit('viewEvent', event)"
        @join="$emit('joinEvent', event)"
      />
    </div>
  </div>
</template>

<script setup>
import EventCard from './EventCard.vue'

defineProps({
  events: {
    type: Array,
    default: () => [],
  },
})

defineEmits(['viewEvent', 'joinEvent'])
</script>

<style scoped>
.events-grid {
  width: 100%;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  padding: 1rem 0;
}

.no-events {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
}

.no-events i {
  font-size: 4rem;
  margin-bottom: 1rem;
  color: #ccc;
}

.no-events h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.no-events p {
  margin: 0;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
