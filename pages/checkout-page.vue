<template>
  <div class="checkout-page bg-[#0a0a0a] min-h-screen">
    <Header />
    
    <div class="container mx-auto px-6 py-8">
      <h1 class="text-2xl md:text-3xl font-bold mb-4">Thanh toán</h1>
      
      <a-steps 
        :current="currentStep" 
        class="mb-8 checkout-steps"
      >
        <a-step title="Thông tin đơn hàng" />
        <a-step title="Phương thức thanh toán" />
        <a-step title="Xác nhận đơn hàng" />
      </a-steps>
      
      <div v-if="cartItems.length === 0" class="empty-cart text-center py-12">
        <a-empty description="Giỏ hàng trống">
          <template #description>
            <span class="text-gray-400">Bạn cần thêm sản phẩm vào giỏ hàng trước khi thanh toán</span>
          </template>
          <router-link to="/">
            <a-button type="primary" class="mt-4 bg-pink-500 border-0 hover:bg-pink-600">
              Quay lại mua sắm
            </a-button>
          </router-link>
        </a-empty>
      </div>
      
      <div v-else class="checkout-content">
        <!-- Step 1: Shipping Information -->
        <div v-if="currentStep === 0" class="shipping-info-step">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <!-- Shipping Form -->
            <div class="lg:col-span-8">
              <div class="bg-[#111] border border-[#333] rounded-lg p-6 mb-6">
                <h2 class="text-xl font-bold mb-6">Thông tin vận chuyển</h2>
                
                <a-form 
                  :model="shippingForm" 
                  :rules="shippingRules" 
                  ref="shippingFormRef"
                  layout="vertical"
                >
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <a-form-item name="fullName" label="Họ tên">
                      <a-input v-model:value="shippingForm.fullName" placeholder="Nhập họ tên" />
                    </a-form-item>
                    
                    <a-form-item name="phone" label="Số điện thoại">
                      <a-input v-model:value="shippingForm.phone" placeholder="Nhập số điện thoại" />
                    </a-form-item>
                  </div>
                  
                  <a-form-item name="email" label="Email">
                    <a-input v-model:value="shippingForm.email" placeholder="Nhập email" />
                  </a-form-item>
                  
                  <a-form-item name="address" label="Địa chỉ">
                    <a-input v-model:value="shippingForm.address" placeholder="Nhập địa chỉ chi tiết" />
                  </a-form-item>
                  
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <a-form-item name="province" label="Tỉnh/Thành phố">
                      <a-select 
                        v-model:value="shippingForm.province" 
                        placeholder="Chọn tỉnh/thành phố"
                        @change="onProvinceChange"
                      >
                        <a-select-option v-for="province in provinces" :key="province.value" :value="province.value">
                          {{ province.label }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                    
                    <a-form-item name="district" label="Quận/Huyện">
                      <a-select 
                        v-model:value="shippingForm.district" 
                        placeholder="Chọn quận/huyện"
                        :disabled="!shippingForm.province"
                        @change="onDistrictChange"
                      >
                        <a-select-option v-for="district in districts" :key="district.value" :value="district.value">
                          {{ district.label }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                    
                    <a-form-item name="ward" label="Phường/Xã">
                      <a-select 
                        v-model:value="shippingForm.ward" 
                        placeholder="Chọn phường/xã"
                        :disabled="!shippingForm.district"
                      >
                        <a-select-option v-for="ward in wards" :key="ward.value" :value="ward.value">
                          {{ ward.label }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                  </div>
                  
                  <a-form-item name="note" label="Ghi chú">
                    <a-textarea 
                      v-model:value="shippingForm.note" 
                      placeholder="Ghi chú về đơn hàng, ví dụ: thời gian nhận hàng hoặc địa điểm chi tiết" 
                      :rows="3"
                    />
                  </a-form-item>
                </a-form>
              </div>
              
              <div class="bg-[#111] border border-[#333] rounded-lg p-6">
                <h2 class="text-xl font-bold mb-6">Phương thức vận chuyển</h2>
                
                <a-radio-group v-model:value="selectedShippingMethod" class="w-full">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a-radio 
                      :value="'standard'" 
                      class="shipping-method-radio"
                    >
                      <div class="p-4 border border-[#333] rounded-lg w-full">
                        <div class="font-medium">Giao hàng tiêu chuẩn</div>
                        <div class="text-sm text-gray-400">Nhận hàng sau 3-5 ngày</div>
                        <div class="text-sm text-pink-500 mt-2">{{ formatCurrency(30000) }}</div>
                      </div>
                    </a-radio>
                    
                    <a-radio 
                      :value="'express'" 
                      class="shipping-method-radio"
                    >
                      <div class="p-4 border border-[#333] rounded-lg w-full">
                        <div class="font-medium">Giao hàng hỏa tốc</div>
                        <div class="text-sm text-gray-400">Nhận hàng trong 24 giờ</div>
                        <div class="text-sm text-pink-500 mt-2">{{ formatCurrency(60000) }}</div>
                      </div>
                    </a-radio>
                  </div>
                </a-radio-group>
              </div>
            </div>
            
            <!-- Order Summary -->
            <div class="lg:col-span-4">
              <div class="sticky top-4">
                <div class="bg-[#111] border border-[#333] rounded-lg p-6 mb-6">
                  <h2 class="text-xl font-bold mb-6">Tóm tắt đơn hàng</h2>
                  
                  <div class="order-items mb-4">
                    <div v-for="(item, index) in cartItems" :key="index" class="flex mb-3">
                      <div class="product-image flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden mr-3">
                        <img :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
                      </div>
                      <div class="product-info flex-1">
                        <div class="product-name text-sm font-medium">{{ item.name }}</div>
                        <div class="product-variants text-xs text-gray-400">{{ item.variations }}</div>
                        <div class="text-xs text-gray-400">
                          {{ formatCurrency(item.price) }} x {{ item.quantity }}
                        </div>
                      </div>
                      <div class="product-price text-sm text-right">
                        {{ formatCurrency(item.price * item.quantity) }}
                      </div>
                    </div>
                  </div>
                  
                  <div class="summary-rows border-t border-[#333] pt-4">
                    <div class="summary-row flex justify-between mb-2">
                      <div class="text-gray-400">Tạm tính:</div>
                      <div class="text-white">{{ formatCurrency(cartSubtotal) }}</div>
                    </div>
                    
                    <div class="summary-row flex justify-between mb-2">
                      <div class="text-gray-400">Giảm giá:</div>
                      <div class="text-pink-500">- {{ formatCurrency(discount) }}</div>
                    </div>
                    
                    <div class="summary-row flex justify-between mb-2">
                      <div class="text-gray-400">Phí vận chuyển:</div>
                      <div class="text-white">{{ formatCurrency(shippingFee) }}</div>
                    </div>
                    
                    <div class="summary-row flex justify-between pt-2 mt-2 border-t border-[#333]">
                      <div class="text-lg font-medium">Tổng tiền:</div>
                      <div class="text-xl text-pink-500 font-bold">{{ formatCurrency(orderTotal) }}</div>
                    </div>
                  </div>
                </div>
                
                <div class="navigation-buttons">
                  <div class="flex flex-col sm:flex-row gap-3">
                    <router-link to="/cart" class="flex-1">
                      <a-button class="w-full border border-[#333] bg-[#222] hover:border-pink-500 hover:text-pink-500">
                        Quay lại
                      </a-button>
                    </router-link>
                    
                    <a-button 
                      type="primary"
                      class="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 border-0"
                      @click="nextStep"
                    >
                      Tiếp tục
                    </a-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Step 2: Payment Method -->
        <div v-else-if="currentStep === 1" class="payment-method-step">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <!-- Payment Options -->
            <div class="lg:col-span-8">
              <div class="bg-[#111] border border-[#333] rounded-lg p-6 mb-6">
                <h2 class="text-xl font-bold mb-6">Phương thức thanh toán</h2>
                
                <a-radio-group v-model:value="selectedPaymentMethod" class="w-full">
                  <div class="grid grid-cols-1 gap-4">
                    <a-radio 
                      :value="'cod'" 
                      class="payment-method-radio"
                    >
                      <div class="p-4 border border-[#333] rounded-lg w-full">
                        <div class="font-medium">Thanh toán khi nhận hàng (COD)</div>
                        <div class="text-sm text-gray-400">Thanh toán bằng tiền mặt khi nhận hàng</div>
                      </div>
                    </a-radio>
                    
                    <a-radio 
                      :value="'bank'" 
                      class="payment-method-radio"
                    >
                      <div class="p-4 border border-[#333] rounded-lg w-full">
                        <div class="font-medium">Chuyển khoản ngân hàng</div>
                        <div class="text-sm text-gray-400">Thanh toán trực tiếp vào tài khoản ngân hàng</div>
                        <div v-if="selectedPaymentMethod === 'bank'" class="mt-3 p-3 bg-[#0a0a0a] rounded-lg">
                          <div class="text-sm text-white mb-1">Thông tin chuyển khoản:</div>
                          <div class="text-sm text-gray-400 mb-1">Ngân hàng: VietComBank</div>
                          <div class="text-sm text-gray-400 mb-1">Tên tài khoản: TIKTOK SHOP VIETNAM</div>
                          <div class="text-sm text-gray-400 mb-1">Số tài khoản: 1234567890</div>
                          <div class="text-sm text-gray-400">Nội dung: TT [Tên của bạn] [Số điện thoại]</div>
                        </div>
                      </div>
                    </a-radio>
                    
                    <a-radio 
                      :value="'momo'" 
                      class="payment-method-radio"
                    >
                      <div class="p-4 border border-[#333] rounded-lg w-full">
                        <div class="font-medium">Ví MoMo</div>
                        <div class="text-sm text-gray-400">Thanh toán qua ví điện tử MoMo</div>
                      </div>
                    </a-radio>
                    
                    <a-radio 
                      :value="'credit_card'" 
                      class="payment-method-radio"
                    >
                      <div class="p-4 border border-[#333] rounded-lg w-full">
                        <div class="font-medium">Thẻ tín dụng/Thẻ ghi nợ</div>
                        <div class="text-sm text-gray-400">Thanh toán trực tuyến qua thẻ VISA, MasterCard, JCB</div>
                        <div v-if="selectedPaymentMethod === 'credit_card'" class="mt-3 p-3 bg-[#0a0a0a] rounded-lg">
                          <div class="grid grid-cols-1 gap-3">
                            <a-input 
                              v-model:value="cardForm.number" 
                              placeholder="Số thẻ"
                            />
                            <div class="grid grid-cols-2 gap-3">
                              <a-input 
                                v-model:value="cardForm.expiry" 
                                placeholder="Ngày hết hạn (MM/YY)"
                              />
                              <a-input 
                                v-model:value="cardForm.cvv" 
                                placeholder="CVV"
                              />
                            </div>
                            <a-input 
                              v-model:value="cardForm.name" 
                              placeholder="Tên chủ thẻ"
                            />
                          </div>
                        </div>
                      </div>
                    </a-radio>
                  </div>
                </a-radio-group>
              </div>
            </div>
            
            <!-- Order Summary -->
            <div class="lg:col-span-4">
              <div class="sticky top-4">
                <div class="bg-[#111] border border-[#333] rounded-lg p-6 mb-6">
                  <h2 class="text-xl font-bold mb-6">Tóm tắt đơn hàng</h2>
                  
                  <div class="summary-rows">
                    <div class="summary-row flex justify-between mb-2">
                      <div class="text-gray-400">Tạm tính:</div>
                      <div class="text-white">{{ formatCurrency(cartSubtotal) }}</div>
                    </div>
                    
                    <div class="summary-row flex justify-between mb-2">
                      <div class="text-gray-400">Giảm giá:</div>
                      <div class="text-pink-500">- {{ formatCurrency(discount) }}</div>
                    </div>
                    
                    <div class="summary-row flex justify-between mb-2">
                      <div class="text-gray-400">Phí vận chuyển:</div>
                      <div class="text-white">{{ formatCurrency(shippingFee) }}</div>
                    </div>
                    
                    <div class="summary-row flex justify-between pt-2 mt-2 border-t border-[#333]">
                      <div class="text-lg font-medium">Tổng tiền:</div>
                      <div class="text-xl text-pink-500 font-bold">{{ formatCurrency(orderTotal) }}</div>
                    </div>
                  </div>
                </div>
                
                <div class="navigation-buttons">
                  <div class="flex flex-col sm:flex-row gap-3">
                    <a-button 
                      class="flex-1 border border-[#333] bg-[#222] hover:border-pink-500 hover:text-pink-500"
                      @click="prevStep"
                    >
                      Quay lại
                    </a-button>
                    
                    <a-button 
                      type="primary"
                      class="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 border-0"
                      @click="nextStep"
                    >
                      Xác nhận
                    </a-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Step 3: Order Confirmation -->
        <div v-else-if="currentStep === 2" class="order-confirmation-step">
          <div class="bg-[#111] border border-[#333] rounded-lg p-6 mb-6">
            <div class="text-center py-8">
              <check-circle-outlined class="text-5xl text-green-500 mb-4" />
              <h2 class="text-2xl font-bold mb-2">Đặt hàng thành công!</h2>
              <p class="text-gray-400 mb-6">Cảm ơn bạn đã mua sắm tại TikTok Shop</p>
              <p class="text-gray-400 mb-2">Đơn hàng của bạn đã được xác nhận.</p>
              <p class="text-gray-400 mb-8">Mã đơn hàng: <span class="text-white font-medium">{{ orderNumber }}</span></p>
              
              <div class="flex flex-col sm:flex-row justify-center gap-4">
                <router-link to="/">
                  <a-button class="border border-[#333] bg-[#222] hover:border-pink-500 hover:text-pink-500">
                    Tiếp tục mua sắm
                  </a-button>
                </router-link>
                
                <a-button 
                  type="primary"
                  class="bg-gradient-to-r from-pink-500 to-purple-600 border-0"
                  @click="viewOrderDetails"
                >
                  Xem chi tiết đơn hàng
                </a-button>
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <!-- Order Information -->
            <div class="lg:col-span-8">
              <div class="bg-[#111] border border-[#333] rounded-lg p-6 mb-6">
                <h2 class="text-xl font-bold mb-6">Thông tin đơn hàng</h2>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Shipping Details -->
                  <div>
                    <h3 class="text-lg font-medium mb-3">Thông tin vận chuyển</h3>
                    <div class="text-gray-400 mb-1">{{ shippingForm.fullName }}</div>
                    <div class="text-gray-400 mb-1">{{ shippingForm.phone }}</div>
                    <div class="text-gray-400 mb-1">{{ shippingForm.email }}</div>
                    <div class="text-gray-400">
                      {{ shippingForm.address }}, 
                      {{ getLocationName(shippingForm.ward, 'ward') }}, 
                      {{ getLocationName(shippingForm.district, 'district') }}, 
                      {{ getLocationName(shippingForm.province, 'province') }}
                    </div>
                  </div>
                  
                  <!-- Payment Details -->
                  <div>
                    <h3 class="text-lg font-medium mb-3">Phương thức thanh toán</h3>
                    <div class="text-gray-400 mb-1">
                      {{ getPaymentMethodName(selectedPaymentMethod) }}
                    </div>
                    
                    <h3 class="text-lg font-medium mt-6 mb-3">Phương thức vận chuyển</h3>
                    <div class="text-gray-400">
                      {{ getShippingMethodName(selectedShippingMethod) }}
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Order Items -->
              <div class="bg-[#111] border border-[#333] rounded-lg p-6">
                <h2 class="text-xl font-bold mb-6">Sản phẩm đã đặt</h2>
                
                <div class="order-items">
                  <div v-for="(item, index) in cartItems" :key="index" class="flex py-3 border-b border-[#333] last:border-0">
                    <div class="product-image flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden mr-3">
                      <img :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
                    </div>
                    <div class="product-info flex-1">
                      <div class="product-name font-medium mb-1">{{ item.name }}</div>
                      <div v-if="item.variations" class="product-variants text-xs text-gray-400 mb-1">
                        {{ item.variations }}
                      </div>
                      <div class="text-sm text-gray-400">
                        {{ formatCurrency(item.price) }} x {{ item.quantity }}
                      </div>
                    </div>
                    <div class="product-price text-right">
                      {{ formatCurrency(item.price * item.quantity) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Order Summary -->
            <div class="lg:col-span-4">
              <div class="sticky top-4">
                <div class="bg-[#111] border border-[#333] rounded-lg p-6">
                  <h2 class="text-xl font-bold mb-6">Tóm tắt thanh toán</h2>
                  
                  <div class="summary-rows">
                    <div class="summary-row flex justify-between mb-2">
                      <div class="text-gray-400">Tạm tính:</div>
                      <div class="text-white">{{ formatCurrency(cartSubtotal) }}</div>
                    </div>
                    
                    <div class="summary-row flex justify-between mb-2">
                      <div class="text-gray-400">Giảm giá:</div>
                      <div class="text-pink-500">- {{ formatCurrency(discount) }}</div>
                    </div>
                    
                    <div class="summary-row flex justify-between mb-2">
                      <div class="text-gray-400">Phí vận chuyển:</div>
                      <div class="text-white">{{ formatCurrency(shippingFee) }}</div>
                    </div>
                    
                    <div class="summary-row flex justify-between pt-2 mt-2 border-t border-[#333]">
                      <div class="text-lg font-medium">Tổng tiền:</div>
                      <div class="text-xl text-pink-500 font-bold">{{ formatCurrency(orderTotal) }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <Footer />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Form, notification } from 'ant-design-vue'
import { CheckCircleOutlined } from '@ant-design/icons-vue'
import { useCartStore } from '../hooks/useCart'
import { formatCurrency } from '../lib/formatters'
import { generateId } from '../lib/utils'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'

const useForm = Form.useForm
const router = useRouter()
const cartStore = useCartStore()

// State
const currentStep = ref(0)
const orderNumber = ref('')
const selectedShippingMethod = ref('standard')
const selectedPaymentMethod = ref('cod')

// Form state
const shippingForm = reactive({
  fullName: '',
  phone: '',
  email: '',
  address: '',
  province: '',
  district: '',
  ward: '',
  note: ''
})

const cardForm = reactive({
  number: '',
  expiry: '',
  cvv: '',
  name: ''
})

// Validation rules
const shippingRules = {
  fullName: [{ required: true, message: 'Vui lòng nhập họ tên' }],
  phone: [{ required: true, message: 'Vui lòng nhập số điện thoại' }],
  email: [
    { required: true, message: 'Vui lòng nhập email' },
    { type: 'email', message: 'Email không hợp lệ' }
  ],
  address: [{ required: true, message: 'Vui lòng nhập địa chỉ' }],
  province: [{ required: true, message: 'Vui lòng chọn tỉnh/thành phố' }],
  district: [{ required: true, message: 'Vui lòng chọn quận/huyện' }],
  ward: [{ required: true, message: 'Vui lòng chọn phường/xã' }]
}

const { validate, validateInfos } = useForm(shippingForm, shippingRules)
const shippingFormRef = ref(null)

// Location data (mocked)
const provinces = [
  { value: 'HN', label: 'Hà Nội' },
  { value: 'HCM', label: 'TP. Hồ Chí Minh' },
  { value: 'DN', label: 'Đà Nẵng' },
  { value: 'HP', label: 'Hải Phòng' },
  { value: 'CT', label: 'Cần Thơ' }
]

const districtsByProvince = {
  'HN': [
    { value: 'HN-BD', label: 'Quận Ba Đình' },
    { value: 'HN-HK', label: 'Quận Hoàn Kiếm' },
    { value: 'HN-TX', label: 'Quận Tây Hồ' },
    { value: 'HN-LB', label: 'Quận Long Biên' },
    { value: 'HN-CG', label: 'Quận Cầu Giấy' }
  ],
  'HCM': [
    { value: 'HCM-1', label: 'Quận 1' },
    { value: 'HCM-3', label: 'Quận 3' },
    { value: 'HCM-4', label: 'Quận 4' },
    { value: 'HCM-5', label: 'Quận 5' },
    { value: 'HCM-7', label: 'Quận 7' }
  ],
  'DN': [
    { value: 'DN-HC', label: 'Quận Hải Châu' },
    { value: 'DN-TK', label: 'Quận Thanh Khê' },
    { value: 'DN-LT', label: 'Quận Liên Chiểu' },
    { value: 'DN-SH', label: 'Huyện Sơn Trà' },
    { value: 'DN-NH', label: 'Quận Ngũ Hành Sơn' }
  ],
  'HP': [
    { value: 'HP-NG', label: 'Quận Ngô Quyền' },
    { value: 'HP-HB', label: 'Quận Hồng Bàng' },
    { value: 'HP-LC', label: 'Quận Lê Chân' },
    { value: 'HP-KA', label: 'Quận Kiến An' },
    { value: 'HP-DB', label: 'Quận Dương Kinh' }
  ],
  'CT': [
    { value: 'CT-NK', label: 'Quận Ninh Kiều' },
    { value: 'CT-BT', label: 'Quận Bình Thủy' },
    { value: 'CT-CM', label: 'Quận Cái Răng' },
    { value: 'CT-OM', label: 'Quận Ô Môn' },
    { value: 'CT-TN', label: 'Quận Thốt Nốt' }
  ]
}

const wardsByDistrict = {
  'HN-BD': [
    { value: 'HN-BD-CT', label: 'Phường Cống Vị' },
    { value: 'HN-BD-DX', label: 'Phường Điện Biên' },
    { value: 'HN-BD-NC', label: 'Phường Ngọc Hà' }
  ],
  'HCM-1': [
    { value: 'HCM-1-BN', label: 'Phường Bến Nghé' },
    { value: 'HCM-1-CM', label: 'Phường Cầu Ông Lãnh' },
    { value: 'HCM-1-DK', label: 'Phường Đa Kao' }
  ],
  // More wards for other districts
}

// Computed properties
const districts = computed(() => {
  if (!shippingForm.province) return []
  return districtsByProvince[shippingForm.province] || []
})

const wards = computed(() => {
  if (!shippingForm.district) return []
  return wardsByDistrict[shippingForm.district] || []
})

const cartItems = computed(() => cartStore.items)
const cartSubtotal = computed(() => cartStore.subtotal)
const discount = computed(() => cartStore.discount)

const shippingFee = computed(() => {
  return selectedShippingMethod.value === 'express' ? 60000 : 30000
})

const orderTotal = computed(() => {
  return cartSubtotal.value - discount.value + shippingFee.value
})

// Methods
const nextStep = async () => {
  if (currentStep.value === 0) {
    // Validate shipping form before proceeding
    try {
      await validate()
      // Update shipping in cart store
      cartStore.updateShipping(shippingFee.value)
      currentStep.value += 1
    } catch (errors) {
      notification.error({
        message: 'Lỗi',
        description: 'Vui lòng điền đầy đủ thông tin vận chuyển',
        placement: 'bottomRight',
      })
    }
  } else if (currentStep.value === 1) {
    // Create order and proceed to confirmation
    createOrder()
    currentStep.value += 1
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value -= 1
  }
}

const onProvinceChange = () => {
  shippingForm.district = ''
  shippingForm.ward = ''
}

const onDistrictChange = () => {
  shippingForm.ward = ''
}

const createOrder = () => {
  orderNumber.value = generateId(8).toUpperCase()
  // Here you would typically send the order data to a server
  // For this demo, we'll just simulate order creation
}

const viewOrderDetails = () => {
  // In a real app, this would navigate to an order details page
  notification.info({
    message: 'Thông báo',
    description: 'Chức năng xem chi tiết đơn hàng đang được phát triển',
    placement: 'bottomRight',
  })
}

const getLocationName = (value, type) => {
  if (!value) return ''
  
  if (type === 'province') {
    const province = provinces.find(p => p.value === value)
    return province ? province.label : ''
  } else if (type === 'district') {
    const district = districts.value.find(d => d.value === value)
    return district ? district.label : ''
  } else if (type === 'ward') {
    const ward = wards.value.find(w => w.value === value)
    return ward ? ward.label : ''
  }
  
  return ''
}

const getPaymentMethodName = (method) => {
  const methods = {
    'cod': 'Thanh toán khi nhận hàng (COD)',
    'bank': 'Chuyển khoản ngân hàng',
    'momo': 'Ví MoMo',
    'credit_card': 'Thẻ tín dụng/Thẻ ghi nợ'
  }
  
  return methods[method] || ''
}

const getShippingMethodName = (method) => {
  const methods = {
    'standard': 'Giao hàng tiêu chuẩn (3-5 ngày)',
    'express': 'Giao hàng hỏa tốc (24 giờ)'
  }
  
  return methods[method] || ''
}

// Initialize data
onMounted(() => {
  cartStore.loadCart()
  
  // Pre-fill form with test data
  if (import.meta.env.DEV) {
    shippingForm.fullName = 'Nguyễn Văn A'
    shippingForm.phone = '0123456789'
    shippingForm.email = 'nguyenvana@example.com'
    shippingForm.address = '123 Đường ABC'
    shippingForm.province = 'HN'
    shippingForm.district = 'HN-BD'
    shippingForm.ward = 'HN-BD-CT'
  }
})
</script>

<style scoped>
:deep(.ant-steps-item-process .ant-steps-item-icon) {
  background-color: #ec4899;
  border-color: #ec4899;
}

:deep(.ant-steps-item-finish .ant-steps-item-icon) {
  background-color: transparent;
  border-color: #ec4899;
}

:deep(.ant-steps-item-finish .ant-steps-item-icon > .ant-steps-icon) {
  color: #ec4899;
}

:deep(.ant-steps-item-finish > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title::after) {
  background-color: #ec4899;
}

:deep(.ant-steps-item-title) {
  color: #d9d9d9 !important;
}

:deep(.ant-input),
:deep(.ant-select-selector),
:deep(.ant-textarea) {
  background-color: #222 !important;
  border-color: #333 !important;
  color: white !important;
}

:deep(.ant-input:hover),
:deep(.ant-input:focus),
:deep(.ant-select-selector:hover),
:deep(.ant-select-selector:focus),
:deep(.ant-select-focused .ant-select-selector),
:deep(.ant-textarea:hover),
:deep(.ant-textarea:focus) {
  border-color: #ec4899 !important;
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

:deep(.ant-form-item-label > label) {
  color: #d9d9d9 !important;
}

:deep(.ant-radio-wrapper) {
  color: #d9d9d9 !important;
}

:deep(.ant-radio-checked .ant-radio-inner) {
  border-color: #ec4899 !important;
  background-color: #ec4899 !important;
}

:deep(.ant-radio:hover .ant-radio-inner) {
  border-color: #ec4899 !important;
}

.shipping-method-radio,
.payment-method-radio {
  width: 100%;
  margin-right: 0;
  margin-bottom: 0;
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

@media (max-width: 768px) {
  .checkout-steps {
    margin-bottom: 1.5rem;
  }
}
</style>