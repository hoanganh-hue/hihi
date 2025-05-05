import { createRouter, createWebHistory } from 'vue-router'

// Import các trang
import HomePage from './pages/home-page.vue'
import CategoryPage from './pages/category-page.vue'
import ProductPage from './pages/product-page.vue'
import CartPage from './pages/cart-page.vue'
import CheckoutPage from './pages/checkout-page.vue'
import SellerPage from './pages/seller-page.vue'
import ContactPage from './pages/contact-page.vue'
import NotFoundPage from './pages/not-found-page.vue'

// Import trang danh mục cụ thể
import DienThoaiPage from './pages/categories/dien-thoai.vue'
import DongHoPage from './pages/categories/dong-ho.vue'
import DoChoiMeVaBePage from './pages/categories/do-choi-me-va-be.vue'
import DungCuTheThaoPage from './pages/categories/dung-cu-the-thao.vue'
import GiayDepPage from './pages/categories/giay-dep.vue'
import QuanAoPage from './pages/categories/quan-ao.vue'
import TheNapKiThuatSoPage from './pages/categories/the-nap-ki-thuat-so.vue'
import ThietBiDienTuPage from './pages/categories/thiet-bi-dien-tu.vue'
import TrangSucPage from './pages/categories/trang-suc.vue'
import TuiXachPage from './pages/categories/tui-xach.vue'

const categoryMap = {
  'dien-thoai': DienThoaiPage,
  'do-choi-me-va-be': DoChoiMeVaBePage,
  'dong-ho': DongHoPage,
  'dung-cu-the-thao': DungCuTheThaoPage,
  'giay-dep': GiayDepPage,
  'quan-ao': QuanAoPage,
  'the-nap-ki-thuat-so': TheNapKiThuatSoPage,
  'thiet-bi-dien-tu': ThietBiDienTuPage,
  'trang-suc': TrangSucPage,
  'tui-xach': TuiXachPage
}

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  {
    path: '/category/:slug',
    name: 'CategoryDetail',
    props: true,
    component: (route) => {
      const slug = route.params.slug;
      console.log('Route params slug:', slug);
      return categoryMap[slug] || NotFoundPage;
    }
  },
  { path: '/category', name: 'Category', component: CategoryPage },
  { path: '/product/:id', name: 'Product', component: ProductPage },
  { path: '/cart', name: 'Cart', component: CartPage },
  { path: '/checkout', name: 'Checkout', component: CheckoutPage },
  { path: '/seller', name: 'Seller', component: SellerPage },
  { path: '/contact', name: 'Contact', component: ContactPage },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
