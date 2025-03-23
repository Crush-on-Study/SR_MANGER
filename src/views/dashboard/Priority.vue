<template>
  <div class="priority-container">
    <!-- 헤더 -->
    <div class="filter-header">
      <h2>우선순위 S/R 리스트</h2>
    </div>

    <!-- ✅ 필터 적용 -->
    <SearchBar
      class="searchbar"
      :domainOptions="['CC', 'SO']"
      :statusOptions="['Request', 'Approved', 'In Progress', 'Finished', 'Rejected']"
      :serviceTypeOptions="['ICC', 'RPA', 'E-KMTC']"
      @search="handleSearch"
    />

    <div class="button-container">
      <Button label="+ 개발 대상 추가" type="primary" @click="handleAddTarget" :disabled="!isAnyChecked" />
    </div>

    <!-- ✅ 테이블 -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th><input type="checkbox" v-model="allChecked" @change="toggleAll" /></th>
            <th @click="sortTable('ref_no')">Ref.no <span v-if="sortKey === 'ref_no'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span></th>
            <th @click="sortTable('domain')">Domain <span v-if="sortKey === 'domain'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span></th>
            <th @click="sortTable('title')">Title <span v-if="sortKey === 'title'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span></th>
            <th @click="sortTable('status')">Status <span v-if="sortKey === 'status'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span></th>
            <th @click="sortTable('serviceType')">Service Type <span v-if="sortKey === 'serviceType'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span></th>
            <th @click="sortTable('requestDate')">Request Date <span v-if="sortKey === 'requestDate'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span></th>
            <th @click="sortTable('estimatedHours')">Estimated Hours <span v-if="sortKey === 'estimatedHours'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span></th>
            <th>필수 개발 대상</th>
            <th>우선 순위</th>
            <th>개발 Month</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in sortedItems" :key="item.ref_no" :class="{ 'highlight-mandatory': item.importance === '필수 개발 대상' }">
            <td><input type="checkbox" v-model="item.isChecked" /></td>
            <td>{{ item.ref_no }}</td>
            <td>{{ item.domain }}</td>
            <td>{{ item.title }}</td>
            <td><StatusCard :status="item.status" /></td>
            <td>{{ item.serviceType }}</td>
            <td>{{ item.requestDate }}</td>
            <td>{{ item.estimatedHours }}</td>
            <td>
              <select v-model="item.mandatory" class="mandatory-input">
                <option>Y</option>
                <option>N</option>
              </select>
            </td>
            <td><input type="number" v-model="item.priority" min="1" class="priority-input" /></td>
            <td><MonthCard :month="(new Date(item.requestDate).getMonth() + 1) + '월'" /></td>
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
    <Modal v-if="isModalOpen" title="개발 목록에 추가" :nameList="nameList" :selectedSRs="selectedItems" @close="isModalOpen = false" @addNewItem="addNewItem" @addToCard="handleAddToCard" />
    <DetailModal v-if="isDetailModalOpen" :detailInfo="detailInfo" @close="isDetailModalOpen = false" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { getPrioritySRRequests, getDevelopmentCards } from "../../backend/firestoreService.js";
import SearchBar from "../../components/widgets/SearchBar.vue";
import Button from "../../components/widgets/Button.vue";
import Modal from "../../components/widgets/Modal.vue";
import StatusCard from "../../components/widgets/StatusCard.vue";
import MonthCard from "../../components/widgets/MonthCard.vue";
import DetailModal from "../../components/Modals/DetailModal.vue";

// ✅ Firestore 데이터
const items = ref([]);
const filteredItems = ref([]); // 필터링된 데이터 저장
const sortKey = ref("");
const sortOrder = ref("asc");
const nameList = ref([]); // 개발 카드 목록

const fetchPrioritySRRequests = async () => {
  const data = await getPrioritySRRequests();
  items.value = data.map(item => ({ ...item, isChecked: false }));
  filteredItems.value = [...items.value]; // 기본적으로 모든 데이터 유지
};

// ✅ 개발 카드 목록 가져오기
const fetchDevelopmentCards = async () => {
  nameList.value = await getDevelopmentCards();
};

onMounted(() => {
  fetchPrioritySRRequests();
  fetchDevelopmentCards();
});

