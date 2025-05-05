<template>
  <div class="min-h-screen bg-black text-white">
    <div class="container mx-auto px-6 py-8">
      <div class="flex items-center mb-8">
        <h1 class="text-3xl font-bold">Tài khoản của tôi</h1>
      </div>

      <!-- Main content -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Sidebar -->
        <div class="lg:col-span-3">
          <div class="bg-[#111] border border-[#333] rounded-lg overflow-hidden">
            <div class="p-6 border-b border-[#333]">
              <div class="flex items-center">
                <div class="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-2xl font-bold mr-4">
                  {{ userInitials }}
                </div>
                <div>
                  <div class="font-medium text-lg">{{ user.fullName }}</div>
                  <div class="text-gray-400 text-sm">{{ user.email }}</div>
                </div>
              </div>
            </div>

            <div class="p-2">
              <div class="account-nav">
                <a 
                  v-for="(item, index) in navItems" 
                  :key="index" 
                  href="#" 
                  @click.prevent="activeTab = item.id"
                  :class="[
                    'flex items-center px-4 py-3 rounded-lg', 
                    activeTab === item.id ? 'bg-[#222] text-pink-500' : 'text-gray-300 hover:bg-[#1a1a1a] hover:text-white'
                  ]"
                >
                  <component :is="item.icon" class="mr-3" />
                  {{ item.label }}
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Main content area -->
        <div class="lg:col-span-9">
          <!-- Personal Information -->
          <div v-if="activeTab === 'profile'" class="bg-[#111] border border-[#333] rounded-lg p-6 mb-6">
            <h2 class="text-xl font-bold mb-6">Thông tin cá nhân</h2>
            
            <a-form layout="vertical" :model="profileForm">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <a-form-item label="Họ và tên">
                  <a-input v-model:value="profileForm.fullName" placeholder="Nhập họ và tên" />
                </a-form-item>
                <a-form-item label="Email">
                  <a-input v-model:value="profileForm.email" placeholder="Nhập email" disabled />
                </a-form-item>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <a-form-item label="Số điện thoại">
                  <a-input v-model:value="profileForm.phone" placeholder="Nhập số điện thoại" />
                </a-form-item>
                <a-form-item label="Ngày sinh">
                  <a-date-picker v-model:value="profileForm.birthdate" class="w-full" placeholder="Chọn ngày sinh" />
                </a-form-item>
              </div>
              
              <a-form-item label="Giới tính">
                <a-radio-group v-model:value="profileForm.gender">
                  <a-radio value="male">Nam</a-radio>
                  <a-radio value="female">Nữ</a-radio>
                  <a-radio value="other">Khác</a-radio>
                </a-radio-group>
              </a-form-item>
              
              <a-form-item>
                <a-button type="primary" class="bg-gradient-to-r from-pink-500 to-purple-600 border-none">
                  Cập nhật thông tin
                </a-button>
              </a-form-item>
            </a-form>
          </div>
          
          <!-- Addresses -->
          <div v-if="activeTab === 'addresses'" class="bg-[#111] border border-[#333] rounded-lg p-6 mb-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-bold">Địa chỉ của tôi</h2>
              <a-button type="primary" class="bg-gradient-to-r from-pink-500 to-purple-600 border-none" @click="showAddAddressModal = true">
                <plus-outlined />
                Thêm địa chỉ mới
              </a-button>
            </div>
            
            <div v-if="addresses.length === 0" class="text-center py-8 text-gray-400">
              Bạn chưa có địa chỉ nào. Vui lòng thêm địa chỉ mới.
            </div>
            
            <div v-else class="space-y-4">
              <div v-for="(address, index) in addresses" :key="index" class="border border-[#333] rounded-lg p-4">
                <div class="flex justify-between">
                  <div>
                    <div class="flex items-center">
                      <span class="font-medium">{{ address.name }}</span>
                      <span v-if="address.isDefault" class="ml-2 px-2 py-1 text-xs bg-pink-500 bg-opacity-20 text-pink-500 rounded-full">Mặc định</span>
                    </div>
                    <div class="text-gray-400 mt-2">{{ address.phone }}</div>
                    <div class="text-gray-400">{{ address.fullAddress }}</div>
                  </div>
                  <div>
                    <a-dropdown placement="bottomRight">
                      <template #overlay>
                        <a-menu>
                          <a-menu-item key="1" @click="editAddress(index)">Chỉnh sửa</a-menu-item>
                          <a-menu-item key="2" @click="setDefaultAddress(index)">Đặt làm mặc định</a-menu-item>
                          <a-menu-item key="3" @click="deleteAddress(index)">Xóa</a-menu-item>
                        </a-menu>
                      </template>
                      <a-button type="text" class="text-gray-400">
                        <ellipsis-outlined />
                      </a-button>
                    </a-dropdown>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Orders -->
          <div v-if="activeTab === 'orders'" class="bg-[#111] border border-[#333] rounded-lg p-6 mb-6">
            <h2 class="text-xl font-bold mb-6">Đơn hàng của tôi</h2>
            
            <a-tabs default-active-key="all" class="custom-tabs">
              <a-tab-pane key="all" tab="Tất cả">
                <order-list :orders="allOrders" />
              </a-tab-pane>
              <a-tab-pane key="pending" tab="Chờ xác nhận">
                <order-list :orders="pendingOrders" />
              </a-tab-pane>
              <a-tab-pane key="processing" tab="Đang xử lý">
                <order-list :orders="processingOrders" />
              </a-tab-pane>
              <a-tab-pane key="shipping" tab="Đang giao">
                <order-list :orders="shippingOrders" />
              </a-tab-pane>
              <a-tab-pane key="completed" tab="Đã giao">
                <order-list :orders="completedOrders" />
              </a-tab-pane>
              <a-tab-pane key="cancelled" tab="Đã hủy">
                <order-list :orders="cancelledOrders" />
              </a-tab-pane>
            </a-tabs>
          </div>
          
          <!-- Saved Products -->
          <div v-if="activeTab === 'wishlist'" class="bg-[#111] border border-[#333] rounded-lg p-6 mb-6">
            <h2 class="text-xl font-bold mb-6">Sản phẩm đã lưu</h2>
            
            <div v-if="wishlistItems.length === 0" class="text-center py-8 text-gray-400">
              Bạn chưa lưu sản phẩm nào.
            </div>
            
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="(item, index) in wishlistItems" :key="index" class="bg-[#1a1a1a] border border-[#333] rounded-lg overflow-hidden">
                <div class="relative">
                  <img :src="item.image" :alt="item.name" class="w-full h-48 object-cover" />
                  <button class="absolute top-2 right-2 w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-pink-500" @click="removeFromWishlist(index)">
                    <heart-filled />
                  </button>
                </div>
                <div class="p-4">
                  <div class="text-sm font-medium mb-1 line-clamp-2">{{ item.name }}</div>
                  <div class="text-pink-500 font-bold">{{ formatCurrency(item.price) }}</div>
                  <a-button type="primary" class="mt-3 w-full bg-gradient-to-r from-pink-500 to-purple-600 border-none">
                    Thêm vào giỏ hàng
                  </a-button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Password Change -->
          <div v-if="activeTab === 'security'" class="bg-[#111] border border-[#333] rounded-lg p-6 mb-6">
            <h2 class="text-xl font-bold mb-6">Thay đổi mật khẩu</h2>
            
            <a-form layout="vertical" :model="passwordForm">
              <a-form-item label="Mật khẩu hiện tại">
                <a-input-password v-model:value="passwordForm.currentPassword" placeholder="Nhập mật khẩu hiện tại" />
              </a-form-item>
              
              <a-form-item label="Mật khẩu mới">
                <a-input-password v-model:value="passwordForm.newPassword" placeholder="Nhập mật khẩu mới" />
              </a-form-item>
              
              <a-form-item label="Xác nhận mật khẩu mới">
                <a-input-password v-model:value="passwordForm.confirmPassword" placeholder="Nhập lại mật khẩu mới" />
              </a-form-item>
              
              <a-form-item>
                <a-button type="primary" class="bg-gradient-to-r from-pink-500 to-purple-600 border-none">
                  Đổi mật khẩu
                </a-button>
              </a-form-item>
            </a-form>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Add Address Modal -->
    <a-modal 
      v-model:visible="showAddAddressModal"
      title="Thêm địa chỉ mới"
      :footer="null"
      class="custom-modal"
    >
      <a-form layout="vertical" :model="addressForm">
        <a-form-item label="Tên người nhận">
          <a-input v-model:value="addressForm.name" placeholder="Nhập tên người nhận" />
        </a-form-item>
        
        <a-form-item label="Số điện thoại">
          <a-input v-model:value="addressForm.phone" placeholder="Nhập số điện thoại" />
        </a-form-item>
        
        <a-form-item label="Địa chỉ chi tiết">
          <a-textarea v-model:value="addressForm.addressLine" placeholder="Nhập địa chỉ chi tiết" :rows="3" />
        </a-form-item>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a-form-item label="Tỉnh/Thành phố">
            <a-select v-model:value="addressForm.province" placeholder="Chọn tỉnh/thành phố">
              <a-select-option value="HN">Hà Nội</a-select-option>
              <a-select-option value="HCM">TP. Hồ Chí Minh</a-select-option>
              <a-select-option value="DN">Đà Nẵng</a-select-option>
            </a-select>
          </a-form-item>
          
          <a-form-item label="Quận/Huyện">
            <a-select v-model:value="addressForm.district" placeholder="Chọn quận/huyện">
              <a-select-option value="Q1">Quận 1</a-select-option>
              <a-select-option value="Q2">Quận 2</a-select-option>
              <a-select-option value="Q3">Quận 3</a-select-option>
            </a-select>
          </a-form-item>
          
          <a-form-item label="Phường/Xã">
            <a-select v-model:value="addressForm.ward" placeholder="Chọn phường/xã">
              <a-select-option value="P1">Phường 1</a-select-option>
              <a-select-option value="P2">Phường 2</a-select-option>
              <a-select-option value="P3">Phường 3</a-select-option>
            </a-select>
          </a-form-item>
        </div>
        
        <a-form-item>
          <a-checkbox v-model:checked="addressForm.isDefault">Đặt làm địa chỉ mặc định</a-checkbox>
        </a-form-item>
        
        <div class="flex justify-end gap-2">
          <a-button @click="showAddAddressModal = false">Hủy</a-button>
          <a-button type="primary" class="bg-gradient-to-r from-pink-500 to-purple-600 border-none" @click="saveAddress">
            Lưu địa chỉ
          </a-button>
        </div>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { 
  UserOutlined, 
  EnvironmentOutlined, 
  ShoppingOutlined, 
  HeartOutlined, 
  HeartFilled,
  LockOutlined, 
  PlusOutlined,
  EllipsisOutlined 
} from '@ant-design/icons-vue';

