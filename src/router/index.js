import { createRouter, createWebHistory } from 'vue-router';
import Login2 from '../views/auth/Login2.vue';
import Priority from '../views/dashboard/Priority.vue';
import General from '../views/dashboard/General.vue';
import Development from '../views/dashboard/Development.vue';
import Detail from '../views/dashboard/Detail.vue';
import URImport from '../views/dashboard/URImport.vue'; // ✅ 추가

const routes = [
  { path: '/', component: Login2 },
  { path: '/priority', component: Priority },
  { path: '/general', component: General },
  { path: '/development', component: Development },
  { path: '/development/:id', component: Detail, props: true },
  { path: '/ur-import', component: URImport }, // ✅ "UR Import" 페이지 추가
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
