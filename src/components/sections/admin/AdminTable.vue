<template>
  <div class="admin-table-container">
    <div class="table-wrapper">
      <table class="admin-table">
        <thead>
          <tr>
            <th v-for="column in columns" :key="column.key">
              {{ column.label }}
            </th>
            <th v-if="actions.length > 0">Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in data" :key="item.id">
            <td v-for="column in columns" :key="column.key">
              <template v-if="column.key === 'statusText'">
                <span class="status" :class="`status-${item.status}`">
                  {{ item[column.key] }}
                </span>
              </template>
              <template v-else>
                {{ item[column.key] }}
              </template>
            </td>
            <td v-if="actions.length > 0" class="action-buttons">
              <button
                v-for="action in getItemActions(item)"
                :key="action.id"
                class="btn btn-icon"
                :class="`btn-${action.color}`"
                :title="action.label"
                @click="$emit('action', action.id, item)"
              >
                <i :class="action.icon"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="data.length === 0" class="empty-state">
      <i class="fas fa-inbox"></i>
      <h3>Данные отсутствуют</h3>
      <p>Нет элементов для отображения</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  columns: {
    type: Array,
    required: true
  },
  data: {
    type: Array,
    required: true
  },
  actions: {
    type: Array,
    default: () => []
  }
})

defineEmits(['action'])

const getItemActions = (item) => {
  return props.actions.filter(action =>
    !action.condition || action.condition(item)
  )
}
</script>

<style scoped>
.admin-table-container {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: var(--shadow);
}

.table-wrapper {
  overflow-x: auto;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  font-weight: 600;
  color: var(--secondary);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

td {
  font-size: 0.95rem;
}

.status {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  display: inline-block;
}

.status-pending {
  background: rgba(255, 152, 0, 0.1);
  color: var(--warning);
}

.status-active {
  background: rgba(76, 175, 80, 0.1);
  color: var(--success);
}

.status-cancelled {
  background: rgba(244, 67, 54, 0.1);
  color: var(--danger);
}

.status-completed {
  background: rgba(108, 99, 255, 0.1);
  color: var(--accent);
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  width: 40px;
  height: 40px;
  min-width: auto;
  padding: 0;
  border-radius: 10px;
}

.btn-icon i {
  margin: 0;
}

.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  color: #666;
}

.empty-state i {
  font-size: 3rem;
  color: #ddd;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: var(--secondary);
}
</style>
