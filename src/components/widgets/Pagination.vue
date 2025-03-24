<!-- src/components/widgets/Pagination.vue -->
<template>
    <div class="pagination" v-if="totalPages > 1">
      <button @click="prevPage" :disabled="currentPage === 1">이전</button>
      <span v-for="page in totalPages" :key="page">
        <button
          @click="goToPage(page)"
          :class="{ active: currentPage === page }"
        >
          {{ page }}
        </button>
      </span>
      <button @click="nextPage" :disabled="currentPage === totalPages">다음</button>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  // Props 정의
  const props = defineProps({
    totalItems: {
      type: Number,
      required: true,
    },
    itemsPerPage: {
      type: Number,
      default: 20,
    },
    currentPage: {
      type: Number,
      required: true,
    },
  });
  
  // Emit 정의
  const emit = defineEmits(['update:currentPage']);
  
  // 전체 페이지 수 계산
  const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage));
  
  // 페이지 이동 함수
  const goToPage = (page) => {
    if (page !== props.currentPage) {
      emit('update:currentPage', page);
    }
  };
  
  const prevPage = () => {
    if (props.currentPage > 1) {
      emit('update:currentPage', props.currentPage - 1);
    }
  };
  
  const nextPage = () => {
    if (props.currentPage < totalPages.value) {
      emit('update:currentPage', props.currentPage + 1);
    }
  };
  </script>
  
  <style scoped>
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-top: 20px;
  }
  
  .pagination button {
    padding: 8px 12px;
    border: none;
    border-radius: 5px;
    background: #3498db;
    color: white;
    cursor: pointer;
    transition: background 0.3s;
  }
  
  .pagination button:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
  }
  
  .pagination button.active {
    background: #2980b9;
    font-weight: bold;
  }
  
  .pagination button:hover:not(:disabled) {
    background: #2980b9;
  }
  </style>