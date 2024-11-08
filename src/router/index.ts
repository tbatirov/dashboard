import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '@/views/DashboardView.vue';
import NotFoundView from '@/views/NotFoundView.vue';

const routes = [
  {
    path: '/builder/:id',
    name: 'Builder',
    component: DashboardView,
    props: true,
  },
  {
    path: '/viewer/:id',
    name: 'Viewer',
    component: DashboardView,
    props: true,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'Not Found',
    component: NotFoundView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, _, next) => {
  document.title = `Dashboard - ${to.name as string}`;
  next();
});

export default router;
