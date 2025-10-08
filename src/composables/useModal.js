import { ref } from 'vue'

export function useModal() {
  const isRegisterModalOpen = ref(false)
  const isLoginModalOpen = ref(false)

  const openRegisterModal = () => {
    isRegisterModalOpen.value = true
    document.body.style.overflow = 'hidden'
  }

  const openLoginModal = () => {
    isLoginModalOpen.value = true
    document.body.style.overflow = 'hidden'
  }

  const closeRegisterModal = () => {
    isRegisterModalOpen.value = false
    document.body.style.overflow = ''
  }

  const closeLoginModal = () => {
    isLoginModalOpen.value = false
    document.body.style.overflow = ''
  }

  const switchToLogin = () => {
    closeRegisterModal()
    setTimeout(openLoginModal, 300)
  }

  const switchToRegister = () => {
    closeLoginModal()
    setTimeout(openRegisterModal, 300)
  }

  return {
    isRegisterModalOpen,
    isLoginModalOpen,
    openRegisterModal,
    openLoginModal,
    closeRegisterModal,
    closeLoginModal,
    switchToLogin,
    switchToRegister,
  }
}
