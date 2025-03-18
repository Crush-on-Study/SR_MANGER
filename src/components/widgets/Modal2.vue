<template>
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content">
        <h3>신규 목록 추가</h3>
  
        <div class="form-container">
          <div class="form-group">
            <label>Name</label>
            <input type="text" v-model="newListName" placeholder="Enter item name" required />
          </div>
  
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="newListDescription" placeholder="Enter item description"></textarea>
          </div>
  
          <div class="form-group">
            <label>Applying Month</label>
            <input type="month" v-model="applyingMonth" />
          </div>
  
          <!-- ✅ 공수 시간 입력란을 가로 정렬 & 간격 조정 -->
          <div class="form-group hours-container">
            <div class="hours-field">
              <label>ICC</label>
              <input type="number" v-model="iccHours" placeholder="공수 시간" />
            </div>
            <div class="hours-field">
              <label>EKMTC</label>
              <input type="number" v-model="ekmtcHours" placeholder="공수 시간" />
            </div>
            <div class="hours-field">
              <label>RPA</label>
              <input type="number" v-model="rpaHours" placeholder="공수 시간" />
            </div>
          </div>
  
          <div class="modal-footer">
            <Button label="Cancel" type="secondary" @click="$emit('close')" />
            <Button label="Create" type="primary" @click="createNewList" />
          </div>
        </div>
      </div>
    </div>
  </template>

<script setup>
import { ref, defineEmits } from 'vue';
import Button from './Button.vue';

const emit = defineEmits(['close', 'create']);

const newListName = ref('');
const newListDescription = ref('');
const applyingMonth = ref('');
const iccHours = ref('');
const ekmtcHours = ref('');
const rpaHours = ref('');

const createNewList = () => {
  if (!newListName.value.trim()) {
    alert("Name은 필수 입력 사항입니다!");
    return;
  }

  const newItem = {
    name: newListName.value,
    description: newListDescription.value,
    month: applyingMonth.value,
    icc: iccHours.value,
    ekmtc: ekmtcHours.value,
    rpa: rpaHours.value,
  };

  console.log("📌 [Modal2.vue] createNewList 실행됨", newItem);

  // ✅ Development.vue로 데이터 전달
  emit('create', newItem);
  emit('close');

  console.log("✅ [Modal2.vue] addNewItem 이벤트 발생", newItem);

  // 입력값 초기화
  newListName.value = '';
  newListDescription.value = '';
  applyingMonth.value = '';
  iccHours.value = '';
  ekmtcHours.value = '';
  rpaHours.value = '';
};
</script>
  
  <style scoped>
  /* ✅ 모달 기본 스타일 */
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
    width: 400px; /* ✅ 모달 너비 유지 */
    position: relative;
  }
  
  /* ✅ 내부 폼 간격 조정 */
  .form-container {
    padding: 0 10px; /* ✅ 좌우 패딩 추가 */
  }
  
  /* ✅ 라벨과 입력 필드 간격 조정 */
  .form-group label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px; /* ✅ 라벨과 input 간 간격 추가 */
  }
  
  /* ✅ 입력 필드 간 간격 조정 */
  .form-group {
    margin-bottom: 20px;
  }
  
  /* ✅ 공수 시간 입력란을 가로 정렬 & 간격 추가 */
  .hours-container {
    display: flex;
    gap: 20px; /* ✅ 공수 시간 입력란 간격 증가 */
    justify-content: space-between;
  }
  
  /* ✅ 개별 입력 필드 */
  .hours-field {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  /* ✅ 더 깔끔한 입력 필드 디자인 */
  input, textarea {
    width: 90%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
    transition: 0.3s;
    font-size: 14px;
    background: #f9f9f9;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  input:focus, textarea:focus {
    border-color: #6a5acd;
    background: white;
    box-shadow: 0 0 5px rgba(106, 90, 205, 0.5);
    outline: none;
  }
  
  /* ✅ 입력 필드 간격 조정 */
  .hours-field input {
    text-align: center;
  }
  
  /* ✅ 모달 푸터 */
  .modal-footer {
    margin-top: 25px;
    display: flex;
    justify-content: space-between;
  }
  </style>
  

  
