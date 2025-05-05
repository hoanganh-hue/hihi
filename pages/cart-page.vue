<template>
  <div class="cart-page bg-[#0a0a0a] min-h-screen">
    <Header />
    
    <div class="container mx-auto px-6 py-8">
      <h1 class="text-2xl md:text-3xl font-bold mb-8">Giỏ hàng của bạn</h1>
      
      <div v-if="cartItems.length === 0" class="empty-cart text-center py-12">
        <a-empty description="Giỏ hàng trống">
          <template #description>
            <span class="text-gray-400">Giỏ hàng của bạn đang trống</span>
          </template>
          <router-link to="/">
            <a-button type="primary" class="mt-4 bg-pink-500 border-0 hover:bg-pink-600">
              Tiếp tục mua sắm
            </a-button>
          </router-link>
        </a-empty>
      </div>
      
      <div v-else class="cart-content grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Cart items -->
        <div class="cart-items lg:col-span-8">
          <div class="cart-header bg-[#111] border border-[#333] rounded-t-lg p-4 grid grid-cols-12 items-center hidden md:grid">
            <div class="col-span-6 text-gray-400">Sản phẩm</div>
            <div class="col-span-2 text-gray-400 text-center">Đơn giá</div>
            <div class="col-span-2 text-gray-400 text-center">Số lượng</div>
            <div class="col-span-2 text-gray-400 text-center">Thành tiền</div>
          </div>
          
          <div class="cart-body border border-t-0 border-[#333] divide-y divide-[#333]">
            <div 
              v-for="(item, index) in cartItems" 
              :key="index" 
              class="cart-item p-4 bg-[#0f0f0f] grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
            >
              <!-- Mobile: Product info with price -->
              <div class="md:hidden grid grid-cols-3 gap-4 mb-3">
                <div class="col-span-1">
                  <div class="product-image w-20 h-20 overflow-hidden rounded-lg">
                    <img :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
                  </div>
                </div>
                <div class="col-span-2">
                  <div class="product-name font-medium mb-1 text-white">{{ item.name }}</div>
                  <div v-if="item.variations" class="product-variations text-xs text-gray-400 mb-2">
                    {{ item.variations }}
                  </div>
                  <div class="product-price text-pink-500">{{ formatCurrency(item.price) }}</div>
                </div>
              </div>
              
              <!-- Desktop: Product info -->
              <div class="hidden md:grid md:col-span-6 grid-cols-12 gap-4 items-center">
                <div class="col-span-3">
                  <div class="product-image w-20 h-20 overflow-hidden rounded-lg">
                    <img :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
                  </div>
                </div>
                <div class="col-span-9">
                  <div class="product-name font-medium mb-1 text-white">{{ item.name }}</div>
                  <div v-if="item.variations" class="product-variations text-xs text-gray-400">
                    {{ item.variations }}
                  </div>
                </div>
              </div>
              
              <!-- Desktop: Price -->
              <div class="hidden md:block md:col-span-2 text-center">
                <div class="product-price text-pink-500">{{ formatCurrency(item.price) }}</div>
              </div>
              
              <!-- Quantity controls -->
              <div class="md:col-span-2 flex justify-center items-center">
                <div class="quantity-controls flex items-center">
                  <a-button 
                    class="border border-[#333] bg-[#222] hover:border-pink-500" 
                    :disabled="item.quantity <= 1"
                    @click="decreaseQuantity(index)"
                  >
                    <minus-outlined />
                  </a-button>
                  
                  <div class="quantity mx-2 w-10 text-center">
                    {{ item.quantity }}
                  </div>
                  
                  <a-button 
                    class="border border-[#333] bg-[#222] hover:border-pink-500" 
                    @click="increaseQuantity(index)"
                  >
                    <plus-outlined />
                  </a-button>
                </div>
              </div>
              
              <!-- Subtotal -->
              <div class="md:col-span-2 flex items-center justify-between md:justify-center">
                <div class="md:hidden text-gray-400">Thành tiền:</div>
                <div class="subtotal text-white font-medium">
                  {{ formatCurrency(item.price * item.quantity) }}
                </div>
              </div>
              
              <!-- Remove button -->
              <div class="flex justify-end md:absolute md:top-4 md:right-4">
                <a-button 
                  type="text" 
                  class="text-gray-400 hover:text-pink-500 flex items-center justify-center"
                  @click="removeItem(index)"
                >
                  <delete-outlined />
                </a-button>
              </div>
            </div>
          </div>
          
          <div class="cart-actions bg-[#111] border border-t-0 border-[#333] rounded-b-lg p-4 flex flex-col sm:flex-row justify-between items-center">
            <div class="action-buttons mb-4 sm:mb-0">
              <router-link to="/">
                <a-button class="border border-[#333] bg-[#222] hover:border-pink-500 hover:text-pink-500 mr-2">
                  <arrow-left-outlined />
                  Tiếp tục mua sắm
                </a-button>
              </router-link>
              
              <a-button 
                class="border border-[#333] bg-[#222] hover:border-pink-500 hover:text-pink-500"
                @click="clearCart"
              >
                <delete-outlined />
                Xóa giỏ hàng
              </a-button>
            </div>
            
            <div class="cart-summary text-gray-400">
              Tổng {{ cartItems.length }} sản phẩm: 
              <span class="text-white font-medium ml-2">{{ formatCurrency(cartTotal) }}</span>
            </div>
          </div>
        </div>
        
        <!-- Cart summary -->
        <div class="cart-sidebar lg:col-span-4">
          <div class="cart-summary bg-[#111] border border-[#333] rounded-lg p-6">
            <h2 class="text-xl font-bold mb-6">Thanh toán</h2>
            
            <div class="summary-row flex justify-between mb-4">
              <div class="text-gray-400">Tạm tính:</div>
              <div class="text-white">{{ formatCurrency(cartSubtotal) }}</div>
            </div>
            
            <div class="summary-row flex justify-between mb-4">
              <div class="text-gray-400">Giảm giá:</div>
              <div class="text-pink-500">- {{ formatCurrency(discount) }}</div>
            </div>
            
            <div class="summary-row flex justify-between mb-4">
              <div class="text-gray-400">Phí vận chuyển:</div>
              <div class="text-white">{{ formatCurrency(shipping) }}</div>
            </div>
            
            <div class="divider border-t border-[#333] my-4"></div>
            
            <div class="summary-row flex justify-between my-4">
              <div class="text-lg font-medium">Tổng cộng:</div>
              <div class="text-xl text-pink-500 font-bold">{{ formatCurrency(cartTotal) }}</div>
            </div>
            
            <!-- Coupon input -->
            <div class="coupon-input mt-6 mb-4">
              <div class="text-white mb-2">Mã giảm giá:</div>
              <div class="flex">
                <a-input 
                  v-model:value="couponCode"
                  placeholder="Nhập mã giảm giá" 
                  class="flex-1 mr-2"
                />
                <a-button 
                  class="border border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white"
                  @click="applyCoupon"
                >
                  Áp dụng
                </a-button>
              </div>
            </div>
            
            <!-- Checkout button -->
            <div class="checkout-button mt-6">
              <router-link to="/checkout">
                <a-button 
                  type="primary"
                  size="large"
                  class="w-full bg-gradient-to-r from-pink-500 to-purple-600 border-0"
                >
                  Tiến hành thanh toán
                </a-button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { notification } from 'ant-design-vue'
