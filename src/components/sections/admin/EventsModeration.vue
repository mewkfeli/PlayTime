<template>
  <div class="events-moderation">
    <div class="table-container">
      <div class="table-header">
        <h3 class="table-title">Модерация событий</h3>
        <button class="btn btn-secondary btn-small">
          <i class="fas fa-filter"></i> Фильтры
        </button>
      </div>
      <p>Модерация событий в разработке...</p>
    </div>
  </div>
</template>

<script setup>
// Компонент модерации событий
</script>

<style scoped>
.table-container {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: var(--shadow);
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.table-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--secondary);
}
</style>
