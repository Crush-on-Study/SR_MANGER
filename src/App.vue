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
    <!-- ✅ 사이드바 -->
    <Sidebar v-if="route.path !== '/'" />

    <!-- ✅ 메인 컨텐츠 -->
    <div class="main-container">
      <Header v-if="route.path !== '/'" />
      
      <div class="page-container">
        <RouterView :nameList="nameList" @addNewItem="addNewItem" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ✅ 전체 레이아웃 설정 */
.app-layout {
  display: flex;
  width: 100vw;
  height: 100vh;
}

/* ✅ 사이드바 크기 고정 */
.sidebar {
  width: 200px;
  height: 100vh;
  flex-shrink: 0; /* 사이드바 크기 고정 */
}

/* ✅ 메인 컨텐츠 */
.main-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1; /* 남은 공간을 차지 */
  background-color: #f5f6fa;
}

/* ✅ 헤더 문제 해결 */
.header {
  height: 50px; /* 기본값 40px에서 50px로 증가 */
  line-height: 50px;
  margin: 0;
  padding: 0 20px;
}

/* ✅ 페이지 컨텐츠 */
.page-container {
  padding: 16px;
  width: 100%;
  box-sizing: border-box;
  padding-top: 0; /* ✅ 헤더와 간격 없음 */
  margin-top: 0; /* ✅ 불필요한 여백 제거 */
}

/* ✅ 기본 폰트 적용 */
* {
  font-family: 'Inter', sans-serif;
  color: #333;
}

/* ✅ 제목 스타일 */
h1, h2, h3, h4 {
  font-weight: 600;
  color: #222;
}
</style>
