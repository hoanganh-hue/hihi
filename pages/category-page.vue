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
            <span class="text-white">{{ category?.name || 'Danh mục' }}</span>
          </a-breadcrumb-item>
          <a-breadcrumb-item v-if="selectedSubcategory">
            <span class="text-white">{{ selectedSubcategory?.name }}</span>
          </a-breadcrumb-item>
        </a-breadcrumb>
      </div>
      
      <!-- Chi tiết danh mục theo chủ đề -->
      <CategoryDetail v-if="categorySlug" :slug="categorySlug" @select-subcategory="selectSubcategory" />
      
      <!-- Category Banner (hiển thị nếu không có chi tiết đặc trưng) -->
      <div v-else-if="category?.image" class="category-banner rounded-xl overflow-hidden mb-8">
        <img :src="category.image" :alt="category.name" class="w-full h-48 md:h-64 object-cover" />
      </div>
      
      <!-- Category Title -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 class="text-2xl md:text-3xl font-bold">{{ category?.name || 'Danh mục sản phẩm' }}</h1>
        <div class="text-gray-400 mt-2 md:mt-0">
          <span>{{ productCount || 0 }} sản phẩm</span>
        </div>
      </div>
      
      <!-- Subcategories -->
      <div v-if="category?.subcategories && category.subcategories.length > 0" class="subcategories-container mb-8">
        <div class="flex flex-wrap gap-3">
          <a-button 
            :class="{ 'bg-pink-500 text-white border-pink-500': !selectedSubcategoryId }"
            class="border border-[#333] bg-[#222] hover:border-pink-500 hover:text-pink-500"
            @click="selectSubcategory(null)"
          >
            Tất cả
          </a-button>
          
          <a-button 
            v-for="subcategory in category.subcategories" 
            :key="subcategory.id"
            :class="{ 'bg-pink-500 text-white border-pink-500': selectedSubcategoryId === subcategory.id }"
            class="border border-[#333] bg-[#222] hover:border-pink-500 hover:text-pink-500"
            @click="selectSubcategory(subcategory.id)"
          >
            {{ subcategory.name }}
          </a-button>
        </div>
      </div>
      
      <!-- Filters and Sort -->
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
          
          <!-- Rating Filter -->
          <div class="rating-filter">
            <div class="text-white mb-2">Đánh giá:</div>
            <a-radio-group v-model:value="filters.rating" @change="applyFilters">
              <a-radio-button value="all">Tất cả</a-radio-button>
              <a-radio-button value="4">4★+</a-radio-button>
              <a-radio-button value="3">3★+</a-radio-button>
            </a-radio-group>
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
              <a-select-option value="rating">Đánh giá</a-select-option>
              <a-select-option value="popular">Phổ biến nhất</a-select-option>
            </a-select>
          </div>
        </div>
      </div>
      
      <!-- Products -->
      <product-list 
        :products="products" 
        :loading="productsLoading" 
        :error="productsError" 
        :pagination="true"
        :total-products="productCount"
        :page-size="pageSize"
        @page-change="handlePageChange"
        @retry="fetchCategoryProducts"
        @add-to-cart="handleAddToCart"
      />
    </div>
    
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCategories } from '../hooks/useCategories'
import { useProducts } from '../hooks/useProducts'
import { debounce } from '../lib/utils'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import ProductList from '../components/product/ProductList.vue'
import CategoryDetail from '../components/category/CategoryDetail.vue'

const route = useRoute()
const { fetchCategoryById, fetchCategoryProducts: fetchCategoryProductsApi } = useCategories()
const productsHook = useProducts()

// State
const category = ref(null)
const products = ref([])
const selectedSubcategoryId = ref(null)
const productCount = ref(0)
const loading = ref(false)
const productsLoading = ref(false)
const error = ref(null)
const productsError = ref(null)
const currentPage = ref(1)
const pageSize = ref(20)
const sortOption = ref('newest')
const filters = ref({
  minPrice: null,
  maxPrice: null,
  rating: 'all'
})

