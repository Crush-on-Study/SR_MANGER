<!-- src/components/layout/Sidebar.vue -->
<template>
  <nav class="sidebar">
    <!-- ✅ 프로필 영역 -->
    <div class="profile-section" :class="{ 'minimized': isSidebarMinimized }">
      <img class="profile-img" src="/src/assets/profile.jpg" alt="Profile" />
      <div class="profile-info">
        <h3>{{ user?.name || 'Guest' }}</h3>
        <p>{{ user?.department || 'N/A' }}</p>
        <p>{{ user?.role || 'N/A' }}</p>
      </div>
    </div>

    <ul class="menu-list">
      <!-- ✅ UR Import 메뉴 추가 -->
      <li :class="{ active: route.path === '/ur-import', 'minimized': isSidebarMinimized }" @click="navigate('/ur-import')">
        <span class="icon">📂</span>
        <span class="menu-text">UR Import</span>
      </li>
      <li :class="{ active: route.path === '/priority', 'minimized': isSidebarMinimized }" @click="navigate('/priority')">
        <span class="icon">📌</span>
        <span class="menu-text">우선순위 대상</span>
      </li>
      <li :class="{ active: route.path === '/general', 'minimized': isSidebarMinimized }" @click="navigate('/general')">
        <span class="icon">📋</span>
        <span class="menu-text">일반 SR</span>
      </li>
      <li :class="{ active: route.path === '/development', 'minimized': isSidebarMinimized }" @click="navigate('/development')">
        <span class="icon">🛠️</span>
        <span class="menu-text">월별 개발 대상</span>
      </li>
      <li :class="{ active: route.path === '/stats', 'minimized': isSidebarMinimized }" @click="navigate('/stats')">
        <span class="icon">📊</span>
        <span class="menu-text">분석 통계</span>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

// ✅ App.vue에서 제공한 사용자 정보와 sidebarState 주입
const user = inject('user');
const sidebarState = inject('sidebarState');
const isSidebarMinimized = sidebarState.isSidebarMinimized;

const navigate = (path) => {
  router.push(path);
};
</script>

<style scoped>
.profile-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  transition: all 0.3s ease-in-out; /* 부드러운 전환 */
}

.profile-section.minimized {
  margin-bottom: 10px;
}

.profile-section.minimized .profile-info {
  display: none; /* 최소화 시 프로필 정보 숨김 */
}

.profile-img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease-in-out;
}

.profile-section.minimized .profile-img {
  width: 40px;
  height: 40px;
}

.profile-info {
  text-align: center;
  margin-top: 10px;
}

.profile-info h3 {
  font-size: 16px;
  font-weight: bold;
  color: #34495e;
}

.profile-info p {
  font-size: 14px;
  color: #7f8c8d;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

.menu-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  cursor: pointer;
  border-radius: 15px;
  font-size: 14px;
  transition: all 0.3s ease-in-out;
  color: #2c3e50;
}

.menu-list li.minimized {
  padding: 12px 10px;
  justify-content: center; /* 최소화 시 아이콘 중앙 정렬 */
}

.menu-list li:hover {
  background: rgba(52, 152, 219, 0.2);
}

.icon {
  font-size: 18px;
  display: flex;
  align-items: center;
}

.menu-text {
  font-size: 14px;
  display: flex;
  align-items: center;
  transition: opacity 0.3s ease-in-out;
}

.menu-list li.minimized .menu-text {
  display: none; /* 최소화 시 텍스트 숨김 */
}

.active {
  font-weight: bold;
  color: #2980b9;
}
</style>