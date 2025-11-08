<template>
  <div class="events-grid">
    <EventCard 
      v-for="event in events" 
      :key="event.id"
      :event="event"
      @join="joinEvent"
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
    default: () => []
  }
})

const emit = defineEmits(['join-event'])

const joinEvent = (event) => {
  emit('join-event', event)
}
</script>

<style scoped>
.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.no-events-message {
  grid-column: 1 / -1;
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
}

.no-events-message i {
  font-size: 4rem;
  color: #ddd;
  margin-bottom: 1rem;
}

.no-events-message h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--secondary);
}

.no-events-message p {
  font-size: 1rem;
  color: #888;
}

@media (max-width: 1400px) {
  .events-grid {
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  }
}

@media (max-width: 992px) {
  .events-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 576px) {
  .events-grid {
    gap: 1.5rem;
  }
  
  .no-events-message {
    padding: 3rem 1rem;
  }
  
  .no-events-message i {
    font-size: 3rem;
  }
}
</style>