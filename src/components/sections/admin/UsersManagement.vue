<template>
  <div class="users-management">
    <div class="table-container">
      <div class="table-header">
        <h3 class="table-title">Управление пользователями</h3>
        <button class="btn btn-secondary btn-small">
          <i class="fas fa-user-plus"></i> Добавить админа
        </button>
      </div>
      <p>Управление пользователями в разработке...</p>
    </div>
  </div>
</template>

<script setup>
// Компонент управления пользователями
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
