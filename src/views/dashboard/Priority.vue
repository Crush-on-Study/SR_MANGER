<template>
    <div class="priority-container">
      <!-- 헤더 -->
      <div class="filter-header">
        <h2>우선순위 S/R 리스트</h2>
      </div>
  
      <!-- ✅ 필터 영역 (SearchBar 적용) -->
      <SearchBar 
        :domainOptions="['CC', 'CS', 'SO','VO']"
        :statusOptions="['Request', 'Approved', 'In Progress', 'Finished', 'Rejected']"
        :serviceTypeOptions="['ICC', 'RPA','E-KMTC']"
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
  
  const props = defineProps({
    nameList: Array,  // ✅ App.vue에서 nameList를 받아옴
  });
  
  const emit = defineEmits(['addNewItem']);
  
  const isModalOpen = ref(false);
  
  // ✅ ✅ ✅ 필터 상태 추가 (에러 해결)
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
  
  // ✅ 기존 테이블 데이터 추가 (실제 값으로 대체)
  const items = ref([
    { id: 12345, title: 'VEP 제약 조건 추가의 건', status: 'Approved', domain: 'CC', serviceType: 'ICC', requestDate: '2025.03.11', estimatedHours: 17, isChecked: false, mandatory: 'N', priority: 1 },
    { id: 15346, title: 'e-billing 확대', status: 'Request', domain: 'SO', serviceType: 'RPA', requestDate: '2025.02.09', estimatedHours: 58, isChecked: false, mandatory: 'N', priority: 1 },
  ]);
  
  const allChecked = computed({
    get: () => items.value.every((item) => item.isChecked),
    set: (value) => items.value.forEach((item) => (item.isChecked = value)),
  });
  
  const selectedItems = computed(() => items.value.filter(item => item.isChecked));
  
  const isAnyChecked = computed(() => selectedItems.value.length > 0);
  
  // ✅ ✅ ✅ 필터링 함수 수정 (filters가 정의되지 않아서 발생한 에러 해결)
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
  
  // ✅ ✅ ✅ handleSearch 함수 추가 (경고 해결)
  const handleSearch = (searchFilters) => {
    filters.value = searchFilters;
  };
  
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
  