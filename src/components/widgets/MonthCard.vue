<template>
    <div :class="monthClass" class="month-card">
      {{ month }}
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  const props = defineProps({
    month: String, // ✅ "1월", "2월" 같은 형식으로 전달받음
  });
  </script>
  
  <style scoped>
  /* ✅ 기본 스타일 */
  .month-card {
    display: inline-block;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
    color: black;
  }
  </style>
  