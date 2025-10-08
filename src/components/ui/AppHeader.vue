<template>
  <header class="header">
    <div class="logo">
      <i class="fas fa-dice-d20"></i>
      <span>Play Time</span>
    </div>

    <button class="mobile-menu-btn" @click="toggleMobileMenu">
      <i class="fas" :class="mobileMenuOpen ? 'fa-times' : 'fa-bars'"></i>
    </button>

    <nav class="nav" :class="{ active: mobileMenuOpen }">
      <div
        v-for="item in navItems"
        :key="item.id"
        class="nav-item"
        :class="{ active: activeNav === item.id }"
        @click="handleNavClick(item)"
      >
        {{ item.text }}
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue'

const mobileMenuOpen = ref(false)
const activeNav = ref('home')

const navItems = [
  { id: 'home', text: 'Главная' },
  { id: 'events', text: 'События' },
  { id: 'catalog', text: 'Каталог игр' },
  { id: 'profile', text: 'Профиль' },
]

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const handleNavClick = (item) => {
  activeNav.value = item.id

  if (window.innerWidth <= 992) {
    mobileMenuOpen.value = false
  }

  if (item.id !== 'profile') {
    console.log('Переход к разделу: ' + item.text)
  }
}
</script>
