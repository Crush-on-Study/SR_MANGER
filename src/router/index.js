import { createRouter, createWebHistory } from 'vue-router';
import Login2 from '../views/auth/Login2.vue';
import Priority from '../views/dashboard/Priority.vue';
import General from '../views/dashboard/General.vue';
import Development from '../views/dashboard/Development.vue';
import Detail from '../views/dashboard/Detail.vue';
import URImport from '../views/dashboard/URImport.vue'; // ✅ 추가
import Stats from "../views/dashboard/Stats.vue";

const routes = [
  { path: '/', component: Login2 },
  { path: '/priority', component: Priority },
  { path: '/general', component: General },
  { path: '/development', component: Development },
  { path: '/development/:id', component: Detail, props: true },
  { path: '/ur-import', component: URImport }, // ✅ "UR Import" 페이지 추가
  { path: '/stats', name: 'Stats', component: Stats },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 라우터 가드 추가 (로그아웃하면 못보도록)
router.beforeEach((to, from, next) => {
    const publicPages = ['/']; // 로그인 페이지
    const authRequired = !publicPages.includes(to.path);
    const loggedIn = localStorage.getItem('user');
  
    if (authRequired && !loggedIn) {
      console.log('📌 [Router] 로그인 필요, 리다이렉트 to /');
      return next('/');
    }
    next();
  });

export default router;
