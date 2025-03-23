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
      :importanceOptions="[ '비긴급 - 중요도 하', '비긴급 - 중요도 상', '긴급 - 중요도 하', '긴급 - 중요도 상', '필수 개발 대상', '미지정']"
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
            <th v-for="col in columns" :key="col.key" @click="sortTable(col.key)">
              {{ col.label }}
              <span v-if="sortKey === col.key">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in sortedFilteredItems" :key="item.ref_no" :class="{ 'highlight-mandatory': item.importance === '필수 개발 대상' }">
            <td><input type="checkbox" v-model="item.isChecked" /></td>
            <td>{{ item.ref_no }}</td>
            <td>{{ item.domain }}</td>
            <td>{{ item.title }}</td>
            <td><StatusCard :status="item.status" /></td>
            <td>{{ item.serviceType }}</td>
            <td>{{ item.requestDate }}</td>
            <td>{{ item.estimatedHours }}</td>
            <td>
              <select v-model="item.importance" class="importance-input">
                <option v-for="option in importanceOptions" :key="option" :value="option">{{ option }}</option>
              </select>
            </td>
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
import { getGeneralSRRequests, getDevelopmentCards } from "../../backend/firestoreService.js";
import SearchBar from "../../components/widgets/SearchBar.vue";
import Button from "../../components/widgets/Button.vue";
import Modal from "../../components/widgets/Modal.vue";
import StatusCard from "../../components/widgets/StatusCard.vue";

// ✅ Firestore에서 가져온 데이터를 저장할 상태 변수
const items = ref([]);
const sortKey = ref(""); // 정렬 기준
const sortOrder = ref("asc"); // asc(오름차순) / desc(내림차순)
const nameList = ref([]); // 개발 카드 목록

// ✅ 중요도 옵션 정의
const importanceOptions = ref(['비긴급 - 중요도 하', '비긴급 - 중요도 상', '긴급 - 중요도 하', '긴급 - 중요도 상', '필수 개발 대상', '미지정']);

// ✅ Firestore에서 데이터를 가져와 `items`에 저장
const fetchGeneralSRRequests = async () => {
  const data = await getGeneralSRRequests();
  items.value = data.map(item => ({
    ...item,
    isChecked: false,
    importance: item.importance || '미지정' // 초기값을 '미지정'으로 설정
  }));
};

// ✅ 개발 카드 목록 가져오기
const fetchDevelopmentCards = async () => {
  nameList.value = await getDevelopmentCards();
};

// ✅ 컴포넌트가 마운트될 때 Firestore 데이터 로드
onMounted(() => {
  fetchGeneralSRRequests();
  fetchDevelopmentCards();
});

// ✅ 컬럼 정의 (정렬을 위함)
const columns = ref([
  { key: "ref_no", label: "Ref.no" },
  { key: "domain", label: "Domain" },
  { key: "title", label: "Title" },
  { key: "status", label: "Status" },
  { key: "serviceType", label: "Service Type" },
  { key: "requestDate", label: "Request Date" },
  { key: "estimatedHours", label: "Estimated Hours" },
  { key: "importance", label: "중요도" },
]);

// ✅ 정렬 함수
const sortTable = (key) => {
  sortOrder.value = sortKey.value === key ? (sortOrder.value === "asc" ? "desc" : "asc") : "asc";
  sortKey.value = key;
};

// ✅ 필터 상태 추가
const filters = ref({
  searchText: '',
  fromDate: '',
  toDate: '',
  domain: '',
  status: '',
  serviceType: '',
  importance: ''
});

// ✅ 필터 적용 여부
const filtersApplied = ref(false);

// ✅ 필터 적용 함수
const handleSearch = (searchFilters) => {
  Object.assign(filters.value, searchFilters);
  filtersApplied.value = true;

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
    const importanceMatch = !searchFilters.importance || searchFilters.importance === "비긴급" || item.importance === searchFilters.importance;

    return searchTextMatch && dateMatch && domainMatch && statusMatch && serviceTypeMatch && importanceMatch;
  });
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

// ✅ 정렬된 & 필터링된 리스트 적용
const sortedFilteredItems = computed(() => {
  if (!sortKey.value) return filteredItems.value;

  return [...filteredItems.value].sort((a, b) => {
    const valueA = a[sortKey.value];
    const valueB = b[sortKey.value];

    return typeof valueA === "string"
      ? (sortOrder.value === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA))
      : (sortOrder.value === "asc" ? valueA - valueB : valueB - valueA);
  });
});

// ✅ 체크박스 관련 로직
const allChecked = computed({
  get: () => items.value.length > 0 && items.value.every((item) => item.isChecked),
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
  if (!isAnyChecked.value) {
    alert("최소 1개 이상의 S/R을 선택하세요.");
    return;
  }
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

// ✅ 상세 모달 열기 (현재 사용되지 않음, 필요 시 구현)
const isDetailModalOpen = ref(false);
const detailInfo = ref({});
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
  cursor: pointer;
  user-select:none;
}

th:hover {
  color: #007bff;
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