// Mock data
const user = ref({
  fullName: 'Nguyễn Văn A',
  email: 'nguyenvana@example.com',
  phone: '0987654321',
  birthdate: null,
  gender: 'male',
});

const userInitials = computed(() => {
  if (!user.value.fullName) return '';
  return user.value.fullName
    .split(' ')
    .map(name => name[0])
    .slice(-2)
    .join('')
    .toUpperCase();
});

// Navigation items
const navItems = [
  { id: 'profile', label: 'Thông tin cá nhân', icon: UserOutlined },
  { id: 'addresses', label: 'Địa chỉ của tôi', icon: EnvironmentOutlined },
  { id: 'orders', label: 'Đơn hàng của tôi', icon: ShoppingOutlined },
  { id: 'wishlist', label: 'Sản phẩm đã lưu', icon: HeartOutlined },
  { id: 'security', label: 'Bảo mật', icon: LockOutlined },
];

// Active tab
const activeTab = ref('profile');

// Profile form
const profileForm = ref({
  fullName: 'Nguyễn Văn A',
  email: 'nguyenvana@example.com',
  phone: '0987654321',
  birthdate: null,
  gender: 'male',
});

// Password form
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

// Address management
const addresses = ref([
  {
    id: 1,
    name: 'Nguyễn Văn A',
    phone: '0987654321',
    addressLine: '123 Đường ABC',
    province: 'HCM',
    district: 'Q1',
    ward: 'P1',
    fullAddress: '123 Đường ABC, Phường 1, Quận 1, TP. Hồ Chí Minh',
    isDefault: true,
  },
  {
    id: 2,
    name: 'Nguyễn Văn A',
    phone: '0987654321',
    addressLine: '456 Đường XYZ',
    province: 'HN',
    district: 'HK',
    ward: 'P2',
    fullAddress: '456 Đường XYZ, Phường 2, Quận Hoàn Kiếm, Hà Nội',
    isDefault: false,
  }
]);

