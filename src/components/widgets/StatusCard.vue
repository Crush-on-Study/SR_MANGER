<!-- src/components/StatusCard.vue -->
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
      case 'Closed': // Finished 대신 Closed로 변경
        return 'closed';
      case 'Rejected':
        return 'rejected';
      case 'Testing': // 새로운 Status 추가
        return 'testing';
      case 'DT Approved': // 새로운 Status 추가
        return 'dt-approved';
      case 'Reconsider': // 새로운 Status 추가
        return 'reconsider';
      case 'Declined': // 새로운 Status 추가
        return 'declined';
      case 'Completed': // 새로운 Status 추가
        return 'completed';
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
  
  .closed { /* finished 대신 closed로 변경 */
    background-color: #d6d6d6; /* 부드러운 회색 */
    color: #555;
  }
  
  .rejected {
    background-color: #f5b5b0; /* 연한 빨강 */
    color: #a82b1e;
  }
  
  .testing { /* 새로운 Status 스타일 */
    background-color: #f0c4e8; /* 옅은 핑크 */
    color: #8b2a7a;
  }
  
  .dt-approved { /* 새로운 Status 스타일 */
    background-color: #b5e1e6; /* 옅은 청록 */
    color: #1a6b73;
  }
  
  .reconsider { /* 새로운 Status 스타일 */
    background-color: #f7d4a8; /* 옅은 주황 */
    color: #8a5a2b;
  }
  
  .declined { /* 새로운 Status 스타일 */
    background-color: #f5a9a9; /* 옅은 레드 */
    color: #9b1d1d;
  }
  
  .completed { /* 새로운 Status 스타일 */
    background-color: #c2e0c6; /* 옅은 민트 */
    color: #2e6b3a;
  }
  </style>