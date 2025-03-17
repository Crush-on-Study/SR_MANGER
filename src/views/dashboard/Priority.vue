<template>
  <div class="priority-container">
    <!-- 헤더 -->
    <div class="filter-header">
      <h2>우선순위 S/R 리스트</h2>
    </div>

    <!-- ✅ 필터 영역 (SearchBar 적용) -->
    <SearchBar 
      :domainOptions="['CC', 'CS', 'SO']"
      :statusOptions="['Request', 'Approved']"
      :serviceTypeOptions="['ICC', 'RPA']"
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
            <td>{{ item.status }}</td>
            <td>{{ item.serviceType }}</td>
            <td>{{ item.requestDate }}</td>
            <td>{{ item.estimatedHours }}</td>
            <td>
              <select v-model="item.mandatory">
                <option>Y</option>
                <option>N</option>
              </select>
            </td>
            <td><input type="number" v-model="item.priority" min="1" /></td>
            <td class="month-label">{{ new Date(item.requestDate).getMonth() + 1 }}월</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ✅ 모달 추가 -->
    <Modal 
      v-if="isModalOpen" 
      title="개발 목록에 추가" 
      @close="isModalOpen = false" 
      @addNewItem="$emit('addNewItem', $event)" 
      />
  </div>
</template>

<script setup>
import { reactive, computed, ref } from 'vue';
import Button from '../../components/widgets/Button.vue';
import SearchBar from '../../components/widgets/SearchBar.vue';
import Modal from '../../components/widgets/Modal.vue';

// ✅ 모달 상태 추가
const isModalOpen = ref(false);

// ✅ 필터 상태
const filters = reactive({
  searchText: '',
  fromDate: '',
  toDate: '',
  domain: '',
  status: '',
  serviceType: '',
});

// ✅ 테이블 데이터
const items = reactive([
  { id: 12345, title: 'VEP 제약 조건 추가의 건', status: 'Approved', domain: 'CC', serviceType: 'ICC', requestDate: '2025.03.11', estimatedHours: 17, isChecked: false, mandatory: 'N', priority: 1 },
  { id: 15346, title: 'e-billing 확대', status: 'Request', domain: 'SO', serviceType: 'RPA', requestDate: '2025.02.09', estimatedHours: 58, isChecked: false, mandatory: 'N', priority: 1 },
]);

// ✅ 전체 체크 여부
const allChecked = computed({
  get: () => items.every((item) => item.isChecked),
  set: (value) => items.forEach((item) => (item.isChecked = value)),
});

// ✅ 체크된 항목 필터링
const selectedItems = computed(() => items.filter(item => item.isChecked));

// ✅ 체크박스가 하나라도 선택되었는지 확인
const isAnyChecked = computed(() => selectedItems.value.length > 0);

// ✅ 모달 열기 함수
const openModal = () => {
  isModalOpen.value = true;
};

// ✅ 필터 적용된 데이터
const filteredItems = computed(() => {
  return items.filter((item) => {
    return (
      (!filters.searchText || item.title.includes(filters.searchText)) &&
      (!filters.fromDate || new Date(item.requestDate) >= new Date(filters.fromDate)) &&
      (!filters.toDate || new Date(item.requestDate) <= new Date(filters.toDate)) &&
      (!filters.domain || item.domain === filters.domain) &&
      (!filters.status || item.status === filters.status) &&
      (!filters.serviceType || item.serviceType === filters.serviceType)
    );
  });
});
</script>

  
  <style scoped>
  /* ✅ 필터 스타일 */
  .filters {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 10px;
    background: white;
    border-radius: 8px;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  /* ✅ 테이블 스타일 */
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

  .button-container {
  display: flex;
  justify-content: flex-end; /* 버튼을 오른쪽 정렬 */
  margin-top: 10px; /* 버튼과 필터 사이 여백 */
}
  
  /* ✅ 개발 Month 스타일 */
  .month-label {
    background: #e3e8ff;
    color: #334ac0;
    font-weight: bold;
    border-radius: 15px;
    padding: 5px 10px;
  }
  </style>
  