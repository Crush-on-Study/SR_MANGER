import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/auth/Login.vue';
import Priority from '../views/dashboard/Priority.vue';
import General from '../views/dashboard/General.vue';
import Development from '../views/dashboard/Development.vue';
import Detail from '../views/dashboard/Detail.vue';
// import Stats from '../views/dashboard/Stats.vue';

const routes = [
  { path: '/', component: Login },          // 로그인 페이지
  { path: '/priority', component: Priority }, // 메인 페이지
  { path: '/general', component: General },
  { path: '/development', component: Development },
  { path: '/development/:id', component: Detail, props: true }, // ✅ 동적 라우트 설정
//   { path: '/stats', component: Stats },

];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
