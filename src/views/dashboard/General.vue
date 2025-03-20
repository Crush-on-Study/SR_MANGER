<template>
  <div class="general-container">
    <!-- 필터 바 -->
    <div class="filter-header">
      <h2>일반 SR 리스트</h2>
    </div>

    <SearchBar class="searchbar"
      :domainOptions="['CC', 'CS', 'SO', 'VO']"
      :statusOptions="['Request', 'Approved', 'In Progress', 'Finished', 'Rejected']"
      :serviceTypeOptions="['ICC', 'RPA', 'E-KMTC']"
      :importanceOptions="[
        '비긴급 - 중요도 하', 
        '비긴급 - 중요도 상', 
        '긴급 - 중요도 하', 
        '긴급 - 중요도 상', 
        '필수 개발 대상', 
        '미지정'
      ]"
      @search="handleSearch"
    />

    <!-- ✅ 개발 대상 추가 버튼 -->
    <div class="button-container">
      <Button label="+ 개발 대상 추가" type="primary" :disabled="!isAnyChecked" @click="openModal" />
    </div>

    <!-- ✅ 테이블 -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th><input type="checkbox" v-model="allChecked" @change="toggleAll" /></th>
            <th>Ref.no</th>
            <th>Domain</th>
            <th>Title</th>
            <th>Status</th>
            <th>Service Type</th>
            <th>Request Date</th>
            <th>Estimated Hours</th>
            <th>중요도</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(item) in filteredItems" 
            :key="item.ref_no"
            :class="{ 'highlight-mandatory': item.importance === '필수 개발 대상' }"
          >
            <td><input type="checkbox" v-model="item.isChecked" /></td>
            <td>{{ item.ref_no }}</td>
            <td>{{ item.domain }}</td>
            <td>{{ item.title }}</td>
            <td><StatusCard :status="item.status" /></td>
            <td>{{ item.serviceType }}</td>
            <td>{{ item.requestDate }}</td>
            <td>{{ item.estimatedHours }}</td>
            <td>{{ item.importance }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ✅ 도메인별 Total Hours + 전체 Total -->
    <div class="total-summary">
      <span class="total-item total-highlight">Total: {{ totalHours }} hours</span> |
      <span v-for="(hours, domain) in totalHoursByDomain" :key="domain" class="total-item">
        {{ domain }}: {{ hours }} hours
      </span>
    </div>

    <!-- ✅ 모달 추가 -->
    <Modal v-if="isModalOpen" title="개발 목록에 추가" :nameList="nameList" @close="isModalOpen = false" @addNewItem="addNewItem" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { getGeneralSRRequests } from "../../backend/firestoreService.js";
import SearchBar from "../../components/widgets/SearchBar.vue";
import Button from "../../components/widgets/Button.vue";
import Modal from "../../components/widgets/Modal.vue";
import StatusCard from "../../components/widgets/StatusCard.vue";

// ✅ Firestore에서 가져온 데이터를 저장할 상태 변수
const items = ref([]);

// ✅ Firestore에서 데이터를 가져와 `items`에 저장
const fetchGeneralSRRequests = async () => {
  items.value = await getGeneralSRRequests();
  console.log("📌 Firestore에서 가져온 General 데이터:", items.value);
};

// ✅ 컴포넌트가 마운트될 때 Firestore 데이터 로드
onMounted(fetchGeneralSRRequests);

// ✅ 필터 상태 추가
const filters = ref({
  searchText: '',
  domain: '',
  status: '',
  serviceType: '',
  importance: ''
});

const filtersApplied = ref(false);

const handleSearch = (searchFilters) => {
  Object.assign(filters.value, searchFilters);
  filtersApplied.value = true;
};

// ✅ 필터링된 리스트 계산
const filteredItems = computed(() => {
  if (!filtersApplied.value) return items.value;

  return items.value.filter(item => (
    (!filters.value.searchText || item.title.toLowerCase().includes(filters.value.searchText.trim().toLowerCase())) &&
    (!filters.value.domain || item.domain === filters.value.domain) &&
    (!filters.value.status || item.status === filters.value.status) &&
    (!filters.value.serviceType || item.serviceType === filters.value.serviceType) &&
    (!filters.value.importance || item.importance === filters.value.importance)
  ));
});

// ✅ 체크박스 관련 로직
const allChecked = computed({
  get: () => items.value.every((item) => item.isChecked),
  set: (value) => items.value.forEach((item) => (item.isChecked = value)),
});

// ✅ 선택된 아이템 목록
const selectedItems = computed(() => items.value.filter(item => item.isChecked));
const isAnyChecked = computed(() => selectedItems.value.length > 0);

// ✅ 도메인별 Estimated Hours 집계
const totalHoursByDomain = computed(() => {
  let hours = {};
  selectedItems.value.forEach((item) => {
    if (!hours[item.domain]) {
      hours[item.domain] = 0;
    }
    hours[item.domain] += item.estimatedHours;
  });
  return hours;
});

// ✅ 전체 Total 계산
const totalHours = computed(() => {
  return Object.values(totalHoursByDomain.value).reduce((sum, value) => sum + value, 0);
});

// ✅ 모달 열기
const isModalOpen = ref(false);
const openModal = () => {
  isModalOpen.value = true;
};

// ✅ 개발 목록에 추가
const addNewItem = (selectedItems) => {
  isModalOpen.value = false;
};
</script>



<style scoped>
.general-container {
    padding: 10px;
}

.filter-header, .searchbar {
  margin: 10px;
}


.button-container {
  display: flex;
  justify-content: flex-end;
  margin: 10px;
}

.table-container {
  margin: 10px;
  background: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
}

select {
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  width: 70%;
  text-align: left;
}

/* ✅ 필수 개발 대상 강조 스타일 */
.highlight-mandatory {
  background-color: #fff5cc !important; /* 연한 노란색 배경 */
  color: red !important; /* 강조된 글씨 색상 */
  font-weight: bold;
}


th, td {
  border-bottom: 1px solid #ddd;
  padding: 12px;
  text-align: center;
  font-size: 14px;
}

th {
  background: #f1f1f1;
}

/* ✅ Total Hours 스타일 */
.total-summary {
  margin-top: 15px;
  padding: 10px;
  background: #eef;
  border-radius: 8px;
  display: flex;
  gap: 10px;
  justify-content: center;
}

/* ✅ Total을 포함한 모든 박스 스타일 */
.total-item {
  font-size: 14px;
  background: white;
  padding: 5px 8px;
  border-radius: 6px;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.2);
}

/* ✅ Total만 빨간색 강조 */
.total-highlight {
  color: red;
  font-weight: bold;
}
</style>
