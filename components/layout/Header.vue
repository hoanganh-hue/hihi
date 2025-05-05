<template>
  <header class="bg-gradient-to-r from-[#1a1a1a] to-[#121212] border-b border-[#333] py-4 px-6 sticky top-0 z-50">
    <div class="container mx-auto flex justify-between items-center">
      <div class="flex items-center">
        <router-link to="/" class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
          TikTok Shop
        </router-link>
      </div>
      <div class="hidden md:flex items-center space-x-6">
        <router-link to="/" class="text-gray-300 hover:text-pink-500 transition-colors duration-300 cursor-pointer" :class="{ 'text-pink-500 font-medium': isActive('/') }" @click="goToHome">
          Trang chủ
        </router-link>
        <category-dropdown />
        <router-link to="/flash-sale" class="text-gray-300 hover:text-pink-500 transition-colors duration-300 cursor-pointer" :class="{ 'text-pink-500 font-medium': isActive('/flash-sale') }">
          Khuyến mãi
        </router-link>
        <router-link to="/seller" class="text-gray-300 hover:text-pink-500 transition-colors duration-300 cursor-pointer" :class="{ 'text-pink-500 font-medium': isActive('/seller') }">
          Bán hàng
        </router-link>
        <router-link to="/contact" class="text-gray-300 hover:text-pink-500 transition-colors duration-300 cursor-pointer" :class="{ 'text-pink-500 font-medium': isActive('/contact') }">
          Liên hệ
        </router-link>
      </div>
      <div class="flex items-center space-x-4">
        <a-input-search
          v-model:value="searchQuery"
          placeholder="Tìm kiếm sản phẩm"
          class="w-40 sm:w-64 rounded-full bg-[#222] border-[#333]"
          :style="{ background: '#222', borderColor: '#333' }"
          @search="handleSearch"
        >
          <template #prefix>
            <search-outlined class="text-gray-400" />
          </template>
        </a-input-search>
        <div class="relative cart-dropdown">
          <router-link to="/cart" class="text-gray-300 hover:text-pink-500 cursor-pointer" data-cart @click.prevent="showCart = !showCart">
            <shopping-cart-outlined class="text-xl" />
            <span v-if="cartItems.length" class="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {{ cartItems.length }}
            </span>
          </router-link>
          <!-- Cart Dropdown -->
          <div v-if="showCart" class="absolute right-0 mt-2 w-80 bg-[#1a1a1a] border border-[#333] rounded-xl shadow-xl z-50">
            <div class="p-4">
              <h3 class="text-lg font-medium mb-4">Giỏ hàng</h3>
              <div v-if="cartItems.length === 0" class="text-center py-6">
                <shopping-cart-outlined class="text-4xl text-gray-400 mb-3" />
                <p class="text-gray-400 mb-4">Giỏ hàng của bạn đang trống</p>
                <a-button type="primary" class="bg-gradient-to-r from-pink-500 to-purple-600 border-none text-white font-medium whitespace-nowrap cursor-pointer" @click="showCart = false">
                  Tiếp tục mua sắm
                </a-button>
              </div>
              <div v-else>
                <div class="max-h-60 overflow-y-auto">
                  <div v-for="(item, index) in cartItems" :key="index" class="flex items-center gap-3 mb-4 pb-4 border-b border-[#333]">
                    <img :src="item.image" :alt="item.name" class="w-16 h-16 object-cover rounded-lg" />
                    <div class="flex-1">
                      <h4 class="text-sm font-medium line-clamp-1">{{ item.name }}</h4>
                      <p class="text-pink-500 text-sm">{{ formatCurrency(item.price) }}</p>
                      <div class="flex items-center mt-1">
                        <a-button-group>
                          <a-button size="small" @click="updateQuantity(index, -1)" :disabled="item.quantity <= 1" class="whitespace-nowrap cursor-pointer">-</a-button>
                          <a-input-number
                            v-model:value="item.quantity"
                            size="small"
                            :min="1"
                            :max="99"
                            class="w-12 text-center"
                          />
                          <a-button size="small" @click="updateQuantity(index, 1)" class="whitespace-nowrap cursor-pointer">+</a-button>
                        </a-button-group>
                      </div>
                    </div>
                    <button @click="removeFromCart(index)" class="text-gray-400 hover:text-pink-500 cursor-pointer">
                      <delete-outlined />
                    </button>
                  </div>
                </div>
                <div class="border-t border-[#333] pt-4 mt-4">
                  <div class="flex justify-between mb-4">
                    <span class="text-gray-400">Tổng tiền:</span>
                    <span class="text-pink-500 font-medium">{{ formatCurrency(totalAmount) }}</span>
                  </div>
                  <div class="flex gap-2">
                    <router-link to="/cart" class="flex-1">
                      <a-button class="flex-1 bg-[#222] border-[#333] text-gray-300 whitespace-nowrap cursor-pointer w-full" @click="showCart = false">
                        Xem giỏ hàng
                      </a-button>
                    </router-link>
                    <router-link to="/checkout" class="flex-1">
                      <a-button type="primary" class="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 border-none text-white font-medium whitespace-nowrap cursor-pointer w-full" @click="showCart = false">
                        Thanh toán
                      </a-button>
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="relative">
          <a v-if="authStore.isAuthenticated" class="text-gray-300 hover:text-pink-500 cursor-pointer" @click="userMenuVisible = !userMenuVisible">
            <div class="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
              <img v-if="authStore.user?.avatar" :src="authStore.user.avatar" alt="Avatar" class="w-full h-full object-cover" />
              <user-outlined v-else class="text-lg" />
            </div>
          </a>
