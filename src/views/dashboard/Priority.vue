<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';
import SearchBar from '../../components/widgets/SearchBar.vue';
import Button from '../../components/widgets/Button.vue';
import Modal from '../../components/widgets/Modal.vue';
import StatusCard from '../../components/widgets/StatusCard.vue';
import MonthCard from '../../components/widgets/MonthCard.vue';

// ✅ Props & Events
const props = defineProps({
  nameList: Array,
});
const emit = defineEmits(['addNewItem']);

const isModalOpen = ref(false);

// ✅ 필터 상태 추가
const filters = ref({
  searchText: '',
  fromDate: '',
  toDate: '',
  domain: '',
  status: '',
  serviceType: '',
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
  { id: 12345, domain: 'CC', title: 'VEP 제약 조건 추가의 건', status: 'Approved', serviceType: 'ICC', requestDate: '2025.03.11', estimatedHours: 17, isChecked: false, mandatory: 'N', priority: 1 },
  { id: 15346, domain: 'SO', title: 'e-billing 확대', status: 'Request', serviceType: 'RPA', requestDate: '2025.02.09', estimatedHours: 58, isChecked: false, mandatory: 'N', priority: 1 },

  // ✅ 추가된 데이터 7개
  { id: 17890, domain: 'VO', title: '클라우드 보안 정책 강화', status: 'In Progress', serviceType: 'E-KMTC', requestDate: '2025.04.15', estimatedHours: 40, isChecked: false, mandatory: 'Y', priority: 2 },
  { id: 18901, domain: 'CS', title: '데이터 정합성 점검 시스템 구축', status: 'Approved', serviceType: 'ICC', requestDate: '2025.05.20', estimatedHours: 30, isChecked: false, mandatory: 'N', priority: 3 },
  { id: 19876, domain: 'SC', title: '모바일 UI/UX 개선', status: 'Finished', serviceType: 'RPA', requestDate: '2025.06.01', estimatedHours: 50, isChecked: false, mandatory: 'N', priority: 2 },
  { id: 20987, domain: 'SA', title: '실시간 모니터링 시스템 구축', status: 'Rejected', serviceType: 'E-KMTC', requestDate: '2025.07.13', estimatedHours: 22, isChecked: false, mandatory: 'Y', priority: 4 },
  { id: 21543, domain: 'ST', title: '사내 커뮤니케이션 툴 개선', status: 'Request', serviceType: 'ICC', requestDate: '2025.08.25', estimatedHours: 35, isChecked: false, mandatory: 'N', priority: 1 },
  { id: 22654, domain: 'CM', title: '자동화 테스트 프레임워크 구축', status: 'In Progress', serviceType: 'RPA', requestDate: '2025.09.10', estimatedHours: 28, isChecked: false, mandatory: 'Y', priority: 3 },
  { id: 23456, domain: 'VO', title: 'API 성능 최적화 프로젝트', status: 'Finished', serviceType: 'E-KMTC', requestDate: '2025.10.05', estimatedHours: 45, isChecked: false, mandatory: 'N', priority: 2 }
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

// ✅ 필터링 함수
const filteredItems = computed(() => {
  return items.value.filter((item) => {
    return (
      (!filters.value.searchText || item.title.includes(filters.value.searchText)) &&
      (!filters.value.fromDate || new Date(item.requestDate) >= new Date(filters.value.fromDate)) &&
      (!filters.value.toDate || new Date(item.requestDate) <= new Date(filters.value.toDate)) &&
      (!filters.value.domain || item.domain === filters.value.domain) &&
      (!filters.value.status || item.status === filters.value.status) &&
      (!filters.value.serviceType || item.serviceType === filters.value.serviceType)
    );
  });
});

// ✅ 검색 필터 적용
const handleSearch = (searchFilters) => {
  filters.value = searchFilters;
};
</script>

<template>
  <div class="priority-container">
    <!-- 헤더 -->
    <div class="filter-header">
      <h2>우선순위 S/R 리스트</h2>
    </div>

    <SearchBar class="searchbar"
      :domainOptions="['CC', 'CS', 'SO', 'SA', 'VO', 'ST']"
      :statusOptions="['Request', 'Approved', 'In Progress', 'Finished', 'Rejected']"
      :serviceTypeOptions="['ICC', 'RPA', 'E-KMTC']"
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
            <th>필수 개발 대상</th>
            <th>우선 순위</th>
            <th>개발 Month</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item) in filteredItems" :key="item.id">
            <td><input type="checkbox" v-model="item.isChecked" /></td>
            <td>{{ item.id }}</td>
            <td>{{ item.domain }}</td>
            <td>{{ item.title }}</td>
            <td><StatusCard :status="item.status" /></td>
            <td>{{ item.serviceType }}</td>
            <td>{{ item.requestDate }}</td>
            <td>{{ item.estimatedHours }}</td>
            <td>
              <select v-model="item.mandatory">
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

    <!-- 서비스 타입 -->
    <div class="service-group">
        <span v-for="(hours, type) in serviceHours" :key="type" class="total-item service-type">
            {{ type }}: {{ hours }} hours
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
