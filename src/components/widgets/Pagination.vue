<template>
  <div class="pagination-container">
    <!-- 페이지당 항목 수 선택 -->
    <div class="items-per-page">
      <label>페이지당 항목 수: </label>
      <select v-model="localItemsPerPage" @change="updateItemsPerPage">
        <option :value="10">10</option>
        <option :value="20">20</option>
        <option :value="50">50</option>
      </select>
    </div>

    <!-- 페이지네이션 버튼 -->
    <div class="pagination-buttons">
      <button :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">이전</button>
      <button
        v-for="page in totalPages"
        :key="page"
        :class="{ active: page === currentPage }"
        @click="goToPage(page)"
      >
        {{ page }}
      </button>
      <button :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">다음</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  totalItems: {
    type: Number,
    required: true,
  },
  itemsPerPage: {
    type: Number,
    default: 10,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
});

const emit = defineEmits(["update:currentPage", "update:itemsPerPage"]);

const localItemsPerPage = ref(props.itemsPerPage);
const localCurrentPage = ref(props.currentPage);

// 총 페이지 수 계산
const totalPages = computed(() => {
  return Math.ceil(props.totalItems / localItemsPerPage.value) || 1;
});

// 페이지 변경
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    localCurrentPage.value = page;
    emit("update:currentPage", page);
  }
};

// 페이지당 항목 수 변경
const updateItemsPerPage = () => {
  emit("update:itemsPerPage", localItemsPerPage.value);
  // 항목 수가 변경되면 첫 페이지로 이동
  goToPage(1);
};

// 부모 컴포넌트의 currentPage 변경 감지
watch(
  () => props.currentPage,
  (newPage) => {
    localCurrentPage.value = newPage;
  }
);

// 부모 컴포넌트의 itemsPerPage 변경 감지
watch(
  () => props.itemsPerPage,
  (newItemsPerPage) => {
    localItemsPerPage.value = newItemsPerPage;
  }
);
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 10px;
  font-size: 14px;
}

.items-per-page {
  display: flex;
  align-items: center;
  gap: 5px;
}

.items-per-page select {
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
  cursor: pointer;
}

.pagination-buttons {
  display: flex;
  gap: 5px;
}

.pagination-buttons button {
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.pagination-buttons button:hover {
  background: #f1f1f1;
}

.pagination-buttons button.active {
  background: #3498db;
  color: white;
  border-color: #3498db;
}

.pagination-buttons button:disabled {
  background: #f1f1f1;
  color: #999;
  cursor: not-allowed;
}
</style>