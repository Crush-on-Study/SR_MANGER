<template>
  <div class="general-container">
    <!-- 헤더 -->
    <div class="filter-header">
      <h2>일반 S/R 리스트</h2>
    </div>

    <!-- ✅ 필터 적용 -->
    <SearchBar
      class="searchbar"
      :domainOptions="['PN', 'SA', 'CS', 'SC', 'VO', 'MA', 'FN', 'CM', 'HR', 'ST']"
      :statusOptions="['Request', 'Approved', 'In Progress', 'Rejected', 'Closed', 'Testing', 'DT Approved', ' Reconsider', 'Declined', 'Completed']"
      :serviceTypeOptions="['ICC', 'RPA', 'E-KMTC']"
      :importanceOptions="['미지정', '긴급-상', '긴급-하', '필수 개발 대상', '비긴급-상', '비긴급-하']"
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
            <th @click="sortTable('DOM_KND')">Domain <span v-if="sortKey === 'DOM_KND'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span></th>
            <th @click="sortTable('REQ_TITLE')">Title <span v-if="sortKey === 'REQ_TITLE'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span></th>
            <th @click="sortTable('REQ_STATUS')">Status <span v-if="sortKey === 'REQ_STATUS'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span></th>
            <th @click="sortTable('PROGRAM_TYPE')">Service Type <span v-if="sortKey === 'PROGRAM_TYPE'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span></th>
            <th @click="sortTable('REQ_DT')">Request Date <span v-if="sortKey === 'REQ_DT'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span></th>
            <th @click="sortTable('TOT_ESTM_TM')">Estimated Hours <span v-if="sortKey === 'TOT_ESTM_TM'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span></th>
            <th @click="sortTable('importance')">Importance <span v-if="sortKey === 'importance'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span></th> <!-- Importance 칼럼 추가 -->
            <th @click="sortTable('REQ_UNO')">요청자 <span v-if="sortKey === 'REQ_UNO'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in paginatedItems" :key="item.id">
            <td><input type="checkbox" v-model="item.isChecked" /></td>
            <td>{{ item.ref_no }}</td>
            <td>{{ item.DOM_KND }}</td>
            <td class="title-cell" @click="openDetailModal(item.id)">{{ item.REQ_TITLE }}</td>
            <td><StatusCard :status="item.REQ_STATUS" /></td>
            <td>{{ item.PROGRAM_TYPE }}</td>
            <td>{{ item.REQ_DT }}</td>
            <td>{{ item.TOT_ESTM_TM || 0 }}</td>
            <td>
              <select v-model="item.importance" @change="updateImportance(item)" class="importance-select">
                <option value="미지정">미지정</option>
                <option value="긴급-상">긴급-상</option>
                <option value="긴급-하">긴급-하</option>
                <option value="필수 개발 대상">필수 개발 대상</option>
                <option value="비긴급-상">비긴급-상</option>
                <option value="비긴급-하">비긴급-하</option>
              </select>
            </td>
            <td>{{ item.REQ_UNO }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ✅ 페이지네이션 -->
    <Pagination
      :total-items="sortedItems.length"
      v-model:current-page="currentPage"
      v-model:items-per-page="itemsPerPage"
    />

    <!-- ✅ 도메인별 Total Hours + 서비스 타입별 세부 집계 -->
    <div class="total-summary">
      <span class="total-item total-highlight">Total: {{ totalHours }} hours</span> |
      <span v-for="(hours, domain) in totalHoursByDomain" :key="domain" class="total-item">
        {{ domain }}: {{ hours.total }} hours
        (ICC: {{ hours.ICC || 0 }}, RPA: {{ hours.RPA || 0 }}, WEB: {{ hours.WEB || 0 }})
      </span>
    </div>

    <!-- ✅ 모달 추가 -->
    <Modal v-if="isModalOpen" title="개발 목록에 추가" :nameList="nameList" :selectedSRs="selectedItems" @close="isModalOpen = false" @addNewItem="addNewItem" @addToCard="handleAddToCard" />
    <DetailModal v-if="isDetailModalOpen" :detailInfo="detailInfo" @close="isDetailModalOpen = false" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { getGeneralSRRequests, getDevelopmentCards, updateSR } from "../../backend/firestoreService.js";
import SearchBar from "../../components/widgets/SearchBar.vue";
import Button from "../../components/widgets/Button.vue";
import Modal from "../../components/widgets/Modal.vue";
import StatusCard from "../../components/widgets/StatusCard.vue";
import DetailModal from "../../components/Modals/DetailModal.vue";
import Pagination from "../../components/widgets/Pagination.vue";

// ✅ Firestore 데이터
const items = ref([]);
const filteredItems = ref([]); // 필터링된 데이터 저장
const sortKey = ref("");
const sortOrder = ref("asc");
const nameList = ref([]); // 개발 카드 목록

// ✅ 페이지네이션 관련 상태
const currentPage = ref(1);
const itemsPerPage = ref(10);

const fetchGeneralSRRequests = async () => {
  const data = await getGeneralSRRequests();
  console.log("✅ General.vue - Fetched Data:", data); // 디버깅 로그 추가
  items.value = data.map(item => ({
    id: item.id,
    ref_no: item.REQ_RNO || "N/A", // 요청 번호로 매핑
    REQ_UNO: item.REQ_UNO || "N/A", // 요청자 이름
    REQ_TITLE: item.REQ_TITLE || "",
    DOM_KND: item.DOM_KND || "",
    REQ_STATUS: item.REQ_STATUS || "",
    PROGRAM_TYPE: item.PROGRAM_TYPE || "",
    REQ_DT: item.REQ_DT || "",
    TOT_ESTM_TM: item.TOT_ESTM_TM || 0,
    importance: item.importance || "미지정", // 디폴트 값 설정
    isChecked: false,
  }));
  filteredItems.value = [...items.value]; // 기본적으로 모든 데이터 유지
  console.log("✅ General.vue - Items:", items.value); // 디버깅 로그 추가
};

// ✅ 개발 카드 목록 가져오기
const fetchDevelopmentCards = async () => {
  nameList.value = await getDevelopmentCards();
};

onMounted(() => {
  fetchGeneralSRRequests();
  fetchDevelopmentCards();
});

// ✅ Importance 업데이트
const updateImportance = async (item) => {
  const success = await updateSR(item.id, { importance: item.importance });
  if (!success) {
    alert("Importance 업데이트에 실패했습니다.");
    // 실패 시 원래 값으로 롤백
    fetchGeneralSRRequests();
  }
};

// ✅ 필터 적용
const handleSearch = (searchFilters) => {
  filteredItems.value = items.value.filter(item => {
    // ✅ ref_no와 REQ_TITLE 모두 검색
    const searchTextMatch = !searchFilters.searchText ||
      item.REQ_TITLE.toLowerCase().includes(searchFilters.searchText.toLowerCase()) ||
      item.ref_no.toString().includes(searchFilters.searchText);

    // ✅ 날짜 필터링
    const requestDate = new Date(item.REQ_DT);
    const fromDate = searchFilters.fromDate ? new Date(searchFilters.fromDate) : null;
    const toDate = searchFilters.toDate ? new Date(searchFilters.toDate) : null;

    const dateMatch = (!fromDate || requestDate >= fromDate) &&
                     (!toDate || requestDate <= toDate);

    // ✅ 나머지 필터링 조건
    const domainMatch = !searchFilters.domain || searchFilters.domain === "ALL" || item.DOM_KND === searchFilters.domain;
    const statusMatch = !searchFilters.status || searchFilters.status === "ALL" || item.REQ_STATUS === searchFilters.status;
    const serviceTypeMatch = !searchFilters.serviceType || searchFilters.serviceType === "ALL" || item.PROGRAM_TYPE === searchFilters.serviceType;
    const importanceMatch = !searchFilters.importance || searchFilters.importance === "ALL" || item.importance === searchFilters.importance; // Importance 필터링 활성화

    return searchTextMatch && dateMatch && domainMatch && statusMatch && serviceTypeMatch && importanceMatch;
  });
  currentPage.value = 1; // 필터링 후 첫 페이지로 이동
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

// ✅ 페이지네이션된 아이템
const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return sortedItems.value.slice(start, end);
});

