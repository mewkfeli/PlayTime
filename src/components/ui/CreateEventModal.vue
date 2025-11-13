<template>
  <ModalWindow
    :is-open="isOpen"
    title="Создание события"
    subtitle="Заполните информацию о вашем игровом событии"
    submit-text="Создать событие"
    submit-icon="plus"
    :is-loading="isLoading"
    @close="$emit('close')"
    @submit="$emit('submit', formData)"
  >
    <template #form-content>
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">Название события *</label>
          <input
            type="text"
            class="form-input"
            v-model="formData.eventName"
            placeholder="Введите название события"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label">Игра *</label>
          <select class="form-input" v-model="formData.gameId" required>
            <option value="">Выберите игру</option>
            <option v-for="game in games" :key="game.gameId" :value="game.gameId">
              {{ game.gameName }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Дата и время *</label>
          <input
            type="datetime-local"
            class="form-input"
            v-model="formData.eventDatetime"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label">Место проведения *</label>
          <input
            type="text"
            class="form-input"
            v-model="formData.location"
            placeholder="Укажите место проведения"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label">Максимальное количество участников *</label>
          <input
            type="number"
            class="form-input"
            v-model="formData.maxParticipants"
            min="2"
            max="50"
            placeholder="От 2 до 50"
            required
          />
        </div>

        <div class="form-group full-width">
          <label class="form-label">Описание события</label>
          <textarea
            class="form-textarea"
            v-model="formData.description"
            placeholder="Опишите ваше событие, правила, особенности..."
            rows="4"
          ></textarea>
        </div>
      </div>
    </template>
  </ModalWindow>
</template>

<script setup>
import { reactive } from 'vue'
import ModalWindow from './ModalWindow.vue'

defineProps({
  isOpen: Boolean,
  games: {
    type: Array,
    default: () => [],
  },
  isLoading: Boolean,
})

defineEmits(['close', 'submit'])

const formData = reactive({
  eventName: '',
  gameId: '',
  eventDatetime: '',
  location: '',
  maxParticipants: 6,
  description: '',
})
</script>

<style scoped>
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--secondary);
  font-size: 0.9rem;
}

.form-input,
.form-textarea {
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  width: 100%;
  box-sizing: border-box;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary);
  background: white;
  box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
