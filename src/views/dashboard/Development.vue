<script setup>
import { ref } from 'vue';
import Button from '../../components/widgets/Button.vue';
import Modal from '../../components/widgets/Modal.vue'; // ✅ 기존 Modal1
import Modal2 from '../../components/widgets/Modal2.vue'; // ✅ 새로운 Modal2

// ✅ 각각의 모달 상태 관리
const isModal1Open = ref(false); // 개발 목록 추가 모달
const isModal2Open = ref(false); // 신규 목록 추가 모달

// ✅ 임시 리스트 데이터 (3개 추가)
const nameList = ref([
  { id: "2501", name: "25.01", description: "25년도 1월 개발 대상 목록 입니다." },
  { id: "2503", name: "25.03(후보)", description: "25년도 3월 개발 대상 후보 목록 입니다." },
  { id: "2504", name: "25.04(후보)", description: "25년도 4월 개발 대상 후보 목록 입니다." },
]);

// ✅ Modal1 (기존 개발 목록 추가 모달)에서 추가
const addItemFromModal1 = (newItem) => {
  nameList.value.push(newItem);
  console.log("📌 [Development.vue] Modal1에서 추가됨:", newItem);
};

// ✅ Modal2 (신규 목록 추가 모달)에서 추가
const addItemFromModal2 = (newItem) => {
  nameList.value.push(newItem);
  console.log("📌 [Development.vue] Modal2에서 추가됨:", newItem);
};

// ✅ 모달 닫기 함수
const closeModal1 = () => {
  isModal1Open.value = false;
};

const closeModal2 = () => {
  isModal2Open.value = false;
};
</script>

<template>
  <div class="development-container">
    <div class="header">
      <h2>목록 리스트</h2>
      <Button label="+ NEW" type="primary" @click="isModal2Open = true" />
    </div>

    <!-- ✅ 리스트 출력 -->
    <div class="list-container">
      <div v-for="(item, index) in nameList" :key="index" class="list-item" @click="$router.push(`/development/${item.id}`)">
        <div class="content">
          <h3>{{ item.name }}</h3>
          <p>{{ item.description }}</p>
        </div>
        <div class="actions">
          <button class="edit-btn" @click.stop="isModal1Open = true">⚙️</button>
          <button class="delete-btn" @click.stop="nameList.splice(index, 1)">🗑️</button>
        </div>
      </div>
    </div>

    <!-- ✅ 개발 목록 추가 모달 (Modal1) -->
    <Modal v-if="isModal1Open" title="개발 목록 추가" @close="closeModal1" @addNewItem="addItemFromModal1" />

    <!-- ✅ 신규 목록 추가 모달 (Modal2) -->
    <Modal2 v-if="isModal2Open" title="신규 목록 추가" @close="closeModal2" @create="addItemFromModal2" />
  </div>
</template>

<style scoped>
/* ✅ 상단 헤더 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

/* ✅ 리스트 스타일 */
.list-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* ✅ 개별 리스트 항목 */
.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer; /* ✅ 클릭 가능하도록 커서 변경 */
  transition: all 0.2s ease-in-out;
}

.list-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* ✅ 버튼 스타일 */
.actions {
  display: flex;
  gap: 10px;
}

.edit-btn, .delete-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
}

.edit-btn:hover {
  color: #6a5acd;
}

.delete-btn:hover {
  color: red;
}
</style>
