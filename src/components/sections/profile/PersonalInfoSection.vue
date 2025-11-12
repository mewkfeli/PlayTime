<template>
  <div class="compact-personal-info">
    <!-- Заголовок секции -->
    <div class="section-header">
      <h2 class="section-title">Личная информация</h2>
      <p class="section-subtitle">Основные данные профиля</p>
    </div>

    <!-- Компактная сетка -->
    <div class="compact-info-grid">
      <!-- Первая строка: Имя и Фамилия -->
      <div class="compact-row">
        <div class="compact-field">
          <div class="field-header">
            <i class="fas fa-signature field-icon"></i>
            <span class="field-label">Имя</span>
          </div>
          <div class="field-content">
            <div class="field-value" v-if="!isEditing">
              {{ userData.firstName || 'Не указано' }}
            </div>
            <input
              v-else
              class="compact-input"
              v-model="localEditData.firstName"
              type="text"
              placeholder="Введите имя"
            />
          </div>
        </div>

        <div class="compact-field">
          <div class="field-header">
            <i class="fas fa-user-tag field-icon"></i>
            <span class="field-label">Фамилия</span>
          </div>
          <div class="field-content">
            <div class="field-value" v-if="!isEditing">{{ userData.lastName || 'Не указано' }}</div>
            <input
              v-else
              class="compact-input"
              v-model="localEditData.lastName"
              type="text"
              placeholder="Введите фамилию"
            />
          </div>
        </div>
      </div>

      <!-- Вторая строка: Дата рождения и Город -->
      <div class="compact-row">
        <div class="compact-field">
          <div class="field-header">
            <i class="fas fa-birthday-cake field-icon"></i>
            <span class="field-label">Дата рождения</span>
          </div>
          <div class="field-content">
            <div class="field-value" v-if="!isEditing">
              {{ formatDate(userData.date_birthday) }}
            </div>
            <input v-else class="compact-input" v-model="localEditData.date_birthday" type="date" />
          </div>
        </div>

        <div class="compact-field">
          <div class="field-header">
            <i class="fas fa-map-marker-alt field-icon"></i>
            <span class="field-label">Город</span>
          </div>
          <div class="field-content">
            <div class="field-value" v-if="!isEditing">{{ userData.city || 'Не указано' }}</div>
            <input
              v-else
              class="compact-input"
              v-model="localEditData.city"
              type="text"
              placeholder="Введите город"
            />
          </div>
        </div>
      </div>

      <!-- Третья строка: Email и Контакты -->
      <div class="compact-row">
        <div class="compact-field">
          <div class="field-header">
            <i class="fas fa-envelope field-icon"></i>
            <span class="field-label">Email</span>
          </div>
          <div class="field-content">
            <div class="field-value" v-if="!isEditing">{{ userData.email || 'Не указано' }}</div>
            <input
              v-else
              class="compact-input"
              v-model="localEditData.email"
              type="email"
              placeholder="Введите email"
            />
          </div>
        </div>

        <div class="compact-field">
          <div class="field-header">
            <i class="fas fa-phone-alt field-icon"></i>
            <span class="field-label">Контакты</span>
          </div>
          <div class="field-content">
            <div class="field-value" v-if="!isEditing">{{ userData.contact || 'Не указано' }}</div>
            <input
              v-else
              class="compact-input"
              v-model="localEditData.contact"
              type="text"
              placeholder="Телефон или другие контакты"
            />
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
          {{ userData.aboutMe || 'Информация о себе пока не добавлена...' }}
        </div>
        <div v-else class="about-edit">
          <textarea
            class="compact-textarea"
            v-model="localEditData.aboutMe"
            placeholder="Расскажите о своих интересах, хобби, игровых предпочтениях..."
            rows="3"
          ></textarea>
          <div class="textarea-hint">Минимум 50 символов для лучшего описания</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompactPersonalInfo',
  props: {
    userData: Object,
    editData: Object,
    isEditing: Boolean,
  },
  data() {
    return {
      localEditData: { ...this.editData },
    }
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return 'Не указано'

      try {
        const date = new Date(dateString)
        if (isNaN(date.getTime())) {
          return 'Неверный формат даты'
        }
        return date.toLocaleDateString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      } catch {
        return 'Неверный формат даты'
      }
    },
  },
  watch: {
    editData: {
      handler(newVal) {
        this.localEditData = { ...newVal }
      },
      deep: true,
    },
    localEditData: {
      handler(newVal) {
        this.$emit('update:editData', newVal)
      },
      deep: true,
    },
  },
}
</script>

<style scoped>
.compact-personal-info {
  margin: 1.5rem 0;
  padding: 0;
}

/* Стили для заголовка секции */
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

/* Компактная сетка */
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

/* Стили для полей ввода */
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

/* Компактная секция "О себе" */
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
</style>
