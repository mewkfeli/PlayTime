<template>
  <div class="profile-card">
    <div class="profile-actions" v-if="!isEditing">
      <button class="btn btn-primary" @click="startEditing">
        <i class="fas fa-edit"></i> Редактировать данные
      </button>
    </div>

    <CompactPersonalInfo
      :user-data="userData"
      :edit-data="editData"
      :is-editing="isEditing"
      :cities="cities"
      :validation-errors="validationErrors"
      @save-profile="handleSaveProfile"
      @cancel-edit="handleCancelEdit"
      @update:editData="handleEditDataUpdate"
    />

    <div class="action-buttons" v-if="isEditing">
      <button class="btn btn-success" @click="handleSave" :disabled="isLoading || !isFormValid">
        <i class="fas fa-save"></i> {{ isLoading ? 'Сохранение...' : 'Сохранить' }}
      </button>
      <button class="btn btn-secondary" @click="handleCancelEdit" :disabled="isLoading">
        <i class="fas fa-times"></i> Отменить
      </button>
    </div>

    <div v-if="isEditing && validationErrors.length" class="validation-errors">
      <div class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <span>Пожалуйста, заполните все обязательные поля:</span>
        <ul>
          <li v-for="error in validationErrors" :key="error">{{ error }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { userService } from '@/api/userService'
import CompactPersonalInfo from './profile/PersonalInfoSection.vue'

export default {
  name: 'ProfileCard',
  components: {
    CompactPersonalInfo,
  },
  props: {
    user: {
      type: Object,
      default: null,
    },
    userId: {
      type: [String, Number],
      default: null,
    },
  },
  data() {
    return {
      userData: {},
      editData: {},
      isEditing: false,
      cities: [],
      isLoading: false,
      originalEditData: null,
      validationErrors: [],
    }
  },
  computed: {
    currentUserId() {
      return this.userId || this.user?.userId || this.user?.id
    },
    isFormValid() {
      this.validateForm()
      return this.validationErrors.length === 0
    },
  },
  watch: {
    user: {
      handler(newUser) {
        if (newUser) {
          this.userData = { ...newUser }
          this.initializeEditData()
        }
      },
      immediate: true,
      deep: true,
    },
    userId: {
      handler(newUserId) {
        if (newUserId && !this.user) {
          this.loadUserData()
        }
      },
      immediate: true,
    },
    editData: {
      handler() {
        if (this.isEditing) {
          this.validateForm()
        }
      },
      deep: true,
    },
  },
  async mounted() {
    await this.loadCities()
    if (!this.user && this.currentUserId) {
      await this.loadUserData()
    } else if (this.user) {
      this.userData = { ...this.user }
      this.initializeEditData()
    }
  },
  methods: {
    validateForm() {
      const errors = []

      if (!this.editData.name?.trim()) {
        errors.push('Имя - обязательное поле')
      }

      if (!this.editData.email?.trim()) {
        errors.push('Email - обязательное поле')
      } else if (!this.isValidEmail(this.editData.email)) {
        errors.push('Введите корректный email адрес')
      }

      if (!this.editData.cityId) {
        errors.push('Город - обязательное поле')
      }

      if (!this.editData.birthDate) {
        errors.push('Дата рождения - обязательное поле')
      } else {
        const birthDate = new Date(this.editData.birthDate)
        const today = new Date()
        const minDate = new Date()
        minDate.setFullYear(today.getFullYear() - 100)
        const maxDate = new Date()
        maxDate.setFullYear(today.getFullYear() - 10)

        if (birthDate < minDate) {
          errors.push('Дата рождения не может быть более 100 лет назад')
        } else if (birthDate > maxDate) {
          errors.push('Возраст должен быть не менее 10 лет')
        }
      }

      if (!this.editData.contactInfo?.trim()) {
        errors.push('Контактная информация - обязательное поле')
      }

      if (!this.editData.description?.trim()) {
        errors.push('Описание - обязательное поле')
      } else if (this.editData.description.trim().length < 10) {
        errors.push('Описание должно содержать минимум 10 символов')
      }

      const hasNewPassword = this.editData.newPassword?.trim()

      if (hasNewPassword) {
        if (!this.editData.currentPassword?.trim()) {
          errors.push('Для смены пароля необходимо указать текущий пароль')
        }

        if (!this.editData.confirmNewPassword?.trim()) {
          errors.push('Для смены пароля необходимо подтвердить новый пароль')
        }

        if (hasNewPassword.length < 6) {
          errors.push('Новый пароль должен содержать минимум 6 символов')
        }

        if (this.editData.newPassword !== this.editData.confirmNewPassword) {
          errors.push('Новый пароль и подтверждение не совпадают')
        }
      }

      this.validationErrors = errors
    },

    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    },

    async loadUserData() {
      if (!this.currentUserId) {
        console.error('UserId не определен')
        return
      }

      try {
        this.userData = await userService.getProfileById(this.currentUserId)
        this.initializeEditData()
      } catch (error) {
        console.error('Ошибка загрузки данных пользователя:', error)
        this.$emit('error', 'Не удалось загрузить данные профиля')
      }
    },

    async loadCities() {
      try {
        this.cities = await userService.getCities()
      } catch (error) {
        console.error('Ошибка загрузки городов:', error)
        this.$emit('error', 'Не удалось загрузить список городов')
      }
    },

    startEditing() {
      this.originalEditData = JSON.parse(JSON.stringify(this.editData))
      this.isEditing = true
      this.validateForm()
    },

    async handleSave() {
      if (!this.currentUserId) {
        this.$emit('error', 'ID пользователя не определен')
        return
      }

      if (!this.isFormValid) {
        this.$emit('error', 'Пожалуйста, заполните все обязательные поля корректно')
        return
      }

      this.isLoading = true
      try {
        const updateData = this.prepareUpdateData()
        await this.handleSaveProfile(updateData)
      } catch (error) {
        console.error('Ошибка сохранения:', error)
      } finally {
        this.isLoading = false
      }
    },

    prepareUpdateData() {
      const data = {
        name: this.editData.name.trim(),
        email: this.editData.email.trim(),
        cityId: parseInt(this.editData.cityId),
        description: this.editData.description.trim(),
        contactInfo: this.editData.contactInfo.trim(),
      }

      if (this.editData.birthDate) {
        try {
          const date = new Date(this.editData.birthDate)
          if (!isNaN(date.getTime())) {
            data.birthDate = date.toISOString().split('T')[0]
          }
        } catch {
          console.warn('Неверный формат даты:', this.editData.birthDate)
        }
      }

      const hasNewPassword = this.editData.newPassword?.trim()
      if (hasNewPassword) {
        data.currentPassword = this.editData.currentPassword?.trim() || ''
        data.newPassword = this.editData.newPassword.trim()
        data.confirmNewPassword = this.editData.confirmNewPassword?.trim() || ''
      } else {
        // заглушка
      }

      return data
    },
    handleCancelEdit() {
      this.editData = JSON.parse(JSON.stringify(this.originalEditData))
      this.isEditing = false
      this.clearPasswordFields()
      this.validationErrors = []
    },

    clearPasswordFields() {
      this.editData.currentPassword = ''
      this.editData.newPassword = ''
      this.editData.confirmNewPassword = ''
    },

    initializeEditData() {
      this.editData = {
        name: this.userData.name || '',
        email: this.userData.email || '',
        cityId: this.userData.cityId || null,
        birthDate: this.userData.birthDate
          ? this.formatDateForInput(this.userData.birthDate)
          : null,
        description: this.userData.description || '',
        contactInfo: this.userData.contactInfo || '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      }
      this.originalEditData = JSON.parse(JSON.stringify(this.editData))
    },

    handleEditDataUpdate(newEditData) {
      this.editData = { ...newEditData }
    },

    async handleSaveProfile(updateData) {
      try {
        if (!this.currentUserId) {
          throw new Error('ID пользователя не определен')
        }

        const response = await userService.updateProfile(this.currentUserId, updateData)

        if (response.message) {
          this.userData = {
            ...this.userData,
            ...updateData,
          }

          this.isEditing = false
          this.clearPasswordFields()
          this.initializeEditData()
          this.validationErrors = []

          this.$emit('profile-updated')
          this.$notify({
            type: 'success',
            title: 'Успех',
            text: response.message,
          })
        }
      } catch (error) {
        console.error('❌ ПОЛНАЯ ИНФОРМАЦИЯ ОБ ОШИБКЕ:')
        console.error('Error object:', error)
        console.error('Response:', error.response)
        console.error('Response data:', error.response?.data)
        console.error('Response status:', error.response?.status)
        console.error('Response headers:', error.response?.headers)

        let errorMessage = 'Произошла ошибка при сохранении'

        if (error.response?.data) {
          const errorData = error.response.data

          if (errorData.errors) {
            const validationErrors = Object.entries(errorData.errors).map(
              ([field, messages]) => `${field}: ${messages.join(', ')}`,
            )
            errorMessage = `Ошибки валидации:\n${validationErrors.join('\n')}`
          } else if (typeof errorData === 'string') {
            errorMessage = errorData
          } else if (errorData.message) {
            errorMessage = errorData.message
          } else if (errorData.title) {
            errorMessage = errorData.title
          }
        } else if (error.message) {
          errorMessage = error.message
        }

        this.$emit('error', errorMessage)
        throw error
      }
    },

    formatDateForInput(dateString) {
      if (!dateString) return null
      try {
        const date = new Date(dateString)
        return date.toISOString().split('T')[0]
      } catch (error) {
        console.error('Ошибка форматирования даты:', error)
        return null
      }
    },
  },
}
</script>

<style scoped>
.validation-errors {
  margin-top: 1rem;
  padding: 1rem;
  background: #fff5f5;
  border: 1px solid #fed7d7;
  border-radius: 8px;
}

.error-message {
  color: #c53030;
  font-size: 0.9rem;
}

.error-message i {
  margin-right: 0.5rem;
}

.error-message ul {
  margin: 0.5rem 0 0 1rem;
  padding: 0;
}

.error-message li {
  margin-bottom: 0.25rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
