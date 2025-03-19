<template>
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content">
        <p>{{ detailInfo.ref_no }}</p>
        <h3>{{ detailInfo.title }}</h3>
  
        <!-- ✅ 체크리스트 (세로 정렬) -->
        <!-- <div class="checkbox-list">
          <label v-for="info in detailInfo" :key="info" class="checkbox-item">
            {{ info.id }}
          </label>
        </div> -->
  
        <button class="close-btn" @click="$emit('close')">X</button>
  
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  const props = defineProps({
    detailInfo: Object,
  });

  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 10px;
    width: 300px;
    position: relative;
  }
  
  /* ✅ 체크리스트 세로 정렬 */
  .checkbox-list {
    display: flex;
    flex-direction: column; /* 세로 정렬 */
    gap: 10px; /* 체크박스 간 간격 */
    margin: 15px 0;
  }
  
  /* ✅ 개별 체크박스 스타일 */
  .checkbox-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
  }
  
  .form-group {
    margin-bottom: 10px;
  }
  
  .form-group label {
    display: block;
    font-weight: bold;
  }
  
  .form-group input, .form-group textarea {
    width: 100%;
    padding: 8px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .modal-footer {
    margin-top: 15px;
    display: flex;
    justify-content: center;
  }
  
  .close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
  }
  </style>