<template>
  <div class="category-page bg-[#0a0a0a] min-h-screen">
    <Header />
    
    <div v-if="loading" class="loading-container flex justify-center items-center py-20">
      <a-spin size="large" />
    </div>
    
    <div v-else-if="error" class="error-container text-center py-20">
      <a-result status="error" :title="error">
        <template #extra>
          <a-button type="primary" @click="loadPhoneData">
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
            <span class="text-white">Điện thoại</span>
          </a-breadcrumb-item>
        </a-breadcrumb>
      </div>
      
      <!-- Category Title -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 class="text-2xl md:text-3xl font-bold text-white">Điện thoại</h1>
        <div class="text-gray-400 mt-2 md:mt-0">
          <span>{{ filteredProducts.length }} sản phẩm</span>
        </div>
      </div>
      
      <!-- Bộ lọc và sắp xếp -->
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
                @change="applyFilters"
              />
              <span class="text-gray-400 mx-2">-</span>
              <a-input-number 
                v-model:value="filters.maxPrice" 
                placeholder="Đến" 
                class="w-full ml-2" 
                :min="filters.minPrice || 0"
                @change="applyFilters"
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
        
        <!-- Bộ lọc nâng cao -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <!-- Ram Filter -->
          <div class="mb-4">
            <div class="text-white font-medium mb-2">RAM</div>
            <div class="flex flex-wrap gap-2">
              <a-checkbox-group v-model:value="filters.ram" @change="applyFilters">
                <div class="flex flex-wrap gap-2">
                  <a-checkbox 
                    v-for="option in ramOptions" 
                    :key="option.value" 
                    :value="option.value"
                    class="filter-checkbox"
                  >
                    <span class="text-gray-300">{{ option.label }}</span>
                  </a-checkbox>
                </div>
              </a-checkbox-group>
            </div>
          </div>
          
          <!-- Rom Filter -->
          <div class="mb-4">
            <div class="text-white font-medium mb-2">Bộ nhớ</div>
            <div class="flex flex-wrap gap-2">
              <a-checkbox-group v-model:value="filters.storage" @change="applyFilters">
                <div class="flex flex-wrap gap-2">
                  <a-checkbox 
                    v-for="option in storageOptions" 
                    :key="option.value" 
                    :value="option.value"
                    class="filter-checkbox"
                  >
                    <span class="text-gray-300">{{ option.label }}</span>
                  </a-checkbox>
                </div>
              </a-checkbox-group>
            </div>
          </div>
          
          <!-- Màn hình Filter -->
          <div class="mb-4">
            <div class="text-white font-medium mb-2">Màn hình</div>
            <div class="flex flex-wrap gap-2">
              <a-checkbox-group v-model:value="filters.screen" @change="applyFilters">
                <div class="flex flex-wrap gap-2">
                  <a-checkbox 
                    v-for="option in screenOptions" 
                    :key="option.value" 
                    :value="option.value"
                    class="filter-checkbox"
                  >
                    <span class="text-gray-300">{{ option.label }}</span>
                  </a-checkbox>
                </div>
              </a-checkbox-group>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Products Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div v-for="product in paginatedProducts" 
             :key="product.id" 
             class="product-card bg-[#111] border border-[#333] rounded-lg overflow-hidden hover:border-pink-500 transition-all"
        >
          <div class="product-image relative">
            <img :src="product.image || (product.images && product.images[0])" 
                 :alt="product.name" 
                 class="w-full h-48 object-cover" 
                 @error="handleImageError"
            />
            <div v-if="product.discountPrice" 
                 class="absolute top-2 right-2 bg-pink-500 text-white px-2 py-1 rounded-md text-sm"
            >
              Giảm giá
            </div>
          </div>
          
          <div class="product-info p-4">
            <h3 class="text-lg font-semibold mb-2 line-clamp-2 text-white">{{ product.name }}</h3>
            
            <div class="specs text-sm text-gray-400 mb-3" v-if="product['thông số kỹ thuật']">
              <div v-if="product['thông số kỹ thuật'].ram">RAM: {{ product['thông số kỹ thuật'].ram }}</div>
              <div v-if="product['thông số kỹ thuật'].storage">Bộ nhớ: {{ product['thông số kỹ thuật'].storage }}</div>
              <div v-if="product['thông số kỹ thuật'].screen">Màn hình: {{ product['thông số kỹ thuật'].screen }}</div>
            </div>
            
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
import { ref, computed, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import Header from '../../components/layout/Header.vue';
import Footer from '../../components/layout/Footer.vue';

// Tất cả sản phẩm
const allProducts = ref([]);

// Trạng thái
const loading = ref(true);
const error = ref(null);
const currentPage = ref(1);
const pageSize = ref(12);
const sortOption = ref('newest');

// Lọc
const filters = ref({
  minPrice: null,
  maxPrice: null,
  ram: [],
  storage: [],
  screen: []
});

// Tùy chọn lọc
const ramOptions = ref([]);
const storageOptions = ref([]);
const screenOptions = ref([]);

// Xử lý khi lọc thay đổi
const applyFilters = () => {
  currentPage.value = 1;
};

// Định dạng giá
const formatPrice = (price) => {
  if (!price) return '0đ';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
    .format(price)
    .replace('₫', 'đ');
};

// Xử lý lỗi hình ảnh
const handleImageError = (e) => {
  e.target.src = '/images/placeholder.png';
};

// Chuyển trang
const handlePageChange = (page) => {
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Lọc sản phẩm theo filter đã chọn
const filteredProducts = computed(() => {
  let result = [...allProducts.value];
  
  // Lọc theo giá
  if (filters.value.minPrice) {
    result = result.filter(product => product.price >= filters.value.minPrice);
  }
  if (filters.value.maxPrice) {
    result = result.filter(product => product.price <= filters.value.maxPrice);
  }
  
  // Lọc theo RAM
  if (filters.value.ram.length > 0) {
    result = result.filter(product => {
      if (product['thông số kỹ thuật'] && product['thông số kỹ thuật'].ram) {
        return filters.value.ram.includes(product['thông số kỹ thuật'].ram);
      }
      return false;
    });
  }
  
  // Lọc theo bộ nhớ
  if (filters.value.storage.length > 0) {
    result = result.filter(product => {
      if (product['thông số kỹ thuật'] && product['thông số kỹ thuật'].storage) {
        return filters.value.storage.includes(product['thông số kỹ thuật'].storage);
      }
      return false;
    });
  }
  
  // Lọc theo màn hình
  if (filters.value.screen.length > 0) {
    result = result.filter(product => {
      if (product['thông số kỹ thuật'] && product['thông số kỹ thuật'].screen) {
        return filters.value.screen.includes(product['thông số kỹ thuật'].screen);
      }
      return false;
    });
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
      if (result[0] && result[0].year) {
        result.sort((a, b) => b.year - a.year);
      }
      break;
    default:
      break;
  }
  
  return result;
});

// Tải dữ liệu từ file JSON
async function loadBrandData(brand) {
  try {
    const response = await fetch(`/images/dien-thoai/data/${brand}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load ${brand} data`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error loading ${brand} data:`, error);
    return [];
  }
}

// Phân trang
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredProducts.value.slice(start, end);
});

// Tải dữ liệu từ tất cả các hãng
async function loadPhoneData() {
  loading.value = true;
  error.value = null;
  
  try {
    message.loading({ content: 'Đang tải dữ liệu sản phẩm...', key: 'loading' });
    
    const brands = ['honor', 'huawei', 'iphone', 'oppo', 'samsung', 'vivo', 'xiaomi'];
    const dataPromises = brands.map(brand => loadBrandData(brand));
    
    const results = await Promise.all(dataPromises);
    
    // Ghép tất cả dữ liệu và cập nhật đường dẫn hình ảnh
    let allData = [];
    results.forEach((brandData, index) => {
      const brand = brands[index];
      if (Array.isArray(brandData)) {
        // Đảm bảo đường dẫn hình ảnh đúng
        const processedData = brandData.map(product => {
          if (product.image && !product.image.startsWith('/')) {
            product.image = `/images/dien-thoai/images/${brand}/${product.image}`;
          }
          if (product.images && Array.isArray(product.images)) {
            product.images = product.images.map(img => {
              if (!img.startsWith('/')) {
                return `/images/dien-thoai/images/${brand}/${img}`;
              }
              return img;
            });
          }
          return product;
        });
        allData = [...allData, ...processedData];
      }
    });
    
    allProducts.value = allData;
    message.success({ content: 'Đã tải dữ liệu sản phẩm thành công!', key: 'loading' });
    
    // Khởi tạo các tùy chọn lọc từ dữ liệu
    initFilterOptions();
  } catch (error) {
    console.error('Error loading all phone data:', error);
    message.error({ content: 'Không thể tải dữ liệu sản phẩm!', key: 'loading' });
    error.value = 'Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.';
  } finally {
    loading.value = false;
  }
}

// Khởi tạo các tùy chọn lọc từ dữ liệu sản phẩm
function initFilterOptions() {
  // Tạo tập hợp các giá trị RAM duy nhất
  const ramSet = new Set();
  allProducts.value.forEach(product => {
    if (product['thông số kỹ thuật'] && product['thông số kỹ thuật'].ram) {
      ramSet.add(product['thông số kỹ thuật'].ram);
    }
  });
  ramOptions.value = Array.from(ramSet).map(value => ({ label: value, value }));
  
  // Tạo tập hợp các giá trị bộ nhớ duy nhất
  const storageSet = new Set();
  allProducts.value.forEach(product => {
    if (product['thông số kỹ thuật'] && product['thông số kỹ thuật'].storage) {
      storageSet.add(product['thông số kỹ thuật'].storage);
    }
  });
  storageOptions.value = Array.from(storageSet).map(value => ({ label: value, value }));
  
  // Tạo tập hợp các giá trị màn hình duy nhất
  const screenSet = new Set();
  allProducts.value.forEach(product => {
    if (product['thông số kỹ thuật'] && product['thông số kỹ thuật'].screen) {
      screenSet.add(product['thông số kỹ thuật'].screen);
    }
  });
  screenOptions.value = Array.from(screenSet).map(value => ({ label: value, value }));
}

onMounted(() => {
  loadPhoneData();
});
</script>

<style scoped>
:deep(.ant-checkbox-wrapper) {
  color: #d9d9d9 !important;
}

:deep(.ant-checkbox-checked .ant-checkbox-inner) {
  background-color: #ec4899 !important;
  border-color: #ec4899 !important;
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