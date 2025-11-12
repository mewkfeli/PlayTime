<template>
  <div class="profile-page">
    <AppHeader />
    <main class="profile-section">
      <ProfileCard />
      <EventsSection />
      <div class="delete-section">
        <button class="btn btn-outline" @click="deleteProfile">
          <i class="fas fa-trash-alt"></i> Удалить профиль
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import AppHeader from '@/components/ui/AppHeader.vue'
import ProfileCard from '@/components/sections/ProfileCard.vue'
import EventsSection from '@/components/sections/EventsSection.vue'

const deleteProfile = () => {
  if (confirm('Вы точно хотите удалить профиль? Это действие нельзя отменить.')) {
    alert('Профиль удален!')
  }
}
</script>

<style scoped>
.profile-section {
  padding: 7rem 2rem 3rem;
  max-width: 1200px;
  margin: 0 auto;
}

.delete-section {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.delete-section .btn {
  max-width: 300px;
}
</style>
