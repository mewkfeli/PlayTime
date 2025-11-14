<template>
  <div class="compact-personal-info">
    <div class="section-header">
      <h2 class="section-title">Личная информация</h2>
      <p class="section-subtitle">Основные данные профиля</p>
    </div>

    <div class="compact-info-grid">
      <div class="compact-row">
        <div class="compact-field">
          <div class="field-header">
            <i class="fas fa-signature field-icon"></i>
            <span class="field-label">Имя</span>
            <span class="required-star">*</span>
          </div>
          <div class="field-content">
            <div class="field-value" v-if="!isEditing">
              {{ userData.name || 'Не указано' }}
            </div>
            <input
              v-else
              class="compact-input"
              :class="{ 'input-error': hasError('имя') }"
              v-model="localEditData.name"
              type="text"
              placeholder="Введите имя"
              @input="emitUpdate"
            />
            <div v-if="isEditing && hasError('имя')" class="field-error">
              {{ getErrorText('имя') }}
            </div>
          </div>
        </div>

        <div class="compact-field">
          <div class="field-header">
            <i class="fas fa-envelope field-icon"></i>
            <span class="field-label">Email</span>
            <span class="required-star">*</span>
          </div>
          <div class="field-content">
            <div class="field-value" v-if="!isEditing">{{ userData.email || 'Не указано' }}</div>
            <input
              v-else
              class="compact-input"
              :class="{ 'input-error': hasError('email') }"
              v-model="localEditData.email"
              type="email"
              placeholder="Введите почту"
              @input="emitUpdate"
            />
            <div v-if="isEditing && hasError('email')" class="field-error">
              {{ getErrorText('email') }}
            </div>
          </div>
        </div>
      </div>

      <div class="compact-row">
        <div class="compact-field">
          <div class="field-header">
            <i class="fas fa-birthday-cake field-icon"></i>
            <span class="field-label">Дата рождения</span>
            <span class="required-star">*</span>
          </div>
          <div class="field-content">
            <div class="field-value" v-if="!isEditing">
              {{ formatDate(userData.birthDate) || 'Не указано' }}
            </div>
            <input
              v-else
              class="compact-input"
              :class="{ 'input-error': hasError('дата рождения') }"
              v-model="localEditData.birthDate"
              type="date"
              @input="emitUpdate"
            />
            <div v-if="isEditing && hasError('дата рождения')" class="field-error">
              {{ getErrorText('дата рождения') }}
            </div>
          </div>
        </div>

        <div class="compact-field">
        <div class="field-header">
          <i class="fas fa-map-marker-alt field-icon"></i>
          <span class="field-label">Город</span>
          <span class="required-star">*</span>
        </div>
        <div class="field-content">
          <div class="field-value" v-if="!isEditing">
            {{ getCityName(userData.cityId) || 'Не указано' }}
            <small v-if="userData.cityId && !getCityName(userData.cityId)" style="color: orange;">
              (ID: {{ userData.cityId }})
            </small>
          </div>
          
          <div v-else class="custom-select-wrapper">
            <div 
              class="custom-select-header"
              :class="{ 'input-error': hasError('город'), 'open': isCityDropdownOpen }"
              @click="toggleCityDropdown"
            >
              <span class="selected-value">
                {{ getSelectedCityName || 'Выберите город' }}
              </span>
              <span class="custom-arrow" :class="{ 'rotated': isCityDropdownOpen }">▼</span>
            </div>
            
            <div v-if="isCityDropdownOpen" class="custom-select-dropdown">
              <div class="dropdown-search" v-if="cities.length > 5">
                <input
                  type="text"
                  v-model="citySearch"
                  placeholder="Поиск города..."
                  class="search-input"
                  @click.stop
                />
              </div>
              <div class="dropdown-list">
                <div 
                  class="dropdown-item"
                  :class="{ 'selected': !localEditData.cityId }"
                  @click="selectCity(null)"
                >
                  Выберите город
                </div>
                <div 
                  v-for="city in filteredCities" 
                  :key="city.cityId"
                  class="dropdown-item"
                  :class="{ 'selected': localEditData.cityId === city.cityId }"
                  @click="selectCity(city.cityId)"
                >
                  {{ city.cityName }}
                </div>
                <div v-if="filteredCities.length === 0" class="no-results">
                  Городы не найдены
                </div>
              </div>
            </div>
            <div v-if="isEditing && hasError('город')" class="field-error">
              {{ getErrorText('город') }}
            </div>
          </div>
        </div>
      </div>
    </div>

      <div class="compact-row">
        <div class="compact-field full-width">
          <div class="field-header">
            <i class="fas fa-phone-alt field-icon"></i>
            <span class="field-label">Контактная информация</span>
            <span class="required-star">*</span>
          </div>
          <div class="field-content">
            <div class="field-value" v-if="!isEditing">
              {{ userData.contactInfo || 'Не указано' }}
            </div>
            <input
              v-else
              class="compact-input"
              :class="{ 'input-error': hasError('контактная информация') }"
              v-model="localEditData.contactInfo"
              type="text"
              placeholder="Телефон, социальные сети или другие контакты"
              @input="emitUpdate"
            />
            <div v-if="isEditing && hasError('контактная информация')" class="field-error">
              {{ getErrorText('контактная информация') }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="compact-about-section">
      <div class="section-header">
        <h2 class="section-title">О себе</h2>
        <p class="section-subtitle">Расскажите о своих интересах и увлечениях</p>
      </div>

      <div class="compact-about-content">
        <div class="about-text" v-if="!isEditing">
          {{ userData.description || 'Информация о себе пока не добавлена...' }}
        </div>
        <div v-else class="about-edit">
          <textarea
            class="compact-textarea"
            :class="{ 'input-error': hasError('описание') }"
            v-model="localEditData.description"
            placeholder="Расскажите о своих интересах, хобби, игровых предпочтениях..."
            rows="3"
            @input="emitUpdate"
          ></textarea>
          <div v-if="isEditing && hasError('описание')" class="field-error">
            {{ getErrorText('описание') }}
          </div>
          <div class="textarea-hint">Минимум 10 символов для описания</div>
        </div>
      </div>
    </div>

    <div class="compact-password-section" v-if="isEditing">
      <div class="section-header">
        <h2 class="section-title">Смена пароля</h2>
        <p class="section-subtitle">Заполните только если хотите изменить пароль</p>
      </div>

      <div class="compact-password-content">
        <div class="compact-row">
          <div class="compact-field">
            <div class="field-header">
              <i class="fas fa-lock field-icon"></i>
              <span class="field-label">Текущий пароль</span>
            </div>
            <div class="field-content">
              <input
                class="compact-input"
                :class="{ 'input-error': hasError('текущий пароль') || hasError('пароль') }"
                v-model="localEditData.currentPassword"
                type="password"
                placeholder="Введите текущий пароль"
                @input="emitUpdate"
              />
            </div>
          </div>

          <div class="compact-field">
            <div class="field-header">
              <i class="fas fa-key field-icon"></i>
              <span class="field-label">Новый пароль</span>
            </div>
            <div class="field-content">
              <input
                class="compact-input"
                :class="{ 'input-error': hasError('новый пароль') || hasError('пароль') }"
                v-model="localEditData.newPassword"
                type="password"
                placeholder="Введите новый пароль"
                @input="emitUpdate"
              />
            </div>
          </div>
        </div>

        <div class="compact-row">
          <div class="compact-field full-width">
            <div class="field-header">
              <i class="fas fa-check-circle field-icon"></i>
              <span class="field-label">Подтверждение нового пароля</span>
            </div>
            <div class="field-content">
              <input
                class="compact-input"
                :class="{ 'input-error': hasError('подтверждение') || hasError('пароль') }"
                v-model="localEditData.confirmNewPassword"
                type="password"
                placeholder="Повторите новый пароль"
                @input="emitUpdate"
              />
            </div>
          </div>
        </div>

        <div class="password-validation" v-if="showPasswordValidation">
          <div class="validation-item" :class="{ valid: isPasswordMatch }">
            <i class="fas" :class="isPasswordMatch ? 'fa-check' : 'fa-times'"></i>
            <span>Пароли совпадают</span>
          </div>
          <div class="validation-item" :class="{ valid: isPasswordStrong }">
            <i class="fas" :class="isPasswordStrong ? 'fa-check' : 'fa-times'"></i>
            <span>Пароль достаточно надежный</span>
          </div>
        </div>

        
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompactPersonalInfo',
  props: {
    userData: {
      type: Object,
      default: () => ({}),
    },
    editData: {
      type: Object,
      default: () => ({}),
    },
    isEditing: Boolean,
    cities: {
      type: Array,
      default: () => [],
    },
    validationErrors: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      localEditData: { ...this.editData },
      isCityDropdownOpen: false,
      citySearch: ''
    }
  },
  computed: {
    showPasswordValidation() {
      return (
        this.isEditing && (this.localEditData.newPassword || this.localEditData.confirmNewPassword)
      )
    },
    isPasswordMatch() {
      return (
        this.localEditData.newPassword === this.localEditData.confirmNewPassword &&
        this.localEditData.newPassword !== ''
      )
    },
    isPasswordStrong() {
      return this.localEditData.newPassword && this.localEditData.newPassword.length >= 6
    },
    hasPasswordErrors() {
      return this.passwordErrors.length > 0
    },
    passwordErrors() {
      return this.validationErrors.filter(
        (error) =>
          error.toLowerCase().includes('пароль') ||
          error.toLowerCase().includes('текущий') ||
          error.toLowerCase().includes('новый') ||
          error.toLowerCase().includes('подтверждение'),
      )
    },
    getSelectedCityName() {
      if (!this.localEditData.cityId) return ''
      const city = this.cities.find(c => c.cityId === this.localEditData.cityId)
      return city ? city.cityName : ''
    },
    filteredCities() {
      if (!this.citySearch) return this.cities
      return this.cities.filter(city =>
        city.cityName.toLowerCase().includes(this.citySearch.toLowerCase())
      )
    }
  },
  watch: {
    editData: {
      handler(newVal) {
        this.localEditData = { ...newVal }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    validateForm() {
      const errors = []

      if (!this.localEditData.name?.trim()) {
        errors.push('Имя является обязательным полем')
      } else if (this.localEditData.name.trim().length < 2) {
        errors.push('Имя должно содержать минимум 2 символа')
      } else if (this.localEditData.name.trim().length > 50) {
        errors.push('Имя не должно превышать 50 символов')
      }

      if (!this.localEditData.email?.trim()) {
        errors.push('Email является обязательным полем')
      } else if (!this.isValidEmail(this.localEditData.email)) {
        errors.push('Введите корректный email')
      }

      if (!this.localEditData.birthDate) {
        errors.push('Дата рождения является обязательным полем')
      } else {
        const birthDate = new Date(this.localEditData.birthDate)
        const today = new Date()
        const minDate = new Date()
        minDate.setFullYear(today.getFullYear() - 100)
        const maxDate = new Date()
        maxDate.setFullYear(today.getFullYear() - 10)

        if (birthDate > today) {
          errors.push('Дата рождения не может быть в будущем')
        } else if (birthDate < minDate) {
          errors.push('Дата рождения не может быть более 100 лет назад')
        } else if (birthDate > maxDate) {
          errors.push('Возраст должен быть не менее 10 лет')
        }
      }

      if (!this.localEditData.cityId) {
        errors.push('Город является обязательным полем')
      }

      if (!this.localEditData.contactInfo?.trim()) {
        errors.push('Контактная информация является обязательным полем')
      } else if (this.localEditData.contactInfo.trim().length < 5) {
        errors.push('Контактная информация должна содержать минимум 5 символов')
      }

      if (this.localEditData.newPassword || this.localEditData.confirmNewPassword) {
        if (!this.localEditData.currentPassword) {
          errors.push('Для смены пароля необходимо указать текущий пароль')
        }

        if (this.localEditData.newPassword !== this.localEditData.confirmNewPassword) {
          errors.push('Новый пароль и подтверждение не совпадают')
        }

        if (this.localEditData.newPassword && this.localEditData.newPassword.length < 6) {
          errors.push('Новый пароль должен содержать минимум 6 символов')
        }
      }

      return errors
    },

    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    },

    hasError(fieldName) {
      return this.validationErrors.some((error) =>
        error.toLowerCase().includes(fieldName.toLowerCase()),
      )
    },

    getErrorText(fieldName) {
      const error = this.validationErrors.find((error) =>
        error.toLowerCase().includes(fieldName.toLowerCase()),
      )
      return error || ''
    },

    emitUpdate() {
      this.$emit('update:editData', { ...this.localEditData })
    },

    formatDate(dateString) {
      if (!dateString) return ''
      try {
        const date = new Date(dateString)
        return date.toLocaleDateString('ru-RU')
      } catch {
        return dateString
      }
    },

    getCityName(cityId) {
      if (!cityId) return ''

      try {
        for (let i = 0; i < this.cities.length; i++) {
          const city = this.cities[i]
          if (city.cityId === cityId) {
            return city.cityName
          }
        }
        return ''
      } catch {
        return ''
      }
    },

    toggleCityDropdown() {
      this.isCityDropdownOpen = !this.isCityDropdownOpen
      if (this.isCityDropdownOpen) {
        this.citySearch = ''
      }
    },

    selectCity(cityId) {
      this.localEditData.cityId = cityId
      this.isCityDropdownOpen = false
      this.citySearch = ''
      this.emitUpdate()
    },

    closeDropdowns(event) {
      if (!event.target.closest('.custom-select-wrapper')) {
        this.isCityDropdownOpen = false
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.closeDropdowns)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.closeDropdowns)
  }
}
</script>

