<template>
  <div>
    <div class="profile-header">
      <div class="card-header">
        <h2 class="card-title">Личная информация</h2>
      </div>
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Имя</div>
          <div class="info-value" v-if="!isEditing">{{ userData.firstName }}</div>
          <input v-else class="form-input" v-model="localEditData.firstName" type="text" />
        </div>

        <div class="info-item">
          <div class="info-label">Фамилия</div>
          <div class="info-value" v-if="!isEditing">{{ userData.lastName }}</div>
          <input v-else class="form-input" v-model="localEditData.lastName" type="text" />
        </div>

        <div class="info-item">
          <div class="info-label">Дата рождения</div>
          <div class="info-value" v-if="!isEditing">{{ formatDate(userData.date_birthday) }}</div>
          <input v-else class="form-input" v-model="localEditData.date_birthday" type="date" />
        </div>

        <div class="info-item">
          <div class="info-label">Город</div>
          <div class="info-value" v-if="!isEditing">{{ userData.city }}</div>
          <input v-else class="form-input" v-model="localEditData.city" type="text" />
        </div>

        <div class="info-item">
          <div class="info-label">Email</div>
          <div class="info-value" v-if="!isEditing">{{ userData.email }}</div>
          <input v-else class="form-input" v-model="localEditData.email" type="email" />
        </div>

        <div class="info-item">
          <div class="info-label">Контактная информация</div>
          <div class="info-value" v-if="!isEditing">{{ userData.contact }}</div>
          <input v-else class="form-input" v-model="localEditData.contact" type="text" />
        </div>
      </div>
    </div>

    <!-- Секция "О себе" -->
    <div class="card-header" style="margin-top: 2rem">
      <h2 class="card-title">О себе</h2>
    </div>
    <div class="info-item">
      <div class="info-value" v-if="!isEditing">{{ userData.aboutMe }}</div>
      <textarea v-else class="form-textarea" v-model="localEditData.aboutMe"></textarea>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PersonalInfoSection',
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
        // Проверяем, что дата валидна
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
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--secondary);
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.info-item {
  margin-bottom: 1rem;
}

.info-label {
  font-weight: 600;
  color: #666;
  margin-bottom: 0.3rem;
  font-size: 0.9rem;
}

.info-value {
  font-size: 1.1rem;
  color: var(--secondary);
}

.form-input {
  width: 100%;
  padding: 0.8rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: var(--transition);
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.1);
}

.form-textarea {
  width: 100%;
  padding: 0.8rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: var(--transition);
  font-family: inherit;
  min-height: 120px;
  resize: vertical;
}

.form-textarea:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.1);
}

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
