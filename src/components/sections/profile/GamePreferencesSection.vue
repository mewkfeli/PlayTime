<template>
  <div class="preferences-section">
    <h2 class="section-title">Игровые предпочтения</h2>

    <div class="preference-group">
      <label class="preference-label">Любимые игры</label>
      <div v-if="!isEditing" class="preference-tags">
        <span v-for="game in userData.favoriteGames" :key="game" class="tag">
          {{ game }}
        </span>
      </div>
      <div v-else class="multi-select-container">
        <select
          multiple
          class="form-input multi-select"
          v-model="localEditData.favoriteGames"
          @change="updateSelectedGames"
        >
          <option
            v-for="game in allGames"
            :key="game"
            :value="game"
            :selected="localEditData.favoriteGames.includes(game)"
          >
            {{ game }}
          </option>
        </select>
        <div class="selected-count">Выбрано: {{ localEditData.favoriteGames.length }}</div>
      </div>
    </div>

    <!-- Любимые жанры -->
    <div class="preference-group">
      <label class="preference-label">Любимые жанры</label>
      <div v-if="!isEditing" class="preference-tags">
        <span v-for="genre in userData.favoriteGenres" :key="genre" class="tag">
          {{ genre }}
        </span>
      </div>
      <div v-else class="multi-select-container">
        <select
          multiple
          class="form-input multi-select"
          v-model="localEditData.favoriteGenres"
          @change="updateSelectedGenres"
        >
          <option
            v-for="genre in allGenres"
            :key="genre"
            :value="genre"
            :selected="localEditData.favoriteGenres.includes(genre)"
          >
            {{ genre }}
          </option>
        </select>
        <div class="selected-count">Выбрано: {{ localEditData.favoriteGenres.length }}</div>
        <small class="hint">Для выбора нескольких вариантов используйте Ctrl+Click</small>
      </div>
    </div>

    <!-- Роли (теперь кликабельные) -->
    <div class="preference-group">
      <label class="preference-label">Роли</label>
      <div v-if="!isEditing" class="preference-tags">
        <span v-for="role in userData.roles" :key="role" class="tag role-tag">
          {{ getRoleDisplayName(role) }}
        </span>
      </div>
      <div v-else class="roles-container">
        <div class="roles-buttons">
          <button
            v-for="role in availableRoles"
            :key="role.value"
            type="button"
            class="role-button"
            :class="{
              'role-button--active': localEditData.roles.includes(role.value),
              'role-button--disabled':
                localEditData.roles.length >= 2 && !localEditData.roles.includes(role.value),
            }"
            @click="toggleRole(role.value)"
            :disabled="localEditData.roles.length >= 2 && !localEditData.roles.includes(role.value)"
          >
            {{ role.displayName }}
          </button>
        </div>
        <div class="selected-count">Выбрано: {{ localEditData.roles.length }} из 2</div>
        <small class="hint">Можно выбрать до 2 ролей</small>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GamePreferencesSection',
  props: {
    userData: Object,
    editData: Object,
    isEditing: Boolean,
    allGames: Array,
    allGenres: Array,
  },
  data() {
    return {
      localEditData: {},
      availableRoles: [
        { value: 'player', displayName: 'Игрок' },
        { value: 'organizer', displayName: 'Организатор' },
      ],
    }
  },
  watch: {
    editData: {
      immediate: true,
      handler(newVal) {
        this.localEditData = { ...newVal }
      },
    },
  },
  methods: {
    updateSelectedGames() {
      this.$emit('update:editData', {
        ...this.localEditData,
        favoriteGames: [...this.localEditData.favoriteGames],
      })
    },
    updateSelectedGenres() {
      this.$emit('update:editData', {
        ...this.localEditData,
        favoriteGenres: [...this.localEditData.favoriteGenres],
      })
    },
    getRoleDisplayName(role) {
      const roleNames = {
        player: 'Игрок',
        organizer: 'Организатор',
      }
      return roleNames[role] || role
    },
    toggleRole(role) {
      const currentRoles = [...this.localEditData.roles]
      const roleIndex = currentRoles.indexOf(role)

      if (roleIndex > -1) {
        // Удаляем роль, если она уже выбрана
        currentRoles.splice(roleIndex, 1)
      } else {
        // Добавляем роль, если можно выбрать еще
        if (currentRoles.length < 2) {
          currentRoles.push(role)
        }
      }

      this.localEditData.roles = currentRoles
      this.$emit('update:editData', {
        ...this.localEditData,
        roles: [...currentRoles],
      })
    },
  },
}
</script>
