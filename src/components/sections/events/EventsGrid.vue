<template>
  <div>
    <div class="events-grid">
      <EventCard
        v-for="event in paginatedEvents"
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

    <div v-if="totalPages > 1" class="pagination">
      <button
        class="pagination-btn"
        :disabled="currentPage === 1"
        @click="prevPage"
      >
        <i class="fas fa-chevron-left"></i>
      </button>
      
      <div class="pagination-pages">
        <button
          v-for="page in totalPages"
          :key="page"
          class="pagination-page"
          :class="{ active: page === currentPage }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
      </div>
      
      <button
        class="pagination-btn"
        :disabled="currentPage === totalPages"
        @click="nextPage"
      >
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import EventCard from './EventCard.vue'

const props = defineProps({
  events: {
    type: Array,
    required: true,
    default: () => [],
  },
})

const emit = defineEmits(['join-event', 'view-event'])

const currentPage = ref(1)
const itemsPerPage = 6

watch(() => props.events, () => {
  currentPage.value = 1
})

//  свой-во для пагинированных событий
const paginatedEvents = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return props.events.slice(startIndex, endIndex)
})

// свой-во для общего количества страниц
const totalPages = computed(() => {
  return Math.ceil(props.events.length / itemsPerPage)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const goToPage = (page) => {
  currentPage.value = page
}

const joinEvent = (event) => {
  emit('join-event', event)
}

const viewEvent = (event) => {
  emit('view-event', event)
}
</script>

<style scoped>
.events-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.no-events-message {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
  color: #666;
}

.no-events-message i {
  font-size: 48px;
  margin-bottom: 16px;
  color: #ccc;
}

.no-events-message h3 {
  margin-bottom: 8px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 30px;
}

.pagination-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.pagination-btn:hover:not(:disabled) {
  background: var(--primary);
  border-color: #007bff;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-pages {
  display: flex;
  gap: 5px;
}

.pagination-page {
  width: 40px;
  height: 40px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.pagination-page:hover {
  background: var(--primary);
  border-color: #007bff;
}

.pagination-page.active {
  background: var(--primary);
  color: white;
}

.pagination-btn:hover:not(:disabled) {
  background: var(--primary);
}

.pagination-page:hover {
  background: var(--primary);
}

.pagination-page.active {
  background: var(--primary); /* Розовый цвет */
  color: white;
}

/* Адаптивность */
@media (max-width: 1200px) {
  .events-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .events-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .pagination {
    gap: 5px;
  }
  
  .pagination-btn,
  .pagination-page {
    width: 35px;
    height: 35px;
    font-size: 12px;
  }
}
</style>