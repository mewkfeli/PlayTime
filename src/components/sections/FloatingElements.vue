<template>
  <div class="floating-elements" @mousemove="handleMouseMove">
    <div
      v-for="(element, index) in elements"
      :key="index"
      class="floating-element"
      :style="element.style"
    >
      {{ element.emoji }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const elements = ref([
  { emoji: '🎲', style: { top: '20%', left: '5%', fontSize: '3rem' } },
  { emoji: '♟️', style: { top: '60%', left: '8%', fontSize: '2.5rem' } },
  { emoji: '🃏', style: { top: '30%', right: '8%', fontSize: '2.8rem' } },
  { emoji: '🎯', style: { top: '70%', right: '10%', fontSize: '2.2rem' } },
])

const handleMouseMove = (e) => {
  const x = e.clientX / window.innerWidth
  const y = e.clientY / window.innerHeight

  elements.value.forEach((element) => {
    const speed = parseInt(element.style.fontSize) / 30
    const xMove = (x * speed * 2 - speed).toFixed(2)
    const yMove = (y * speed * 2 - speed).toFixed(2)

    element.style.transform = `translate(${xMove}px, ${yMove}px)`
  })
}
</script>
