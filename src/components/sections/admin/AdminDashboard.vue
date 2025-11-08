<template>
  <div class="admin-dashboard">
    <!-- Статистика -->
    <div class="stats-container">
      <div class="stat-card" v-for="stat in stats" :key="stat.id">
        <div class="stat-icon" :class="stat.color">
          <i :class="stat.icon"></i>
        </div>
        <div class="stat-value">{{ stat.value }}</div>
        <div class="stat-label">{{ stat.label }}</div>
      </div>
    </div>

    <!-- Быстрые действия -->
    <div class="quick-actions">
      <h3 class="section-title">Быстрые действия</h3>
      <div class="actions-grid">
        <button
          v-for="action in quickActions"
          :key="action.id"
          class="action-card"
          @click="handleQuickAction(action.id)"
        >
          <div class="action-icon" :class="action.color">
            <i :class="action.icon"></i>
          </div>
          <div class="action-title">{{ action.title }}</div>
          <div class="action-description">{{ action.description }}</div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const stats = ref([
  {
    id: 1,
    value: '1,254',
    label: 'Пользователей',
    icon: 'fas fa-users',
    color: 'primary',
  },
  {
    id: 2,
    value: '87',
    label: 'Событий',
    icon: 'fas fa-calendar-alt',
    color: 'secondary',
  },
  {
    id: 3,
    value: '42',
    label: 'Игр в каталоге',
    icon: 'fas fa-gamepad',
    color: 'success',
  },
  {
    id: 4,
    value: '12',
    label: 'На модерации',
    icon: 'fas fa-exclamation-circle',
    color: 'warning',
  },
])

const quickActions = ref([
  {
    id: 'add-game',
    title: 'Добавить игру',
    description: 'Добавить новую игру в каталог',
    icon: 'fas fa-plus',
    color: 'primary',
  },
  {
    id: 'moderate-events',
    title: 'Модерация событий',
    description: 'Проверить новые события',
    icon: 'fas fa-shield-alt',
    color: 'warning',
  },
  {
    id: 'user-management',
    title: 'Управление пользователями',
    description: 'Просмотр и управление пользователями',
    icon: 'fas fa-user-cog',
    color: 'secondary',
  },
  {
    id: 'view-reports',
    title: 'Просмотр отчетов',
    description: 'Аналитика и статистика',
    icon: 'fas fa-chart-line',
    color: 'success',
  },
])

const handleQuickAction = (actionId) => {
  const actions = {
    'add-game': () => alert('Открытие формы добавления игры'),
    'moderate-events': () => alert('Переход к модерации событий'),
    'user-management': () => alert('Переход к управлению пользователями'),
    'view-reports': () => alert('Открытие отчетов'),
  }

  if (actions[actionId]) {
    actions[actionId]()
  }
}
</script>

<style scoped>
.admin-dashboard {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 1.5rem;
}

.stat-icon.primary {
  background: rgba(255, 89, 111, 0.1);
  color: var(--primary);
}

.stat-icon.secondary {
  background: rgba(108, 99, 255, 0.1);
  color: var(--accent);
}

.stat-icon.success {
  background: rgba(76, 175, 80, 0.1);
  color: var(--success);
}

.stat-icon.warning {
  background: rgba(255, 152, 0, 0.1);
  color: var(--warning);
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  color: var(--secondary);
}

.stat-label {
  color: #666;
  font-weight: 500;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--secondary);
}

.quick-actions {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: var(--shadow);
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.action-card {
  background: #f8f9ff;
  border: 2px solid transparent;
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: var(--transition);
}

.action-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 1.5rem;
}

.action-icon.primary {
  background: rgba(255, 89, 111, 0.1);
  color: var(--primary);
}

.action-icon.secondary {
  background: rgba(108, 99, 255, 0.1);
  color: var(--accent);
}

.action-icon.success {
  background: rgba(76, 175, 80, 0.1);
  color: var(--success);
}

.action-icon.warning {
  background: rgba(255, 152, 0, 0.1);
  color: var(--warning);
}

.action-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--secondary);
}

.action-description {
  color: #666;
  font-size: 0.9rem;
}

.activity-section {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: var(--shadow);
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  background: #f8f9ff;
  transition: var(--transition);
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-icon.event {
  background: rgba(108, 99, 255, 0.1);
  color: var(--accent);
}

.activity-icon.user {
  background: rgba(255, 89, 111, 0.1);
  color: var(--primary);
}

.activity-icon.game {
  background: rgba(76, 175, 80, 0.1);
  color: var(--success);
}

.activity-icon.moderation {
  background: rgba(255, 152, 0, 0.1);
  color: var(--warning);
}

.activity-content {
  flex: 1;
}

.activity-text {
  font-weight: 500;
  color: var(--secondary);
  margin-bottom: 0.2rem;
}

.activity-time {
  font-size: 0.8rem;
  color: #666;
}

@media (max-width: 1400px) {
  .stats-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-container {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
