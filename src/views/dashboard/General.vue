<template>
  <div class="general-container">
    <!-- 필터 바 -->
    <div class="filter-header">
      <h2>일반 SR</h2>
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
      <Button 
        label="+ 개발 대상 추가" 
        type="primary" 
        :disabled="!isAnyChecked"
        @click="openModal" 
      />
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
                :key="item.id"
                :class="{ 'highlight-mandatory': item.importance === '필수 개발 대상' }"
            >
                <td><input type="checkbox" v-model="item.isChecked" /></td>
                <td>{{ item.id }}</td>
                <td>{{ item.domain }}</td>
                <td>{{ item.title }}</td>
                <td><StatusCard :status="item.status" /></td>
                <td>{{ item.serviceType }}</td>
                <td>{{ item.requestDate }}</td>
                <td>{{ item.estimatedHours }}</td>
                <td>
                    <!-- 중요도 드롭다운 추가 -->
                    <select v-model="item.importance">
                        <option disabled value="">중요도 선택</option>
                        <option value="비긴급 - 중요도 하">비긴급 - 중요도 하</option>
                        <option value="비긴급 - 중요도 상">비긴급 - 중요도 상</option>
                        <option value="긴급 - 중요도 하">긴급 - 중요도 하</option>
                        <option value="긴급 - 중요도 상">긴급 - 중요도 상</option>
                        <option value="필수 개발 대상">필수 개발 대상</option>
                        <option value="미지정">미지정</option>
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
    <Modal 
      v-if="isModalOpen" 
      title="개발 목록에 추가" 
      :nameList="nameList" 
      @close="isModalOpen = false" 
      @addNewItem="addNewItem" 
    />
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';
import SearchBar from '../../components/widgets/SearchBar.vue';
import Button from '../../components/widgets/Button.vue';
import Modal from '../../components/widgets/Modal.vue';
import StatusCard from '../../components/widgets/StatusCard.vue';

// ✅ Props & Events
const props = defineProps({
  nameList: Array,
});
const emit = defineEmits(['addNewItem']);

const isModalOpen = ref(false);
const filtersApplied = ref(false); // 🔥 필터가 적용되었는지 체크하는 상태


// ✅ 필터 상태 추가
const filters = ref({
  searchText: '',
  fromDate: '',
  toDate: '',
  domain: 'ALL',
  status: 'ALL',
  serviceType: 'ALL',
  importance: 'ALL',
});

// ✅ 모달 열기 함수
const openModal = () => {
  isModalOpen.value = true;
};

// ✅ 개발 목록에 추가 (선택한 데이터 전달)
const addNewItem = (selectedItems) => {
  emit('addNewItem', selectedItems);
  isModalOpen.value = false;
};

// ✅ 기존 + 추가된 더미 데이터
const items = ref([
  { id: 12345, domain: 'CS', title: '2025 G.BSC Request', status: 'Approved', serviceType: 'ICC', requestDate: '2025-03-11', estimatedHours: 17, importance: '비긴급 - 중요도 상', isChecked: false },
  { id: 15346, domain: 'ST', title: '공동 운항 정산 협력표', status: 'Request', serviceType: 'RPA', requestDate: '2025-02-09', estimatedHours: 58, importance: '비긴급 - 중요도 하', isChecked: false },

  // ✅ 추가된 데이터 7개
  { id: 17890, domain: 'CC', title: '고객 데이터 관리 개선', status: 'In Progress', serviceType: 'E-KMTC', requestDate: '2025-04-15', estimatedHours: 40, importance: '긴급 - 중요도 하', isChecked: false },
  { id: 18901, domain: 'SO', title: '시스템 통합 테스트', status: 'Approved', serviceType: 'ICC', requestDate: '2025-05-20', estimatedHours: 30, importance: '필수 개발 대상', isChecked: false },
  { id: 19876, domain: 'VO', title: '보안 프로토콜 강화', status: 'Finished', serviceType: 'RPA', requestDate: '2025-06-01', estimatedHours: 50, importance: '비긴급 - 중요도 상', isChecked: false },
  { id: 20987, domain: 'CM', title: '모바일 앱 성능 최적화', status: 'Rejected', serviceType: 'E-KMTC', requestDate: '2025-07-13', estimatedHours: 22, importance: '미지정', isChecked: false },
  { id: 21543, domain: 'ST', title: '전자 결제 시스템 도입', status: 'Request', serviceType: 'ICC', requestDate: '2025-08-25', estimatedHours: 35, importance: '긴급 - 중요도 상', isChecked: false },
  { id: 22654, domain: 'SC', title: '자동화 테스트 도구 개발', status: 'In Progress', serviceType: 'RPA', requestDate: '2025-09-10', estimatedHours: 28, importance: '비긴급 - 중요도 하', isChecked: false },
  { id: 23456, domain: 'SA', title: '데이터 백업 정책 강화', status: 'Finished', serviceType: 'E-KMTC', requestDate: '2025-10-05', estimatedHours: 45, importance: '긴급 - 중요도 하', isChecked: false }
]);
const allChecked = computed({
  get: () => items.value.every((item) => item.isChecked),
  set: (value) => items.value.forEach((item) => (item.isChecked = value)),
});

const selectedItems = computed(() => items.value.filter(item => item.isChecked));
const isAnyChecked = computed(() => selectedItems.value.length > 0);

// ✅ **도메인별 Estimated Hours 집계 (체크 여부 반영)**
const totalHoursByDomain = computed(() => {
  let hours = {
    CC: 0,
    CS: 0,
    SO: 0,
    SA: 0,
    VO: 0,
    CC: 0,
    CM: 0,
    ST: 0,
    SC: 0,
  };

  selectedItems.value.forEach((item) => {
    if (hours[item.domain] !== undefined) {
      hours[item.domain] += item.estimatedHours;
    }
  });

  return hours;
});

// ✅ 전체 Total 계산 (도메인별 합계)
const totalHours = computed(() => {
  return Object.values(totalHoursByDomain.value).reduce((sum, value) => sum + value, 0);
});

const filteredItems = computed(() => {
  // ✅ Search 버튼을 누르지 않았다면 모든 데이터 반환
  if (!filtersApplied.value) return items.value;

  return items.value.filter((item) => {
    return (
      (!filters.value.searchText || item.title.toLowerCase().includes(filters.value.searchText.trim().toLowerCase())) &&
      (!filters.value.fromDate || (new Date(item.requestDate).toString() !== 'Invalid Date' && new Date(item.requestDate) >= new Date(filters.value.fromDate))) &&
      (!filters.value.toDate || (new Date(item.requestDate).toString() !== 'Invalid Date' && new Date(item.requestDate) <= new Date(filters.value.toDate))) &&
      (filters.value.domain === "ALL" || item.domain === filters.value.domain) &&
      (filters.value.status === "ALL" || item.status === filters.value.status) &&
      (filters.value.serviceType === "ALL" || item.serviceType === filters.value.serviceType) &&
      (filters.value.importance === "ALL" || !filters.value.importance || item.importance === filters.value.importance)
    );
  });
});



// ✅ 검색 필터 적용
const handleSearch = (searchFilters) => {
  filters.value = { ...searchFilters, importance: searchFilters.importance || "ALL" };
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
