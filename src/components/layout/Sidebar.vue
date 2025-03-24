<!-- src/components/layout/Sidebar.vue -->
<template>
    <nav class="sidebar">
      <!-- ✅ 프로필 영역 -->
      <div class="profile-section">
        <img class="profile-img" src="/src/assets/profile.jpg" alt="Profile" />
        <div class="profile-info">
          <h3>{{ user?.name || 'Guest' }}</h3>
          <p>{{ user?.department || 'N/A' }}</p>
          <p>{{ user?.role || 'N/A' }}</p>
        </div>
      </div>
  
      <ul class="menu-list">
        <!-- ✅ UR Import 메뉴 추가 -->
        <li :class="{ active: route.path === '/ur-import' }" @click="navigate('/ur-import')">
          <span class="icon">📂</span> <span class="menu-text">UR Import</span>
        </li>
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
  
  <script setup>
  import { inject } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  
  const router = useRouter();
  const route = useRoute();
  
  // App.vue에서 제공한 사용자 정보 주입
  const user = inject('user');
  
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
  }
  
  .active {
    font-weight: bold;
    color: #2980b9;
  }
  </style>