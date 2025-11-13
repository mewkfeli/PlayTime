<template>
  <div class="profile-page">
    <AppHeader />
    <main class="profile-section">
      <div v-if="isAuthenticated" class="profile-content">
        <PersonalInfoSection
          :user-data="userData"
          :edit-data="editData"
          :is-editing="isEditing"
          :validation-errors="validationErrors"
          @update:edit-data="updateEditData"
        />

        <div class="profile-actions">
          <button v-if="!isEditing" class="btn btn-primary" @click="startEditing">
            <i class="fas fa-edit"></i>
            Редактировать профиль
          </button>
          <div v-else class="edit-actions">
            <button class="btn btn-success" @click="saveProfile">
              <i class="fas fa-save"></i>
              Сохранить изменения
            </button>
            <button class="btn btn-secondary" @click="cancelEditing">
              <i class="fas fa-times"></i>
              Отмена
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppHeader from '@/components/ui/AppHeader.vue'
import PersonalInfoSection from '@/components/sections/profile/PersonalInfoSection.vue'
import { userService } from '@/api/userService'
import { userState, initUserSession } from '@/composables/userSession'
import { useRouter } from 'vue-router'
const userData = ref({})
const editData = ref({})
const isEditing = ref(false)
const validationErrors = ref([])
const router = useRouter()
const isAuthenticated = computed(() => userState.isAuthenticated)

const loadUserProfile = async () => {
  if (!isAuthenticated.value) return

  const userId = userState.userId || userState.user?.userId || userState.user?.id
  if (userId) {
    try {
      userData.value = await userService.getProfileById(userId)
      editData.value = { ...userData.value }
    } catch (error) {
      console.error('Ошибка загрузки профиля:', error)
      userData.value = {}
      editData.value = {}
    }
  }
}

const startEditing = () => {
  isEditing.value = true
}

const cancelEditing = () => {
  isEditing.value = false
  editData.value = { ...userData.value }
  validationErrors.value = []
}

const saveProfile = async () => {
  try {
    validationErrors.value = []

    if (!editData.value.name?.trim()) {
      validationErrors.value.push('Имя обязательно для заполнения')
    }
    if (!editData.value.email?.trim()) {
      validationErrors.value.push('Email обязателен для заполнения')
    }

    if (validationErrors.value.length > 0) return

    const userId = userState.userId
    if (userId) {
      await userService.updateProfile(userId, editData.value)
      await loadUserProfile()
      isEditing.value = false
      alert('Профиль успешно обновлен!')
    }
  } catch (error) {
    console.error('Ошибка сохранения профиля:', error)
    validationErrors.value.push('Ошибка при сохранении профиля')
  }
}

const updateEditData = (newData) => {
  editData.value = newData
}

onMounted(async () => {
  initUserSession()

  if (!isAuthenticated.value) {
    alert('Для перехода в личный профиль необходимо авторизоваться в системе!')
    router.push('/')
    return
  }

  await loadUserProfile()
})
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: var(--light);
}

.profile-section {
  padding: 7rem 2rem 3rem;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-content {
  animation: fadeIn 0.5s ease-in;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.profile-actions {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  padding: 0 1rem;
  width: 100%;
  max-width: 600px;
}

.edit-actions {
  display: flex;
  gap: 1rem;
  width: 100%;
  justify-content: center;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.btn-primary {
  background: var(--primary);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #545b62;
  transform: translateY(-2px);
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-success:hover {
  background: #218838;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .profile-section {
    padding: 6rem 1rem 2rem;
  }

  .edit-actions {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .profile-actions {
    max-width: 300px;
  }
}
</style>
