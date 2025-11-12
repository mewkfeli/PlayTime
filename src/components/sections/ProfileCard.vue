<template>
  <div class="profile-card">
    <div class="profile-header">
      <div class="avatar-container">
        <img :src="avatarUrl" alt="Аватар пользователя" class="avatar" />
        <div class="avatar-edit" @click="editAvatar">
          <i class="fas fa-camera"></i>
        </div>
      </div>
      <div class="profile-info">
        <div class="profile-name-container">
          <h1 class="profile-name">{{ userData.username }}</h1>
        </div>
        <div class="profile-location">
          <i class="fas fa-map-marker-alt"></i>
          <span>{{ userData.city }}</span>
        </div>
        <div class="profile-actions">
          <button class="btn" @click="startEditing" v-if="!isEditing">
            <i class="fas fa-edit"></i> Редактировать профиль
          </button>
          <div class="edit-controls" v-else>
            <button class="btn btn-secondary" @click="saveProfile">
              <i class="fas fa-save"></i> Сохранить
            </button>
            <button class="btn btn-outline" @click="cancelEditing">
              <i class="fas fa-times"></i> Отмена
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="profile-content">
      <!-- Левая колонка -->
      <div class="left-column">
        <PersonalInfoSection
          :userData="userData"
          :editData="editData"
          :isEditing="isEditing"
          @update:editData="updateEditData"
        />
      </div>

      <!-- Правая колонка -->
      <div class="right-column">
        <GamePreferencesSection
          :userData="userData"
          :editData="editData"
          :isEditing="isEditing"
          :allGames="allGames"
          :allGenres="allGenres"
          @update:editData="updateEditData"
        />
      </div>
    </div>
  </div>
</template>

<script>
import PersonalInfoSection from './profile/PersonalInfoSection.vue'
import GamePreferencesSection from './profile/GamePreferencesSection.vue'

export default {
  name: 'ProfileCard',
  components: {
    PersonalInfoSection,
    GamePreferencesSection,
  },
  data() {
    return {
      isEditing: false,
      userData: {
        username: 'iiichiiro',
        firstName: 'iiichiro',
        lastName: '',
        date_birthday: '2007-04-05',
        city: 'Уфа',
        email: 'qwe@qwe.qwe',
        contact: 'Telegram: @iiichiiro',
        aboutMe:
          'Люблю настольные игры, особенно стратегии и ролевые игры. Играю регулярно, предпочитаю игры с глубокой механикой. Всегда рад новым знакомствам и интересным игровым сессиям!',
        favoriteGames: ['Манчкин', 'Колонизаторы', 'Мафия', 'Каркассон'],
        favoriteGenres: ['Стратегии', 'Ролевые', 'Кооперативные'],
        roles: ['player', 'organizer'],
      },
      editData: {},
      avatarUrl: 'cat.png',
      allGames: [
        'Манчкин',
        'Колонизаторы',
        'Мафия',
        'Каркассон',
        'Монополия',
        'Имаджинариум',
        'Алиас',
        'Дженга',
        'Уно',
        'Шакал',
        'Экивоки',
        'Кодовые имена',
      ],
      allGenres: [
        'Стратегии',
        'Ролевые',
        'Кооперативные',
        'Детективные',
        'Экономические',
        'Карточные',
        'Семейные',
        'Партийные',
        'Абстрактные',
        'Варгеймы',
        'Детские',
        'Викторины',
      ],
    }
  },
  methods: {
    startEditing() {
      this.editData = {
        ...this.userData,
        favoriteGames: [...this.userData.favoriteGames],
        favoriteGenres: [...this.userData.favoriteGenres],
      }
      this.isEditing = true
    },
    saveProfile() {
      this.userData = {
        ...this.editData,
        favoriteGames: [...this.editData.favoriteGames],
        favoriteGenres: [...this.editData.favoriteGenres],
      }
      this.isEditing = false
      alert('Изменения сохранены!')
    },
    cancelEditing() {
      this.isEditing = false
      this.editData = {}
    },
    editAvatar() {
      alert('Редактирование аватара')
    },
    updateEditData(newData) {
      this.editData = { ...this.editData, ...newData }
    },
  },
}
</script>
