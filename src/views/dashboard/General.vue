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

// ✅ 필터 상태 추가
const filters = ref({
  searchText: '',
  fromDate: '',
  toDate: '',
  domain: '',
  status: '',
  serviceType: '',
  importance: '',
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

// ✅ 기존 테이블 데이터
const items = ref([
  { id: 12345, domain: 'CS', title: '2025 G.BSC Request', status: 'Approved', serviceType: 'ICC', requestDate: '2025-03-11', estimatedHours: 17, importance: '비긴급 - 중요도 상', isChecked: false },
  { id: 15346, domain: 'ST', title: '공동 운항 정산 협력표', status: 'Request', serviceType: 'RPA', requestDate: '2025-02-09', estimatedHours: 58, importance: '비긴급 - 중요도 하', isChecked: false },
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
      (!filters.value.serviceType || item.serviceType === filters.value.serviceType) &&
      (!filters.value.importance || item.importance === filters.value.importance)
    );
  });
});

// ✅ 검색 필터 적용
const handleSearch = (searchFilters) => {
  filters.value = searchFilters;
};
</script>

<template>
  <div class="general-container">
    <!-- 필터 바 -->
    <div class="filter-header">
      <h2>일반 SR</h2>
    </div>

    <SearchBar 
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
          <tr v-for="(item) in filteredItems" :key="item.id">
            <td><input type="checkbox" v-model="item.isChecked" /></td>
            <td>{{ item.id }}</td>
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
.filter-header {
  margin-bottom: 10px;
}

.button-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.table-container {
  margin-top: 20px;
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
