<!-- 2025/03/20 리팩토링 설명 드립니다.-->
 <!-- 작업자 : HB Kang -->
<!-- 1. SM님이 애용하시는 computed 속성 활용해서 route에 직접 접근하는 것을 showLayout 변수에다 computed를 써서 path에 조건을 걸어봤습니다. -->
 <!-- 사유 : 규모는 작은애라 사실 성능상 문제는 없을거 같은데, 코드 통일성을 위해 넣었습니다.  -->


<template>
    <div class="app-layout">
      <!-- ✅ 헤더 (전체 상단) -->
      <Header v-if="showLayout" class="header" />
  
      <!-- ✅ 사이드바 + 메인 컨텐츠 래핑 -->
      <div class="content-wrapper">
        <Sidebar v-if="showLayout" class="sidebar" />
  
        <!-- ✅ 메인 컨텐츠 (남은 공간 차지) -->
        <div class="main-content">
          <RouterView :nameList="nameList" @addNewItem="addNewItem" />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { RouterView, useRoute } from 'vue-router';
  import Header from './components/layout/Header.vue';
  import Sidebar from './components/layout/Sidebar.vue';
  
  const nameList = ref([
    { id: 2501, name: '25.01', description: '25년도 1월 개발 대상 목록 입니다.' },
    { id: 2503, name: '25.03(후보)', description: '25년도 3월 개발 대상 후보 목록 입니다.' },
    { id: 2504, name: '25.04(후보)', description: '25년도 4월 개발 대상 후보 목록 입니다.' }
  ]);
  
  const route = useRoute();
  const showLayout = computed(() => route.path !== '/'); // !!

  const addNewItem = (newItem) => {
    if (!newItem || !newItem.id || !newItem.name) {
        console.error('잘못된 데이터 추가 시도 중임. 확인해보셈',newItem);
        return;
    }

    console.log('📌 [App.vue] addNewItem 호출됨', newItem);
    nameList.value.push(newItem);
  };
  </script>
  
  <style scoped>
  /* ✅ 전체 레이아웃 (column 구조) */
* {
    box-sizing: border-box;
}

html, body {
  width: 100vw;
  height: 100vh;
  overflow: hidden; /* 스크롤 없애기 */
}

  .app-layout {
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
  }

  /* ✅ 헤더 (전체 너비 차지) */
  .header {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  background: linear-gradient(135deg, #2980b9, #6dd5fa);
  color: white;
  height: 50px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
  padding: 10px;
}
  
  /* ✅ 사이드바 + 메인 컨텐츠 감싸는 래퍼 */
  .content-wrapper {
    display: flex;
    flex: 1; /* 부모 요소인 .app-layout에 맞춰 높이 자동 조정 */
    width: 100%;
    overflow: hidden;
    gap: 10px;
  }
  
  /* ✅ 사이드바 (왼쪽 고정) */
  .sidebar {
  width: 280px;
  height: 100vh;
  background: linear-gradient(135deg, #ecf0f3, #ffffff);
  color: #2c3e50;
  padding: 20px;
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}
  
  /* ✅ 메인 컨텐츠 (남은 공간 차지) */
  .main-content {
    /* flex: 1; 남은 공간을 차지하도록 설정 */
    width: 100%;
    height: 100%;
    background-color: #f5f6fa;
    box-sizing: border-box;
    overflow: hidden;
  }
  </style>
  