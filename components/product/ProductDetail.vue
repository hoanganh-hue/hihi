<template>
  <div class="product-detail">
    <div v-if="loading" class="loading-container flex justify-center items-center py-16">
      <a-spin size="large" />
    </div>
    
    <div v-else-if="error" class="error-container text-center py-16">
      <a-result status="error" :title="error">
        <template #extra>
          <a-button type="primary" @click="$emit('retry')">
            Thử lại
          </a-button>
        </template>
      </a-result>
    </div>
    
    <div v-else-if="!product" class="not-found-container text-center py-16">
      <a-result status="404" title="Không tìm thấy sản phẩm">
        <template #extra>
          <router-link to="/">
            <a-button type="primary">
              Quay lại trang chủ
            </a-button>
          </router-link>
        </template>
      </a-result>
    </div>
    
    <div v-else class="product-detail-content">
      <!-- Main product content -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Product gallery -->
        <div class="lg:col-span-5">
          <div class="product-gallery">
            <div class="main-image rounded-xl overflow-hidden border border-[#333] mb-4">
              <img :src="selectedImage || parsedImages[0] || ''" :alt="product.name" class="w-full h-auto object-cover" />
            </div>
            
            <div class="thumbnails grid grid-cols-5 gap-3">
              <div 
                v-for="(image, index) in parsedImages" 
                :key="index" 
                class="thumbnail rounded-lg overflow-hidden border border-[#333] cursor-pointer transition-all duration-200"
                :class="{'border-pink-500': selectedImage === image}"
                @click="selectedImage = image"
              >
                <img :src="image" :alt="`Thumbnail ${index + 1}`" class="w-full h-auto object-cover" />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Product info -->
        <div class="lg:col-span-7">
          <h1 class="text-2xl md:text-3xl font-bold mb-4">{{ product.name }}</h1>
          
          <div class="flex items-center mb-4">
            <div class="flex items-center mr-4">
              <star-filled class="text-yellow-400 mr-1" />
              <span class="text-yellow-400 font-medium">{{ product.rating }}</span>
              <span class="text-gray-400 ml-1">({{ product.reviewCount }} đánh giá)</span>
            </div>
            <div class="text-gray-400">
              <span>Đã bán {{ product.sold }}</span>
            </div>
          </div>
          
          <div class="price-container bg-[#111] rounded-lg p-6 mb-6">
            <div class="flex items-end mb-2">
              <span class="text-3xl text-pink-500 font-bold mr-3">{{ formatPrice(product.price) }}</span>
              <span v-if="product.originalPrice && product.price < product.originalPrice" class="text-gray-400 text-lg line-through">{{ formatPrice(product.originalPrice) }}</span>
              <span v-if="product.discount" class="ml-3 px-2 py-1 bg-pink-500 text-white text-xs rounded-full">-{{ product.discount }}%</span>
            </div>
          </div>
          
          <!-- Variations -->
          <div v-if="product.variations && product.variations.length > 0" class="variations-container mb-6">
            <div v-for="variation in product.variations" :key="variation.id" class="variation-group mb-4">
              <div class="text-white mb-2">{{ variation.name }}:</div>
              <div class="flex flex-wrap gap-2">
                <a-button 
                  v-for="option in variation.options" 
                  :key="option" 
                  :class="{ 'border-pink-500 text-pink-500': selectedVariations[variation.id] === option }"
                  class="border border-[#333] bg-[#222] hover:border-pink-500 hover:text-pink-500"
                  @click="selectVariation(variation.id, option)"
                >
                  {{ option }}
                </a-button>
              </div>
            </div>
          </div>
          
          <!-- Quantity -->
          <div class="quantity-container mb-6">
            <div class="text-white mb-2">Số lượng:</div>
            <div class="flex items-center">
              <a-button 
                class="border border-[#333] bg-[#222] hover:border-pink-500" 
                :disabled="quantity <= 1"
                @click="decreaseQuantity"
              >
                <template #icon><minus-outlined /></template>
              </a-button>
              
              <a-input-number
                v-model:value="quantity"
                :min="1"
                :max="product.stock"
                class="mx-2 w-20 text-center"
              />
              
              <a-button 
                class="border border-[#333] bg-[#222] hover:border-pink-500" 
                :disabled="quantity >= product.stock"
                @click="increaseQuantity"
              >
                <template #icon><plus-outlined /></template>
              </a-button>
              
              <span class="text-gray-400 ml-4">{{ product.stock }} sản phẩm có sẵn</span>
            </div>
          </div>
          
          <!-- Action buttons -->
          <div class="action-buttons flex flex-col sm:flex-row gap-4 mb-6">
            <a-button
              size="large"
              class="flex-1 border border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white"
              @click="addToCart"
            >
              <template #icon><shopping-cart-outlined /></template>
              Thêm vào giỏ hàng
            </a-button>
            
            <a-button
              type="primary"
              size="large"
              class="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 border-0"
              @click="buyNow"
            >
              Mua ngay
            </a-button>
          </div>
          
          <!-- Seller info -->
          <div class="seller-info border border-[#333] rounded-lg p-4">
            <div class="flex items-center">
              <div class="seller-avatar mr-3">
                <a-avatar size={50} class="bg-gradient-to-r from-pink-500 to-purple-600">
                  {{ product.seller.name.charAt(0) }}
                </a-avatar>
              </div>
              
              <div class="seller-details flex-1">
                <div class="text-lg font-medium mb-1">{{ product.seller.name }}</div>
                <div class="flex items-center">
                  <star-filled class="text-yellow-400 mr-1 text-xs" />
                  <span class="text-yellow-400 text-xs mr-2">{{ product.seller.rating }}</span>
                  <span class="text-gray-400 text-xs">{{ product.seller.followers }} người theo dõi</span>
                </div>
              </div>
              
              <a-button class="border border-[#333] bg-[#222] hover:border-pink-500 hover:text-pink-500">
                Xem shop
              </a-button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Product description -->
      <div class="product-description mt-12 border border-[#333] rounded-lg p-6 bg-[#111]">
        <h2 class="text-xl font-bold mb-6">Chi tiết sản phẩm</h2>
        <div class="description-content" v-html="product.description"></div>
      </div>
      
      <!-- Specifications -->
      <div v-if="product.specifications && product.specifications.length > 0" class="product-specifications mt-8 border border-[#333] rounded-lg p-6 bg-[#111]">
        <h2 class="text-xl font-bold mb-6">Thông số kỹ thuật</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="(spec, index) in product.specifications" :key="index" class="specification-item py-2 border-b border-[#333]">
            <span class="text-gray-400">{{ spec.key }}: </span>
            <span class="text-white">{{ spec.value }}</span>
          </div>
        </div>
      </div>
      
      <!-- Reviews section will be added in a separate component -->
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ShoppingCartOutlined, MinusOutlined, PlusOutlined, StarFilled } from '@ant-design/icons-vue'
import { useCartStore } from '../../hooks/useCart'
import { formatCurrency } from '../../lib/formatters'

