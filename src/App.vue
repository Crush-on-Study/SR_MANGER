<!-- src/App.vue -->
<template>
    <div class="app-layout">
        <!-- ✅ 헤더 (전체 상단) -->
        <Header v-if="showLayout" class="header" />

        <!-- ✅ 사이드바 + 메인 컨텐츠 래핑 -->
        <div class="content-wrapper">
        <Sidebar v-if="showLayout" class="sidebar" />

        <!-- ✅ 메인 컨텐츠 (남은 공간 차지) -->
        <div class="main-content">
            <RouterView />
        </div>
        </div>

        <!-- ✅ 푸터 (페이지 하단) -->
        <Footer v-if="showLayout" />
    </div>
</template>

<script setup>
import { ref, computed, provide } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import Header from './components/layout/Header.vue';
import Sidebar from './components/layout/Sidebar.vue';
import Footer from './components/layout/Footer.vue';

const route = useRoute();
const showLayout = computed(() => {
    console.log(`📌 [App.vue] 현재 경로: ${route.path}, showLayout: ${route.path !== '/'}`);
    return route.path !== '/';
});

// localStorage에서 사용자 정보 로드
const user = ref(null);
const storedUser = localStorage.getItem('user');
if (storedUser) {
    user.value = JSON.parse(storedUser);
    console.log('📌 [App.vue] localStorage에서 사용자 정보 로드:', user.value);
}
provide('user', user);
</script>

<style scoped>
    .app-layout {
    display: flex;
    flex-direction: column;
    width: 100vw;
    min-height: 100vh;
}

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

.content-wrapper {
    display: flex;
    flex: 1;
    width: 100%;
    overflow: hidden;
    gap: 10px;
}

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

.main-content {
    width: 100%;
    height: 100%;
    background-color: #f5f6fa;
    box-sizing: border-box;
    overflow-y: auto;
}
</style>