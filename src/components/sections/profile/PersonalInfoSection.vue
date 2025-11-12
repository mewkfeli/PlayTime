<template>
  <div class="compact-personal-info">
    <!-- Заголовок секции -->
    <div class="section-header">
      <h2 class="section-title">Личная информация</h2>
      <p class="section-subtitle">Основные данные профиля</p>
    </div>

    <!-- Компактная сетка -->
    <div class="compact-info-grid">
      <!-- Первая строка: Имя и Email -->
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

      <!-- Вторая строка: Дата рождения и Город -->
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
            </div>
            <select
              v-else
              class="compact-input"
              :class="{ 'input-error': hasError('город') }"
              v-model="localEditData.cityId"
              @change="emitUpdate"
            >
              <option :value="null">Выберите город</option>
              <option v-for="city in cities" :key="city.cityId" :value="city.cityId">
                {{ city.name }}
              </option>
            </select>
            <div v-if="isEditing && hasError('город')" class="field-error">
              {{ getErrorText('город') }}
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

    <!-- Компактная секция "О себе" -->
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

    <!-- Секция смены пароля -->
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

        <!-- Валидация пароля -->
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

        <!-- Общие ошибки пароля -->
        <div v-if="isEditing && hasPasswordErrors" class="password-errors">
          <div class="field-error" v-for="error in passwordErrors" :key="error">
            {{ error }}
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
      } catch (error) {
        console.error('Ошибка форматирования даты:', error)
        return dateString
      }
    },

    getCityName(cityId) {
      if (!cityId || !this.cities.length) return ''
      const city = this.cities.find((c) => c.cityId === cityId)
      return city ? city.name : ''
    },
  },
}
</script>

<style scoped>
.compact-personal-info {
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

.compact-row:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
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
  border-color: var(--accent);
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
  border-color: var(--accent);
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
  content: '⚠';
  font-size: 0.7rem;
}

.password-errors {
  margin-top: 1rem;
  padding: 0.75rem;
  background: #fff5f5;
  border: 1px solid #fed7d7;
  border-radius: 6px;
}

.password-errors .field-error {
  margin-bottom: 0.25rem;
}

.password-errors .field-error:last-child {
  margin-bottom: 0;
}
</style>