<style scoped>
.compact-personal-info {
  width: 1000px;
  margin: 1.5rem 0;
  padding: 0;
}

.section-header {
  text-align: center;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--secondary);
  margin-bottom: 0.5rem;
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: var(--primary);
  border-radius: 2px;
}

.section-subtitle {
  color: #666;
  font-size: 1rem;
  margin-top: 0.8rem;
}

.compact-info-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.compact-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  background: white;
  border-radius: 12px;
  padding: 1.2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(108, 99, 255, 0.1);
  transition: all 0.3s ease;
}
.compact-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.compact-field.full-width {
  grid-column: 1 / -1;
}

.field-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.3rem;
}

.field-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: white;
  flex-shrink: 0;
}

.field-label {
  font-weight: 600;
  color: var(--secondary);
  font-size: 0.9rem;
}

.field-content {
  padding-left: 0.1rem;
}

.field-value {
  font-size: 1.1rem;
  color: var(--secondary);
  font-weight: 500;
  line-height: 1.4;
  min-height: 1.4em;
  padding: 0.2rem 0;
}

.field-value:empty::before {
  content: 'Не указано';
  color: #999;
  font-style: italic;
}

.compact-input {
  background: #f8f9ff;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 0.6rem 0.8rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  width: 100%;
}

.compact-input:focus {
  outline: none;
  border-color: var(--primary);
  background: white;
  box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.1);
}

