<template>
  <div class="filters-container">
    <!-- Основные фильтры -->
    <div class="filter-group">
      <label class="filter-label">Город</label>
      <select class="filter-select" v-model="localFilters.city" @change="emitFilters">
        <option value="">Все города</option>
        <option v-for="city in cities" :key="city.cityId" :value="city.cityName">
          {{ city.cityName }}
        </option>
      </select>
    </div>

    <div class="filter-group">
      <label class="filter-label">Игра</label>
      <select class="filter-select" v-model="localFilters.game" @change="emitFilters">
        <option value="">Все игры</option>
        <option v-for="game in games" :key="game.gameId" :value="game.gameName">
          {{ game.gameName }}
        </option>
      </select>
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

  <!-- Поиск -->
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
import { ref, watch } from 'vue'

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

const emitFilters = () => {
  emit('filter-change', localFilters.value)
}

const handleSearch = () => {
  emit('search', searchTerm.value)
}

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
}

.filter-group {
  position: relative;
}

.filter-select {
  width: 450px;
  position: relative;
  z-index: 1001;
}

select {
  appearance: menulist;
}
</style>
