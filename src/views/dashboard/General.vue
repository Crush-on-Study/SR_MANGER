<template>
    <div class="general-container">
      <!-- 필터 바 -->
      <div class="filter-header">
        <h2>일반 SR</h2>
      </div>
  
      <SearchBar 
        :domainOptions="['CC', 'CS', 'SO','VO']"
        :statusOptions="['Request', 'Approved', 'In Progress', 'Finished', 'Rejected']"
        :serviceTypeOptions="['ICC', 'RPA','E-KMTC']"
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
  
      <!-- ✅ 하단 합계 -->
      <div class="total-section">
        Total - ICC: 286 hours | E-KMTC: 12 hours | RPA: 41 hours
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
  
  // ✅ App.vue에서 nameList를 받아옴 (Development.vue 연동)
  const props = defineProps({
    nameList: Array,
  });
  
  const emit = defineEmits(['addNewItem']);
  
  const isModalOpen = ref(false);
  
  // ✅ 필터 상태 추가 (에러 해결)
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
  
  // ✅ 기존 테이블 데이터 추가 (실제 값으로 대체)
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
  
  // ✅ ✅ ✅ 필터링 함수 수정 (filters가 정의되지 않아서 발생한 에러 해결)
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
  
  // ✅ ✅ ✅ handleSearch 함수 추가 (경고 해결)
  const handleSearch = (searchFilters) => {
    filters.value = searchFilters;
  };
  
  </script>
  

<style scoped>
.filter-section {
  display: flex;
  gap: 10px;
  padding: 10px;
  align-items: center;
}

.button-container {
  display: flex;
  justify-content: flex-end; /* 버튼을 오른쪽 정렬 */
  margin-top: 10px; /* 버튼과 필터 사이 여백 */
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

.total-section {
  margin-top: 15px;
  font-weight: bold;
  background: #eef;
  padding: 10px;
  border-radius: 5px;
}
</style>
