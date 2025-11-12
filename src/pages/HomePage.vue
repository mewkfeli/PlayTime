<template>
  <div class="container">
    <section class="section top-section">
      <div class="gradient-bg"></div>
      <FloatingElements />
      <AppHeader />
      <HeroSection @open-register="openRegisterModal" />
    </section>

    <ModalWindow
      :is-open="isRegisterModalOpen"
      title="Присоединиться"
      subtitle="Создайте аккаунт чтобы начать играть"
      submit-text="Создать аккаунт"
      submit-icon="fas fa-user-plus"
      footer-text="Уже есть аккаунт?"
      switch-text="Войти в аккаунт"
      :is-loading="isRegisterLoading"
      @close="closeRegisterModal"
      @submit="handleRegister"
      @switch="switchToLogin"
    >
      <template #form-content>
        <div class="form-group">
          <label class="form-label">Имя</label>
          <input
            v-model="registerForm.name"
            type="text"
            class="form-input"
            :disabled="isRegisterLoading"
            required
          />
          <div class="error-message" :class="{ show: registerErrors.name }">
            {{ registerErrors.name }}
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Email</label>
          <input
            v-model="registerForm.email"
            type="email"
            class="form-input"
            :disabled="isRegisterLoading"
            required
          />
          <div class="error-message" :class="{ show: registerErrors.email }">
            {{ registerErrors.email }}
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Пароль</label>
          <input
            v-model="registerForm.password"
            type="password"
            class="form-input"
            :disabled="isRegisterLoading"
            required
            minlength="6"
          />
          <div class="error-message" :class="{ show: registerErrors.password }">
            {{ registerErrors.password }}
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Подтвердите пароль</label>
          <input
            v-model="registerForm.confirmPassword"
            type="password"
            class="form-input"
            :disabled="isRegisterLoading"
            required
          />
          <div class="error-message" :class="{ show: registerErrors.confirmPassword }">
            {{ registerErrors.confirmPassword }}
          </div>
        </div>
      </template>
    </ModalWindow>

    <ModalWindow
      :is-open="isLoginModalOpen"
      title="С возвращением!"
      subtitle="Войдите в свой аккаунт"
      submit-text="Войти"
      submit-icon="fas fa-sign-in-alt"
      footer-text="Еще нет аккаунта?"
      switch-text="Зарегистрироваться"
      :is-loading="isLoginLoading"
      @close="closeLoginModal"
      @submit="handleLogin"
      @switch="switchToRegister"
    >
      <template #form-content>
        <div class="form-group">
          <label class="form-label">Email</label>
          <input
            v-model="loginForm.email"
            type="email"
            class="form-input"
            :disabled="isLoginLoading"
            required
          />
          <div class="error-message" :class="{ show: loginErrors.email }">
            {{ loginErrors.email }}
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Пароль</label>
          <input
            v-model="loginForm.password"
            type="password"
            class="form-input"
            :disabled="isLoginLoading"
            required
          />
          <div class="error-message" :class="{ show: loginErrors.password }">
            {{ loginErrors.password }}
          </div>
        </div>

        <div class="form-options">
          <label class="remember-me">
            <input v-model="loginForm.remember" type="checkbox" />
            Запомнить меня
          </label>
          <a href="#" class="forgot-password">Забыли пароль?</a>
        </div>
      </template>
    </ModalWindow>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import AppHeader from '@/components/ui/AppHeader.vue'
import ModalWindow from '@/components/ui/ModalWindow.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import FloatingElements from '@/components/sections/FloatingElements.vue'
import { useModal } from '@/composables/useModal'

const {
  isRegisterModalOpen,
  isLoginModalOpen,
  openRegisterModal,
  closeRegisterModal,
  closeLoginModal,
  switchToLogin,
  switchToRegister,
} = useModal()

// Состояния загрузки
const isRegisterLoading = ref(false)
const isLoginLoading = ref(false)

const registerForm = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const loginForm = reactive({
  email: '',
  password: '',
  remember: false,
})

const registerErrors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const loginErrors = reactive({
  email: '',
  password: '',
})

// Валидация email
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

const handleRegister = async () => {
  // Сброс ошибок
  Object.keys(registerErrors).forEach((key) => (registerErrors[key] = ''))

  let isValid = true

  // Валидация
  if (!registerForm.name.trim()) {
    registerErrors.name = 'Введите имя'
    isValid = false
  }

  if (!registerForm.email.trim()) {
    registerErrors.email = 'Введите email'
    isValid = false
  } else if (!validateEmail(registerForm.email)) {
    registerErrors.email = 'Введите корректный email'
    isValid = false
  }

  if (!registerForm.password) {
    registerErrors.password = 'Введите пароль'
    isValid = false
  } else if (registerForm.password.length < 6) {
    registerErrors.password = 'Пароль должен содержать минимум 6 символов'
    isValid = false
  }

  if (!registerForm.confirmPassword) {
    registerErrors.confirmPassword = 'Подтвердите пароль'
    isValid = false
  } else if (registerForm.password !== registerForm.confirmPassword) {
    registerErrors.confirmPassword = 'Пароли не совпадают'
    isValid = false
  }

  if (!isValid) return

  isRegisterLoading.value = true

  try {
    const payload = {
      Name: registerForm.name,
      Email: registerForm.email,
      Password: registerForm.password,
      ConfirmPassword: registerForm.confirmPassword,
    }

    const result = await window.$userService.register(payload)

    alert(result || 'Регистрация успешна!')
    closeRegisterModal()

    // Очистка формы
    Object.keys(registerForm).forEach((key) => (registerForm[key] = ''))
  } catch (error) {
    const errorMessage = typeof error === 'string' ? error : 'Ошибка при регистрации'

    if (errorMessage.includes('почта') || errorMessage.includes('email')) {
      registerErrors.email = errorMessage
    } else if (errorMessage.includes('пароль') && errorMessage.includes('подтверждени')) {
      registerErrors.confirmPassword = errorMessage
    } else {
      registerErrors.email = errorMessage
    }
  } finally {
    isRegisterLoading.value = false
  }
}

const handleLogin = async () => {
  // Сброс ошибок
  Object.keys(loginErrors).forEach((key) => (loginErrors[key] = ''))

  let isValid = true

  if (!loginForm.email.trim()) {
    loginErrors.email = 'Введите email'
    isValid = false
  } else if (!validateEmail(loginForm.email)) {
    loginErrors.email = 'Введите корректный email'
    isValid = false
  }

  if (!loginForm.password) {
    loginErrors.password = 'Введите пароль'
    isValid = false
  }

  if (!isValid) return

  isLoginLoading.value = true

  try {
    const user = await window.$userService.login(loginForm.email, loginForm.password)

    // Сохраняем пользователя
    localStorage.setItem('user', JSON.stringify(user))

    alert('Вход выполнен успешно!')
    closeLoginModal()

    // Очистка формы (кроме remember)
    loginForm.email = ''
    loginForm.password = ''

    console.log('Пользователь вошел:', user)
  } catch (error) {
    const errorMessage = typeof error === 'string' ? error : 'Ошибка при входе'

    if (errorMessage.includes('логин') || errorMessage.includes('пароль')) {
      loginErrors.password = errorMessage
    } else if (errorMessage.includes('введите')) {
      loginErrors.email = errorMessage
    } else {
      loginErrors.password = errorMessage
    }
  } finally {
    isLoginLoading.value = false
  }
}
</script>