import { MinusOutlined, PlusOutlined, DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons-vue'
import { useCartStore } from '../hooks/useCart'
import { formatCurrency } from '../lib/formatters'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'

const cartStore = useCartStore()
const couponCode = ref('')

// Computed properties
const cartItems = computed(() => cartStore.items)
const cartSubtotal = computed(() => cartStore.subtotal)
const discount = computed(() => cartStore.discount)
const shipping = computed(() => cartStore.shipping)
const cartTotal = computed(() => cartStore.total)

// Methods
const increaseQuantity = (index) => {
  cartStore.updateQuantity(index, 1)
}

const decreaseQuantity = (index) => {
  cartStore.updateQuantity(index, -1)
}

const removeItem = (index) => {
  cartStore.removeItem(index)
  notification.success({
    message: 'Đã xóa sản phẩm',
    description: 'Sản phẩm đã được xóa khỏi giỏ hàng',
    placement: 'bottomRight',
  })
}

const clearCart = () => {
  cartStore.clearCart()
  notification.success({
    message: 'Đã xóa giỏ hàng',
    description: 'Tất cả sản phẩm đã được xóa khỏi giỏ hàng',
    placement: 'bottomRight',
  })
}

const applyCoupon = () => {
  if (!couponCode.value) {
    notification.error({
      message: 'Lỗi',
      description: 'Vui lòng nhập mã giảm giá',
      placement: 'bottomRight',
    })
    return
  }
  
  // Giả định mã giảm giá "TIKTOK10" giảm 10%, "TIKTOK20" giảm 20%
  if (couponCode.value === 'TIKTOK10') {
    cartStore.applyDiscount('TIKTOK10', cartSubtotal.value * 0.1)
    notification.success({
      message: 'Áp dụng mã giảm giá thành công',
      description: 'Đã áp dụng mã giảm giá TIKTOK10: giảm 10%',
      placement: 'bottomRight',
    })
  } else if (couponCode.value === 'TIKTOK20') {
    cartStore.applyDiscount('TIKTOK20', cartSubtotal.value * 0.2)
    notification.success({
      message: 'Áp dụng mã giảm giá thành công',
      description: 'Đã áp dụng mã giảm giá TIKTOK20: giảm 20%',
      placement: 'bottomRight',
    })
  } else {
    notification.error({
      message: 'Lỗi',
      description: 'Mã giảm giá không hợp lệ hoặc đã hết hạn',
      placement: 'bottomRight',
    })
  }
  
  couponCode.value = ''
}

// Load cart data from localStorage on mount
onMounted(() => {
  cartStore.loadCart()
})
</script>

<style scoped>
:deep(.ant-input) {
  background-color: #222 !important;
  border-color: #333 !important;
  color: white !important;
}

:deep(.ant-input:hover),
:deep(.ant-input:focus) {
  border-color: #ec4899 !important;
}

.cart-item {
  position: relative;
}

@media (max-width: 768px) {
  .cart-item {
    padding-bottom: 4rem;
  }
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