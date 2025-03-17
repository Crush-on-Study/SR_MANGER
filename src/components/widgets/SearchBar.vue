<template>
    <div class="search-bar">
      <!-- Reference No. -->
      <div class="filter-group">
        <label>Reference No.</label>
        <input v-model="searchTerm" type="text" placeholder="Search" class="search-input" />
      </div>
  
      <!-- Date Range -->
      <div class="filter-group">
        <label>From</label>
        <input v-model="dateRange.from" type="date" class="date-picker" />
      </div>
      <span>~</span>
      <div class="filter-group">
        <label>To</label>
        <input v-model="dateRange.to" type="date" class="date-picker" />
      </div>
  
      <!-- Domain -->
      <div class="filter-group">
        <label>Domain</label>
        <select v-model="domain" class="dropdown">
          <option value="ALL">ALL</option>
          <option v-for="option in domainOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </div>
  
      <!-- Status -->
      <div class="filter-group">
        <label>Status</label>
        <select v-model="status" class="dropdown">
          <option value="All">All</option>
          <option v-for="option in statusOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </div>
  
      <!-- Service Type -->
      <div class="filter-group">
        <label>Service Type</label>
        <select v-model="serviceType" class="dropdown">
          <option value="All">All</option>
          <option v-for="option in serviceTypeOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </div>
  
      <!-- Importance -->
      <div class="filter-group">
        <label>Importance</label>
        <select v-model="importance" class="dropdown">
          <option v-for="option in importanceOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </div>
  
      <!-- Search Button -->
      <button class="search-button" @click="handleSearch">
        Search
      </button>
    </div>
  </template>
  
  <script>
  import Button from "../../components/widgets/Button.vue"

  export default {
    name: "SearchBar",
    props: {
      domainOptions: {
        type: Array,
        default: () => ["Option 1", "Option 2", "Option 3"],
      },
      statusOptions: {
        type: Array,
        default: () => ["Pending", "Approved", "Rejected"],
      },
      serviceTypeOptions: {
        type: Array,
        default: () => ["Type A", "Type B", "Type C"],
      },
      importanceOptions: {
        type: Array,
        default: () => ["비긴급", "중요도 상"],
      },
    },
    data() {
      return {
        searchTerm: "",
        dateRange: {
          from: new Date().toISOString().split("T")[0], // 오늘 날짜 기본값
          to: new Date().toISOString().split("T")[0],
        },
        domain: "ALL",
        status: "All",
        serviceType: "All",
        importance: "비긴급",
      };
    },
    methods: {
      handleSearch() {
        this.$emit("search", {
          searchTerm: this.searchTerm,
          dateRange: this.dateRange,
          domain: this.domain,
          status: this.status,
          serviceType: this.serviceType,
          importance: this.importance,
        });
      },
    },
  };
  </script>
  
  <style scoped>
  .search-bar {
    display: flex;
    align-items: center;
    gap: 12px;
    background: #fff;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  /* 필터 그룹: 라벨 + 입력 요소 */
  .filter-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-size: 12px;
  }
  
  /* 라벨 스타일 */
  .filter-group label {
    font-weight: bold;
    margin-bottom: 4px;
  }
  
  /* 입력 요소 스타일 */
  .search-input,
  .date-picker,
  .dropdown {
    padding: 6px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
  }
  
  /* 검색 버튼 스타일 */
  .search-button {
    background: #007bff;
    color: white;
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  }
  
  .search-button:hover {
    background: #0056b3;
  }
  </style>
  