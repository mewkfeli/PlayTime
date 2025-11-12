<template>
  <div class="profile-page">
    <AppHeader />
    <main class="profile-section">
      <ProfileCard
        :user-id="currentUserId"
        :user="profile"
        @profile-updated="refreshProfile"
        @error="handleError"
      />
      <!-- ... остальной код ... -->
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import AppHeader from '@/components/ui/AppHeader.vue'
import ProfileCard from '@/components/sections/ProfileCard.vue'
import { userService } from '@/api/userService'
import { userState, initUserSession } from '@/composables/userSession'

const profile = ref(null)

const currentUserId = computed(() => {
  return userState.userId || userState.user?.userId || userState.user?.id
})

async function refreshProfile() {
  if (currentUserId.value) {
    try {
      profile.value = await userService.getProfileById(currentUserId.value)
    } catch (e) {
      profile.value = null
      console.error('Ошибка загрузки профиля:', e)
    }
  }
}

function handleError(errorMessage) {
  alert('Ошибка: ' + errorMessage)
}

onMounted(async () => {
  initUserSession()
  await refreshProfile()
})
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
.user-info {
  margin: 2rem 0;
  padding: 2rem;
  background: #f8f8f8;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}
.user-field {
  margin-bottom: 1rem;
  font-size: 1.2rem;
}
</style>
