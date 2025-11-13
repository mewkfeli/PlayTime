<template>
  <div class="admin-page">
    <AppHeader />
    <div class="admin-container">
      <AdminSidebar :active-tab="activeTab" @tab-change="handleTabChange" />

      <div class="admin-content">
        <!-- Управление играми -->
        <GamesManagement v-if="activeTab === 'games'" />

        <!-- Модерация событий -->
        <EventsModeration v-if="activeTab === 'events'" />

        <!-- Управление пользователями -->
        <UsersManagement v-if="activeTab === 'users'" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppHeader from '@/components/ui/AppHeader.vue'
import AdminSidebar from '@/components/sections/admin/AdminSidebar.vue'
import GamesManagement from '@/components/sections/admin/GamesManagement.vue'
import EventsModeration from '@/components/sections/admin/EventsModeration.vue'
import UsersManagement from '@/components/sections/admin/UsersManagement.vue'

const activeTab = ref('games')

const handleTabChange = (tabId) => {
  activeTab.value = tabId
}
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  background: var(--light);
}

.admin-container {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 7rem 2rem 2rem;
}

.admin-content {
  min-height: 600px;
}

.tab-content {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: var(--shadow);
  min-height: 500px;
}

.tab-content h2 {
  color: var(--secondary);
  margin-bottom: 1rem;
  font-size: 1.8rem;
}

.tab-content p {
  color: #666;
  line-height: 1.6;
}

@media (max-width: 1200px) {
  .admin-container {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 6rem 1rem 1rem;
  }
}

@media (max-width: 768px) {
  .admin-container {
    padding: 5rem 1rem 1rem;
  }

  .tab-content {
    padding: 1.5rem;
  }
}
</style>