const addressForm = ref({
  name: '',
  phone: '',
  addressLine: '',
  province: '',
  district: '',
  ward: '',
  isDefault: false,
});

const showAddAddressModal = ref(false);

const saveAddress = () => {
  const fullAddress = `${addressForm.value.addressLine}, Phường ${addressForm.value.ward}, Quận ${addressForm.value.district}, ${addressForm.value.province === 'HN' ? 'Hà Nội' : addressForm.value.province === 'HCM' ? 'TP. Hồ Chí Minh' : 'Đà Nẵng'}`;
  
  addresses.value.push({
    id: addresses.value.length + 1,
    name: addressForm.value.name,
    phone: addressForm.value.phone,
    addressLine: addressForm.value.addressLine,
    province: addressForm.value.province,
    district: addressForm.value.district,
    ward: addressForm.value.ward,
    fullAddress,
    isDefault: addressForm.value.isDefault,
  });
  
  if (addressForm.value.isDefault) {
    // Set all other addresses as non-default
    addresses.value.forEach((addr, i) => {
      if (i !== addresses.value.length - 1) {
        addr.isDefault = false;
      }
    });
  }
  
  showAddAddressModal.value = false;
  
  // Reset form
  addressForm.value = {
    name: '',
    phone: '',
    addressLine: '',
    province: '',
    district: '',
    ward: '',
    isDefault: false,
  };
};

