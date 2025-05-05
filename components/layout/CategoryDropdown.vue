<template>
  <div class="relative group">
    <router-link
      to="/categories"
      class="text-gray-300 hover:text-pink-500 transition-colors duration-300 cursor-pointer flex items-center"
      :class="{ 'text-pink-500 font-medium': $route.path.startsWith('/categor') }"
    >
      Danh mục
      <down-outlined class="ml-1 text-xs" />
    </router-link>
    
    <!-- Dropdown -->
    <div class="absolute top-full left-0 mt-2 w-[540px] bg-[#1a1a1a] border border-[#333] rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
      <div class="grid grid-cols-2 gap-2 p-4">
        <div v-for="(category, index) in hardcodedCategories" :key="index" class="relative">
          <router-link 
            :to="`/category/${category.slug}`" 
            class="flex items-center py-3 px-4 hover:bg-[#222] rounded-lg transition-colors duration-300 group"
          >
            <component 
              :is="getCategoryIcon(category.icon)" 
              class="text-pink-500 mr-3 text-lg" 
            />
            <span class="text-gray-300 group-hover:text-pink-500 transition-colors duration-300">{{ category.name }}</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { DownOutlined, RightOutlined } from '@ant-design/icons-vue';
import { 
  MobileOutlined, 
  LaptopOutlined, 
  UsbOutlined, 
  SkinOutlined,
  SlidersOutlined,
  FieldTimeOutlined,
  HomeOutlined,
  RobotOutlined,
  HeartOutlined,
  CreditCardOutlined,
  QuestionOutlined
} from '@ant-design/icons-vue';

// Danh sách danh mục cứng
const hardcodedCategories = [
  { id: 'dien-thoai', name: 'Điện thoại', slug: 'dien-thoai', icon: 'mobile-outlined' },
  { id: 'do-choi-me-va-be', name: 'Đồ chơi - Mẹ & Bé', slug: 'do-choi-me-va-be', icon: 'robot-outlined' },
  { id: 'dong-ho', name: 'Đồng hồ', slug: 'dong-ho', icon: 'field-time-outlined' },
  { id: 'dung-cu-the-thao', name: 'Dụng cụ thể thao', slug: 'dung-cu-the-thao', icon: 'sliders-outlined' },
  { id: 'giay-dep', name: 'Giày dép', slug: 'giay-dep', icon: 'skin-outlined' },
  { id: 'quan-ao', name: 'Quần áo', slug: 'quan-ao', icon: 'skin-outlined' },
  { id: 'the-nap-ki-thuat-so', name: 'Thẻ nạp & Kỹ thuật số', slug: 'the-nap-ki-thuat-so', icon: 'credit-card-outlined' },
  { id: 'thiet-bi-dien-tu', name: 'Thiết bị điện tử', slug: 'thiet-bi-dien-tu', icon: 'laptop-outlined' },
  { id: 'trang-suc', name: 'Trang sức', slug: 'trang-suc', icon: 'heart-outlined' },
  { id: 'tui-xach', name: 'Túi xách', slug: 'tui-xach', icon: 'skin-outlined' }
];

const categories = ref(hardcodedCategories);

// Đối chiếu icon string thành component
function getCategoryIcon(iconString) {
  const iconMap = {
    'mobile-outlined': MobileOutlined,
    'laptop-outlined': LaptopOutlined,
    'usb-outlined': UsbOutlined,
    'skin-outlined': SkinOutlined,
    'sliders-outlined': SlidersOutlined,
    'field-time-outlined': FieldTimeOutlined,
    'home-outlined': HomeOutlined,
    'robot-outlined': RobotOutlined,
    'heart-outlined': HeartOutlined,
    'credit-card-outlined': CreditCardOutlined,
    'question-outlined': QuestionOutlined
  };
  
  return iconMap[iconString] || QuestionOutlined;
}
</script>

<style scoped>
/* Custom styling for dropdown */
.group:hover .ml-1 {
  transform: rotate(180deg);
}
</style>