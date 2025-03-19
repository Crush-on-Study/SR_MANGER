<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <h3>개발 목록에 추가</h3>

      <!-- ✅ 체크리스트 (세로 정렬) -->
      <div class="checkbox-list">
        <label v-for="(item, index) in nameList" :key="index" class="checkbox-item">
          <input type="checkbox" v-model="checkedItems" :value="item.name" />
          {{ item.name }}
        </label>
      </div>

      <div class="modal-footer">
        <Button label="+ 새로운 목록" type="secondary" @click="isNewListModalOpen = true" />
      </div>

      <button class="close-btn" @click="$emit('close')">X</button>
    </div>

    <!-- ✅ 새로운 목록 추가 모달 -->
    <div class="modal-overlay new-list-modal" v-if="isNewListModalOpen" @click.self="isNewListModalOpen = false">
      <div class="modal-content">
        <h3>새로운 목록 추가</h3>
        
        <div class="form-group">
          <label>Name</label>
          <input type="text" v-model="newListName" placeholder="Enter item name" required />
        </div>

        <div class="form-group">
          <label>Description</label>
          <textarea v-model="newListDescription" placeholder="Enter item description"></textarea>
        </div>

        <div class="modal-footer">
          <Button label="Cancel" type="secondary" @click="isNewListModalOpen = false" />
          <Button label="Create" type="primary" @click="createNewList" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import Button from './Button.vue';

const props = defineProps({
  nameList: Array, // ✅ App.vue에서 전달받음
});

const isNewListModalOpen = ref(false);
const newListName = ref('');
const newListDescription = ref('');
const checkedItems = ref([]); // ✅ 체크된 항목 저장

const emit = defineEmits(['addNewItem']);

const createNewList = () => {
  if (!newListName.value.trim()) {
    alert("Name은 필수 입력 사항입니다!");
    return;
  }

  const newItem = { name: newListName.value, description: newListDescription.value };

  console.log("📌 [Modal.vue] createNewList 실행됨", newItem);
  
  // ✅ 새로운 목록을 App.vue에 전달 (전역 관리)
  emit('addNewItem', newItem);

  console.log("✅ [Modal.vue] addNewItem 이벤트 발생", newItem);

  // 입력값 초기화 및 모달 닫기
  newListName.value = '';
  newListDescription.value = '';
  isNewListModalOpen.value = false;
};
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
