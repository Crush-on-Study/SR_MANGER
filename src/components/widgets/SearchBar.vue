<template>
    <div class="search-bar">
      <!-- ✅ Reference No -->
      <div class="filter-group">
        <label>Reference No.</label>
        <input type="text" v-model="filters.searchText" placeholder="Search" class="search-input" />
      </div>
  
      <!-- ✅ 날짜 필터 -->
      <div class="filter-group">
        <label>From</label>
        <input type="date" v-model="filters.fromDate" class="search-input" />
      </div>
  
      <span class="date-separator">~</span>
  
      <div class="filter-group">
        <label>To</label>
        <input type="date" v-model="filters.toDate" class="search-input" />
      </div>
  
      <!-- ✅ 도메인 선택 -->
      <div class="filter-group">
        <label>Domain</label>
        <select v-model="filters.domain" class="search-input">
          <option value="ALL">All</option>
          <option v-for="option in props.domainOptions" :key="option" :value="option">{{ option }}</option>
        </select>
      </div>
  
      <!-- ✅ 상태 선택 -->
      <div class="filter-group">
        <label>Status</label>
        <select v-model="filters.status" class="search-input">
          <option value="ALL">All</option>
          <option v-for="option in props.statusOptions" :key="option" :value="option">{{ option }}</option>
        </select>
      </div>
  
      <!-- ✅ 서비스 타입 선택 -->
      <div class="filter-group">
        <label>Service Type</label>
        <select v-model="filters.serviceType" class="search-input">
          <option value="ALL">All</option>
          <option v-for="option in props.serviceTypeOptions" :key="option" :value="option">{{ option }}</option>
        </select>
      </div>
  
      <!-- ✅ 중요도 필터 (필요한 경우에만 렌더링) -->
      <div v-if="props.importanceOptions" class="filter-group">
        <label>Importance</label>
        <select v-model="filters.importance" class="search-input">
          <option value="비긴급">비긴급</option>
          <option v-for="option in props.importanceOptions" :key="option" :value="option">{{ option }}</option>
        </select>
      </div>
  
      <!-- ✅ Search 버튼 -->
      <div class="button-group">
        <Button label="Search" type="primary" @click="handleSearch" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, defineEmits, defineProps } from "vue";
  import Button from "../widgets/Button.vue";
  
  // ✅ 부모 컴포넌트에서 필터 옵션을 받을 수 있도록 설정
  const props = defineProps({
    domainOptions: Array,
    statusOptions: Array,
    serviceTypeOptions: Array,
    importanceOptions: Array // ✅ Priority에서 안 데려오도록 할거임.
  });
  
  // ✅ 검색 필터 상태
  const filters = ref({
    searchText: "",
    fromDate: "",
    toDate: "",
    domain: "ALL",
    status: "ALL",
    serviceType: "ALL",
    importance: props.importanceOptions ? "비긴급" : "" // ✅ 중요도 필터가 없으면 빈 값 유지
  });
  
  // ✅ 검색 & 초기화 이벤트 발생
  const emit = defineEmits(["search"]);
  
  const handleSearch = () => {
    emit("search", filters.value);
  };
  </script>
  
  <style scoped>
  /* ✅ 전체 검색 바 */
  .search-bar {
    display: flex;
    align-items: center;
    background: white;
    padding: 12px 20px;
    border-radius: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    gap: 8px; /* ✅ 필터 요소 간격 */
    justify-content: space-between;
    flex-wrap: wrap;
  }
  
  /* ✅ 필터 그룹 */
  .filter-group {
    display: flex;
    flex-direction: column;
    font-size: 12px;
    min-width: 140px; /* ✅ 일정 크기 유지 */
  }
  
  /* ✅ 라벨 스타일 */
  .filter-group label {
    font-weight: 600;
    color: #555;
    margin-bottom: 4px;
  }
  
  /* ✅ 입력 필드 스타일 */
  .search-input {
    padding: 6px 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 14px;
    background: #f9f9f9;
  }
  
  /* ✅ 날짜 구분자 */
  .date-separator {
    font-size: 18px;
    font-weight: bold;
    color: #555;
  }
  
  /* ✅ 버튼 그룹 */
  .button-group {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-top: 10px;
  }
  
  /* ✅ Button.vue 스타일 유지 */
  button {
    min-width: 90px;
  }
  </style>
  