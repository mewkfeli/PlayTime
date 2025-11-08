<template>
  <div class="filters-container">
    <!-- Основные фильтры -->
    <div class="filter-group">
      <label class="filter-label">Город</label>
      <select class="filter-select" v-model="localFilters.city" @change="emitFilters">
        <option value="">Все города</option>
        <option value="moscow">Москва</option>
        <option value="spb">Санкт-Петербург</option>
        <option value="ufa">Уфа</option>
        <option value="ekb">Екатеринбург</option>
      </select>
    </div>

    <div class="filter-group">
      <label class="filter-label">Игра</label>
      <select class="filter-select" v-model="localFilters.game" @change="emitFilters">
        <option value="">Все игры</option>
        <option value="catan">Колонизаторы</option>
        <option value="munchkin">Манчкин</option>
        <option value="mafia">Мафия</option>
        <option value="carcassonne">Каркассон</option>
      </select>
    </div>

    <div class="filter-group">
      <label class="filter-label">Дата</label>
      <div class="date-input-container">
        <input
          type="text"
          class="date-input"
          placeholder="Выберите дату"
          readonly
          v-model="localFilters.date"
          @click="toggleCalendar"
        />
        <CalendarPopup
          v-model:visible="showCalendar"
          v-model:selected-date="localFilters.date"
          @date-select="handleDateSelect"
        />
      </div>
    </div>

    <div class="filter-group">
      <label class="filter-label">Количество игроков</label>
      <select class="filter-select" v-model="localFilters.players" @change="emitFilters">
        <option value="">Любое количество</option>
        <option value="2-4">2-4 игрока</option>
        <option value="4-6">4-6 игроков</option>
        <option value="6+">6+ игроков</option>
      </select>
    </div>

    <div class="filter-group">
      <label class="filter-label">Статус</label>
      <select class="filter-select" v-model="localFilters.status" @change="emitFilters">
        <option value="">Все события</option>
        <option value="open">Есть свободные места</option>
        <option value="upcoming">Скоро начнется</option>
      </select>
    </div>
  </div>

  <!-- Поиск -->
  <div class="search-container">
    <input
      type="text"
      class="search-input"
      placeholder="Поиск по названию события или описанию..."
      v-model="searchTerm"
      @keyup.enter="handleSearch"
    />
    <button class="btn btn-secondary" @click="handleSearch">
      <i class="fas fa-search"></i> Найти
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import CalendarPopup from '@/components/ui/CalendarPopup.vue'

const props = defineProps({
  filters: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['filter-change', 'search'])

const localFilters = ref({ ...props.filters })
const searchTerm = ref('')
const showCalendar = ref(false)

const emitFilters = () => {
  emit('filter-change', localFilters.value)
}

const handleSearch = () => {
  emit('search', searchTerm.value)
}

const toggleCalendar = () => {
  showCalendar.value = !showCalendar.value
}

const handleDateSelect = (date) => {
  localFilters.value.date = date
  emitFilters()
  showCalendar.value = false
}

// Следим за изменениями props и синхронизируем с localFilters
watch(
  () => props.filters,
  (newFilters) => {
    localFilters.value = { ...newFilters }
  },
  { deep: true },
)
</script>

<style scoped>
.filters-container {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.filter-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-select {
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  background: white;
  transition: var(--transition);
  cursor: pointer;
  width: 100%;
}

.filter-select:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.1);
}

.date-input-container {
  position: relative;
}

.date-input {
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  background: white;
  transition: var(--transition);
  width: 100%;
  cursor: pointer;
}

.date-input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.1);
}

.search-container {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.search-input {
  flex: 1;
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  transition: var(--transition);
}

.search-input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.1);
}

@media (max-width: 1200px) {
  .filters-container {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 992px) {
  .filters-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .filters-container {
    grid-template-columns: 1fr;
  }

  .search-container {
    flex-direction: column;
  }
}
</style>
