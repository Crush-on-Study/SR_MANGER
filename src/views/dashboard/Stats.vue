<!-- src/views/Stats.vue -->
<template>
    <div class="stats-container">
      <div class="notice-card">
        <h2>📢 Notice</h2>
        <p>분석 통계 기능은 현재 개발 중입니다.</p>
        <p>버전 2에서 만나보실 수 있습니다. 조금만 기다려 주세요! 😊</p>
      </div>
    </div>
  </template>
  
  <script setup>
  // 구현 예정
  </script>
  
  <style scoped>
  .stats-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-color: #f5f6fa;
    padding: 20px;
  }
  
  .notice-card {
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    max-width: 500px;
    width: 100%;
  }
  
  .notice-card h2 {
    font-size: 24px;
    color: #2c3e50;
    margin-bottom: 15px;
  }
  
  .notice-card p {
    font-size: 16px;
    color: #7f8c8d;
    line-height: 1.5;
  }
  </style>