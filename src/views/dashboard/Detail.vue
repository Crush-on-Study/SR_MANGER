<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import Button from '../../components/widgets/Button.vue';

const route = useRoute();

const nameList = ref([
  { id: "2501", name: "25.01", description: "25년도 1월 개발 대상 목록 입니다." },
  { id: "2503", name: "25.03(후보)", description: "25년도 3월 개발 대상 후보 목록 입니다." },
  { id: "2504", name: "25.04(후보)", description: "25년도 4월 개발 대상 후보 목록 입니다." },
]);

const selectedItem = computed(() => {
  return nameList.value.find(item => item.id === route.params.id) || { name: "목록 없음" };
});

// ✅ 첫 번째 메인 테이블 데이터 (기본 리스트 + 추가 데이터)
const mainTableData = ref([
  { id: 481384, title: "ICC 분석", domain: "CM", serviceType: "ICC", requestDate: "2024.12.31", estimatedHours: 170, importance: "필수 개발 대상" },
  { id: 15346, title: "Audinga API 연경", domain: "CM", serviceType: "API", requestDate: "2025.02.09", estimatedHours: 58, importance: "긴급 중요도 상" },
  { id: 731205, title: "부산 터미널 × eBilling", domain: "SO", serviceType: "RPA", requestDate: "2025.01.23", estimatedHours: 41, importance: "긴급 중요도 하" },
  { id: 12345, title: "2025 G.BSC Request", domain: "CS", serviceType: "ICC", requestDate: "2025.03.11", estimatedHours: 17, importance: "비긴급 중요도 상" },
  { id: 428215, title: "unplanned report 정리 개선", domain: "DT", serviceType: "ICC", requestDate: "2024.10.29", estimatedHours: 23, importance: "비긴급 중요도 상" },
  { id: 731484, title: "TAX Report Upgrade", domain: "FN", serviceType: "EKMTC", requestDate: "2024.10.22", estimatedHours: 30, importance: "비긴급 중요도 하" },
  // ✅ 추가된 더미 데이터
  { id: 981234, title: "서버 성능 최적화", domain: "IT", serviceType: "ICC", requestDate: "2025.06.12", estimatedHours: 45, importance: "필수 개발 대상" },
  { id: 762345, title: "클라우드 마이그레이션", domain: "IT", serviceType: "RPA", requestDate: "2025.07.22", estimatedHours: 62, importance: "긴급 중요도 상" },
  { id: 612309, title: "데이터 백업 솔루션 개선", domain: "DB", serviceType: "EKMTC", requestDate: "2025.08.14", estimatedHours: 38, importance: "비긴급 중요도 상" },
  { id: 872019, title: "보안 강화 패치 적용", domain: "SEC", serviceType: "ICC", requestDate: "2025.09.01", estimatedHours: 29, importance: "비긴급 중요도 하" },
  { id: 432198, title: "UI/UX 개편 프로젝트", domain: "UX", serviceType: "API", requestDate: "2025.10.05", estimatedHours: 55, importance: "긴급 중요도 하" },
  { id: 123789, title: "실시간 로그 모니터링 구축", domain: "LOG", serviceType: "RPA", requestDate: "2025.11.23", estimatedHours: 48, importance: "비긴급 중요도 중" }
]);

const serviceTypeTables = ref({
  ICC: [],
  EKMTC: [],
  RPA: []
});

const excludeItem = (index) => {
  const item = mainTableData.value[index];
  if (serviceTypeTables.value[item.serviceType]) {
    serviceTypeTables.value[item.serviceType].push(item);
    mainTableData.value.splice(index, 1);
  }
};

const restoreItem = (serviceType, index) => {
  const item = serviceTypeTables.value[serviceType][index];
  mainTableData.value.push(item);
  serviceTypeTables.value[serviceType].splice(index, 1);
};
</script>


<template>
    <div class="detail-container">
      <h2>{{ selectedItem.name }} 개발 목록 리스트</h2>
      
        <!-- ✅ 스크롤 적용된 테이블 컨테이너 -->
        <div class="table-wrapper">
      <table class="main-table">
        <thead>
          <tr>
            <th>Ref.no</th>
            <th>Title</th>
            <th>Domain</th>
            <th>Service Type</th>
            <th>Request Date</th>
            <th>Estimated Hours</th>
            <th>중요도</th>
            <th>제외</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in mainTableData" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.title }}</td>
            <td>{{ item.domain }}</td>
            <td>{{ item.serviceType }}</td>
            <td>{{ item.requestDate }}</td>
            <td>{{ item.estimatedHours }}</td>
            <td>{{ item.importance }}</td>
            <td><button @click="excludeItem(index)">🚫</button></td>
            <td><button @click="mainTableData.splice(index, 1)">🗑️</button></td>
          </tr>
        </tbody>
      </table>
    </div>
      
      <!-- ✅ Service Type별 테이블 -->
      <div v-for="(items, type) in serviceTypeTables" :key="type" class="service-type-section">
        <h3>{{ type }}</h3>
        <table>
          <thead>
            <tr>
              <th class="ref-no">Ref.no</th>
              <th class="title">Title</th>
              <th class="importance">중요도</th>
              <th class="estimated-hours">Est. Hours</th>
              <th class="action">추가</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.title }}</td>
              <td>{{ item.importance }}</td>
              <td>{{ item.estimatedHours }}</td>
              <td><button @click="restoreItem(type, index)">➕</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  

<style scoped>
/* ✅ 테이블 컨테이너 스타일 */
.table-wrapper {
  max-height: 400px; /* ✅ 최대 10개가 보이도록 제한 */
  overflow-y: auto;  /* ✅ 아래로 스크롤 가능하게 설정 */
  border: 1px solid #ddd; /* ✅ 테두리 추가 */
  border-radius: 8px; /* ✅ 둥근 모서리 */
}

.detail-container {
  padding: 20px;
}

.main-table,
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th, td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
}

th {
  background: #f4f4f4;
}

.service-type-section {
  margin-top: 30px;
}
</style>
