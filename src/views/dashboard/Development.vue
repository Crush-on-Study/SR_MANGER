<template>
  <div class="development-container">
    <div class="header">
      <h2>S/R 요청 카드 리스트</h2>
    </div>

    <div class="btn_new">
      <Button label="+ NEW" type="primary" @click="isModal2Open = true" class="btn-class" />
    </div>

    <!-- ✅ 리스트 출력 -->
    <div class="list-container">
      <div
        v-for="(item, index) in nameList"
        :key="item.id"
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
            <p>✅ 필수 개발 대상: <b>{{ getPriorityCount(item) }}건</b></p>
            <p>📊 총 공수 시간: <b>{{ getPriorityHours(item) }}h</b></p>
          </div>
        </div>

        <!-- ✅ 수정 & 삭제 버튼 -->
        <div class="actions">
          <button class="edit-btn" @click.stop="isModal1Open = true">⚙️</button>
          <button class="delete-btn" @click.stop="deleteCard(item.id, index)">🗑️</button>
        </div>
      </div>
    </div>

    <!-- ✅ 개발 목록 추가 모달 -->
    <Modal v-if="isModal1Open" title="개발 목록 추가" @close="closeModal1" />
    <Modal2 v-if="isModal2Open" :isOpen="isModal2Open" @close="closeModal2" @create="handleCreate" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Button from "../../components/widgets/Button.vue";
import Modal from "../../components/widgets/Modal.vue";
import Modal2 from "../../components/widgets/Modal2.vue";
import DonutChart from "../../components/widgets/DonutChart.vue";
import { getDevelopmentCards, deleteDevelopmentCard, addDevelopmentCard } from "../../backend/firestoreService.js";

const router = useRouter();
const nameList = ref([]);
const isModal1Open = ref(false);
const isModal2Open = ref(false);

// ✅ 필수 개발 대상 개수 및 총 공수시간 계산 (각 카드별 적용)
const getPriorityCount = (card) => card.priorityCount || 0;
const getPriorityHours = (card) => card.priorityHours || 0;

// ✅ Firestore에서 카드 목록 불러오기
const fetchDevelopmentCards = async () => {
  nameList.value = await getDevelopmentCards();
};

onMounted(fetchDevelopmentCards);

// ✅ 카드 삭제
const deleteCard = async (cardId, index) => {
  const success = await deleteDevelopmentCard(cardId);
  if (success) {
    nameList.value.splice(index, 1);
  } else {
    alert("카드 삭제에 실패했습니다.");
  }
};

// ✅ Modal1 닫기
const closeModal1 = () => {
  isModal1Open.value = false;
  fetchDevelopmentCards();
};

// ✅ Modal2 닫기
const closeModal2 = () => {
  isModal2Open.value = false;
};

// ✅ 새로운 개발 카드 생성
const handleCreate = async (formData) => {
  const newCard = {
    name: formData.name,
    description: formData.description || "",
    applyingMonth: formData.applyingMonth,
    serviceTypes: formData.serviceTypes,
    image: "https://via.placeholder.com/150", // 더미 이미지
    priorityCount: 0, // 초기값
    priorityHours: 0, // 초기값
  };

  const success = await addDevelopmentCard(newCard);
  if (success) {
    await fetchDevelopmentCards(); // 데이터 새로고침
  } else {
    alert("개발 카드 생성에 실패했습니다.");
  }
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