// ✅ 정렬 함수
const sortTable = (key) => {
  sortOrder.value = sortKey.value === key ? (sortOrder.value === "asc" ? "desc" : "asc") : "asc";
  sortKey.value = key;
  currentPage.value = 1; // 정렬 후 첫 페이지로 이동
};

// ✅ 체크박스 전체 선택 기능
const allChecked = computed({
  get: () => items.value.length > 0 && items.value.every((item) => item.isChecked),
  set: (value) => items.value.forEach((item) => (item.isChecked = value)),
});

// ✅ 체크된 아이템 목록
const selectedItems = computed(() => items.value.filter(item => item.isChecked));
const isAnyChecked = computed(() => selectedItems.value.length > 0);

// ✅ 도메인별 Estimated Hours 집계 (서비스 타입별 세부 집계 포함)
const totalHoursByDomain = computed(() => {
  let hours = {};
  selectedItems.value.forEach((item) => {
    if (!hours[item.DOM_KND]) {
      hours[item.DOM_KND] = { total: 0, ICC: 0, RPA: 0, WEB: 0 };
    }
    hours[item.DOM_KND].total += item.TOT_ESTM_TM || 0;
    if (item.PROGRAM_TYPE === "ICC") {
      hours[item.DOM_KND].ICC += item.TOT_ESTM_TM || 0;
    } else if (item.PROGRAM_TYPE === "RPA") {
      hours[item.DOM_KND].RPA += item.TOT_ESTM_TM || 0;
    } else if (item.PROGRAM_TYPE === "WEB") {
      hours[item.DOM_KND].WEB += item.TOT_ESTM_TM || 0;
    }
  });

  // 소수점 첫째 자리까지만 반올림 처리
  for (const domain in hours) {
    hours[domain].total = Number(hours[domain].total.toFixed(1));
    hours[domain].ICC = Number(hours[domain].ICC.toFixed(1));
    hours[domain].RPA = Number(hours[domain].RPA.toFixed(1));
    hours[domain].WEB = Number(hours[domain].WEB.toFixed(1));
  }

  return hours;
});

