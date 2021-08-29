import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Wrapper from '../components/Wrapper.vue';
import LoginPage from '../pages/LoginPage/LoginPage.vue';
import RegisterPage from '../pages/RegisterPage/RegisterPage.vue';
import ProfilePage from '../pages/ProfilePage/ProfilePage.vue';
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:8000/api/';
axios.defaults.withCredentials = true;

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
      {
        path: '/profile',
        name: 'ProfilePage',
        component: ProfilePage,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