// Computed properties
const selectedSubcategory = computed(() => {
  if (!category.value || !category.value.subcategories || !selectedSubcategoryId.value) return null
  return category.value.subcategories.find(sub => sub.id === selectedSubcategoryId.value)
})

// Slug của danh mục hiện tại để hiển thị nội dung riêng
const categorySlug = computed(() => {
  return route.params.categoryId || null;
})

// Watch for route changes
watch(() => route.params, (newParams) => {
  if (newParams.categoryId) {
    currentPage.value = 1
    selectedSubcategoryId.value = newParams.subcategoryId || null
    fetchCategoryData()
  }
}, { immediate: true })

// Methods
const fetchCategoryData = async () => {
  loading.value = true
  error.value = null
  
  try {
    const categoryId = route.params.categoryId
    const categoryData = await fetchCategoryById(categoryId)
    category.value = categoryData
    
    // If subcategoryId is in route params but not valid, reset it
    if (route.params.subcategoryId && 
        categoryData.subcategories && 
        !categoryData.subcategories.some(sub => sub.id === route.params.subcategoryId)) {
      selectedSubcategoryId.value = null
    }
    
    // After loading category data, load products
    fetchCategoryProducts()
  } catch (err) {
    console.error('Error fetching category data:', err)
    error.value = 'Không thể tải thông tin danh mục. Vui lòng thử lại sau.'
  } finally {
    loading.value = false
  }
}

const fetchCategoryProducts = async () => {
  productsLoading.value = true
  productsError.value = null
  
  try {
    const categoryId = route.params.categoryId
    const subcategoryId = selectedSubcategoryId.value
    
    // Prepare params for API call
    const params = {
      page: currentPage.value,
      limit: pageSize.value,
      sort: sortOption.value,
      ...(filters.value.minPrice && { minPrice: filters.value.minPrice }),
      ...(filters.value.maxPrice && { maxPrice: filters.value.maxPrice }),
      ...(filters.value.rating !== 'all' && { minRating: filters.value.rating }),
      ...(subcategoryId && { subcategoryId })
    }
    
    const result = await fetchCategoryProductsApi(categoryId, params)
    products.value = result.products || []
    productCount.value = result.total || products.value.length
  } catch (err) {
    console.error('Error fetching category products:', err)
    productsError.value = 'Không thể tải sản phẩm. Vui lòng thử lại sau.'
    // Fallback to mock products
    const mockProducts = await productsHook.getMockCategoryProducts(route.params.categoryId)
    products.value = mockProducts
    productCount.value = mockProducts.length
  } finally {
    productsLoading.value = false
  }
}

const selectSubcategory = (subcategoryId) => {
  selectedSubcategoryId.value = subcategoryId
  currentPage.value = 1
  fetchCategoryProducts()
}

const handlePageChange = (page) => {
  currentPage.value = page
  fetchCategoryProducts()
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const applyFilters = () => {
  currentPage.value = 1
  fetchCategoryProducts()
}

const debouncedApplyFilters = debounce(applyFilters, 500)

const handleAddToCart = (product) => {
  // Product is already added to cart from ProductCard component
  // Just show notification if needed
}

// Initial data fetch
onMounted(() => {
  if (route.params.categoryId) {
    fetchCategoryData()
  }
})
</script>

<style scoped>
:deep(.ant-breadcrumb) {
  color: #d9d9d9;
}

:deep(.ant-radio-button-wrapper) {
  background-color: #222;
  border-color: #333;
  color: #d9d9d9;
}

:deep(.ant-radio-button-wrapper:hover) {
  color: #ec4899;
}

:deep(.ant-radio-button-wrapper-checked) {
  background-color: #ec4899;
  border-color: #ec4899;
  color: white;
}

:deep(.ant-radio-button-wrapper-checked:hover) {
  background-color: #db2777;
  border-color: #db2777;
  color: white;
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
</style>