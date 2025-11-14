<template>
  <div class="filters-container">
    <div class="filter-group">
      <label class="filter-label">Город</label>
      <div class="custom-select">
        <div class="select-header" @click="toggleDropdown('city')">
          <span>{{ getSelectedCityLabel }}</span>
          <span class="arrow" :class="{ 'rotated': dropdowns.city }">▼</span>
        </div>
        <div v-if="dropdowns.city" class="select-dropdown">
          <div class="dropdown-list">
            <div 
              class="dropdown-item" 
              :class="{ 'selected': !localFilters.city }"
              @click="selectOption('city', '')"
            >
              Все города
            </div>
            <div 
              v-for="city in cities" 
              :key="city.cityId"
              class="dropdown-item"
              :class="{ 'selected': localFilters.city === city.cityName }"
              @click="selectOption('city', city.cityName)"
            >
              {{ city.cityName }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="filter-group">
      <label class="filter-label">Игра</label>
      <div class="custom-select">
        <div class="select-header" @click="toggleDropdown('game')">
          <span>{{ getSelectedGameLabel }}</span>
          <span class="arrow" :class="{ 'rotated': dropdowns.game }">▼</span>
        </div>
        <div v-if="dropdowns.game" class="select-dropdown">
          <div class="dropdown-list">
            <div 
              class="dropdown-item" 
              :class="{ 'selected': !localFilters.game }"
              @click="selectOption('game', '')"
            >
              Все игры
            </div>
            <div 
              v-for="game in games" 
              :key="game.gameId"
              class="dropdown-item"
              :class="{ 'selected': localFilters.game === game.gameName }"
              @click="selectOption('game', game.gameName)"
            >
              {{ game.gameName }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="filter-group">
      <label class="filter-label">Дата</label>
      <div class="date-input-container">
        <input type="date" class="date-input" v-model="localFilters.date" @change="emitFilters" />
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
  </div>

  <div class="search-container">
    <input
      type="text"
      class="search-input"
      placeholder="Поиск по названию события или описанию..."
      v-model="searchTerm"
      @keyup.enter="handleSearch"
    />
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  filters: {
    type: Object,
    required: true,
  },
  games: {
    type: Array,
    required: true,
    default: () => [],
  },
  cities: {
    type: Array,
    required: true,
    default: () => [],
  },
})

const emit = defineEmits(['filter-change', 'search'])

const localFilters = ref({
  city: '',
  game: '',
  date: '',
  players: '',
  ...props.filters,
})
const searchTerm = ref('')

const dropdowns = ref({
  city: false,
  game: false
})

const getSelectedCityLabel = computed(() => {
  return localFilters.value.city || 'Все города'
})

const getSelectedGameLabel = computed(() => {
  return localFilters.value.game || 'Все игры'
})

const toggleDropdown = (type) => {
  Object.keys(dropdowns.value).forEach(key => {
    if (key !== type) dropdowns.value[key] = false
  })
  dropdowns.value[type] = !dropdowns.value[type]
}

const selectOption = (type, value) => {
  localFilters.value[type] = value
  dropdowns.value[type] = false
  emitFilters()
}

const emitFilters = () => {
  emit('filter-change', localFilters.value)
}

const handleSearch = () => {
  emit('search', searchTerm.value)
}

const closeDropdowns = (event) => {
  if (!event.target.closest('.custom-select')) {
    Object.keys(dropdowns.value).forEach(key => {
      dropdowns.value[key] = false
    })
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdowns)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdowns)
})

watch(
  () => props.filters,
  (newFilters) => {
    localFilters.value = { ...newFilters }
  },
  { deep: true },
)

watch(
  () => props.cities,
  (newCities) => {
    console.log(newCities)
  },
)
</script>

<style scoped>
.filters-container {
  position: relative;
  z-index: 1000;
  display: flex;
  gap: 16px;
}

.filter-group {
  position: relative;
}

.filter-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
  font-size: 14px;
}

.custom-select {
  position: relative;
  width: 450px;
}

.select-header {
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  transition: border-color 0.2s;
}

.select-header:hover {
  border-color: #3b82f6;
}

.select-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 1002;
  margin-top: 4px;
}

.dropdown-list {
  max-height: 200px;
  overflow-y: auto; 
  padding: 4px 0;
}

.dropdown-item {
  padding: 10px 12px;
  cursor: pointer;
  font-size: 18px;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f8fafc;
}

.dropdown-item:hover {
  background: #f1f5f9;
}

.dropdown-item.selected {
  background: #3b82f6;
  color: white;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.arrow {
  transition: transform 0.2s;
  font-size: 12px;
  color: #6b7280;
}

.arrow.rotated {
  transform: rotate(180deg);
}

.date-input-container {
  position: relative;
}

.date-input {
  width: 200px;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 18px;
}

.filter-select {
  width: 350px;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 18px;
  background: white;
  cursor: pointer;
}

.search-container {
  margin-top: 16px;
}

.search-input {
  width: 1000px;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 18px;
}
</style>