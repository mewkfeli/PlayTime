import { reactive, computed } from 'vue'

export const userState = reactive({
  user: null,
  userId: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
})

export function initUserSession() {
  let userJson = localStorage.getItem('user') || sessionStorage.getItem('user')
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  if (userJson && userJson !== 'undefined' && userJson !== '') {
    try {
      userState.user = JSON.parse(userJson)
      userState.userId = userState.user?.userId || userState.user?.id
      userState.token = token
      userState.isAuthenticated = true
    } catch (e) {
      userState.user = null
      userState.userId = null
      userState.token = null
      userState.isAuthenticated = false
      console.warn('Ошибка парсинга ', e)
    }
  }
  userState.isLoading = false
}

// Функция входа
export function login(userData, token) {
  userState.user = userData
  userState.userId = userData?.userId || userData?.id
  userState.token = token
  userState.isAuthenticated = true
  localStorage.setItem('user', JSON.stringify(userData))
  localStorage.setItem('token', token)
}

// Функция выхода
export function logout() {
  userState.user = null
  userState.userId = null
  userState.token = null
  userState.isAuthenticated = false
  localStorage.removeItem('user')
  localStorage.removeItem('token')
  sessionStorage.removeItem('user')
  sessionStorage.removeItem('token')
}

// Computed свойства для удобства
export const useUser = () => {
  return {
    user: computed(() => userState.user),
    userId: computed(() => userState.userId),
    token: computed(() => userState.token),
    isAuthenticated: computed(() => userState.isAuthenticated),
    isLoading: computed(() => userState.isLoading),
    userName: computed(() => userState.user?.name),
    userEmail: computed(() => userState.user?.email),
  }
}
