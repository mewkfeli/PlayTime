import { reactive, computed } from 'vue'

export const userState = reactive({
  user: null,
  userId: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  userRole: '',
})

export function initUserSession() {
  let userJson = localStorage.getItem('user') || sessionStorage.getItem('user')
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  if (userJson && userJson !== 'undefined' && userJson !== '') {
    try {
      const userData = JSON.parse(userJson)
      userState.user = userData
      userState.userId = userData?.userId || userData?.id
      userState.token = token
      userState.userRole = userData?.role || userData?.userRole || 'Пользователь'
      userState.isAuthenticated = true

      console.log('User session initialized:', {
        role: userState.userRole,
        userData: userData,
      })
    } catch (e) {
      console.warn('Ошибка парсинга ', e)
      clearUserData()
    }
  }
  userState.isLoading = false
}

export function login(userData, token) {
  userState.user = userData
  userState.userId = userData?.userId || userData?.id
  userState.userRole = userData?.role || userData?.userRole || 'Пользователь'
  userState.token = token
  userState.isAuthenticated = true
  localStorage.setItem('user', JSON.stringify(userData))
  localStorage.setItem('token', token)
}

export function logout() {
  console.log('User logging out')
  clearUserData()
  localStorage.removeItem('user')
  localStorage.removeItem('token')
  sessionStorage.removeItem('user')
  sessionStorage.removeItem('token')
}

function clearUserData() {
  userState.user = null
  userState.userId = null
  userState.token = null
  userState.userRole = ''
  userState.isAuthenticated = false
}

export const useUser = () => {
  return {
    user: computed(() => userState.user),
    userId: computed(() => userState.userId),
    token: computed(() => userState.token),
    isAuthenticated: computed(() => userState.isAuthenticated),
    isLoading: computed(() => userState.isLoading),
    userName: computed(() => userState.user?.name),
    userEmail: computed(() => userState.user?.email),
    userRole: computed(() => userState.userRole),

    isAdmin: computed(() => {
      const role = userState.userRole
      console.log('Checking admin role:', role)
      return role === 'Администратор'
    }),
  }
}
