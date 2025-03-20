<template>
    <div :class="statusClass" class="status-card">
      {{ status }}
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  const props = defineProps({
    status: String, // ✅ Status 값을 props로 전달받음
  });
  
  // ✅ Status에 따른 클래스 동적 적용
  const statusClass = computed(() => {
    switch (props.status) {
      case 'Request':
        return 'request';
      case 'Approved':
        return 'approved';
      case 'In Progress':
        return 'in-progress';
      case 'Finished':
        return 'finished';
      case 'Rejected':
        return 'rejected';
      default:
        return '';
    }
  });
  </script>
  
  <style scoped>
  /* ✅ 기본 스타일 */
  .status-card {
    display: inline-block;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
    color: white;
  }
  
/* ✅ Status별 배경색 (부드러운 컬러로 변경) */
.request {
  background-color: #f8e3a1; /* 옅은 노랑 */
  color: #755e06;
}

.approved {
  background-color: #a7e3a5; /* 옅은 초록 */
  color: #246b2e;
}

.in-progress {
  background-color: #c4dcfc; /* 옅은 파랑 */
  color: #2a5fba;
}

.finished {
  background-color: #d6d6d6; /* 부드러운 회색 */
  color: #555;
}

.rejected {
  background-color: #f5b5b0; /* 연한 빨강 */
  color: #a82b1e;
}

  </style>
  