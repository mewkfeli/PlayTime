<template>
  <div class="calendar-popup" :class="{ active: visible }" v-if="visible">
    <div class="calendar-header">
      <button class="calendar-nav" @click="prevMonth">
        <i class="fas fa-chevron-left"></i>
      </button>
      <div class="current-month">{{ currentMonth }} {{ currentYear }}</div>
      <button class="calendar-nav" @click="nextMonth">
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
    <div class="calendar-grid">
      <div 
        v-for="day in daysOfWeek" 
        :key="day" 
        class="calendar-day-header"
      >
        {{ day }}
      </div>
      <div 
        v-for="day in calendarDays" 
        :key="day.date.toString()"
        class="calendar-day"
        :class="{
          'other-month': !day.isCurrentMonth,
          'today': day.isToday,
          'selected': day.isSelected
        }"
        @click="selectDate(day)"
      >
        {{ day.date.getDate() }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  selectedDate: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:visible', 'update:selectedDate', 'date-select'])

const currentDate = ref(new Date())
const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

const currentMonth = computed(() => {
  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ]
  return months[currentDate.value.getMonth()]
})

const currentYear = computed(() => {
  return currentDate.value.getFullYear()
})

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  
  const days = []
  
  // Пустые ячейки перед первым днем
  const firstDayOfWeek = (firstDay.getDay() + 6) % 7
  for (let i = 0; i < firstDayOfWeek; i++) {
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    const date = new Date(year, month - 1, prevMonthLastDay - firstDayOfWeek + i + 1)
    days.push({
      date,
      isCurrentMonth: false,
      isToday: false,
      isSelected: false
    })
  }
  
  // Дни текущего месяца
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(year, month, day)
    date.setHours(0, 0, 0, 0)
    
    const isToday = date.getTime() === today.getTime()
    const isSelected = props.selectedDate === formatDate(date)
    
    days.push({
      date,
      isCurrentMonth: true,
      isToday,
      isSelected
    })
  }
  
  // Пустые ячейки после последнего дня
  const lastDayOfWeek = (lastDay.getDay() + 6) % 7
  const emptyCellsAfter = 6 - lastDayOfWeek
  for (let i = 1; i <= emptyCellsAfter; i++) {
    const date = new Date(year, month + 1, i)
    days.push({
      date,
      isCurrentMonth: false,
      isToday: false,
      isSelected: false
    })
  }
  
  return days
})

const formatDate = (date) => {
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
}

const prevMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

const selectDate = (day) => {
  const formattedDate = formatDate(day.date)
  emit('update:selectedDate', formattedDate)
  emit('date-select', formattedDate)
  emit('update:visible', false)
}

// Закрытие календаря при клике вне его
const handleClickOutside = (event) => {
  const calendar = document.querySelector('.calendar-popup')
  if (calendar && !calendar.contains(event.target) && 
      !event.target.classList.contains('date-input')) {
    emit('update:visible', false)
  }
}

watch(() => props.visible, (newVal) => {
  if (newVal) {
    document.addEventListener('click', handleClickOutside)
  } else {
    document.removeEventListener('click', handleClickOutside)
  }
})
</script>

<style scoped>
.calendar-popup {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--shadow);
  z-index: 100;
  margin-top: 0.5rem;
  display: none;
  width: 320px;
}

.calendar-popup.active {
  display: block;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.calendar-nav {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: var(--secondary);
  padding: 0.5rem;
  border-radius: 6px;
  transition: var(--transition);
}

.calendar-nav:hover {
  background: #f0f0f0;
}

.current-month {
  font-weight: 600;
  color: var(--secondary);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
}

.calendar-day-header {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
  color: #666;
}

.calendar-day {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  transition: var(--transition);
  font-size: 0.9rem;
}

.calendar-day:hover {
  background: #f0f0f0;
}

.calendar-day.selected {
  background: var(--primary);
  color: white;
}

.calendar-day.other-month {
  color: #ccc;
}

.calendar-day.today {
  background: rgba(108, 99, 255, 0.1);
  color: var(--accent);
  font-weight: 600;
}
</style>