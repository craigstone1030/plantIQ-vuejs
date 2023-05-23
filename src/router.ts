/** Vue Router Configure */
import {
  createRouter,
  type Router,
  type RouteRecordRaw,
} from '@logue/vue2-helpers/vue-router';
import LoginView from '@/views/LoginView.vue';
import SignupView from '@/views/SignupView.vue';
import jwtDecode from 'jwt-decode';
import { useGlobalStore } from '@/stores/global';

/** Router Configure */
const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/signup',
    name: 'Signup',
    component: SignupView,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: async () => await import('@/views/DashboardView.vue'),
  },
  {
    path: '/datasource',
    name: 'Datasource',
    component: async () => await import('@/views/DatasourceView.vue'),
  },
  {
    path: '/process',
    name: 'Process',
    component: async () => await import('@/views/ProcessView.vue'),
  },
  {
    path: '/detector',
    name: 'Detector',
    component: async () => await import('@/views/DetectorView.vue'),
  },
  {
    path: '/alert',
    name: 'Alert',
    component: async () => await import('@/views/AlertView.vue'),
  },
  {
    path: '*',
    redirect: '/login',
  },
];

/** Vue Router */
const router = createRouter({
  base: import.meta.env.BASE_URL,
  mode: 'history', // abstract, hash, history
  routes,
});

router.beforeEach((to, from, next) => {
  const globalStore = useGlobalStore();
  const token = localStorage.getItem('plant-iq-token');
  globalStore.setToken(token || '');

  if (to.name === 'Login' || to.name === 'Signup') {
    if (globalStore.user.email) {
      next({
        name: 'Dashboard',
      });
    }
  } else {
    if (!globalStore.user.email) {
      next({
        name: 'Login',
      });
    }
  }
  next();
});

export default router as Router;
