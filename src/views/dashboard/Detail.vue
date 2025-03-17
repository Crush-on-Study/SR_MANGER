<script setup>
import { ref } from 'vue';
import Button from '../../components/widgets/Button.vue';

// ✅ 첫 번째 메인 테이블 데이터 (기본 리스트)
// ✅ 상세 페이지에 표시할 테이블 데이터 (임시 데이터)
const mainTableData = ref([
  { id: 481384, title: "ICC 분석", domain: "CM", serviceType: "ICC", requestDate: "2024.12.31", estimatedHours: 170, importance: "필수 개발 대상" },
  { id: 15346, title: "Audinga API 연경", domain: "CM", serviceType: "API", requestDate: "2025.02.09", estimatedHours: 58, importance: "긴급 중요도 상" },
  { id: 731205, title: "부산 터미널 × eBilling", domain: "SO", serviceType: "RPA", requestDate: "2025.01.23", estimatedHours: 41, importance: "긴급 중요도 하" },
  { id: 12345, title: "2025 G.BSC Request", domain: "CS", serviceType: "ICC", requestDate: "2025.03.11", estimatedHours: 17, importance: "비긴급 중요도 상" },
  { id: 428215, title: "unplanned report 정리 개선", domain: "DT", serviceType: "ICC", requestDate: "2024.10.29", estimatedHours: 23, importance: "비긴급 중요도 상" },
  { id: 731484, title: "TAX Report Upgrade", domain: "FN", serviceType: "ICC + EKMTC", requestDate: "2024.10.22", estimatedHours: 30, importance: "비긴급 중요도 하" }
]);

// ✅ Service Type별 리스트 (제외된 데이터 저장소)
const serviceTypeTables = ref({
  ICC: [],
  'E-KMTC+RPA': []
});

// ✅ "제외" 버튼 클릭 시 Service Type에 따라 해당 테이블로 이동
const excludeItem = (index) => {
  const item = mainTableData.value[index];
  if (serviceTypeTables.value[item.serviceType]) {
    serviceTypeTables.value[item.serviceType].push(item);
    mainTableData.value.splice(index, 1); // 메인 테이블에서 제거
  }
};

// ✅ Service Type 리스트에서 "추가" 버튼 클릭 시 다시 메인 테이블로 이동
const restoreItem = (serviceType, index) => {
  const item = serviceTypeTables.value[serviceType][index];
  mainTableData.value.push(item); // 메인 테이블로 복귀
  serviceTypeTables.value[serviceType].splice(index, 1); // Service Type 리스트에서 제거
};
</script>

<template>
  <div class="detail-container">
    <h2>개발 목록 리스트</h2>
    
    <!-- ✅ 첫 번째 테이블 (메인 리스트) -->
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
    
    <!-- ✅ Service Type 테이블 (제외된 데이터 저장소) -->
    <div v-for="(items, type) in serviceTypeTables" :key="type" class="service-type-section">
      <h3>{{ type }}</h3>
      <table>
        <thead>
          <tr>
            <th>Ref.no</th>
            <th>Title</th>
            <th>중요도</th>
            <th>Estimated Hours</th>
            <th>추가</th>
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