// ✅ 필터 적용
const handleSearch = (searchFilters) => {
  filteredItems.value = items.value.filter(item => {
    // ✅ Ref.No와 Title 모두 검색
    const searchTextMatch = !searchFilters.searchText ||
      item.title.toLowerCase().includes(searchFilters.searchText.toLowerCase()) ||
      item.ref_no.toString().includes(searchFilters.searchText);

    // ✅ 날짜 필터링
    const requestDate = new Date(item.requestDate);
    const fromDate = searchFilters.fromDate ? new Date(searchFilters.fromDate) : null;
    const toDate = searchFilters.toDate ? new Date(searchFilters.toDate) : null;

    const dateMatch = (!fromDate || requestDate >= fromDate) &&
                     (!toDate || requestDate <= toDate);

    // ✅ 나머지 필터링 조건
    const domainMatch = !searchFilters.domain || searchFilters.domain === "ALL" || item.domain === searchFilters.domain;
    const statusMatch = !searchFilters.status || searchFilters.status === "ALL" || item.status === searchFilters.status;
    const serviceTypeMatch = !searchFilters.serviceType || searchFilters.serviceType === "ALL" || item.serviceType === searchFilters.serviceType;

    return searchTextMatch && dateMatch && domainMatch && statusMatch && serviceTypeMatch;
  });
};

// ✅ 정렬된 리스트 (필터된 데이터를 정렬)
const sortedItems = computed(() => {
  if (!sortKey.value) return filteredItems.value;

  return [...filteredItems.value].sort((a, b) => {
    const valueA = a[sortKey.value];
    const valueB = b[sortKey.value];

    return typeof valueA === "string"
      ? (sortOrder.value === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA))
      : (sortOrder.value === "asc" ? valueA - valueB : valueB - valueA);
  });
});

// ✅ 정렬 함수
const sortTable = (key) => {
  sortOrder.value = sortKey.value === key ? (sortOrder.value === "asc" ? "desc" : "asc") : "asc";
  sortKey.value = key;
};

// ✅ 체크박스 전체 선택 기능
const allChecked = computed({
  get: () => items.value.length > 0 && items.value.every((item) => item.isChecked),
  set: (value) => items.value.forEach((item) => (item.isChecked = value)),
});

// ✅ 체크된 아이템 목록
const selectedItems = computed(() => items.value.filter(item => item.isChecked));
const isAnyChecked = computed(() => selectedItems.value.length > 0);

// ✅ 전체 Total 계산
const totalHours = computed(() => {
  return Object.values(totalHoursByDomain.value).reduce((sum, value) => sum + value, 0);
});

// ✅ 개발 대상 추가 버튼 클릭 이벤트
const isModalOpen = ref(false);
const handleAddTarget = () => {
  if (!isAnyChecked.value) {
    alert("최소 1개 이상의 S/R을 선택하세요.");
    return;
  }
  openModal();
};

// ✅ 모달 열기
const openModal = () => {
  isModalOpen.value = true;
};

// ✅ 개발 목록에 추가
const addNewItem = (selectedItems) => {
  console.log("✅ 추가할 아이템:", selectedItems);
  isModalOpen.value = false;
};

// ✅ Modal에서 카드에 추가 후 처리
const handleAddToCard = (cardIds) => {
  console.log("✅ 카드에 추가 완료, 선택된 카드 ID:", cardIds);
  isModalOpen.value = false;
  // 선택된 항목 체크 해제
  items.value.forEach(item => {
    if (item.isChecked) item.isChecked = false;
  });
};

// ✅ 상세 모달 열기
const isDetailModalOpen = ref(false);
const detailInfo = ref({});
const openDetailModal = (id) => {
  const selectedIdDetails = items.value.find((item) => item.ref_no === id);
  if (!selectedIdDetails) return;
  detailInfo.value = selectedIdDetails;
  isDetailModalOpen.value = true;
};

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
</script>

<style scoped>
.priority-container {
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

/* ✅ 우선 순위 입력 필드 */
.priority-input {
  width: 50px;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
  text-align: center;
  font-size: 14px;
  background-color: #f8f9fa;
  transition: all 0.2s ease-in-out;
}

.priority-input:focus {
  outline: none;
  border-color: #3498db;
  background-color: white;
}

/* ✅ 중요도 선택 드롭다운 */
.mandatory-select {
  width: 70px;
  padding: 6px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.mandatory-select:focus {
  outline: none;
  border-color: #3498db;
  background-color: #f1f1f1;
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
  margin: 15px;
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

.service-type {
  background: #ffede0; /* ✅ Service Type 스타일 추가 (연한 주황색) */
  color: #b30000;
}
</style>
