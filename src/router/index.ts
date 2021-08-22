import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Wrapper from '../components/Wrapper.vue';
import LoginPage from '../pages/LoginPage/LoginPage.vue';
import RegisterPage from '../pages/RegisterPage/RegisterPage.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    component: Wrapper,
    children: [
      {
        path: '/login',
        name: 'LoginPage',
        component: LoginPage,
      },
      {
        path: '/register',
        name: 'RegisterPage',
        component: RegisterPage,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