<a v-else class="text-gray-300 hover:text-pink-500 cursor-pointer" @click="navigateToAuth">
  <user-outlined class="text-xl" />
</a>


          <!-- User dropdown menu when logged in -->
          <div v-if="userMenuVisible && authStore.isAuthenticated" class="absolute right-0 mt-2 w-48 bg-[#1a1a1a] border border-[#333] rounded-xl shadow-xl z-50">
            <div class="p-3 border-b border-[#333]">
              <div class="font-medium text-white mb-1">{{ authStore.user?.name }}</div>
              <div class="text-sm text-gray-400">{{ authStore.user?.email }}</div>
            </div>
            <div class="py-1">
              <router-link to="/account" class="block px-4 py-2 text-gray-300 hover:bg-[#222] hover:text-pink-500 cursor-pointer" @click="userMenuVisible = false">
                Tài khoản của tôi
              </router-link>
              <router-link to="/orders" class="block px-4 py-2 text-gray-300 hover:bg-[#222] hover:text-pink-500 cursor-pointer" @click="userMenuVisible = false">
                Đơn hàng
              </router-link>
              <router-link to="/wishlist" class="block px-4 py-2 text-gray-300 hover:bg-[#222] hover:text-pink-500 cursor-pointer" @click="userMenuVisible = false">
                Sản phẩm yêu thích
              </router-link>
              <div class="border-t border-[#333] my-1"></div>
              <a @click="handleLogout" class="block px-4 py-2 text-gray-300 hover:bg-[#222] hover:text-pink-500 cursor-pointer">
                Đăng xuất
              </a>
            </div>
          </div>
        </div>
        <button class="md:hidden text-gray-300 hover:text-pink-500 cursor-pointer" @click="mobileMenuOpen = !mobileMenuOpen">
          <menu-outlined class="text-xl" />
        </button>
      </div>
    </div>
    <!-- Mobile Menu -->
    <div v-if="mobileMenuOpen" class="md:hidden bg-[#1a1a1a] mt-4 rounded-xl border border-[#333] p-4">
      <div class="flex flex-col space-y-3">
        <router-link to="/" class="text-gray-300 hover:text-pink-500 transition-colors duration-300 py-2 cursor-pointer" :class="{ 'text-pink-500 font-medium': isActive('/') }" @click="goToHome">
          Trang chủ
        </router-link>
        <router-link to="/categories" class="text-gray-300 hover:text-pink-500 transition-colors duration-300 py-2 cursor-pointer" :class="{ 'text-pink-500 font-medium': isActive('/categories') }">
          Danh mục
        </router-link>
        <router-link to="/flash-sale" class="text-gray-300 hover:text-pink-500 transition-colors duration-300 py-2 cursor-pointer" :class="{ 'text-pink-500 font-medium': isActive('/flash-sale') }">
          Khuyến mãi
        </router-link>
        <router-link to="/seller" class="text-gray-300 hover:text-pink-500 transition-colors duration-300 py-2 cursor-pointer" :class="{ 'text-pink-500 font-medium': isActive('/seller') }">
          Bán hàng
        </router-link>
        <router-link to="/contact" class="text-gray-300 hover:text-pink-500 transition-colors duration-300 py-2 cursor-pointer" :class="{ 'text-pink-500 font-medium': isActive('/contact') }">
          Liên hệ
        </router-link>
        
        <div class="border-t border-[#333] my-2 pt-2">
          <!-- Hiển thị thông tin người dùng nếu đã đăng nhập -->
          <template v-if="authStore.isAuthenticated">
            <div class="flex items-center mb-3">
              <div class="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden mr-3">
                <img v-if="authStore.user?.avatar" :src="authStore.user.avatar" alt="Avatar" class="w-full h-full object-cover" />
                <user-outlined v-else class="text-lg" />
              </div>
              <div>
                <div class="font-medium text-white">{{ authStore.user?.name }}</div>
                <div class="text-xs text-gray-400">{{ authStore.user?.email }}</div>
              </div>
            </div>
            
            <a class="flex items-center text-gray-300 hover:text-pink-500 transition-colors duration-300 py-2 cursor-pointer">
              <user-outlined class="mr-2" /> Tài khoản của tôi
            </a>
            <a class="flex items-center text-gray-300 hover:text-pink-500 transition-colors duration-300 py-2 cursor-pointer">
              <shopping-cart-outlined class="mr-2" /> Đơn hàng
            </a>
            <a @click="handleLogout" class="flex items-center text-gray-300 hover:text-pink-500 transition-colors duration-300 py-2 cursor-pointer">
              <logout-outlined class="mr-2" /> Đăng xuất
            </a>
          </template>
          
          <!-- Hiển thị nút đăng nhập/đăng ký nếu chưa đăng nhập -->
          <template v-else>
