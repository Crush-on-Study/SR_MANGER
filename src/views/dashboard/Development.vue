<template>
  <div class="development-container">
    <div class="header">
      <h2> S/R 요청 카드 리스트</h2>
    </div>

    <div class="btn_new">
        <Button label="+ NEW" type="primary" @click="isModal2Open = true" class="btn-class"/>
    </div>

    <!-- ✅ 리스트 출력 -->
    <div class="list-container">
      <div 
        v-for="(item, index) in nameList" 
        :key="index" 
        class="list-item" 
        @click="$router.push(`/development/${item.id}`)"
      >
        <div class="content">
          <h3>{{ item.name }}</h3>
          <p>{{ item.description }}</p>
        </div>

        <!-- ✅ 도넛 차트 & 필수 개발 대상 요약 -->
        <div class="chart-summary">
          <DonutChart :data="item.serviceTypes" />
          <div class="priority-summary">
            <p>✅ 필수 개발 대상: <b>{{ priorityCount }}건</b></p>
            <p>📊 총 공수 시간: <b>{{ priorityHours }}h</b></p>
          </div>
        </div>

        <!-- ✅ 수정 & 삭제 버튼 -->
        <div class="actions">
          <button class="edit-btn" @click.stop="isModal1Open = true">⚙️</button>
          <button class="delete-btn" @click.stop="nameList.splice(index, 1)">🗑️</button>
        </div>
      </div>
    </div>

    <!-- ✅ 개발 목록 추가 모달 -->
    <Modal v-if="isModal1Open" title="개발 목록 추가" @close="closeModal1" />
    <Modal2 v-if="isModal2Open" title="신규 목록 추가" @close="closeModal2" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getDevelopmentCards, deleteDevelopmentCard } from "../../backend/firestoreService.js";
import Button from '../../components/widgets/Button.vue';
import Modal from '../../components/widgets/Modal.vue';
import DonutChart from '../../components/widgets/DonutChart.vue';

const nameList = ref([]);
const isModalOpen = ref(false);

// ✅ Firestore에서 카드 목록 불러오기
const fetchDevelopmentCards = async () => {
  nameList.value = await getDevelopmentCards();
};

onMounted(fetchDevelopmentCards);

// ✅ 카드 삭제
const deleteCard = async (cardId, index) => {
  await deleteDevelopmentCard(cardId);
  nameList.value.splice(index, 1);
};

// ✅ 모달 닫고 카드 리스트 새로고침
const closeModal = () => {
  isModalOpen.value = false;
  fetchDevelopmentCards();
};
</script>


<style scoped>
.development-container {
  padding: 20px;
}

.btn_new {
    display: flex;
    justify-content: flex-end;
    margin: 10px;
}


.list-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.list-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* ✅ 도넛 차트 & 요약 정렬 */
.chart-summary {
  display: flex;
  align-items: center;
  gap: 15px;
}

/* ✅ 필수 개발 대상 요약 스타일 */
.priority-summary {
  font-size: 14px;
  color: #333;
}

.priority-summary p {
  margin: 4px 0;
  font-weight: bold;
}

.chart-wrapper {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.actions {
  display: flex;
  gap: 10px;
}

.edit-btn, .delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.edit-btn:hover {
  color: #007bff;
}

.delete-btn:hover {
  color: red;
}
</style>
