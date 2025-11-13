<template>
  <div class="content">
    <div class="main-heading">Не хватает <span>игроков</span>? Не беда!</div>
    <div class="description">
      Наш сервис создан, чтобы соединять людей, обожающих настольные игры. Найдите идеальную
      компанию для вашей следующей игровой сессии!
    </div>
    <div class="btn-container">
      <button class="btn" @click="$emit('open-register')">
        <i class="play-circle"></i> Начать играть
      </button>
    </div>
  </div>

  <div class="img-container">
    <img class="main-img" src="@/assets/images/cubes.svg" alt="Игральные кости" />
    <img class="decoration-img" src="@/assets/images/pawns.svg" alt="Дартс" />
  </div>
</template>

<script setup>
defineEmits(['open-register'])
</script>
