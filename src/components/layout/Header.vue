<!-- src/components/layout/Header.vue -->
<template>
  <header class="header">
    <div class="left">
      <button class="menu-btn" @click="toggleSidebar">
        {{ sidebarState.isSidebarMinimized ? '💡' : '💡' }}
      </button>
      <h1>DT SR Management Service</h1>
    </div>
    <div class="right">
      <Button label="Logout" type="danger" @click="logout" />
    </div>
  </header>
</template>

<script setup>
import { inject } from 'vue';
import { useRouter } from 'vue-router';
import Button from '../widgets/Button.vue';

const router = useRouter();

// ✅ App.vue에서 제공한 sidebarState 주입
const sidebarState = inject('sidebarState');

const toggleSidebar = () => {
  sidebarState.toggleSidebar();
};

const logout = () => {
  router.push('/');
};
</script>

<style scoped>
.left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.menu-btn {
  font-size: 24px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.menu-btn:hover {
  transform: scale(1.1);
}

.right {
  display: flex;
  align-items: center;
}

h1 {
  font-size: 18px;
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}
</style>