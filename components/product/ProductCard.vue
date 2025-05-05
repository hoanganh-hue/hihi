<template>
  <div class="product-card bg-gradient-to-br from-[#1a1a1a] to-[#111] rounded-xl overflow-hidden border border-[#333] hover:border-pink-500/30 transition-all duration-300 group">
    <div class="relative">
      <div class="relative h-48 overflow-hidden">
        <img :src="productImage" :alt="product.name" class="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110" />
        <div v-if="product.discount" class="absolute top-3 left-3">
          <span class="bg-pink-500 text-white text-xs px-2 py-1 rounded-full">-{{ product.discount }}%</span>
        </div>
      </div>
    </div>
    <div class="p-4">
      <h3 class="text-base font-medium mb-1 line-clamp-1 group-hover:text-pink-500 transition-colors duration-300">{{ product.name }}</h3>
      <div class="flex items-center space-x-2 mb-2">
        <span class="text-pink-500 font-medium">{{ product.price }}</span>
        <span v-if="product.originalPrice" class="text-gray-400 text-sm line-through">{{ formatPrice(product.originalPrice) }}</span>
      </div>
      <div v-if="showSoldCount && product.soldPercentage" class="w-full bg-[#222] h-2 rounded-full mb-3">
        <div class="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full" :style="{ width: `${product.soldPercentage}%` }"></div>
      </div>
      <div v-if="showSoldCount && product.sold" class="flex justify-between text-sm text-gray-400 mb-4">
        <span>Đã bán {{ product.sold }}</span>
        <span v-if="product.stock">Còn lại {{ product.stock }}</span>
      </div>
      <slot name="actions">
        <a-button
          type="primary"
          block
          class="bg-gradient-to-r from-pink-500 to-purple-600 border-0 shadow-lg"
          @click="addToCart(product)"
        >
          <template #icon><shopping-cart-outlined /></template>
          Thêm vào giỏ
        </a-button>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { ShoppingCartOutlined } from '@ant-design/icons-vue'
import { computed } from 'vue'
import { useCartStore } from '../../hooks/useCart'
import { formatCurrency } from '../../lib/formatters'

const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  showSoldCount: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['add-to-cart'])
const cartStore = useCartStore()

// Xử lý hình ảnh sản phẩm từ DB sau khi đã chuẩn hóa
const productImage = computed(() => {
  // Xử lý trường images như một chuỗi JSON
  if (props.product.images) {
    try {
      // Parse images (luôn là chuỗi JSON sau khi chuẩn hóa)
      const parsedImages = JSON.parse(props.product.images)
      return Array.isArray(parsedImages) && parsedImages.length > 0 ? parsedImages[0] : ''
    } catch (error) {
      console.error('Error parsing product images:', error)
    }
  }
  
  // Fallback: trả về đường dẫn ảnh mặc định
  return '/images/placeholder-product.png'
})

const formatPrice = (price) => {
  return formatCurrency(price)
}

const addToCart = (product) => {
  cartStore.addItem({
    id: product.id,
    name: product.name,
    price: product.price,
    image: productImage.value,
    quantity: 1
  })
  
  emit('add-to-cart', product)
}
</script>

<style scoped>
:deep(.ant-btn-primary) {
  background-color: #ec4899 !important;
  border-color: #ec4899 !important;
}

:deep(.ant-btn-primary:hover) {
  background-color: #db2777 !important;
  border-color: #db2777 !important;
}
</style>