// ✅ 전체 Total 계산
const totalHours = computed(() => {
  const total = Object.values(totalHoursByDomain.value).reduce((sum, value) => sum + value.total, 0);
  return Number(total.toFixed(1)); // 소수점 첫째 자리까지만 반올림 처리
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
  const selectedItem = items.value.find((item) => item.id === id);
  if (!selectedItem) return;
  detailInfo.value = selectedItem;
  isDetailModalOpen.value = true;
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

th, td {
  border-bottom: 1px solid #ddd;
  padding: 12px;
  text-align: center;
  font-size: 14px;
}

th {
  background: #f1f1f1;
}

/* ✅ Importance 드롭다운 스타일 */
.importance-select {
  width: 120px;
  padding: 6px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.importance-select:focus {
  outline: none;
  border-color: #3498db;
  background-color: #f1f1f1;
}

/* ✅ Title 셀 스타일 개선 */
.title-cell {
  cursor: pointer;
  color: #333; /* 기본 색상을 진한 회색으로 설정 */
  transition: color 0.2s ease-in-out; /* 부드러운 색상 전환 */
}

.title-cell:hover {
  color: #555; /* 호버 시 약간 더 밝은 회색 */
}

.title-cell:visited {
  color: #333; /* 방문 후에도 색상 유지 */
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

/* ✅ Service Type 스타일 추가 (연한 주황색) */
.service-type {
  background: #ffede0;
  color: #b30000;
}
</style>