<a @click="navigateToAuth" class="flex items-center text-gray-300 hover:text-pink-500 transition-colors duration-300 py-2 cursor-pointer">
  <login-outlined class="mr-2" /> Đăng nhập
</a>
<a @click="navigateToAuth" class="flex items-center text-gray-300 hover:text-pink-500 transition-colors duration-300 py-2 cursor-pointer">
  <user-add-outlined class="mr-2" /> Đăng ký
</a>

          </template>
        </div>
      </div>
    </div>
  </header>

  <!-- Auth Modals -->
  <login-modal
    v-model:visible="loginModalVisible"
    @success="handleLoginSuccess"
    @register="showRegisterModal"
  />
  
  <register-modal
    v-model:visible="registerModalVisible"
    @success="handleRegisterSuccess"
    @login="showLoginModal"
  />
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { 
  ShoppingCartOutlined, 
  SearchOutlined, 
  UserOutlined, 
  MenuOutlined,
  DeleteOutlined,
  LogoutOutlined,
  LoginOutlined,
  UserAddOutlined
} from '@ant-design/icons-vue';
import { useCartStore } from '../../hooks/useCart';
import { useAuthStore } from '../../hooks/useAuth';
import { formatCurrency } from '../../lib/formatters';
import LoginModal from '../auth/LoginModal.vue';
import RegisterModal from '../auth/RegisterModal.vue';
import CategoryDropdown from './CategoryDropdown.vue';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const authStore = useAuthStore();