select.compact-input {
  cursor: pointer;
}

.compact-about-section {
  margin-top: 2rem;
}

.compact-about-content {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(108, 99, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.compact-about-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, var(--primary), var(--accent));
}

.about-text {
  font-size: 1rem;
  line-height: 1.5;
  color: var(--secondary);
  text-align: center;
  padding: 1rem;
}

.about-text:empty::before {
  content: 'Информация о себе пока не добавлена...';
  color: #999;
  font-style: italic;
}

.about-edit {
  position: relative;
}

.compact-textarea {
  background: #f8f9ff;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  font-size: 1rem;
  line-height: 1.5;
  resize: vertical;
  min-height: 80px;
  transition: all 0.3s ease;
  width: 100%;
  font-family: inherit;
}

.compact-textarea:focus {
  outline: none;
  border-color: var(--primary);
  background: white;
  box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.1);
}

.textarea-hint {
  font-size: 0.8rem;
  color: #888;
  margin-top: 0.5rem;
  text-align: center;
}

.compact-password-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #f0f0f0;
}

.compact-password-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.password-validation {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}

.validation-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #e74c3c;
  transition: color 0.3s ease;
}

.validation-item.valid {
  color: #27ae60;
}

.validation-item i {
  width: 16px;
}

.required-star {
  color: #e53e3e;
  margin-left: 0.25rem;
}

