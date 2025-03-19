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
  
  /* ✅ Status별 배경색 */
  .request {
    background-color: #f1cd5e; /* 노란색 */
  }
  
  .approved {
    background-color: #24c44f; /* 초록색 */
  }
  
  .in-progress {
    background-color: #679ffa; /* 파란색 */
  }
  
  .finished {
    background-color: #9e9e9e; /* 회색 */
  }
  
  .rejected {
    background-color: #ea4335; /* 빨간색 */
  }
  </style>
  