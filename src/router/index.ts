import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Wrapper from '../components/Wrapper.vue';
import LoginPage from '../pages/LoginPage/LoginPage.vue';
import RegisterPage from '../pages/RegisterPage/RegisterPage.vue';
import ProfileShowPage from '../pages/ProfileShowPage/ProfileShowPage.vue';
import PasswordEditPage from '../pages/PasswordEditPage/PasswordEditPage.vue';
import ProfileEditPage from '../pages/ProfileEditPage/ProfileEditPage.vue';
import SectionsPage from '../pages/SectionsPage/SectionsPage.vue';
import SectionSubmitPage from '../pages/SectionSubmitPage/SectionSubmitPage.vue';
import SectionEditPage from '../pages/SectionEditPage/SectionEditPage.vue';
import StudyPage from '../pages/StudyPage/StudyPage.vue';
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:8000/api/';
axios.defaults.withCredentials = true;

const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    component: Wrapper,
    children: [
      {
        path: '',
        name: 'SectionsPage',
        component: SectionsPage,
      },
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
        path: '/profile_show',
        name: 'ProfileShowPage',
        component: ProfileShowPage,
      },
      {
        path: '/profile_edit',
        name: 'ProfileEditPage',
        component: ProfileEditPage,
      },
      {
        path: '/password_edit',
        name: 'PasswordEditPage',
        component: PasswordEditPage,
      },
      {
        path: '/section_submit',
        name: 'SectionSubmitPage',
        component: SectionSubmitPage,
      },
      {
        path: '/section/:sectionId/study',
        name: 'StudyPage',
        component: StudyPage,
      },
      {
        path: '/section/:sectionId/edit',
        name: 'SectionEdit',
        component: SectionEditPage,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