.input-error {
  border-color: #e53e3e !important;
  background-color: #fff5f5 !important;
}

.compact-input.input-error:focus {
  border-color: #e53e3e !important;
  box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1) !important;
}

.field-error {
  color: #e53e3e;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.field-error::before {
  font-size: 0.7rem;
}
.custom-select-wrapper {
  position: relative;
  width: 100%;
  z-index: 100;
}

.custom-select-header {
  background: #f8f9ff;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 0.6rem 0.8rem;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  min-height: 44px;
}

.custom-select-header:hover {
  border-color: #c0c0c0;
}

.custom-select-header.open {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.1);
}

.custom-select-header.input-error {
  border-color: #e53e3e;
  background-color: #fff5f5;
}

.selected-value {
  color: var(--secondary);
}

.custom-arrow {
  transition: transform 0.3s ease;
  color: #666;
  font-size: 0.8rem;
}

.custom-arrow.rotated {
  transform: rotate(180deg);
}

.custom-select-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white !important;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  z-index: 1001;
  margin-top: 4px;
  overflow: hidden;
  opacity: 1 !important;
  visibility: visible !important;
}

.dropdown-search {
  padding: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 0.9rem;
  outline: none;
}

.search-input:focus {
  border-color: var(--primary);
}

.dropdown-list {
  max-height: 200px;
  overflow-y: auto;
  background: white !important;
}

.dropdown-item {
  padding: 10px 12px;
  cursor: pointer;
  border-bottom: 1px solid #f8f9fa;
  transition: background-color 0.2s ease;
  font-size: 0.95rem;
  background: white;
}

.dropdown-item:hover {
  background: white;
  opacity: 1;
}

.dropdown-item.selected {
  background: var(--primary) !important;
  color: white;
  opacity: 1 !important;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.no-results {
  padding: 16px;
  text-align: center;
  color: #666;
  font-style: italic;
}

.dropdown-list::-webkit-scrollbar {
  width: 6px;
}

.dropdown-list::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.dropdown-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.dropdown-list::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

@media (max-width: 768px) {
  .custom-select-dropdown {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90vw;
    max-width: 400px;
    max-height: 60vh;
  }
}
</style>
