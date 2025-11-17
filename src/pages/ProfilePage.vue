<template>
  <div class="profile-page">
    <AppHeader />
    <main class="profile-section">
      <div v-if="isAuthenticated" class="profile-content">
        <PersonalInfoSection
          ref="personalInfoRef"
          :user-data="userData"
          :edit-data="editData"
          :is-editing="isEditing"
          :cities="cities"
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
        <UserCreatedEventsSection />
        <UserEventsSection />
        <div class="logout-section">
          <button class="btn btn-logout" @click="handleLogout">
            <i class="fas fa-sign-out-alt"></i>
            Выход
          </button>
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
import { userState, initUserSession, logout } from '@/composables/userSession'
import { useRouter } from 'vue-router'
import UserEventsSection from '@/components/sections/profile/UserEventsSection.vue'
import UserCreatedEventsSection from '@/components/sections/profile/UserCreatedEventsSection.vue'

const userData = ref({})
const editData = ref({})
const isEditing = ref(false)
const validationErrors = ref([])
const personalInfoRef = ref(null)
const cities = ref([])
const router = useRouter()

const loadCities = async () => {
  try {
    cities.value = await userService.getCities()
  } catch (error) {
    console.error('Ошибка загрузки городов:', error)
  }
}

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

    if (!personalInfoRef.value) {
      alert('Ошибка компонента формы')
      return
    }

    if (typeof personalInfoRef.value.validateForm !== 'function') {
      alert('Ошибка валидации формы')
      return
    }

    const validationErrorsArray = personalInfoRef.value.validateForm()

    if (validationErrorsArray && validationErrorsArray.length > 0) {
      const errorMessage = validationErrorsArray.join('\n• ')
      alert('Обнаружены ошибки:\n• ' + errorMessage)
      validationErrors.value = validationErrorsArray
      return
    }

    const userId = userState.userId

    if (!userId) {
      alert('Пользователь не авторизован')
      return
    }

    const dataToSend = {
      name: editData.value.name?.trim() || '',
      email: editData.value.email?.trim() || '',
      birthDate: editData.value.birthDate || '',
      cityId: editData.value.cityId || null,
      contactInfo: editData.value.contactInfo?.trim() || '',
      description: editData.value.description?.trim() || '',
    }

    const hasNewPassword = editData.value.newPassword?.trim()
    if (hasNewPassword) {
      dataToSend.currentPassword = editData.value.currentPassword
      dataToSend.newPassword = editData.value.newPassword
    }

    await userService.updateProfile(userId, dataToSend)

    await loadUserProfile()
    isEditing.value = false

    editData.value.currentPassword = ''
    editData.value.newPassword = ''
    editData.value.confirmNewPassword = ''

    alert('Профиль успешно обновлен!')

  } catch (error) {
    console.error('Ошибка сохранения профиля:', error)
    handleSaveError(error)
  }
}

const handleSaveError = (error) => {
  let errorMessage = 'Ошибка при сохранении профиля'

  if (error.response?.data) {
    const errorData = error.response.data

    if (errorData.errors) {
      const errorMessages = []
      for (const key in errorData.errors) {
        const fieldErrors = errorData.errors[key]
        errorMessages.push(...fieldErrors)
        validationErrors.value.push(...fieldErrors)
      }

      if (errorMessages.length > 0) {
        errorMessage = errorMessages.join('\n• ')
        alert('Ошибки валидации:\n• ' + errorMessage)
      }

    } else if (errorData.message) {
      errorMessage = errorData.message
      validationErrors.value.push(errorData.message)
      alert(errorMessage)
    } else {
      validationErrors.value.push('Ошибка при сохранении профиля')
      alert('Ошибка при сохранении профиля')
    }
  } else if (error.request) {
    errorMessage = 'Ошибка сети: не удалось подключиться к серверу'
    validationErrors.value.push(errorMessage)
    alert(errorMessage)
  } else {
    validationErrors.value.push(errorMessage)
    alert(errorMessage)
  }
}

const updateEditData = (newData) => {
  editData.value = newData
}

const handleLogout = async () => {
  if (confirm('Вы уверены, что хотите выйти?')) {
    try {
      await userService.logout()
      logout()
      router.push('/')
    } catch (error) {
      console.error('Ошибка при выходе:', error)
      logout()
      router.push('/')
    }
  }
}

onMounted(async () => {
  initUserSession()

  if (!isAuthenticated.value) {
    alert('Для перехода в личный профиль необходимо авторизоваться в системе!')
    router.push('/')
    return
  }

  await Promise.all([loadUserProfile(), loadCities()])
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

.logout-section {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  padding: 0 1rem;
  width: 100%;
  max-width: 600px;
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
  border-radius: 36.2px;
}

.btn-primary:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
}

.btn-secondary {
  background: #6c757d;
  color: white;
  border-radius: 36.2px;
}

.btn-secondary:hover {
  background: #545b62;
  transform: translateY(-2px);
}

.btn-success {
  background: #28a745;
  color: white;
  border-radius: 36.2px;
}

.btn-success:hover {
  background: #218838;
  transform: translateY(-2px);
}

.btn-logout {
  background: #dc3545;
  color: white;
  border-radius: 36.2px;
}

.btn-logout:hover {
  background: #c82333;
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

  .profile-actions,
  .logout-section {
    max-width: 300px;
  }
}
</style>