const editAddress = (index) => {
  // TODO: Implement edit address functionality
  console.log('Edit address at index:', index);
};

const setDefaultAddress = (index) => {
  addresses.value.forEach((addr, i) => {
    addr.isDefault = i === index;
  });
};

const deleteAddress = (index) => {
  addresses.value.splice(index, 1);
};

// Orders
const allOrders = ref([
  {
    id: 'DH001',
    date: '10/07/2023',
    total: 1250000,
    status: 'processing',
    items: [
      { name: 'iPhone 14 Pro Max 256GB', quantity: 1, price: 1250000 }
    ]
  },
  {
    id: 'DH002',
    date: '05/06/2023',
    total: 799000,
    status: 'completed',
    items: [
      { name: 'Tai nghe Sony WH-1000XM4', quantity: 1, price: 799000 }
    ]
  },
  {
    id: 'DH003',
    date: '01/05/2023',
    total: 650000,
    status: 'cancelled',
    items: [
      { name: 'Samsung Galaxy Watch 5', quantity: 1, price: 650000 }
    ]
  }
]);

const pendingOrders = computed(() => allOrders.value.filter(order => order.status === 'pending'));
const processingOrders = computed(() => allOrders.value.filter(order => order.status === 'processing'));
const shippingOrders = computed(() => allOrders.value.filter(order => order.status === 'shipping'));
const completedOrders = computed(() => allOrders.value.filter(order => order.status === 'completed'));
const cancelledOrders = computed(() => allOrders.value.filter(order => order.status === 'cancelled'));

// Wishlist
const wishlistItems = ref([
  {
    id: 1,
    name: 'iPhone 14 Pro Max 256GB',
    price: 28990000,
    image: 'https://cdn2.cellphones.com.vn/358x358,webp,q100/media/catalog/product/i/p/iphone-14-pro_2__5.jpg',
  },
  {
    id: 2,
    name: 'Samsung Galaxy S23 Ultra 12GB/256GB',
    price: 23990000,
    image: 'https://cdn2.cellphones.com.vn/358x358,webp,q100/media/catalog/product/s/2/s23-ultra-tim.png',
  },
  {
    id: 3,
    name: 'Tai nghe Sony WH-1000XM4',
    price: 5990000,
    image: 'https://cdn2.cellphones.com.vn/358x358,webp,q100/media/catalog/product/g/r/group_157_1_12.png',
  }
]);

const removeFromWishlist = (index) => {
  wishlistItems.value.splice(index, 1);
};

// Utility functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};
</script>

<style scoped>
/* Custom styles for Ant Design components */
:deep(.ant-form-item-label > label) {
  color: #d9d9d9;
}

:deep(.ant-input),
:deep(.ant-input-password),
:deep(.ant-picker),
:deep(.ant-select-selector),
:deep(.ant-select-dropdown),
:deep(.ant-textarea) {
  background-color: #222 !important;
  border-color: #333 !important;
  color: white !important;
}

:deep(.ant-radio-wrapper) {
  color: #d9d9d9;
}

:deep(.ant-tabs-tab) {
  color: #d9d9d9 !important;
}

:deep(.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn) {
  color: #ec4899 !important;
}

:deep(.ant-tabs-ink-bar) {
  background: #ec4899 !important;
}

:deep(.ant-menu) {
  background: #222 !important;
}

:deep(.ant-menu-item) {
  color: #d9d9d9 !important;
}

:deep(.ant-menu-item:hover) {
  color: #ec4899 !important;
}

:deep(.ant-select-item) {
  color: #d9d9d9 !important;
  background-color: #222 !important;
}

:deep(.ant-select-item-option-active:not(.ant-select-item-option-disabled)) {
  background-color: #333 !important;
}

:deep(.ant-select-item-option-selected:not(.ant-select-item-option-disabled)) {
  background-color: #1f1f1f !important;
  color: #ec4899 !important;
}

:deep(.ant-modal-content) {
  background-color: #111 !important;
}

:deep(.ant-modal-header) {
  background-color: #111 !important;
  border-bottom: 1px solid #333 !important;
}

:deep(.ant-modal-title) {
  color: white !important;
}

:deep(.ant-modal-close-x) {
  color: #d9d9d9 !important;
}
</style>