// State
const searchQuery = ref('');
const showCart = ref(false);
const mobileMenuOpen = ref(false);
const userMenuVisible = ref(false);
const loginModalVisible = ref(false);
const registerModalVisible = ref(false);

// Cart items
const cartItems = computed(() => cartStore.items);
const totalAmount = computed(() => cartStore.subtotal);

const navigateToAuth = () => {
  router.push('/auth');
};

// Methods
const isActive = (path) => {
  return route.path === path;
};

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/search',
      query: { q: searchQuery.value }
    });
    searchQuery.value = '';
  }
};

const updateQuantity = (index, change) => {
  cartStore.updateQuantity(index, change);
};

const removeFromCart = (index) => {
  cartStore.removeItem(index);
};

const showLoginModal = () => {
  console.log('showLoginModal called');
  loginModalVisible.value = true;
  registerModalVisible.value = false;
  userMenuVisible.value = false;
};

const showRegisterModal = () => {
  console.log('showRegisterModal called');
  registerModalVisible.value = true;
  loginModalVisible.value = false;
  userMenuVisible.value = false;
};

const handleLoginSuccess = (userData) => {
  // Có thể thêm xử lý bổ sung khi đăng nhập thành công
  console.log('Đăng nhập thành công:', userData);
};

const handleRegisterSuccess = (userData) => {
  // Có thể thêm xử lý bổ sung khi đăng ký thành công
  console.log('Đăng ký thành công:', userData);
};

const handleLogout = () => {
  authStore.logout();
  userMenuVisible.value = false;
  
  // Nếu đang ở trang yêu cầu đăng nhập, chuyển về trang chủ
  if (route.meta.requiresAuth) {
    router.push('/');
  }
};

// Đảm bảo nút trang chủ luôn hoạt động từ bất kỳ trang nào
const goToHome = () => {
  // Nếu đang ở trang chủ, reload lại trang
  if (route.path === '/') {
    window.location.reload();
  } else {
    // Nếu không, chuyển hướng về trang chủ
    router.push('/');
  }
};

// Close dropdowns when clicking outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    // Close cart dropdown
    const cartDropdown = document.querySelector('.cart-dropdown');
    if (showCart.value && cartDropdown && !cartDropdown.contains(e.target) && !e.target.closest('a[data-cart]')) {
      showCart.value = false;
    }
    
    // Close user menu dropdown
    if (userMenuVisible.value && !e.target.closest('.user-menu')) {
      userMenuVisible.value = false;
    }
  });
  
  // Close mobile menu when route changes
  watch(() => route.path, () => {
    mobileMenuOpen.value = false;
  });
});
</script>

<style scoped>
:deep(.ant-input-search-button) {
  background-color: #333 !important;
  border-color: #333 !important;
}

:deep(.ant-input-search-button:hover) {
  background-color: #444 !important;
  border-color: #444 !important;
}

:deep(.ant-input) {
  background-color: #222 !important;
  border-color: #333 !important;
  color: white !important;
}

:deep(.ant-input-group-addon) {
  background-color: #222 !important;
  border-color: #333 !important;
}

:deep(.ant-input:focus),
:deep(.ant-input-focused) {
  border-color: #ec4899 !important;
  box-shadow: 0 0 0 2px rgba(236, 72, 153, 0.2) !important;
}

:deep(.ant-input-number) {
  background-color: #222 !important;
  border-color: #333 !important;
  color: white !important;
}

:deep(.ant-input-number-handler-wrap) {
  background-color: #333 !important;
  border-color: #444 !important;
}

:deep(.ant-input-number-handler) {
  color: #d9d9d9 !important;
}

:deep(.ant-input-number-input) {
  color: white !important;
}

:deep(.ant-input-number-handler-up-inner),
:deep(.ant-input-number-handler-down-inner) {
  color: #d9d9d9 !important;
}
</style>
