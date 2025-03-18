<script setup>
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

const navigate = (path) => {
  router.push(path);
};
</script>

<template>
  <nav class="sidebar">
    <!-- ✅ 프로필 영역 -->
    <div class="profile-section">
      <img class="profile-img" src="/src/assets/profile.jpg" alt="Profile" />
      <div class="profile-info">
        <h3>Hyun Bin Kang</h3>
        <p>DT</p>
        <p>Manager</p>
      </div>
    </div>

    <ul class="menu-list">
      <li :class="{ active: route.path === '/priority' }" @click="navigate('/priority')">
        <span class="icon">📌</span> <span class="menu-text">우선순위 대상</span>
      </li>
      <li :class="{ active: route.path === '/general' }" @click="navigate('/general')">
        <span class="icon">📋</span> <span class="menu-text">일반 SR</span>
      </li>
      <li :class="{ active: route.path === '/development' }" @click="navigate('/development')">
        <span class="icon">🛠️</span> <span class="menu-text">월별 개발 대상</span>
      </li>
      <li :class="{ active: route.path === '/stats' }" @click="navigate('/stats')">
        <span class="icon">📊</span> <span class="menu-text">분석 통계</span>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.sidebar {
  width: 230px;
  height: 100vh;
  background: linear-gradient(135deg, #ecf0f3, #ffffff);
  color: #2c3e50;
  padding: 20px;
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

/* ✅ 프로필 섹션 */
.profile-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.profile-img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
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

/* ✅ 메뉴 리스트 */
.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

.menu-list li {
  display: flex;
  gap: 10px;
  padding: 12px 20px;
  cursor: pointer;
  border-radius: 25px;
  font-size: 16px;
  transition: all 0.3s ease-in-out;
  width: 60%;
  margin: 8px auto;
  color: #2c3e50;
}

.menu-list li:hover {
  background: rgba(52, 152, 219, 0.2);
}

.menu-list .icon {
  font-size: 18px;
}

.menu-list .menu-text {
  flex-grow: 1;
}

/* ✅ 활성화된 메뉴 */
.active {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  font-weight: bold;
  box-shadow: 0px 4px 10px rgba(52, 152, 219, 0.3);
  transform: scale(1.05);
}
</style>