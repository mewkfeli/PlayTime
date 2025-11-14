<template>
  <header class="header">
    <div class="logo" @click="goToHome">
      <i class="fas fa-dice-d20"></i>
      <span>Play Time</span>
    </div>

    <button class="mobile-menu-btn" @click="toggleMobileMenu">
      <i class="fas" :class="mobileMenuOpen ? 'fa-times' : 'fa-bars'"></i>
    </button>

    <nav class="nav" :class="{ active: mobileMenuOpen }">
      <div class="nav-item" :class="{ active: $route.name === 'Home' }" @click="goToHome">
        Главная
      </div>
      <div class="nav-item" :class="{ active: $route.name === 'Events' }" @click="goToEvents">
        События
      </div>
      <div class="nav-item" :class="{ active: $route.name === 'Profile' }" @click="goToProfile">
        Профиль
      </div>
      <div
        v-if="isAdmin"
        class="nav-item admin-item"
        :class="{ active: $route.name === 'Admin' }"
        @click="goToAdmin"
      >
        Админка
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUser } from '@/composables/userSession.js'

const router = useRouter()
const mobileMenuOpen = ref(false)

const { isAdmin } = useUser()

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const goToHome = () => {
  router.push('/')
  mobileMenuOpen.value = false
}

const goToEvents = () => {
  router.push('/events')
  mobileMenuOpen.value = false
}

const goToProfile = () => {
  router.push('/profile')
  mobileMenuOpen.value = false
}

const goToAdmin = () => {
  router.push('/admin')
  mobileMenuOpen.value = false
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  position: fixed;
  background: white;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
  box-shadow: var(--shadow);
}

.logo {
  font-size: 2rem;
  font-weight: 800;
  color: var(--secondary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: var(--transition);
}

.logo:hover {
  color: var(--primary);
}

.logo i {
  color: var(--primary);
  font-size: 1.8rem;
}

.nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 2.5rem;
}

.nav-item {
  font-size: 1.3rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  position: relative;
  padding: 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 3px;
  background: var(--primary);
  border-radius: 3px;
  transition: var(--transition);
}

.nav-item:hover {
  color: var(--primary);
}

.nav-item:hover::after {
  width: 100%;
}

.nav-item.active {
  color: var(--primary);
  font-weight: 700;
}

.nav-item.active::after {
  width: 100%;
}

.admin-item {
  position: relative;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--secondary);
  cursor: pointer;
}

@media (max-width: 992px) {
  .nav {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: white;
    flex-direction: column;
    padding: 1.5rem;
    box-shadow: var(--shadow);
    gap: 1rem;
  }

  .nav.active {
    display: flex;
  }

  .mobile-menu-btn {
    display: block;
  }
}
</style>
