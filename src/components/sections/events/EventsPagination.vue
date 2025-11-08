<template>
  <div class="pagination" v-if="totalPages > 1">
    <button 
      class="pagination-btn" 
      :disabled="currentPage === 1"
      @click="changePage(currentPage - 1)"
    >
      <i class="fas fa-chevron-left"></i>
    </button>
    
    <button 
      v-for="page in visiblePages" 
      :key="page"
      class="pagination-btn" 
      :class="{ active: page === currentPage }"
      @click="changePage(page)"
    >
      {{ page }}
    </button>
    
    <button 
      class="pagination-btn" 
      :disabled="currentPage === totalPages"
      @click="changePage(currentPage + 1)"
    >
      <i class="fas fa-chevron-right"></i>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['page-change'])

const visiblePages = computed(() => {
  const pages = []
  const startPage = Math.max(1, props.currentPage - 1)
  const endPage = Math.min(props.totalPages, props.currentPage + 1)
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }
  
  return pages
})

const changePage = (page) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('page-change', page)
  }
}
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 3rem;
}

.pagination-btn {
  width: 45px;
  height: 45px;
  border-radius: 12px;
  background: white;
  border: 2px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
  font-weight: 600;
  color: var(--secondary);
}

.pagination-btn:hover:not(:disabled) {
  border-color: var(--accent);
  color: var(--accent);
}

.pagination-btn.active {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>