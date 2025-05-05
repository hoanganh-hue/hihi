<!-- Template cơ sở cho tất cả các trang danh mục -->
<template>
  <div class="category-page bg-[#0a0a0a] min-h-screen">
    <Header />
    
    <div v-if="loading" class="loading-container flex justify-center items-center py-20">
      <a-spin size="large" />
    </div>
    
    <div v-else-if="error" class="error-container text-center py-20">
      <a-result status="error" :title="error">
        <template #extra>
          <a-button type="primary" @click="fetchCategoryData">
            Thử lại
          </a-button>
        </template>
      </a-result>
    </div>
    
    <div v-else class="container mx-auto px-6 py-8">
      <!-- Breadcrumb -->
      <div class="breadcrumbs mb-6">
        <a-breadcrumb separator=">">
          <a-breadcrumb-item>
            <router-link to="/" class="text-gray-400 hover:text-pink-500">Trang chủ</router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>
            <span class="text-white">{{ displayCategoryName }}</span>
          </a-breadcrumb-item>
        </a-breadcrumb>
      </div>
      
      <!-- Category Title -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 class="text-2xl md:text-3xl font-bold text-white">{{ displayCategoryName }}</h1>
        <div class="text-gray-400 mt-2 md:mt-0">
          <span>{{ filteredProducts.length }} sản phẩm</span>
        </div>
      </div>
      
      <!-- Filters và sắp xếp -->
      <div class="filters-container bg-[#111] border border-[#333] rounded-lg p-4 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Price Range Filter -->
          <div class="price-filter">
            <div class="text-white mb-2">Khoảng giá:</div>
            <div class="flex items-center">
              <a-input-number 
                v-model:value="filters.minPrice" 
                placeholder="Từ" 
                class="w-full mr-2" 
                :min="0"
                @change="debouncedApplyFilters"
              />
              <span class="text-gray-400 mx-2">-</span>
              <a-input-number 
                v-model:value="filters.maxPrice" 
                placeholder="Đến" 
                class="w-full ml-2" 
                :min="filters.minPrice || 0"
                @change="debouncedApplyFilters"
              />
            </div>
          </div>
          
          <!-- Sort Option -->
          <div class="sort-option">
            <div class="text-white mb-2">Sắp xếp theo:</div>
            <a-select 
              v-model:value="sortOption" 
              class="w-full" 
              @change="applyFilters"
            >
              <a-select-option value="newest">Mới nhất</a-select-option>
              <a-select-option value="price_asc">Giá: Thấp đến cao</a-select-option>
              <a-select-option value="price_desc">Giá: Cao đến thấp</a-select-option>
            </a-select>
          </div>
        </div>
        
        <!-- Slot cho bộ lọc nâng cao tùy chỉnh -->
        <slot name="advanced-filters"></slot>
      </div>
      
      <!-- Products Grid -->
      <slot name="products">
        <div class="products-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <div v-for="product in paginatedProducts" :key="product.id" 
               class="product-card bg-[#111] border border-[#333] rounded-lg overflow-hidden hover:border-pink-500 transition-all">
            <div class="product-image relative">
              <img :src="product.image || (product.images && product.images[0])" :alt="product.name" class="w-full h-48 object-cover" />
              <div v-if="product.discountPrice" class="absolute top-2 right-2 bg-pink-500 text-white px-2 py-1 rounded-md text-sm">
                Giảm giá
              </div>
            </div>
            
            <div class="product-info p-4">
              <h3 class="text-lg font-semibold mb-2 line-clamp-2 text-white">{{ product.name }}</h3>
              
              <!-- Slot cho thông tin sản phẩm tùy chỉnh -->
              <slot name="product-info" :product="product">
                <!-- Default product info display -->
                <div class="specs text-sm text-gray-400 mb-3" v-if="product['thông số kỹ thuật']">
                  <div v-if="product['thông số kỹ thuật'].ram">RAM: {{ product['thông số kỹ thuật'].ram }}</div>
                  <div v-if="product['thông số kỹ thuật'].storage">Bộ nhớ: {{ product['thông số kỹ thuật'].storage }}</div>
                  <div v-if="product['thông số kỹ thuật'].screen">Màn hình: {{ product['thông số kỹ thuật'].screen }}</div>
                </div>
              </slot>
              
              <div class="price-container mb-4">
                <span v-if="product.discountPrice" class="text-gray-400 line-through mr-2">{{ formatPrice(product.price) }}</span>
                <span class="text-xl font-bold text-pink-500">{{ formatPrice(product.discountPrice || product.price) }}</span>
              </div>
              
              <div class="actions flex justify-between items-center">
                <a-button type="primary" class="bg-gradient-to-r from-pink-500 to-pink-600 border-0 flex-grow mr-2">
                  <i class="fas fa-cart-plus mr-1"></i> Mua ngay
                </a-button>
                <a-button class="border-[#333] hover:border-pink-500">
                  <i class="fas fa-heart"></i>
                </a-button>
              </div>
            </div>
          </div>
        </div>
      </slot>
      
      <!-- Pagination -->
      <div class="pagination-container mt-8 flex justify-center">
        <a-pagination
          v-model:current="currentPage"
          :total="filteredProducts.length"
          :pageSize="pageSize"
          @change="handlePageChange"
        />
      </div>
    </div>
    
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchCategoryProducts } from '@/hooks/useProducts'
import Header from '../layout/Header.vue'
import Footer from '../layout/Footer.vue'

