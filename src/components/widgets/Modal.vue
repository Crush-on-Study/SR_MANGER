<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <h3>개발 목록에 추가</h3>

      <!-- ✅ 체크리스트 -->
      <div class="checkbox-list">
        <label v-for="(item, index) in nameList" :key="index" class="checkbox-item">
          <input type="checkbox" v-model="checkedItems" :value="item.id" />
          {{ item.name }}
        </label>
      </div>

      <div class="modal-footer">
        <!-- ✅ 새로운 목록 추가 -->
        <Button label="+ 새로운 목록" type="secondary" @click="isNewListModalOpen = true" />
        
        <!-- ✅ 카드에 추가 -->
        <Button label="카드에 추가" type="primary" @click="handleAddToCard" />
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
import { ref, defineProps, defineEmits, onMounted } from "vue";
import { addDevelopmentCard, getDevelopmentCards, addSRToCard } from "../../backend/firestoreService.js";
import Button from "./Button.vue";

const props = defineProps({
  selectedSRs: Array, // ✅ 체크한 SR 리스트
});

const emit = defineEmits(["close", "addToCard", "refreshCards"]);

const isNewListModalOpen = ref(false);
const newListName = ref('');
const newListDescription = ref('');
const checkedItems = ref([]); // 선택된 카드 ID 리스트
const nameList = ref([]);

// ✅ Firestore에서 개발 목록 불러오기
const fetchCards = async () => {
  nameList.value = await getDevelopmentCards();
};

onMounted(fetchCards);

// ✅ 새로운 개발 목록 추가
const createNewList = async () => {
  if (!newListName.value.trim()) {
    alert("⚠️ 이름을 입력해주세요!");
    return;
  }

  const newCard = await addDevelopmentCard(newListName.value, newListDescription.value);
  if (newCard) {
    nameList.value.push(newCard);
    isNewListModalOpen.value = false;
    newListName.value = '';
    newListDescription.value = '';
    emit('refreshCards');  
  }
};

// ✅ 체크한 SR을 특정 카드에 추가
const handleAddToCard = async () => {
  // 선택된 카드 ID 확인
  if (checkedItems.value.length === 0) {
    alert("🚨 카드를 선택해주세요!");
    return;
  }

  // 선택된 SR 데이터 확인
  if (!props.selectedSRs || props.selectedSRs.length === 0) {
    alert("🚨 추가할 SR 요청이 없습니다!");
    return;
  }

  // 선택된 카드 ID (여러 카드 선택 가능)
  for (const cardId of checkedItems.value) {
    console.log(`📌 카드(${cardId})에 추가할 SR 리스트:`, props.selectedSRs);

    // addSRToCard 호출
    const success = await addSRToCard(cardId, props.selectedSRs);

    if (success) {
      console.log(`✅ 카드(${cardId})에 SR 추가 성공`);
    } else {
      console.log(`❌ 카드(${cardId})에 SR 추가 실패`);
    }
  }

  // 성공 여부와 상관없이 모달 닫기 및 이벤트 emit
  emit('addToCard', checkedItems.value);
  emit('close');
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

/* 새로운 목록 추가 , 카드에 추가 */
.modal-footer {
  margin-top: 15px;
  display: flex;
  gap: 15px;
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
