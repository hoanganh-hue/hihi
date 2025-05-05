<template>
  <div class="bg-[#121212] border-r border-[#333] h-screen sticky top-0 overflow-y-auto w-64 hidden lg:block">
    <div class="p-6">
      <h3 class="text-lg font-medium mb-6 text-white">Danh mục sản phẩm</h3>
      <ul class="space-y-2">
        <li v-for="(category, index) in categories" :key="index">
          <div>
            <router-link 
              :to="`/category/${category.id}`" 
              class="flex items-center py-2 px-3 rounded-lg hover:bg-[#1a1a1a] text-gray-300 hover:text-pink-500 transition-colors duration-300"
              :class="{ 'bg-[#1a1a1a] text-pink-500': isActive(category.id) }"
            >
              <component :is="category.icon" class="mr-3" />
              <span>{{ category.name }}</span>
              <right-outlined v-if="category.subcategories && category.subcategories.length" class="ml-auto text-xs" />
            </router-link>
          </div>
          <div v-if="category.subcategories && category.subcategories.length && isActive(category.id)" class="ml-8 mt-2 space-y-1">
            <router-link 
              v-for="(subcat, subIndex) in category.subcategories" 
              :key="subIndex" 
              :to="`/category/${category.id}/${subcat.id}`" 
              class="flex items-center py-1.5 px-3 rounded-lg hover:bg-[#1a1a1a] text-gray-400 hover:text-pink-500 transition-colors duration-300 text-sm"
              :class="{ 'text-pink-500': isActiveSubcategory(subcat.id) }"
            >
              {{ subcat.name }}
            </router-link>
          </div>
        </li>
      </ul>
    </div>

    <div class="p-6 border-t border-[#333]">
      <h3 class="text-lg font-medium mb-6 text-white">Lọc sản phẩm</h3>
      
      <div class="mb-6">
        <h4 class="text-gray-300 font-medium mb-3">Khoảng giá</h4>
        <a-slider 
          v-model:value="priceRange" 
          range 
          :min="0" 
          :max="10000000" 
          :step="100000" 
          :tooltip-visible="true" 
          :tooltip-formatter="formatCurrency"
          class="custom-slider" 
        />
        <div class="flex justify-between mt-2 text-sm text-gray-400">
          <span>{{ formatCurrency(priceRange[0]) }}</span>
          <span>{{ formatCurrency(priceRange[1]) }}</span>
        </div>
      </div>
      
      <div class="mb-6">
        <h4 class="text-gray-300 font-medium mb-3">Đánh giá</h4>
        <div class="space-y-2">
          <div v-for="i in 5" :key="i" class="flex items-center">
            <a-checkbox class="custom-checkbox text-gray-300">
              <div class="flex items-center">
                <a-rate 
                  :default-value="6-i" 
                  disabled 
                  allow-half 
                  :count="5"
                  class="text-sm custom-rate" 
                />
                <span v-if="i === 1" class="ml-2 text-sm text-gray-400">trở lên</span>
              </div>
            </a-checkbox>
          </div>
        </div>
      </div>
      
      <div class="mb-6">
        <h4 class="text-gray-300 font-medium mb-3">Trạng thái</h4>
        <div class="space-y-2">
          <a-checkbox class="custom-checkbox text-gray-300">Khuyến mãi</a-checkbox>
          <a-checkbox class="custom-checkbox text-gray-300">Hàng mới</a-checkbox>
          <a-checkbox class="custom-checkbox text-gray-300">Bán chạy</a-checkbox>
        </div>
      </div>
      
      <div class="flex space-x-2 mt-6">
        <a-button class="flex-1 !rounded-button bg-[#222] border-[#333] text-gray-300">
          Đặt lại
        </a-button>
        <a-button type="primary" class="flex-1 !rounded-button bg-gradient-to-r from-pink-500 to-purple-600 border-none text-white font-medium">
          Áp dụng
        </a-button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { 
  RightOutlined, 
  MobileOutlined, 
  LaptopOutlined, 
  AudioOutlined,
  SkinOutlined,
  ShoppingOutlined,
  ClockCircleOutlined,
  HomeOutlined,
  SmileOutlined,
  ExperimentOutlined
} from '@ant-design/icons-vue';

