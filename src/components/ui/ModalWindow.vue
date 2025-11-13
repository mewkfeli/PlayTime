<template>
  <div class="modal-overlay" :class="{ active: isOpen }" @click="closeOnOverlay">
    <div class="modal" @click.stop>
      <button class="modal-close" @click="closeModal">
        <i class="times"></i>
      </button>

      <div class="modal-header">
        <h2 class="modal-title">{{ title }}</h2>
        <p class="modal-subtitle">{{ subtitle }}</p>
      </div>

      <form @submit="handleSubmit">
        <slot name="form-content"></slot>

        <button type="submit" class="modal-btn">
          <i :class="submitIcon"></i> {{ submitText }}
        </button>
      </form>

      <div class="modal-footer">
        <p class="modal-footer-text">{{ footerText }}</p>
        <button class="modal-switch" @click="switchModal">
          {{ switchText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isOpen: Boolean,
  title: String,
  subtitle: String,
  submitText: String,
  submitIcon: String,
  footerText: String,
  switchText: String,
})

const emit = defineEmits(['close', 'submit', 'switch'])

const closeModal = () => {
  emit('close')
}

const closeOnOverlay = (event) => {
  if (event.target.classList.contains('modal-overlay')) {
    closeModal()
  }
}

const handleSubmit = (event) => {
  event.preventDefault()
  emit('submit', event)
}

const switchModal = () => {
  emit('switch')
}
</script>