const props = defineProps({
  product: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['retry', 'add-to-cart', 'buy-now'])
const router = useRouter()
const cartStore = useCartStore()

// State
const quantity = ref(1)
const selectedImage = ref('')
const selectedVariations = ref({})

// Parse images from JSON string
const parsedImages = computed(() => {
  if (!props.product) return []
  
  try {
    // Sau khi chuẩn hóa, images luôn là chuỗi JSON
    if (typeof props.product.images === 'string') {
      return JSON.parse(props.product.images)
    }
  } catch (error) {
    console.error('Error parsing product images:', error)
  }
  
  // Fallback: trả về mảng rỗng
  return []
})

// Khi sản phẩm thay đổi, reset các giá trị đã chọn
watch(() => props.product, (newProduct) => {
  if (newProduct) {
    quantity.value = 1
    selectedImage.value = parsedImages.value.length > 0 ? parsedImages.value[0] : ''
    selectedVariations.value = {}
    
    // Tự động chọn phiên bản đầu tiên của mỗi biến thể (nếu có)
    if (newProduct.variations && newProduct.variations.length) {
      newProduct.variations.forEach(variation => {
        if (variation.options && variation.options.length) {
          selectedVariations.value[variation.id] = variation.options[0]
        }
      })
    }
  }
}, { immediate: true })

// Methods
const selectVariation = (variationId, option) => {
  selectedVariations.value[variationId] = option
}

const increaseQuantity = () => {
  if (quantity.value < props.product.stock) {
    quantity.value++
  }
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const getSelectedVariationsAsString = () => {
  if (!props.product.variations || !props.product.variations.length) {
    return ''
  }
  
  return props.product.variations
    .map(variation => {
      const selected = selectedVariations.value[variation.id]
      return selected ? `${variation.name}: ${selected}` : ''
    })
    .filter(Boolean)
    .join(', ')
}

const addToCart = () => {
  if (!props.product) return
  
  const variations = getSelectedVariationsAsString()
  
  const cartItem = {
    id: props.product.id,
    name: props.product.name,
    price: props.product.price,
    image: parsedImages.value.length > 0 ? parsedImages.value[0] : '',
    quantity: quantity.value,
    variations
  }
  
  cartStore.addItem(cartItem)
  emit('add-to-cart', cartItem)
}

const buyNow = () => {
  addToCart()
  router.push('/checkout')
  emit('buy-now')
}

function formatPrice(price) {
  return formatCurrency(price)
}
</script>

<style scoped>
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

.thumbnail {
  height: 80px;
}

.thumbnail img {
  height: 80px;
  object-fit: cover;
}

.main-image {
  height: 400px;
}

.main-image img {
  width: 100%;
  height: 400px;
  object-fit: contain;
}

/* Responsive main image height */
@media (max-width: 768px) {
  .main-image,
  .main-image img {
    height: 300px;
  }
}
</style>
