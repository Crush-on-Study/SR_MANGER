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

    <!-- ✅ 푸터 (페이지 하단) -->
    <Footer v-if="showLayout" class="footer" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import Header from './components/layout/Header.vue';
import Sidebar from './components/layout/Sidebar.vue';
import Footer from './components/layout/Footer.vue';

const route = useRoute();
const showLayout = computed(() => route.path !== '/'); // 루트 경로에서는 레이아웃 숨김

const nameList = ref([]); // nameList 초기화

const addNewItem = (newItem) => {
  if (!newItem || !newItem.id || !newItem.name) {
    console.error('잘못된 데이터 추가 시도 중임. 확인해보셈', newItem);
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
  overflow-y: auto; /* 스크롤 없애기 */
}

.app-layout {
  display: flex;
  flex-direction: column;
  width: 100vw;
  min-height: 100vh; /* 최소 높이를 100vh로 설정 */
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
  flex: 1; /* 남은 공간을 차지하도록 설정 */
  width: 100%;
  overflow: hidden;
  gap: 10px;
}

/* ✅ 사이드바 (왼쪽 고정) */
.sidebar {
  width: 280px;
  height: 100%;
  background: linear-gradient(135deg, #ecf0f3, #ffffff);
  color: #2c3e50;
  padding: 20px;
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

/* ✅ 메인 컨텐츠 (남은 공간 차지) */
.main-content {
  width: 100%;
  height: 100%;
  background-color: #f5f6fa;
  box-sizing: border-box;
  overflow-y: auto;
}

/* ✅ 푸터 (페이지 하단) */
.footer {
  background-color: #f8f9fa;
  padding: 20px;
  text-align: center;
  border-top: 1px solid #e9ecef;
  width: 100%;
}
</style>