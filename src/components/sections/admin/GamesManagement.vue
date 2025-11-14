<template>
  <div class="games-management">
    <div class="page-header">
      <h1 class="page-title">Управление играми</h1>
      <button class="btn btn-primary" @click="openAddModal">
        <i class="fas fa-plus"></i>
        Добавить игру
      </button>
    </div>

    <div class="search-section">
      <div class="search-input-container">
        <i class="fas fa-search search-icon"></i>
        <input
          v-model="searchTerm"
          type="text"
          class="search-input"
          placeholder="Поиск игры по названию..."
          @input="handleSearch"
        />
        <button v-if="searchTerm" class="clear-search" @click="clearSearch">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Загрузка игр...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <h2>Ошибка загрузки</h2>
      <p>{{ error }}</p>
      <button class="btn btn-primary" @click="loadGames">Попробовать снова</button>
    </div>

    <div v-else class="games-table-container">
      <div class="table-header">
        <div class="table-stats">Найдено игр: {{ filteredGames.length }}</div>
      </div>

      <div class="games-table">
        <div class="table-row header-row">
          <div class="table-cell">Название</div>
          <div class="table-cell">Жанр</div>
          <div class="table-cell">Игроки</div>
          <div class="table-cell">Дата создания</div>
          <div class="table-cell">Действия</div>
        </div>

        <div v-if="filteredGames.length === 0" class="empty-state">
          <i class="fas fa-gamepad"></i>
          <p>Игры не найдены</p>
        </div>

        <div v-else v-for="game in filteredGames" :key="game.gameId" class="table-row">
          <div class="table-cell game-name">
            <div class="game-title">{{ game.gameName }}</div>
            <div v-if="game.description" class="game-description">
              {{ game.description }}
            </div>
          </div>
          <div class="table-cell">
            <span class="genre-badge">{{ getGenreName(game.genreId) }}</span>
          </div>
          <div class="table-cell">
            <span class="players-count">
              {{ game.minPlayers }} - {{ game.maxPlayers }} игроков
            </span>
          </div>
          <div class="table-cell">
            {{ formatDate(game.createdAt) }}
          </div>
          <div class="table-cell actions">
            <button class="btn-icon btn-edit" @click="openEditModal(game)" title="Редактировать">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn-icon btn-delete" @click="deleteGame(game.gameId)" title="Удалить">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showAddModal" class="modal-overlay" @click.self="closeAddModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Добавить новую игру</h2>
          <button class="modal-close" @click="closeAddModal">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="addGame">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Название игры *</label>
                <input
                  v-model="newGame.gameName"
                  type="text"
                  class="form-input"
                  :class="{ 'input-error': formErrors.gameName }"
                  placeholder="Введите название игры"
                  required
                />
                <div v-if="formErrors.gameName" class="field-error">
                  {{ formErrors.gameName }}
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Жанр *</label>
                <select
                  v-model.number="newGame.genreId"
                  class="form-input"
                  :class="{ 'input-error': formErrors.genreId }"
                  required
                >
                  <option value="">Выберите жанр</option>
                  <option v-for="genre in genres" :key="genre.genreId" :value="genre.genreId">
                    {{ genre.genreName }}
                  </option>
                </select>
                <div v-if="formErrors.genreId" class="field-error">
                  {{ formErrors.genreId }}
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Минимальное количество игроков *</label>
                <input
                  v-model.number="newGame.minPlayers"
                  type="number"
                  class="form-input"
                  :class="{ 'input-error': formErrors.minPlayers }"
                  placeholder="Минимум игроков"
                  min="1"
                  required
                />
                <div v-if="formErrors.minPlayers" class="field-error">
                  {{ formErrors.minPlayers }}
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Максимальное количество игроков *</label>
                <input
                  v-model.number="newGame.maxPlayers"
                  type="number"
                  class="form-input"
                  :class="{ 'input-error': formErrors.maxPlayers }"
                  placeholder="Максимум игроков"
                  :min="newGame.minPlayers || 1"
                  required
                />
                <div v-if="formErrors.maxPlayers" class="field-error">
                  {{ formErrors.maxPlayers }}
                </div>
              </div>

              <div class="form-group full-width">
                <label class="form-label">Описание игры</label>
                <textarea
                  v-model="newGame.description"
                  class="form-textarea"
                  placeholder="Описание игры (необязательно)"
                  rows="3"
                ></textarea>
              </div>
            </div>

            <div class="modal-actions">
              <button
                type="button"
                class="btn btn-secondary"
                @click="closeAddModal"
                :disabled="addingGame"
              >
                Отмена
              </button>
              <button type="submit" class="btn btn-primary" :disabled="addingGame">
                <i class="fas fa-plus" v-if="!addingGame"></i>
                {{ addingGame ? 'Добавление...' : 'Добавить игру' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div v-if="showEditModal" class="modal-overlay" @click.self="closeEditModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Редактировать игру</h2>
          <button class="modal-close" @click="closeEditModal">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="updateGame">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Название игры *</label>
                <input
                  v-model="editGame.gameName"
                  type="text"
                  class="form-input"
                  :class="{ 'input-error': formErrors.gameName }"
                  placeholder="Введите название игры"
                  required
                />
                <div v-if="formErrors.gameName" class="field-error">
                  {{ formErrors.gameName }}
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Жанр *</label>
                <select
                  v-model.number="editGame.genreId"
                  class="form-input"
                  :class="{ 'input-error': formErrors.genreId }"
                  required
                >
                  <option value="">Выберите жанр</option>
                  <option v-for="genre in genres" :key="genre.genreId" :value="genre.genreId">
                    {{ genre.genreName }}
                  </option>
                </select>
                <div v-if="formErrors.genreId" class="field-error">
                  {{ formErrors.genreId }}
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Минимальное количество игроков *</label>
                <input
                  v-model.number="editGame.minPlayers"
                  type="number"
                  class="form-input"
                  :class="{ 'input-error': formErrors.minPlayers }"
                  placeholder="Минимум игроков"
                  min="1"
                  required
                />
                <div v-if="formErrors.minPlayers" class="field-error">
                  {{ formErrors.minPlayers }}
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Максимальное количество игроков *</label>
                <input
                  v-model.number="editGame.maxPlayers"
                  type="number"
                  class="form-input"
                  :class="{ 'input-error': formErrors.maxPlayers }"
                  placeholder="Максимум игроков"
                  :min="editGame.minPlayers || 1"
                  required
                />
                <div v-if="formErrors.maxPlayers" class="field-error">
                  {{ formErrors.maxPlayers }}
                </div>
              </div>

              <div class="form-group full-width">
                <label class="form-label">Описание игры</label>
                <textarea
                  v-model="editGame.description"
                  class="form-textarea"
                  placeholder="Описание игры (необязательно)"
                  rows="3"
                ></textarea>
              </div>
            </div>

            <div class="modal-actions">
              <button
                type="button"
                class="btn btn-secondary"
                @click="closeEditModal"
                :disabled="updatingGame"
              >
                Отмена
              </button>
              <button type="submit" class="btn btn-primary" :disabled="updatingGame">
                <i class="fas fa-save" v-if="!updatingGame"></i>
                {{ updatingGame ? 'Сохранение...' : 'Сохранить изменения' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const loading = ref(false)
const error = ref('')
const games = ref([])
const genres = ref([])
const searchTerm = ref('')
const showAddModal = ref(false)
const showEditModal = ref(false)
const addingGame = ref(false)
const updatingGame = ref(false)

const newGame = ref({
  gameName: '',
  genreId: '',
  minPlayers: '',
  maxPlayers: '',
  description: '',
})

const editGame = ref({
  gameId: '',
  gameName: '',
  genreId: '',
  minPlayers: '',
  maxPlayers: '',
  description: '',
})

const formErrors = ref({})

const loadGames = async () => {
  try {
    loading.value = true
    error.value = ''

    const response = await fetch('http://localhost:5119/api/Game/GetGames')

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    games.value = data
  } catch (err) {
    console.error('Ошибка загрузки игр:', err)
    error.value = 'Не удалось загрузить список игр'
  } finally {
    loading.value = false
  }
}

const loadGenres = async () => {
  try {
    const response = await fetch('http://localhost:5119/api/Game/GetGenres')

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    genres.value = Array.isArray(data) ? data : []

    console.log('Загружены жанры:', genres.value)
  } catch (err) {
    console.error('Ошибка загрузки жанров:', err)
  }
}

const getGenreName = (genreId) => {
  const genre = genres.value.find((g) => g.genreId === genreId)
  return genre ? genre.genreName : `Жанр #${genreId}`
}

const searchGames = async () => {
  if (!searchTerm.value.trim()) {
    await loadGames()
    return
  }

  try {
    loading.value = true
    const response = await fetch(
      `http://localhost:5119/api/Game/SearchGame?name=${encodeURIComponent(searchTerm.value)}`,
    )

    if (response.ok) {
      const data = await response.json()
      games.value = Array.isArray(data) ? data : []
    } else if (response.status === 400) {
      games.value = []
    } else {
      throw new Error(`${response.status}`)
    }
  } catch (err) {
    console.error('Ошибка поиска:', err)
    games.value = []
  } finally {
    loading.value = false
  }
}

const addGame = async () => {
  if (!validateForm(newGame.value)) return

  try {
    addingGame.value = true

    const response = await fetch('http://localhost:5119/api/Game/AddGame', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newGame.value),
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(errorData || 'Ошибка при добавлении игры')
    }

    const result = await response.text()

    alert(result || 'Игра успешно добавлена!')
    closeAddModal()
    await loadGames()
  } catch (err) {
    console.error('Ошибка добавления игры:', err)
    alert(err.message || 'Ошибка при добавлении игры')
  } finally {
    addingGame.value = false
  }
}

const updateGame = async () => {
  if (!validateForm(editGame.value)) return

  try {
    updatingGame.value = true

    const response = await fetch(
      `http://localhost:5119/api/Game/UpdateGame/${editGame.value.gameId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameName: editGame.value.gameName,
          genreId: editGame.value.genreId,
          minPlayers: editGame.value.minPlayers,
          maxPlayers: editGame.value.maxPlayers,
          description: editGame.value.description,
        }),
      },
    )

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(errorData || 'Ошибка при обновлении игры')
    }

    const result = await response.text()

    alert(result || 'Игра успешно обновлена!')
    closeEditModal()
    await loadGames()
  } catch (err) {
    console.error('Ошибка обновления игры:', err)
    alert(err.message || 'Ошибка при обновлении игры')
  } finally {
    updatingGame.value = false
  }
}

const deleteGame = async (gameId) => {
  if (!confirm('Вы уверены, что хотите удалить эту игру?')) {
    return
  }

  try {
    const response = await fetch(`http://localhost:5119/api/Game/RemoveGame?gameId=${gameId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(errorText || 'Ошибка при удалении игры')
    }

    const result = await response.text()
    alert(result || 'Игра успешно удалена!')
    await loadGames()
  } catch (err) {
    console.error('Ошибка удаления игры:', err)
    alert(err.message || 'Ошибка при удалении игры')
  }
}

const validateForm = (formData) => {
  formErrors.value = {}

  if (!formData.gameName?.trim()) {
    formErrors.value.gameName = 'Введите название игры'
    return false
  }

  if (!formData.genreId || formData.genreId < 1) {
    formErrors.value.genreId = 'Выберите жанр'
    return false
  }

  if (!formData.minPlayers || formData.minPlayers < 1) {
    formErrors.value.minPlayers = 'Введите минимальное количество игроков'
    return false
  }

  if (!formData.maxPlayers || formData.maxPlayers < formData.minPlayers) {
    formErrors.value.maxPlayers =
      'Максимальное количество игроков должно быть больше или равно минимальному'
    return false
  }

  return true
}

const openAddModal = () => {
  console.log('Opening add modal')
  showAddModal.value = true
  formErrors.value = {}
}

const openEditModal = (game) => {
  console.log('Opening edit modal')

  editGame.value = { ...game }
  showEditModal.value = true
  formErrors.value = {}
}

const closeAddModal = () => {
  showAddModal.value = false
  newGame.value = {
    gameName: '',
    genreId: '',
    minPlayers: '',
    maxPlayers: '',
    description: '',
  }
  formErrors.value = {}
}

const closeEditModal = () => {
  showEditModal.value = false
  editGame.value = {
    gameId: '',
    gameName: '',
    genreId: '',
    minPlayers: '',
    maxPlayers: '',
    description: '',
  }
  formErrors.value = {}
}

const handleSearch = () => {
  if (searchTerm.value.trim()) {
    searchGames()
  } else {
    loadGames()
  }
}

const clearSearch = () => {
  searchTerm.value = ''
  loadGames()
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU')
  } catch {
    return dateString
  }
}

const filteredGames = computed(() => {
  return games.value
})

onMounted(() => {
  loadGames()
  loadGenres()
})
</script>

<style scoped>
.games-management {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--secondary);
  margin: 0;
}

.search-section {
  margin-bottom: 2rem;
}

.search-input-container {
  position: relative;
  max-width: 950px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(255, 89, 111, 0.1);
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.clear-search {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.25rem;
}

.clear-search:hover {
  color: #333;
}

.games-table-container {
  background: white;
  border-radius: 12px;
  box-shadow: var(--shadow);
  overflow: hidden;
}

.table-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  background: #f8f9fa;
}

.table-stats {
  color: #666;
  font-weight: 500;
}

.games-table {
  width: 100%;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
}

.table-row.header-row {
  background: #f8f9ff;
  font-weight: 600;
  color: var(--secondary);
  border-bottom: 2px solid #e0e0e0;
}

.table-cell {
  display: flex;
  align-items: center;
}

.game-name {
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
}

.game-title {
  font-weight: 600;
  color: var(--secondary);
}

.game-description {
  font-size: 0.8rem;
  color: #666;
  line-height: 1.3;
}

.genre-badge {
  background: rgba(108, 99, 255, 0.1);
  color: var(--accent);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.players-count {
  color: #666;
  font-weight: 500;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.btn-edit {
  background: rgba(76, 175, 80, 0.1);
  color: var(--success);
}

.btn-edit:hover {
  background: rgba(76, 175, 80, 0.2);
}

.btn-delete {
  background: rgba(244, 67, 54, 0.1);
  color: #f44336;
}

.btn-delete:hover {
  background: rgba(244, 67, 54, 0.2);
}

.empty-state {
  padding: 3rem;
  text-align: center;
  color: #666;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #ccc;
}

/* Модальные окна */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e0e0e0;
  position: sticky;
  top: 0;
  background: white;
  border-radius: 12px 12px 0 0;
}

.modal-header h2 {
  margin: 0;
  color: var(--secondary);
  font-size: 1.5rem;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #666;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: #f0f0f0;
}

.modal-body {
  padding: 2rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
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
  box-shadow: 0 0 0 3px rgba(255, 89, 111, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

.input-error {
  border-color: #f44336 !important;
  background-color: #fff5f5 !important;
}

.field-error {
  color: #f44336;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
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
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--primary);
  color: white;
  border-radius: 36.5px;
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-dark);
  transform: translateY(-1px);
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #545b62;
  transform: translateY(-1px);
}

.form-input select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'><path fill='%23666' d='M2 0L0 2h4zm0 5L0 3h4z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 0.65rem;
  padding-right: 2.5rem;
}

.form-input select:focus {
  background-image: url("data:image/svg+xml;charset=US-ASCII,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'><path fill='%23333' d='M2 0L0 2h4zm0 5L0 3h4z'/></svg>");
}

@media (max-width: 768px) {
  .games-management {
    padding: 1rem;
  }

  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .table-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    padding: 1rem;
  }

  .table-row.header-row {
    display: none;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .modal-actions {
    flex-direction: column;
  }

  .modal-content {
    margin: 1rem;
    max-height: calc(100vh - 2rem);
  }
}
/* Модальные окны - исправленная версия */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 10001;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e0e0e0;
  background: white;
  border-radius: 12px 12px 0 0;
  position: sticky;
  top: 0;
}

.modal-header h2 {
  margin: 0;
  color: var(--secondary);
  font-size: 1.5rem;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #666;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: #f0f0f0;
}

.modal-body {
  padding: 2rem;
}
</style>