const route = useRoute()
const { slug } = route.params
const { products, loading, error } = fetchCategoryProducts(slug)

// Lấy tên danh mục từ slug
const displayCategoryName = computed(() => {
  // Chuyển đổi slug thành tên hiển thị (ví dụ: dien-thoai -> Điện thoại)
  const categoryMap = {
    'dien-thoai': 'Điện thoại',
    'do-choi-me-va-be': 'Đồ chơi - Mẹ & Bé',
    'dong-ho': 'Đồng hồ',
    'dung-cu-the-thao': 'Dụng cụ thể thao',
    'giay-dep': 'Giày dép',
    'quan-ao': 'Quần áo',
    'the-nap-ki-thuat-so': 'Thẻ nạp & Kỹ thuật số',
    'thiet-bi-dien-tu': 'Thiết bị điện tử',
    'trang-suc': 'Trang sức',
    'tui-xach': 'Túi xách'
  };
  return categoryMap[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
});

// State
const currentPage = ref(1)
const pageSize = ref(20)
const sortOption = ref('newest')

// Filters
const filters = ref({
  minPrice: null,
  maxPrice: null
})

// Định dạng giá
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
    .format(price)
    .replace('₫', 'đ')
}

// Computed
const filteredProducts = computed(() => {
  let result = [...products.value]

  // Lọc theo giá
  if (filters.value.minPrice) {
    result = result.filter(product => product.price >= filters.value.minPrice)
  }
  if (filters.value.maxPrice) {
    result = result.filter(product => product.price <= filters.value.maxPrice)
  }

  // Sắp xếp
  const discountPrice = p => p.discountPrice || p.price;
  switch (sortOption.value) {
    case 'price_asc':
      result.sort((a, b) => discountPrice(a) - discountPrice(b));
      break;
    case 'price_desc':
      result.sort((a, b) => discountPrice(b) - discountPrice(a));
      break;
    case 'newest':
      // Nếu có trường năm thì sort theo năm, nếu không giữ nguyên thứ tự
      if (result[0] && result[0].year) {
        result.sort((a, b) => b.year - a.year)
      }
      break;
    default:
      break;
  }

  return result
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredProducts.value.slice(start, end)
})

// Methods
const handlePageChange = (page) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const applyFilters = () => {
  currentPage.value = 1
}

const debouncedApplyFilters = debounce(applyFilters, 300)

// Initial data fetch
onMounted(() => {
  // fetchCategoryData()
})
</script>

<style scoped>
:deep(.ant-breadcrumb) {
  color: #d9d9d9;
}

:deep(.ant-select-selector) {
  background-color: #222 !important;
  border-color: #333 !important;
  color: #d9d9d9 !important;
}

:deep(.ant-select-arrow) {
  color: #d9d9d9 !important;
}

:deep(.ant-select-dropdown) {
  background-color: #222 !important;
  border: 1px solid #333 !important;
}

:deep(.ant-select-item) {
  color: #d9d9d9 !important;
}

:deep(.ant-select-item-option-active) {
  background-color: #333 !important;
}

:deep(.ant-select-item-option-selected) {
  background-color: #ec4899 !important;
  color: white !important;
}

:deep(.ant-input-number) {
  background-color: #222 !important;
  border-color: #333 !important;
  color: #d9d9d9 !important;
}

:deep(.ant-input-number-handler-wrap) {
  background-color: #333 !important;
  border-color: #444 !important;
}

:deep(.ant-input-number-handler) {
  color: #d9d9d9 !important;
}

:deep(.ant-input-number-input) {
  color: #d9d9d9 !important;
}

:deep(.ant-pagination-item) {
  background-color: #222 !important;
  border-color: #333 !important;
}

:deep(.ant-pagination-item a) {
  color: #d9d9d9 !important;
}

:deep(.ant-pagination-item-active) {
  border-color: #ec4899 !important;
}

:deep(.ant-pagination-item-active a) {
  color: #ec4899 !important;
}

:deep(.ant-pagination-prev button),
:deep(.ant-pagination-next button) {
  background-color: #222 !important;
  border-color: #333 !important;
  color: #d9d9d9 !important;
}
</style>