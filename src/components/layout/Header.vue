<script setup>
import { useRouter } from 'vue-router';
import Button from '../widgets/Button.vue';

const router = useRouter();

const logout = () => {
  router.push('/');
};
</script>

<template>
  <header class="header">
    <div class="left">
      <button class="menu-btn">☰</button>
      <h1>DT SR Management Service</h1>
    </div>
    <div class="right">
      <Button label="Logout" type="danger" @click="logout" />
    </div>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background: #3498db;
  color: white;
  height: 40px; /* 헤더 높이 유지 */
}

.left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.menu-btn {
  font-size: 20px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
}

.right {
  display: flex;
  align-items: center;
}
</style>