export default {
  name: 'SidebarComponent',
  components: {
    RightOutlined,
    MobileOutlined,
    LaptopOutlined,
    AudioOutlined,
    SkinOutlined,
    ShoppingOutlined,
    ClockCircleOutlined,
    HomeOutlined,
    SmileOutlined,
    ExperimentOutlined
  },
  setup() {
    const route = useRoute();
    const priceRange = ref([0, 10000000]);
    
    const categories = ref([
      { 
        id: 1, 
        name: 'Điện thoại - Máy tính bảng', 
        icon: 'MobileOutlined',
        subcategories: [
          { id: 101, name: 'Điện thoại' },
          { id: 102, name: 'Máy tính bảng' },
          { id: 103, name: 'Điện thoại cơ bản' }
        ]
      },
      { 
        id: 2, 
        name: 'Thiết bị điện tử - Máy tính', 
        icon: 'LaptopOutlined',
        subcategories: [
          { id: 201, name: 'Laptop' },
          { id: 202, name: 'Màn hình' },
          { id: 203, name: 'Linh kiện máy tính' }
        ]
      },
      { 
        id: 3, 
        name: 'Phụ kiện công nghệ', 
        icon: 'AudioOutlined',
        subcategories: [
          { id: 301, name: 'Tai nghe' },
          { id: 302, name: 'Cáp sạc' },
          { id: 303, name: 'Ốp lưng' }
        ]
      },
      { 
        id: 4, 
        name: 'Thời trang nam/nữ', 
        icon: 'SkinOutlined',
        subcategories: [
          { id: 401, name: 'Áo' },
          { id: 402, name: 'Quần' },
          { id: 403, name: 'Váy' }
        ]
      },
      { 
        id: 5, 
        name: 'Giày dép nam/nữ', 
        icon: 'ShoppingOutlined',
        subcategories: [
          { id: 501, name: 'Giày sneaker' },
          { id: 502, name: 'Giày thể thao' },
          { id: 503, name: 'Dép' }
        ]
      },
      { 
        id: 6, 
        name: 'Đồng hồ thông minh', 
        icon: 'ClockCircleOutlined',
        subcategories: [
          { id: 601, name: 'Smartwatch' },
          { id: 602, name: 'Đồng hồ thời trang' }
        ]
      },
      { 
        id: 7, 
        name: 'Nhà cửa - Đời sống', 
        icon: 'HomeOutlined',
        subcategories: [
          { id: 701, name: 'Đồ gia dụng' },
          { id: 702, name: 'Trang trí nội thất' }
        ]
      },
      { 
        id: 8, 
        name: 'Làm đẹp - Sức khỏe', 
        icon: 'ExperimentOutlined',
        subcategories: [
          { id: 801, name: 'Mỹ phẩm' },
          { id: 802, name: 'Chăm sóc da' }
        ]
      }
    ]);

    const isActive = (categoryId) => {
      return route.params.categoryId == categoryId;
    };

    const isActiveSubcategory = (subcategoryId) => {
      return route.params.subcategoryId == subcategoryId;
    };

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    return {
      categories,
      priceRange,
      isActive,
      isActiveSubcategory,
      formatCurrency
    };
  }
};
</script>

<style scoped>
.custom-slider :deep(.ant-slider-rail) {
  background-color: #333;
}
.custom-slider :deep(.ant-slider-track) {
  background-color: #ec4899;
}
.custom-slider :deep(.ant-slider-handle) {
  border-color: #ec4899;
}
.custom-checkbox :deep(.ant-checkbox-inner) {
  background-color: #222;
  border-color: #333;
}
.custom-checkbox :deep(.ant-checkbox-checked .ant-checkbox-inner) {
  background-color: #ec4899;
  border-color: #ec4899;
}
.custom-rate :deep(.ant-rate-star-zero .ant-rate-star-first),
.custom-rate :deep(.ant-rate-star-zero .ant-rate-star-second) {
  color: #444;
}
.custom-rate :deep(.ant-rate-star-full .ant-rate-star-first),
.custom-rate :deep(.ant-rate-star-full .ant-rate-star-second) {
  color: #f5a623;
}
</style>
