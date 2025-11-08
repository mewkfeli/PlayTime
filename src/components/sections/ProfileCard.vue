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

<style scoped>
.profile-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: var(--shadow);
  margin-bottom: 2rem;
}

.profile-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.avatar-container {
  position: relative;
  margin-right: 2rem;
}

.avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--primary);
  display: block;
}

.avatar-edit {
  position: absolute;
  right: 10px;
  bottom: 10px;
  background: var(--primary);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: var(--shadow);
  z-index: 2;
}

.avatar-edit i {
  color: white;
  font-size: 1.5rem;
}

.avatar-edit:hover {
  background: var(--primary-dark);
  transform: scale(1.1);
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  color: var(--secondary);
}

.profile-location {
  display: flex;
  align-items: center;
  color: #666;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.profile-location i {
  margin-right: 0.5rem;
  color: var(--primary);
}

.profile-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.profile-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.location-inputs {
  display: flex;
  gap: 10px;
}

@media (max-width: 992px) {
  .profile-content {
    grid-template-columns: 1fr;
  }

  .profile-header {
    flex-direction: column;
    text-align: center;
  }

  .avatar-container {
    margin-right: 0;
    margin-bottom: 1.5rem;
  }

  .profile-actions {
    justify-content: center;
  }
}
</style>
