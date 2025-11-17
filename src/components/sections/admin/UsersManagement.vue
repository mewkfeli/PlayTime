<template>
  <div class="users-management">
    <div class="page-header">
      <h1 class="page-title">Управление пользователями</h1>
      <div class="page-subtitle">Просмотр и управление пользователями системы</div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">{{ users.length }}</div>
        <div class="stat-label">Всего пользователей</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ adminsCount }}</div>
        <div class="stat-label">Администраторов</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ regularUsersCount }}</div>
        <div class="stat-label">Обычных пользователей</div>
      </div>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Загрузка пользователей...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <div class="error-icon">⚠️</div>
      <h2>Ошибка загрузки</h2>
      <p>{{ error }}</p>
      <button class="btn btn-primary" @click="loadUsers">Попробовать снова</button>
    </div>

    <div v-else class="users-table-container">
      <div class="table-header">
        <div class="table-stats">Найдено пользователей: {{ filteredUsers.length }}</div>
        <div class="table-actions">
          <div class="filters-container">
            <div class="filter-group">
              <label for="search-input" class="filter-label">
                <i class="fas fa-search"></i>
              </label>
              <input id="search-input" v-model="searchQuery" type="text" class="search-input"
                placeholder="Поиск по имени..." />
            </div>
            <div class="filter-group">
              <label for="role-filter" class="filter-label">Роль:</label>
              <select id="role-filter" v-model="selectedRole" class="role-filter">
                <option value="all">Все роли</option>
                <option value="Администратор">Администраторы</option>
                <option value="Пользователь">Пользователи</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="users-table">
        <div class="table-row header-row">
          <div class="table-cell">№</div>
          <div class="table-cell">Имя</div>
          <div class="table-cell">Email</div>
          <div class="table-cell">Город</div>
          <div class="table-cell">Дата рождения</div>
          <div class="table-cell">Роль</div>
          <div class="table-cell">Дата регистрации</div>
          <div class="table-cell">Контакты</div>
        </div>

        <div v-if="filteredUsers.length === 0" class="empty-state">
          <i class="fas fa-users"></i>
          <p>Пользователи не найдены</p>
          <p v-if="searchQuery || selectedRole !== 'all'" class="empty-state-hint">
            Попробуйте изменить параметры поиска
          </p>
        </div>

        <div v-else v-for="user in filteredUsers" :key="user.userId" class="table-row">
          <div class="table-cell">
            <span class="user-id">#{{ user.userId }}</span>
          </div>

          <div class="table-cell user-info">
            <div class="user-name">{{ user.name }}</div>
            <div v-if="user.description" class="user-description">
              {{ user.description }}
            </div>
          </div>

          <div class="table-cell">
            <span class="user-email">{{ user.email }}</span>
          </div>

          <div class="table-cell">
            <span class="city-name">{{ getCityName(user.cityId) }}</span>
          </div>

          <div class="table-cell">
            <span class="birth-date">{{ formatDate(user.birthDate) }}</span>
          </div>

          <div class="table-cell">
            <select v-model="user.role" class="role-select" :class="getRoleClass(user.role)"
              @change="changeUserRole(user.userId, user.role, user.name)" :disabled="changingRoleId === user.userId">
              <option value="Пользователь">Пользователь</option>
              <option value="Администратор">Администратор</option>
            </select>
          </div>

          <div class="table-cell">
            <span class="created-date">{{ formatDateTime(user.createdAt) }}</span>
          </div>

          <div class="table-cell">
            <span v-if="user.contactInfo" class="contact-info">
              {{ user.contactInfo }}
            </span>
            <span v-else class="no-contact">—</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const loading = ref(false)
const error = ref('')
const users = ref([])
const cities = ref([])
const changingRoleId = ref(null)
const searchQuery = ref('')
const selectedRole = ref('all')

const filteredUsers = computed(() => {
  let filtered = users.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user =>
      user.name.toLowerCase().includes(query)
    )
  }

  if (selectedRole.value !== 'all') {
    filtered = filtered.filter(user => {
      if (selectedRole.value === 'Администратор') {
        return user.role === 'Администратор'
      } else if (selectedRole.value === 'Пользователь') {
        return user.role === 'Пользователь'
      }
      return true
    })
  }

  return filtered.sort((a, b) => {
    const dateA = new Date(a.createdAt)
    const dateB = new Date(b.createdAt)
    return dateB - dateA
  })
})

const adminsCount = computed(() => {
  return users.value.filter(
    (user) =>
      user.role === 'Администратор' || user.role === 'Administrator' || user.role === 'Admin',
  ).length
})

const regularUsersCount = computed(() => {
  return users.value.filter((user) => user.role === 'Пользователь' || user.role === 'User').length
})

const loadUsers = async () => {
  try {
    loading.value = true
    error.value = ''

    const response = await fetch('http://localhost:5119/api/User/GetUsers')

    if (!response.ok) {
      throw new Error(`Ошибка загрузки: ${response.status}`)
    }

    const data = await response.json()
    users.value = Array.isArray(data)
      ? data.map((user) => ({
        ...user,
        passwordHash: undefined,
      }))
      : []

    await loadCities()
  } catch {
    error.value = 'Не удалось загрузить список пользователей'
  } finally {
    loading.value = false
  }
}

const loadCities = async () => {
  try {
    const response = await fetch('http://localhost:5119/api/User/GetCity')
    if (response.ok) {
      const data = await response.json()
      cities.value = Array.isArray(data) ? data : []
    }
  } catch (err) {
    console.error('Ошибка загрузки городов:', err)
  }
}

