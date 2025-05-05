import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../pages/home-page.vue'),
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('../pages/AuthPage.vue'),
  },
  {
    path: '/category/dien-thoai',
    name: 'DienThoai',
    component: () => import('../pages/categories/dien-thoai.vue'),
  },
  {
    path: '/category/do-choi-me-va-be',
    name: 'DoChoiMeVaBe',
    component: () => import('../pages/categories/do-choi-me-va-be.vue'),
  },
  {
    path: '/category/dong-ho',
    name: 'DongHo',
    component: () => import('../pages/categories/dong-ho.vue'),
  },
  {
    path: '/category/dung-cu-the-thao',
    name: 'DungCuTheThao',
    component: () => import('../pages/categories/dung-cu-the-thao.vue'),
  },
  {
    path: '/category/giay-dep',
    name: 'GiayDep',
    component: () => import('../pages/categories/giay-dep.vue'),
  },
  {
    path: '/category/quan-ao',
    name: 'QuanAo',
    component: () => import('../pages/categories/quan-ao.vue'),
  },
  {
    path: '/category/the-nap-ki-thuat-so',
    name: 'TheNapKiThuatSo',
    component: () => import('../pages/categories/the-nap-ki-thuat-so.vue'),
  },
  {
    path: '/category/thiet-bi-dien-tu',
    name: 'ThietBiDienTu',
    component: () => import('../pages/categories/thiet-bi-dien-tu.vue'),
  },
  {
    path: '/category/trang-suc',
    name: 'TrangSuc',
    component: () => import('../pages/categories/trang-suc.vue'),
  },
  {
    path: '/category/tui-xach',
    name: 'TuiXach',
    component: () => import('../pages/categories/tui-xach.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/not-found-page.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
