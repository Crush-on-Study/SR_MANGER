// ✅ App.vue (전역 nameList 관리)
<script setup>
import { ref } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import Header from './components/layout/Header.vue';
import Sidebar from './components/layout/Sidebar.vue';

const route = useRoute();

// ✅ 전역적으로 관리할 nameList
const nameList = ref([
  { id: '2501', name: '25.01', description: '25년도 1월 개발 대상 목록 입니다.' },
  { id: '2503', name: '25.03(후보)', description: '25년도 3월 개발 대상 후보 목록 입니다.' },
  { id: '2504', name: '25.04(후보)', description: '25년도 4월 개발 대상 후보 목록 입니다.' }
]);

// ✅ 새로운 목록 추가 함수
const addNewItem = (newItem) => {
  console.log('📌 [App.vue] addNewItem 호출됨', newItem);
  nameList.value.push(newItem);
};
</script>

<template>
  <div class="app-layout">
    <Sidebar v-if="route.path !== '/'" />
    
    <div class="main-content">
      <Header v-if="route.path !== '/'" />
      
      <div class="page-container">
        <!-- ✅ nameList를 모든 페이지에 전달 -->
        <RouterView :nameList="nameList" @addNewItem="addNewItem" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 전체 레이아웃 */
.app-layout {
  display: flex;
  width: 100vw;
  height: 100vh;
}

/* 메인 컨텐츠 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #f5f6fa; /* 살짝 회색 배경 */
}

.page-container {
  padding: 16px 16px;
  width: 100%; /* 부모 크기에 맞춤 */
  box-sizing: border-box; /* 패딩 포함 너비 유지 */
}

/* ✅ 기본 폰트 적용 */
* {
  font-family: 'Inter', sans-serif;
  color: #333; /* 기본 텍스트 컬러 */
}

/* ✅ 제목 스타일 */
h1, h2, h3, h4 {
  font-weight: 600;
  color: #222;
}
</style>