const getCityName = (cityId) => {
  const city = cities.value.find((c) => c.cityId === cityId)
  return city ? city.cityName : `Город #${cityId}`
}

const changeUserRole = async (userId, newRole, userName) => {
  const currentUser = users.value.find((u) => u.userId === userId)
  if (!currentUser) return

  const confirmation = confirm(
    `Вы уверены, что хотите изменить роль пользователя "${userName}" на "${newRole}"?`,
  )

  if (!confirmation) {
    const originalUser = users.value.find((u) => u.userId === userId)
    if (originalUser) {
      originalUser.role = currentUser.role
    }
    return
  }

  try {
    changingRoleId.value = userId

    const url = `http://localhost:5119/api/Admin/ChangeRole/${userId}?role=${encodeURIComponent(newRole)}`

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        accept: '*/*',
      },
    })

    if (!response.ok) {
      let errorText = 'Неизвестная ошибка'
      try {
        errorText = await response.text()
      } catch {
        errorText = `${response.status}`
      }
      throw new Error(errorText)
    }

    const result = await response.text()
    alert(result || 'Роль успешно изменена!')

    await loadUsers()
  } catch (err) {
    alert('Ошибка при изменении роли: ' + err.message)
    const user = users.value.find((u) => u.userId === userId)
    if (user) {
      user.role = currentUser.role
    }
  } finally {
    changingRoleId.value = null
  }
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

const formatDateTime = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateString
  }
}

const getRoleClass = (role) => {
  switch (role) {
    case 'Администратор':
    case 'Administrator':
    case 'Admin':
      return 'role-admin'
    case 'Пользователь':
    case 'User':
      return 'role-user'
    default:
      return 'role-default'
  }
}

onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.users-management {
  padding: 2rem;
  max-width: 1800px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--secondary);
  margin: 0 0 0.5rem 0;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #666;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: var(--shadow);
  text-align: center;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #666;
  font-weight: 500;
}

.users-table-container {
  background: white;
  border-radius: 12px;
  box-shadow: var(--shadow);
  overflow: hidden;
  margin: 0 auto;
  width: 1200px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  background: #f8f9fa;
}

.table-stats {
  color: #666;
  font-weight: 500;
}

.table-actions {
  display: flex;
  gap: 1rem;
}

.filters-container {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-label {
  font-weight: 500;
  color: #666;
  font-size: 0.9rem;
}

.filter-label i {
  color: #999;
}

.search-input {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  font-size: 0.9rem;
  color: #333;
  transition: all 0.3s ease;
  min-width: 200px;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(var(--primary-rgb), 0.1);
}

.search-input::placeholder {
  color: #999;
}

.role-filter {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  font-size: 0.9rem;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;
}

.role-filter:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(var(--primary-rgb), 0.1);
}

.users-table {
  width: 100%;
}

.table-row {
  display: grid;
  grid-template-columns: 80px 1.5fr 1.5fr 1fr 1fr 1.2fr 1.5fr 1fr;
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

.user-id {
  font-weight: 600;
  color: #666;
  font-family: monospace;
  font-size: 0.9rem;
}

.user-info {
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
}

.user-name {
  font-weight: 600;
  color: var(--secondary);
  font-size: 1rem;
}

.user-description {
  font-size: 0.8rem;
  color: #666;
  line-height: 1.3;
  font-style: italic;
}

.user-email {
  color: var(--accent);
  font-weight: 500;
  word-break: break-all;
}

.city-name {
  color: #666;
  font-weight: 500;
}

.birth-date {
  color: #666;
  font-weight: 500;
}

.role-select {
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  border: 1px solid #e0e0e0;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.role-select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(108, 99, 255, 0.1);
}

.role-select.role-admin {
  background: rgba(255, 193, 7, 0.1);
  border-color: rgba(255, 193, 7, 0.3);
  color: #ffc107;
}

.role-select.role-user {
  background: rgba(76, 175, 80, 0.1);
  border-color: rgba(76, 175, 80, 0.3);
  color: var(--success);
}

.role-select.role-default {
  background: rgba(158, 158, 158, 0.1);
  border-color: rgba(158, 158, 158, 0.3);
  color: #9e9e9e;
}

.role-select:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.created-date {
  color: #666;
  font-size: 0.85rem;
}

.contact-info {
  color: var(--accent);
  font-weight: 500;
  word-break: break-all;
}

.no-contact {
  color: #999;
  font-style: italic;
}

.empty-state {
  padding: 3rem;
  text-align: center;
  color: #666;
  grid-column: 1 / -1;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #ccc;
}

.empty-state-hint {
  font-size: 0.9rem;
  color: #999;
  margin-top: 0.5rem;
}

/* Состояния загрузки */
.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  text-align: center;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-container h2 {
  color: var(--secondary);
  margin-bottom: 1rem;
}

.error-container p {
  color: #666;
  margin-bottom: 2rem;
}

@media (max-width: 1400px) {
  .users-table-container {
    overflow-x: auto;
  }

  .users-table {
    min-width: 1200px;
  }
}

@media (max-width: 768px) {
  .users-management {
    padding: 1rem;
  }

  .table-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    padding: 1rem;
  }

  .table-row.header-row {
    display: none;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .table-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .filters-container {
    flex-direction: column;
    width: 100%;
    gap: 1rem;
  }

  .filter-group {
    width: 100%;
  }

  .search-input,
  .role-filter {
    flex: 1;
    min-width: auto;
  }
}
</style>
