<template>
    <div class="app-layout">
      <!-- ✅ 헤더 (전체 상단 차지) -->
      <Header v-if="route.path !== '/'" />
  
      <div class="content-wrapper">
        <!-- ✅ 사이드바 (왼쪽 고정) -->
        <Sidebar 
          v-if="route.path !== '/'" 
          :tabs="tabs"
        />
  
        <!-- ✅ 메인 컨텐츠 (남은 공간 차지) -->
        <div class="main-content">
          <RouterView :nameList="nameList" @addNewItem="addNewItem" />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { RouterView, useRoute } from 'vue-router';
  import Header from './components/layout/Header.vue';
  import Sidebar from './components/layout/Sidebar.vue';

  // !Remark 추후 DATA 따로 빼서 관리
  const tabs = ref([
    {path: '/priority', icon: '📌', text: '우선순위 대상'},
    {path: '/general', icon: '📋', text: '일반 SR'},
    {path: '/development', icon: '🛠️', text: '월별 개발 대상'},
    {path: '/stats', icon: '📊', text: '분석 통계'},
  ]);
  
  const nameList = ref([
    { id: '2501', name: '25.01', description: '25년도 1월 개발 대상 목록 입니다.' },
    { id: '2503', name: '25.03(후보)', description: '25년도 3월 개발 대상 후보 목록 입니다.' },
    { id: '2504', name: '25.04(후보)', description: '25년도 4월 개발 대상 후보 목록 입니다.' }
  ]);
  
  const route = useRoute();
  
  const addNewItem = (newItem) => {
    console.log('📌 [App.vue] addNewItem 호출됨', newItem);
    nameList.value.push(newItem);
  };
  </script>
  
  <style scoped>
  /* ✅ 전체 레이아웃 */
  .app-layout {
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
  }
  
  /* ✅ 헤더 (전체 상단 차지) */
  .header {
    width: 100%;
    height: 60px;
    background: #3498db;
    color: white;
    display: flex;
    align-items: center;
    padding: 0 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }
  
  /* ✅ 헤더 아래 전체 컨텐츠 */
  .content-wrapper {
    display: flex;
    flex: 1;
    width: 100%;
    height: calc(100vh - 60px); /* 헤더 높이만큼 제외 */
  }
  
  /* ✅ 사이드바 (왼쪽 고정) */
  .sidebar {
    width: 240px;
    height: 100%;
    background: white;
    flex-shrink: 0;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  }
  
  /* ✅ 메인 컨텐츠 (남은 공간 자동 차지) */
  .main-content {
    flex: 1;
    background-color: #f5f6fa;
    padding: 20px;
    box-sizing: border-box;
    overflow: auto;
  }
  </style>
  