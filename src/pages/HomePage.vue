<template>
  <div class="container">
    <!-- Верхняя секция -->
    <section class="section top-section">
      <div class="gradient-bg"></div>

      <FloatingElements />

      <AppHeader />

      <HeroSection @open-register="openRegisterModal" />
    </section>

    <!-- Нижняя секция -->
    <section class="section bottom-section">
      <FeaturesSection />
    </section>

    <!-- Модальные окна -->
    <ModalWindow
      :is-open="isRegisterModalOpen"
      title="Присоединиться"
      subtitle="Создайте аккаунт чтобы начать играть"
      submit-text="Создать аккаунт"
      submit-icon="fas fa-user-plus"
      footer-text="Уже есть аккаунт?"
      switch-text="Войти в аккаунт"
      @close="closeRegisterModal"
      @submit="handleRegister"
      @switch="switchToLogin"
    >
      <template #form-content>
        <div class="form-group">
          <label class="form-label">Имя</label>
          <input v-model="registerForm.name" type="text" class="form-input" required />
          <div class="error-message" :class="{ show: registerErrors.name }">
            {{ registerErrors.name }}
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Email</label>
          <input v-model="registerForm.email" type="email" class="form-input" required />
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
      @close="closeLoginModal"
      @submit="handleLogin"
      @switch="switchToRegister"
    >
      <template #form-content>
        <div class="form-group">
          <label class="form-label">Email</label>
          <input v-model="loginForm.email" type="email" class="form-input" required />
          <div class="error-message" :class="{ show: loginErrors.email }">
            {{ loginErrors.email }}
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Пароль</label>
          <input v-model="loginForm.password" type="password" class="form-input" required />
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
import { reactive } from 'vue'
import AppHeader from '@/components/ui/AppHeader.vue'
import ModalWindow from '@/components/ui/ModalWindow.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import FeaturesSection from '@/components/sections/FeaturesSection.vue'
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

const handleRegister = (event) => {
  event.preventDefault()

  // Сброс ошибок
  Object.keys(registerErrors).forEach((key) => (registerErrors[key] = ''))

  let isValid = true

  if (registerForm.password !== registerForm.confirmPassword) {
    registerErrors.confirmPassword = 'Пароли не совпадают'
    isValid = false
  }

  if (registerForm.password.length < 6) {
    registerErrors.password = 'Пароль должен содержать минимум 6 символов'
    isValid = false
  }

  if (isValid) {
    console.log('Регистрация:', registerForm)
    alert('Регистрация успешна!')
    closeRegisterModal()

    // Сброс формы
    Object.keys(registerForm).forEach((key) => (registerForm[key] = ''))
  }
}

const handleLogin = (event) => {
  event.preventDefault()

  // Сброс ошибок
  Object.keys(loginErrors).forEach((key) => (loginErrors[key] = ''))

  console.log('Вход:', loginForm)
  alert('Вход выполнен успешно!')
  closeLoginModal()

  // Сброс формы
  Object.keys(loginForm).forEach((key) => {
    if (key !== 'remember') loginForm[key] = ''
  })
}
</script>
