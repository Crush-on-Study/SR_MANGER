<!-- src/components/layout/Sidebar.vue -->
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
    <h2>SR Manager</h2>
    <ul>
      <li :class="{ active: route.path === '/priority' }" @click="navigate('/priority')">
        <span>📌</span> 우선순위 대상
      </li>
      <li :class="{ active: route.path === '/general' }" @click="navigate('/general')">
        <span>📋</span> 일반 SR
      </li>
      <li :class="{ active: route.path === '/development' }" @click="navigate('/development')">
        <span>🛠️</span> 월별 개발 대상
      </li>
      <li :class="{ active: route.path === '/stats' }" @click="navigate('/stats')">
        <span>📊</span> 분석 통계
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.sidebar {
  width: 200px;
  height: 100vh;
  background-color: #2C3E50;
  color: white;
  padding: 20px;
}

h2 {
  font-size: 18px;
  margin-bottom: 20px;
  color: #fff;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  cursor: pointer;
  border-radius: 5px;
}

li:hover {
  background: rgba(255, 255, 255, 0.2);
}

.active {
  background: #fff;
  color: #333;
  font-weight: bold;
}
</style>
