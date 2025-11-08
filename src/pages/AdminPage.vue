<template>
  <div class="admin-page">
    <AppHeader />
    <div class="container">
      <section class="admin-section">
        <!-- Боковая панель -->
        <AdminSidebar :active-tab="activeTab" @tab-change="changeTab" />

        <!-- Основной контент -->
        <div class="admin-content">
          <!-- Заголовок -->
          <div class="admin-header">
            <h1 class="admin-title">{{ getTabTitle(activeTab) }}</h1>
            <div class="admin-subtitle">{{ getTabSubtitle(activeTab) }}</div>
          </div>

          <!-- Компоненты контента -->
          <component :is="activeComponent" :key="activeTab" />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppHeader from '@/components/ui/AppHeader.vue'
import AdminSidebar from '@/components/sections/admin/AdminSidebar.vue'
import AdminDashboard from '@/components/sections/admin/AdminDashboard.vue'
import EventsModeration from '@/components/sections/admin/EventsModeration.vue'
import UsersManagement from '@/components/sections/admin/UsersManagement.vue'

const activeTab = ref('dashboard')

const tabComponents = {
  dashboard: AdminDashboard,
  events: EventsModeration,
  users: UsersManagement,
}

const activeComponent = computed(() => {
  return tabComponents[activeTab.value] || AdminDashboard
})

const changeTab = (tab) => {
  activeTab.value = tab
}

const getTabTitle = (tab) => {
  const titles = {
    dashboard: 'Панель администратора',
    events: 'Модерация событий',
    users: 'Управление пользователями',
  }
  return titles[tab] || 'Админ-панель'
}

const getTabSubtitle = (tab) => {
  const subtitles = {
    dashboard: 'Обзор статистики и управления платформой',
    events: 'Модерация и управление игровыми событиями',
    users: 'Управление пользователями и правами доступа',
  }
  return subtitles[tab] || 'Управление платформой Play Time'
}
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  background: var(--light);
}

.container {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  position: relative;
}

.admin-section {
  padding: 8rem 4rem 2rem;
  display: flex;
  gap: 2rem;
}

.admin-content {
  flex: 1;
}

.admin-header {
  background: white;
  border-radius: 20px;
  padding: 1rem 3rem;
  box-shadow: var(--shadow);
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
}

.admin-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, var(--primary), var(--accent));
}

.admin-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  color: var(--secondary);
}

.admin-subtitle {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
  font-weight: 500;
}

@media (max-width: 1200px) {
  .admin-section {
    flex-direction: column;
  }
}

@media (max-width: 992px) {
  .admin-title {
    font-size: 2rem;
  }

  .admin-section {
    padding: 6rem 2rem 2rem;
  }
}

@media (max-width: 768px) {
  .admin-section {
    padding: 5rem 1.5rem 1.5rem;
  }

  .admin-header {
    padding: 2rem 1.5rem;
  }
}

@media (max-width: 576px) {
  .admin-title {
    font-size: 1.8rem;
  }

  .admin-section {
    padding: 5rem 1rem 1rem;
  }
}
</style>
