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
  
  // ✅ 개발 Month 색상 클래스 적용
  const monthClass = computed(() => {
    const monthColors = {
      "1월": "january",
      "2월": "february",
      "3월": "march",
      "4월": "april",
      "5월": "may",
      "6월": "june",
      "7월": "july",
      "8월": "august",
      "9월": "september",
      "10월": "october",
      "11월": "november",
      "12월": "december",
    };
    return monthColors[props.month] || '';
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
  
  /* ✅ 개발 Month 색상 */
  .january { background-color: #FF5733; }
  .february { background-color: #FFBD33; }
  .march { background-color: #33FF57; }
  .april { background-color: #33FFF3; }
  .may { background-color: #338AFF; }
  .june { background-color: #8D33FF; }
  .july { background-color: #FF33A8; }
  .august { background-color: #FF3357; }
  .september { background-color: #A833FF; }
  .october { background-color: #33FFA8; }
  .november { background-color: #FFD733; }
  .december { background-color: #B5B5B5; }
  </style>
  