<template>
  <div class="product-page bg-[#0a0a0a] min-h-screen">
    <Header />
    
    <div class="container mx-auto px-6 py-8">
      <!-- Breadcrumb -->
      <div class="breadcrumbs mb-6">
        <a-breadcrumb separator=">">
          <a-breadcrumb-item>
            <router-link to="/" class="text-gray-400 hover:text-pink-500">Trang chủ</router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item v-if="product && product.category">
            <router-link 
              :to="`/category/${product.category.id}`" 
              class="text-gray-400 hover:text-pink-500"
            >
              {{ product.category.name }}
            </router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>
            <span class="text-white">{{ product?.name || 'Chi tiết sản phẩm' }}</span>
          </a-breadcrumb-item>
        </a-breadcrumb>
      </div>
      
      <!-- Product Detail -->
      <product-detail 
        :product="product" 
        :loading="loading" 
        :error="error"
        @retry="fetchProductData"
        @add-to-cart="showAddToCartNotification"
        @buy-now="redirectToCheckout"
      />
      
      <!-- Related Products -->
      <related-products 
        :products="relatedProducts" 
        :loading="relatedLoading" 
        :error="relatedError"
        @add-to-cart="showAddToCartNotification"
      />
    </div>
    
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { notification } from 'ant-design-vue'
import { useStaticProducts } from '../hooks/useStaticProducts'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import ProductDetail from '../components/product/ProductDetail.vue'
import RelatedProducts from '../components/product/RelatedProducts.vue'

const route = useRoute()
const router = useRouter()
const { getProductsByCategory } = useStaticProducts()

// State
const product = ref(null)
const relatedProducts = ref([])
const loading = ref(false)
const relatedLoading = ref(false)
const error = ref(null)
const relatedError = ref(null)

// Watch for route changes
watch(() => route.params.id, (newId) => {
  if (newId) {
    fetchProductData()
  }
}, { immediate: true })

// Methods
const fetchProductData = async () => {
  loading.value = true
  error.value = null
  
  try {
    const productId = route.params.id
    // Lấy danh sách sản phẩm tĩnh trong danh mục điện thoại
    const products = getProductsByCategory('dien-thoai')
    // Tìm sản phẩm theo id
    const productData = products.find(p => p.id === productId)
    if (productData) {
      product.value = productData
    } else {
      error.value = 'Không tìm thấy sản phẩm'
    }
    
    // TODO: Lấy sản phẩm liên quan (có thể lấy ngẫu nhiên hoặc theo hãng)
    relatedProducts.value = products.filter(p => p.id !== productId).slice(0, 5)
  } catch (err) {
    console.error('Error fetching product data:', err)
    error.value = 'Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.'
  } finally {
    loading.value = false
  }
}

const fetchRelatedProductsData = async (productId) => {
  relatedLoading.value = true
  relatedError.value = null
  
  try {
    // Không dùng API, dữ liệu đã lấy trong fetchProductData
  } catch (err) {
    console.error('Error fetching related products:', err)
    relatedError.value = 'Không thể tải sản phẩm liên quan.'
  } finally {
    relatedLoading.value = false
  }
}

const showAddToCartNotification = (item) => {
  notification.success({
    message: 'Thêm vào giỏ hàng',
    description: `Đã thêm "${item.name}" vào giỏ hàng.`,
    placement: 'bottomRight',
  })
}

const redirectToCheckout = () => {
  router.push('/checkout')
  }

// Initial data fetch
onMounted(() => {
  if (route.params.id) {
    fetchProductData()
  }
})
</script>

<style scoped>
:deep(.ant-breadcrumb) {
  color: #d9d9d9;
}

:deep(.ant-notification-notice) {
  background-color: #222;
  border: 1px solid #333;
}

:deep(.ant-notification-notice-message) {
  color: white;
}

:deep(.ant-notification-notice-description) {
  color: #d9d9d9;
}
</style>