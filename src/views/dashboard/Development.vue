<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import Button from '../../components/widgets/Button.vue';
import Modal from '../../components/widgets/Modal.vue';
import Modal2 from '../../components/widgets/Modal2.vue';
import DonutChart from '../../components/widgets/DonutChart.vue'; // ✅ 도넛 차트 추가

const route = useRoute();

// ✅ 개발 목록 데이터 (Service Type 비율 포함)
const nameList = ref([
  { id: "2501", name: "25.01", description: "25년도 1월 개발 대상 목록 입니다.", serviceTypes: { ICC: 50, RPA: 30, EKMTC: 20 } },
  { id: "2503", name: "25.03(후보)", description: "25년도 3월 개발 대상 후보 목록 입니다.", serviceTypes: { ICC: 60, RPA: 20, EKMTC: 20 } },
  { id: "2504", name: "25.04(후보)", description: "25년도 4월 개발 대상 후보 목록 입니다.", serviceTypes: { ICC: 40, RPA: 40, EKMTC: 20 } },
]);

// ✅ 실제 SR 요청 데이터
const requestData = ref([
  { id: 12345, title: "VEP 제약 조건 추가의 건", domain: "CC", serviceType: "ICC", requestDate: "2025-03-11", estimatedHours: 17, importance: "필수 개발 대상" },
  { id: 15346, title: "e-billing 확대", domain: "SO", serviceType: "RPA", requestDate: "2025-02-09", estimatedHours: 58, importance: "긴급 - 중요도 상" },
  { id: 428215, title: "unplanned report 정리 개선", domain: "DT", serviceType: "ICC", requestDate: "2024-10-29", estimatedHours: 23, importance: "필수 개발 대상" },
  { id: 731205, title: "부산 터미널 × eBilling", domain: "SO", serviceType: "RPA", requestDate: "2025-01-23", estimatedHours: 41, importance: "비긴급 - 중요도 하" },
  { id: 872019, title: "보안 강화 패치 적용", domain: "SEC", serviceType: "ICC", requestDate: "2025-09-01", estimatedHours: 29, importance: "필수 개발 대상" },
]);

// ✅ Service Type 비율 계산 (도넛 차트용)
const serviceData = computed(() => {
  const counts = {};
  requestData.value.forEach(item => {
    if (!counts[item.serviceType]) {
      counts[item.serviceType] = 0;
    }
    counts[item.serviceType]++;
  });

  return Object.keys(counts).map(type => ({
    serviceType: type,
    count: counts[type]
  }));
});

// ✅ "필수 개발 대상" 개수 & 총 공수시간 집계
const priorityCount = computed(() => 
  requestData.value.filter(item => item.importance === "필수 개발 대상").length
);
const priorityHours = computed(() => 
  requestData.value.reduce((sum, item) => sum + (item.importance === "필수 개발 대상" ? item.estimatedHours : 0), 0)
);

// ✅ 모달 상태 관리
const isModal1Open = ref(false);
const isModal2Open = ref(false);
const closeModal1 = () => { isModal1Open.value = false; };
const closeModal2 = () => { isModal2Open.value = false; };
</script>

<template>
  <div class="development-container">
    <div class="header">
      <h2> S/R 요청 카드 리스트</h2>
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

<style scoped>
.development-container {
  padding: 20px;
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
