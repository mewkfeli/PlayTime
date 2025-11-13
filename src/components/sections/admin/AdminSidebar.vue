<template>
  <div class="sidebar">
    <h2 class="sidebar-title">Админ-панель</h2>
    <div class="sidebar-nav">
      <div
        v-for="item in menuItems"
        :key="item.id"
        class="sidebar-item"
        :class="{ active: activeTab === item.id }"
        @click="$emit('tabChange', item.id)"
      >
        <i :class="item.icon"></i>
        <span>{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineEmits(['tabChange'])

const menuItems = ref([
  { id: 'games', label: 'Управление играми', icon: 'fas fa-gamepad' },
  { id: 'events', label: 'Модерация событий', icon: 'fas fa-calendar-alt' },
  { id: 'users', label: 'Управление пользователями', icon: 'fas fa-users' },
])
</script>

<style scoped>
.sidebar {
  width: 280px;
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: var(--shadow);
  height: fit-content;
  position: sticky;
  top: 100px;
}

.sidebar-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--secondary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sidebar-title i {
  color: var(--primary);
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sidebar-item {
  padding: 1rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 1rem;
  font-weight: 500;
}

.sidebar-item:hover {
  background: rgba(108, 99, 255, 0.1);
  color: var(--accent);
}

.sidebar-item.active {
  background: rgba(108, 99, 255, 0.15);
  color: var(--accent);
  font-weight: 600;
}

.sidebar-item i {
  width: 20px;
  text-align: center;
}

@media (max-width: 1200px) {
  .sidebar {
    width: 100%;
    position: static;
  }

  .sidebar-nav {
    flex-direction: row;
    overflow-x: auto;
    padding-bottom: 1rem;
  }

  .sidebar-item {
    white-space: nowrap;
  }
}
</style>
