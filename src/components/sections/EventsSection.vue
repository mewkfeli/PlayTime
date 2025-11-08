<template>
  <div class="events-section">
    <div class="profile-card">
      <div class="card-header">
        <h2 class="card-title">Мои события</h2>
        <button class="btn btn-small" @click="createEvent">
          <i class="fas fa-plus"></i> Создать событие
        </button>
      </div>

      <EventCard 
        v-for="event in events" 
        :key="event.id"
        :event="event"
        @edit="editEvent"
        @share="shareEvent"
      />
    </div>
  </div>
</template>

<script>
import EventCard from './profile/EventCard.vue'

export default {
  name: 'EventsSection',
  components: {
    EventCard
  },
  data() {
    return {
      events: [
        {
          id: 1,
          title: 'Вечер настольных игр',
          game: 'Колонизаторы',
          date: '15.11.2025',
          time: '18:30 - 21:30',
          location: 'Кафе "Игровая зона"',
          created: '10.11.2025',
          participants: '4/6',
          description: 'Приглашаю всех любителей настольных игр на вечернюю сессию по классической игре "Колонизаторы". Отличная возможность провести время в приятной компании и насладиться стратегической игрой.',
          players: ['iiichiiro', 'Мария С.', 'Дмитрий К.', 'Анна П.']
        },
        {
          id: 2,
          title: 'Турнир по Мафии',
          game: 'Мафия',
          date: '22.11.2025',
          time: '19:00 - 22:00',
          location: 'Коворкинг "Просторанство"',
          created: '12.11.25',
          participants: '8/12',
          description: 'Организую турнир по Мафии для всех желающих. Будем играть в несколько раундов с разными составами игроков. Призы для победителей!',
          players: ['iiichiiro', 'Сергей М.', 'Ольга К.', 'Иван П.', 'Елена С.', 'Алексей Р.', 'Дарья Л.', 'Максим В.']
        }
      ]
    }
  },
  methods: {
    createEvent() {
      alert('Создание нового события')
    },
    editEvent(event) {
      alert(`Редактирование события: ${event.title}`)
    },
    shareEvent(event) {
      alert(`Поделиться событием: ${event.title}`)
    }
  }
}
</script>

<style scoped>
.events-section {
  margin-top: 2rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--secondary);
}
</style>