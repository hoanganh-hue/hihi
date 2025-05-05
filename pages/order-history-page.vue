<template>
  <div class="min-h-screen bg-black text-white">
    <div class="container mx-auto px-6 py-8">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 class="text-3xl font-bold mb-4 md:mb-0">Lịch sử đơn hàng</h1>
        <div class="flex flex-wrap gap-3">
          <a-input-search
            v-model:value="searchTerm"
            placeholder="Tìm kiếm theo mã đơn hàng"
            class="w-full md:w-64"
            @search="handleSearch"
          />
        </div>
      </div>

      <!-- Order filters -->
      <div class="bg-[#121212] rounded-xl border border-[#333] p-6 mb-8">
        <div class="flex flex-wrap gap-4 mb-6">
          <a-radio-group v-model:value="orderStatus" button-style="solid">
            <a-radio-button value="all">Tất cả</a-radio-button>
            <a-radio-button value="pending">Chờ xác nhận</a-radio-button>
            <a-radio-button value="confirmed">Đã xác nhận</a-radio-button>
            <a-radio-button value="shipping">Đang giao</a-radio-button>
            <a-radio-button value="completed">Đã nhận</a-radio-button>
            <a-radio-button value="cancelled">Đã hủy</a-radio-button>
            <a-radio-button value="refund">Hoàn tiền</a-radio-button>
          </a-radio-group>
        </div>
        <div class="flex flex-wrap items-center gap-4">
          <div class="w-full md:w-auto flex items-center space-x-2">
            <span class="text-gray-400">Từ:</span>
            <a-date-picker 
              v-model:value="dateRange[0]" 
              class="w-36" 
              format="DD/MM/YYYY"
            />
          </div>
          <div class="w-full md:w-auto flex items-center space-x-2">
            <span class="text-gray-400">Đến:</span>
            <a-date-picker 
              v-model:value="dateRange[1]" 
              class="w-36" 
              format="DD/MM/YYYY" 
            />
          </div>
          <a-button 
            type="default" 
            class="flex-shrink-0"
            @click="applyFilters"
          >
            <filter-outlined /> Lọc
          </a-button>
          <a-button 
            type="link" 
            class="flex-shrink-0 text-pink-500 p-0"
            @click="clearFilters"
          >
            Xóa bộ lọc
          </a-button>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="filteredOrders.length === 0" class="bg-[#121212] rounded-xl border border-[#333] p-12 text-center">
        <shopping-outlined class="text-6xl text-gray-500 mb-4" />
        <h3 class="text-xl mb-2">Không có đơn hàng nào</h3>
        <p class="text-gray-400 mb-6">Bạn chưa có đơn hàng nào hoặc không có đơn hàng khớp với bộ lọc hiện tại</p>
        <a-button 
          type="primary" 
          class="bg-gradient-to-r from-pink-500 to-purple-600 border-none"
          @click="goToShopping"
        >
          Mua sắm ngay
        </a-button>
      </div>

      <!-- Orders list -->
      <div v-else class="space-y-6">
        <div 
          v-for="order in filteredOrders" 
          :key="order.id"
          class="bg-[#121212] rounded-xl border border-[#333] overflow-hidden"
        >
          <!-- Order header -->
          <div class="p-4 bg-[#1a1a1a] border-b border-[#333] flex justify-between items-center flex-wrap gap-3">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-gray-400">Đơn hàng:</span>
                <span class="font-medium">{{ order.id }}</span>
                <copy-outlined 
                  class="text-gray-400 cursor-pointer hover:text-pink-500" 
                  @click="copyOrderId(order.id)"
                />
              </div>
              <div class="text-xs text-gray-400">{{ order.date }}</div>
            </div>
            <div class="flex items-center gap-3">
              <a-tag :color="getStatusColor(order.status)">
                {{ getStatusText(order.status) }}
              </a-tag>
              <a-button 
                type="link" 
                class="text-pink-500 p-0"
                @click="showOrderDetail(order)"
              >
                Xem chi tiết
              </a-button>
            </div>
          </div>
          
          <!-- Order items -->
          <div>
            <div 
              v-for="(item, index) in order.items" 
              :key="`${order.id}-${index}`"
              class="p-4 border-b border-[#333] last:border-b-0 flex flex-col md:flex-row gap-4"
            >
              <div class="flex-shrink-0">
                <img 
                  :src="item.image" 
                  :alt="item.name" 
                  class="w-20 h-20 object-cover rounded-md"
                />
              </div>
              <div class="flex-grow">
                <div class="flex flex-col md:flex-row md:justify-between gap-2">
                  <div>
                    <div class="font-medium mb-1">{{ item.name }}</div>
                    <div class="text-sm text-gray-400">{{ getVariantText(item.variant) }}</div>
                    <div class="text-sm text-gray-400">Số lượng: {{ item.quantity }}</div>
                  </div>
                  <div class="md:text-right">
                    <div class="font-medium">{{ formatCurrency(item.price * item.quantity) }}</div>
                    <div class="text-sm text-gray-400">{{ formatCurrency(item.price) }}/sản phẩm</div>
                  </div>
                </div>
                
                <!-- Actions after delivery -->
                <div v-if="order.status === 'completed'" class="mt-3 space-x-2">
                  <a-button 
                    v-if="!item.reviewed"
                    type="primary" 
                    size="small"
                    class="bg-gradient-to-r from-pink-500 to-purple-600 border-none"
                    @click="reviewProduct(item)"
                  >
                    <star-outlined /> Đánh giá
                  </a-button>
                  <a-button 
                    v-else
                    type="dashed" 
                    size="small"
                    @click="viewReview(item)"
                  >
                    <eye-outlined /> Xem đánh giá
                  </a-button>
                  <a-button 
                    type="default" 
                    size="small"
                    @click="buyAgain(item)"
                  >
                    <shopping-cart-outlined /> Mua lại
                  </a-button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Order footer -->
          <div class="p-4 bg-[#1a1a1a] border-t border-[#333] flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
            <div>
              <div class="text-sm text-gray-400">
                <span>Thanh toán:</span>
                <span class="text-white ml-1">{{ getPaymentMethodText(order.payment.method) }}</span>
                <span class="ml-2 text-xs px-2 py-0.5 rounded-full" :class="getPaymentStatusClass(order.payment.status)">
                  {{ order.payment.status }}
                </span>
              </div>
              <div v-if="order.shipping" class="text-sm text-gray-400 mt-1">
                <span>Giao hàng:</span>
                <span class="text-white ml-1">{{ order.shipping.method }}</span>
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm text-gray-400">Tổng tiền</div>
              <div class="text-xl font-bold">{{ formatCurrency(order.total) }}</div>
              <div class="flex flex-wrap justify-end gap-2 mt-2">
                <!-- Dynamic buttons based on status -->
                <a-button 
                  v-if="order.status === 'pending'" 
                  danger 
                  @click="cancelOrder(order)"
                >
                  Hủy đơn
                </a-button>
                <a-button 
                  v-if="order.status === 'shipping'" 
                  type="primary"
                  class="bg-gradient-to-r from-pink-500 to-purple-600 border-none"
                  @click="confirmReceived(order)"
                >
                  Đã nhận hàng
                </a-button>
                <a-button 
                  v-if="order.status === 'pending' || order.status === 'confirmed'" 
                  @click="contactSeller(order)"
                >
                  Liên hệ người bán
                </a-button>
                <a-button 
                  v-if="order.status === 'completed'" 
                  @click="viewInvoice(order)"
                >
                  Xem hóa đơn
                </a-button>
                <a-button 
                  v-if="order.status === 'completed' && !order.hasReported" 
                  danger
                  @click="reportIssue(order)"
                >
                  Báo vấn đề
                </a-button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Pagination -->
        <div class="flex justify-center mt-8">
          <a-pagination 
            v-model:current="currentPage" 
            :total="totalOrders" 
            :pageSize="pageSize" 
            show-less-items 
            @change="handlePageChange" 
          />
        </div>
      </div>
    </div>
  
    <!-- Order Detail Modal -->
    <a-modal
      v-model:visible="orderDetailVisible"
      :title="`Chi tiết đơn hàng #${selectedOrder?.id}`"
      width="800px"
      :footer="null"
      class="custom-modal"
    >
      <div v-if="selectedOrder">
        <a-steps 
          :current="getOrderStepIndex(selectedOrder.status)" 
          direction="vertical" 
          size="small"
          class="mb-6"
        >
          <a-step 
            title="Đặt hàng thành công" 
            :description="selectedOrder.timeline?.ordered || selectedOrder.date" 
            status="finish" 
          />
          <a-step 
            title="Đã xác nhận" 
            :description="selectedOrder.timeline?.confirmed || 'Đang chờ xác nhận'"
            :status="getStepStatus(selectedOrder.status, 'confirmed')" 
          />
          <a-step 
            title="Đang giao hàng" 
            :description="selectedOrder.timeline?.shipping || 'Chờ giao hàng'"
            :status="getStepStatus(selectedOrder.status, 'shipping')" 
          />
          <a-step 
            title="Đã nhận hàng" 
            :description="selectedOrder.timeline?.completed || 'Chờ giao hàng'"
            :status="getStepStatus(selectedOrder.status, 'completed')" 
          />
        </a-steps>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <div class="text-gray-400 mb-1">Địa chỉ giao hàng</div>
            <div class="p-3 bg-[#1a1a1a] rounded-md">
              <div class="font-medium">{{ selectedOrder.shippingAddress.name }}</div>
              <div>{{ selectedOrder.shippingAddress.phone }}</div>
              <div>{{ selectedOrder.shippingAddress.address }}</div>
            </div>
          </div>
          <div>
            <div class="text-gray-400 mb-1">Thông tin thanh toán</div>
            <div class="p-3 bg-[#1a1a1a] rounded-md">
              <div class="flex justify-between mb-1">
                <span>Phương thức:</span>
                <span class="font-medium">{{ getPaymentMethodText(selectedOrder.payment.method) }}</span>
              </div>
              <div class="flex justify-between mb-1">
                <span>Trạng thái:</span>
                <span class="font-medium">{{ selectedOrder.payment.status }}</span>
              </div>
              <div v-if="selectedOrder.payment.transactionId" class="flex justify-between">
                <span>Mã giao dịch:</span>
                <span class="font-medium">{{ selectedOrder.payment.transactionId }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="mb-6">
          <div class="text-gray-400 mb-1">Sản phẩm</div>
          <div class="border border-[#333] rounded-md overflow-hidden">
            <div 
              v-for="(item, index) in selectedOrder.items" 
              :key="`${selectedOrder.id}-${index}`"
              class="p-3 border-b border-[#333] last:border-b-0 flex"
            >
              <img 
                :src="item.image" 
                :alt="item.name" 
                class="w-16 h-16 object-cover rounded-md mr-3"
              />
              <div class="flex-grow flex flex-col md:flex-row md:justify-between gap-2">
                <div>
                  <div class="font-medium">{{ item.name }}</div>
                  <div class="text-sm text-gray-400">{{ getVariantText(item.variant) }}</div>
                  <div class="text-sm text-gray-400">Số lượng: {{ item.quantity }}</div>
                </div>
                <div class="md:text-right">
                  <div>{{ formatCurrency(item.price * item.quantity) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="mb-6 bg-[#1a1a1a] rounded-md p-3">
          <div class="flex justify-between mb-2">
            <span class="text-gray-400">Tổng tiền hàng:</span>
            <span>{{ formatCurrency(selectedOrder.subtotal) }}</span>
          </div>
          <div class="flex justify-between mb-2">
            <span class="text-gray-400">Phí vận chuyển:</span>
            <span>{{ formatCurrency(selectedOrder.shipping?.fee || 0) }}</span>
          </div>
          <div v-if="selectedOrder.discount" class="flex justify-between mb-2">
            <span class="text-gray-400">Giảm giá:</span>
            <span>-{{ formatCurrency(selectedOrder.discount) }}</span>
          </div>
          <div class="flex justify-between pt-2 border-t border-[#333] font-bold">
            <span>Tổng thanh toán:</span>
            <span>{{ formatCurrency(selectedOrder.total) }}</span>
          </div>
        </div>
        
        <div v-if="selectedOrder.note" class="mb-6">
          <div class="text-gray-400 mb-1">Ghi chú đơn hàng</div>
          <div class="p-3 bg-[#1a1a1a] rounded-md">
            {{ selectedOrder.note }}
          </div>
        </div>
        
        <div class="flex justify-end gap-3">
          <a-button @click="orderDetailVisible = false">Đóng</a-button>
          <a-button 
            type="default" 
            @click="contactSellerFromDetail"
          >
            <message-outlined /> Liên hệ người bán
          </a-button>
          <a-button 
            v-if="selectedOrder.status === 'pending'" 
            danger 
            @click="cancelOrderFromDetail"
          >
            <close-outlined /> Hủy đơn hàng
          </a-button>
        </div>
      </div>
    </a-modal>
    
    <!-- Review Product Modal -->
    <a-modal
      v-model:visible="reviewModalVisible"
      title="Đánh giá sản phẩm"
      :footer="null"
      class="custom-modal"
    >
      <div v-if="selectedProduct">
        <div class="flex mb-6">
          <img 
            :src="selectedProduct.image" 
            :alt="selectedProduct.name" 
            class="w-24 h-24 object-cover rounded-md mr-4"
          />
          <div>
            <div class="font-medium">{{ selectedProduct.name }}</div>
            <div class="text-sm text-gray-400">{{ getVariantText(selectedProduct.variant) }}</div>
          </div>
        </div>
        
        <a-form layout="vertical">
          <a-form-item label="Đánh giá của bạn">
            <a-rate v-model:value="reviewForm.rating" allow-half />
            <div class="text-xs text-gray-400 mt-1">Chọn số sao bạn muốn đánh giá</div>
          </a-form-item>
          
          <a-form-item label="Nhận xét">
            <a-textarea 
              v-model:value="reviewForm.comment" 
              :rows="4" 
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
            />
          </a-form-item>
          
          <a-form-item label="Ảnh (tùy chọn)">
            <a-upload
              v-model:fileList="reviewForm.images"
              list-type="picture-card"
              :before-upload="beforeUpload"
              @preview="handleImagePreview"
            >
              <div v-if="reviewForm.images.length < 5">
                <plus-outlined />
                <div style="margin-top: 8px">Tải lên</div>
              </div>
            </a-upload>
            <div class="text-xs text-gray-400 mt-1">Tối đa 5 ảnh (mỗi ảnh tối đa 5MB)</div>
          </a-form-item>
          
          <div class="flex justify-end gap-3 mt-6">
            <a-button @click="reviewModalVisible = false">Hủy</a-button>
            <a-button 
              type="primary"
              class="bg-gradient-to-r from-pink-500 to-purple-600 border-none"
              @click="submitReview"
              :disabled="!isReviewValid"
            >
              Gửi đánh giá
            </a-button>
          </div>
        </a-form>
      </div>
    </a-modal>

    <!-- Preview Image Modal -->
    <a-modal
      v-model:visible="previewVisible"
      :footer="null"
      :title="null"
    >
      <img :src="previewImage" alt="Preview" style="width: 100%" />
    </a-modal>

    <!-- Issue Report Modal -->
    <a-modal
      v-model:visible="issueModalVisible"
      title="Báo cáo vấn đề về đơn hàng"
      :footer="null"
      class="custom-modal"
    >
      <a-form layout="vertical">
        <a-form-item label="Loại vấn đề">
          <a-select v-model:value="issueForm.type">
            <a-select-option value="damaged">Sản phẩm bị hư hỏng</a-select-option>
            <a-select-option value="wrong_item">Sản phẩm không đúng mô tả</a-select-option>
            <a-select-option value="missing">Thiếu sản phẩm</a-select-option>
            <a-select-option value="other">Vấn đề khác</a-select-option>
          </a-select>
        </a-form-item>
        
        <a-form-item label="Mô tả vấn đề">
          <a-textarea 
            v-model:value="issueForm.description" 
            :rows="4" 
            placeholder="Vui lòng mô tả chi tiết vấn đề bạn gặp phải..."
          />
        </a-form-item>
        
        <a-form-item label="Ảnh chứng minh (tùy chọn)">
          <a-upload
            v-model:fileList="issueForm.images"
            list-type="picture-card"
            :before-upload="beforeUpload"
            @preview="handleImagePreview"
          >
            <div v-if="issueForm.images.length < 5">
              <plus-outlined />
              <div style="margin-top: 8px">Tải lên</div>
            </div>
          </a-upload>
        </a-form-item>
        
        <a-form-item label="Yêu cầu của bạn">
          <a-radio-group v-model:value="issueForm.requestType">
            <a-radio value="refund">Hoàn tiền</a-radio>
            <a-radio value="replace">Đổi sản phẩm</a-radio>
            <a-radio value="partialRefund">Hoàn tiền một phần</a-radio>
          </a-radio-group>
        </a-form-item>
        
        <div class="flex justify-end gap-3">
          <a-button @click="issueModalVisible = false">Hủy</a-button>
          <a-button 
            type="primary"
            danger
            @click="submitIssueReport"
            :disabled="!isIssueFormValid"
          >
            Gửi báo cáo
          </a-button>
        </div>
      </a-form>
    </a-modal>

    <!-- Cancel Order Modal -->
    <a-modal
      v-model:visible="cancelOrderModalVisible"
      title="Hủy đơn hàng"
      :footer="null"
      class="custom-modal"
    >
      <p class="mb-4">Bạn có chắc chắn muốn hủy đơn hàng này?</p>
      
      <a-form layout="vertical">
        <a-form-item label="Lý do hủy đơn">
          <a-select v-model:value="cancelForm.reason">
            <a-select-option value="changed_mind">Tôi đổi ý không muốn mua nữa</a-select-option>
            <a-select-option value="found_better">Tôi tìm thấy sản phẩm tốt hơn</a-select-option>
            <a-select-option value="mistake">Tôi đặt nhầm sản phẩm</a-select-option>
            <a-select-option value="payment_issue">Vấn đề về thanh toán</a-select-option>
            <a-select-option value="other">Lý do khác</a-select-option>
          </a-select>
        </a-form-item>
        
        <a-form-item v-if="cancelForm.reason === 'other'" label="Chi tiết">
          <a-textarea 
            v-model:value="cancelForm.detail" 
            :rows="3" 
            placeholder="Vui lòng cho chúng tôi biết lý do bạn muốn hủy đơn hàng..."
          />
        </a-form-item>
      </a-form>
      
      <div class="flex justify-end gap-3 mt-4">
        <a-button @click="cancelOrderModalVisible = false">Không hủy</a-button>
        <a-button 
          type="primary" 
          danger
          @click="confirmCancelOrder"
        >
          Xác nhận hủy đơn
        </a-button>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { 
  ShoppingOutlined,
  StarOutlined,
  FilterOutlined,
  ShoppingCartOutlined,
  EyeOutlined,
  MessageOutlined,
  CopyOutlined,
  CloseOutlined,
  PlusOutlined
} from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// State
const searchTerm = ref('');
const orderStatus = ref('all');
const dateRange = ref([null, null]);
const orders = ref([]);
const currentPage = ref(1);
const pageSize = ref(5);
const totalOrders = ref(0);
const isLoading = ref(false);

// Modal states
const orderDetailVisible = ref(false);
const reviewModalVisible = ref(false);
const previewVisible = ref(false);
const previewImage = ref('');
const issueModalVisible = ref(false);
const cancelOrderModalVisible = ref(false);
const selectedOrder = ref(null);
const selectedProduct = ref(null);

// Form states
const reviewForm = ref({
  rating: 5,
  comment: '',
  images: []
});

const issueForm = ref({
  type: 'damaged',
  description: '',
  images: [],
  requestType: 'refund'
});

const cancelForm = ref({
  reason: 'changed_mind',
  detail: ''
});

// Mock orders data
orders.value = [
  {
    id: 'TT-20230615-001',
    date: '15/06/2023 09:15',
    status: 'pending',
    items: [
      {
        id: 1,
        name: 'iPhone 14 Pro Max 256GB',
        price: 28990000,
        quantity: 1,
        image: 'https://cdn2.cellphones.com.vn/358x358,webp,q100/media/catalog/product/i/p/iphone-14-pro_2__5.jpg',
        variant: { color: 'Deep Purple', size: '256GB' },
        reviewed: false
      }
    ],
    subtotal: 28990000,
    shipping: {
      method: 'Giao hàng nhanh',
      fee: 30000
    },
    payment: {
      method: 'momo',
      status: 'Đã thanh toán',
      transactionId: 'TXN123456789'
    },
    discount: 0,
    total: 29020000,
    timeline: {
      ordered: '15/06/2023 09:15',
    },
    shippingAddress: {
      name: 'Nguyễn Văn A',
      phone: '0987654321',
      address: '123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM'
    },
    note: '',
    hasReported: false
  },
  {
    id: 'TT-20230612-023',
    date: '12/06/2023 16:42',
    status: 'confirmed',
    items: [
      {
        id: 2,
        name: 'Samsung Galaxy S23 Ultra',
        price: 25990000,
        quantity: 1,
        image: 'https://cdn2.cellphones.com.vn/358x358,webp,q100/media/catalog/product/s/2/s23-ultra-tim.png',
        variant: { color: 'Cream', size: '256GB' },
        reviewed: false
      },
      {
        id: 3,
        name: 'Ốp lưng Samsung Galaxy S23 Ultra',
        price: 350000,
        quantity: 1,
        image: 'https://cdn2.cellphones.com.vn/358x358,webp,q100/media/catalog/product/g/r/group_182_2_.png',
        variant: { color: 'Trong suốt', size: '' },
        reviewed: false
      }
    ],
    subtotal: 26340000,
    shipping: {
      method: 'Giao hàng tiêu chuẩn',
      fee: 45000
    },
    payment: {
      method: 'bank',
      status: 'Đã thanh toán',
      transactionId: 'TXN987654321'
    },
    discount: 0,
    total: 26385000,
    timeline: {
      ordered: '12/06/2023 16:42',
      confirmed: '12/06/2023 17:30'
    },
    shippingAddress: {
      name: 'Nguyễn Văn A',
      phone: '0987654321',
      address: '456 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM'
    },
    note: 'Giao hàng ngoài giờ hành chính',
    hasReported: false
  },
  {
    id: 'TT-20230608-018',
    date: '08/06/2023 10:22',
    status: 'shipping',
    items: [
      {
        id: 4,
        name: 'MacBook Air M2 13"',
        price: 27990000,
        quantity: 1,
        image: 'https://cdn2.cellphones.com.vn/358x358,webp,q100/media/catalog/product/m/a/macbook_air_m2.png',
        variant: { color: 'Space Gray', size: '256GB' },
        reviewed: false
      }
    ],
    subtotal: 27990000,
    shipping: {
      method: 'Giao hàng tiêu chuẩn',
      fee: 30000
    },
    payment: {
      method: 'cod',
      status: 'Chưa thanh toán'
    },
    discount: 0,
    total: 28020000,
    timeline: {
      ordered: '08/06/2023 10:22',
      confirmed: '08/06/2023 11:15',
      shipping: '09/06/2023 09:30'
    },
    shippingAddress: {
      name: 'Nguyễn Văn A',
      phone: '0987654321',
      address: '789 Đường 3/2, Phường 11, Quận 10, TP.HCM'
    },
    note: '',
    hasReported: false
  },
  {
    id: 'TT-20230601-042',
    date: '01/06/2023 18:05',
    status: 'completed',
    items: [
      {
        id: 5,
        name: 'Apple Watch Series 7',
        price: 9990000,
        quantity: 1,
        image: 'https://cdn2.cellphones.com.vn/358x358,webp,q100/media/catalog/product/a/p/apple_watch_se_2022_lte_-_viền_nhôm_starlight_dây_quai_thể_thao_starlight.jpg',
        variant: { color: 'Silver', size: '41mm' },
        reviewed: true
      },
      {
        id: 6,
        name: 'Dây đeo Apple Watch Sport Band',
        price: 1190000,
        quantity: 1,
        image: 'https://cdn2.cellphones.com.vn/358x358,webp,q100/media/catalog/product/g/r/group_157_1_12.png',
        variant: { color: 'Blue', size: '41mm' },
        reviewed: false
      }
    ],
    subtotal: 11180000,
    shipping: {
      method: 'Giao hàng tiêu chuẩn',
      fee: 30000
    },
    payment: {
      method: 'credit',
      status: 'Đã thanh toán',
      transactionId: 'TXN456789123'
    },
    discount: 500000,
    total: 10710000,
    timeline: {
      ordered: '01/06/2023 18:05',
      confirmed: '01/06/2023 19:10',
      shipping: '02/06/2023 10:00',
      completed: '03/06/2023 15:22'
    },
    shippingAddress: {
      name: 'Nguyễn Văn A',
      phone: '0987654321',
      address: '101 Đường Hai Bà Trưng, Phường Bến Nghé, Quận 1, TP.HCM'
    },
    note: '',
    hasReported: false
  },
  {
    id: 'TT-20230525-015',
    date: '25/05/2023 09:34',
    status: 'cancelled',
    items: [
      {
        id: 7,
        name: 'iPad Pro 11" M2',
        price: 19990000,
        quantity: 1,
        image: 'https://cdn2.cellphones.com.vn/358x358,webp,q100/media/catalog/product/i/p/ipad-pro-11-m1-wifi-gray-1.jpg',
        variant: { color: 'Space Gray', size: '128GB' },
        reviewed: false
      }
    ],
    subtotal: 19990000,
    shipping: {
      method: 'Giao hàng nhanh',
      fee: 45000
    },
    payment: {
      method: 'zalopay',
      status: 'Đã hoàn tiền'
    },
    discount: 0,
    total: 20035000,
    timeline: {
      ordered: '25/05/2023 09:34',
      cancelled: '25/05/2023 10:15'
    },
    shippingAddress: {
      name: 'Nguyễn Văn A',
      phone: '0987654321',
      address: '202 Đường Nguyễn Trãi, Phường 3, Quận 5, TP.HCM'
    },
    note: 'Hủy theo yêu cầu của khách hàng',
    hasReported: false
  }
];

// Initialize total orders
totalOrders.value = orders.value.length;

// Computed
const filteredOrders = computed(() => {
  let result = [...orders.value];
  
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase();
    result = result.filter(order => order.id.toLowerCase().includes(term));
  }
  
  if (orderStatus.value !== 'all') {
    result = result.filter(order => order.status === orderStatus.value);
  }
  
  // Date filtering would be implemented here
  
  return result;
});

const isReviewValid = computed(() => {
  return reviewForm.value.rating > 0 && reviewForm.value.comment.trim().length > 0;
});

const isIssueFormValid = computed(() => {
  return issueForm.value.description.trim().length > 0;
});

// Methods
onMounted(() => {
  // In a real app, fetch orders from API
  console.log('Order history page mounted');
});

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount);
};

const getStatusText = (status) => {
  switch (status) {
    case 'pending': return 'Chờ xác nhận';
    case 'confirmed': return 'Đã xác nhận';
    case 'shipping': return 'Đang giao hàng';
    case 'completed': return 'Đã nhận hàng';
    case 'cancelled': return 'Đã hủy';
    case 'refund': return 'Hoàn tiền';
    default: return status;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'pending': return 'gold';
    case 'confirmed': return 'blue';
    case 'shipping': return 'processing';
    case 'completed': return 'success';
    case 'cancelled': return 'default';
    case 'refund': return 'error';
    default: return 'default';
  }
};

const getPaymentMethodText = (method) => {
  switch (method) {
    case 'cod': return 'Thanh toán khi nhận hàng';
    case 'bank': return 'Chuyển khoản ngân hàng';
    case 'momo': return 'Ví MoMo';
    case 'zalopay': return 'ZaloPay';
    case 'credit': return 'Thẻ tín dụng/ghi nợ';
    default: return method;
  }
};

const getPaymentStatusClass = (status) => {
  if (status === 'Đã thanh toán' || status === 'Đã hoàn tiền') {
    return 'bg-green-500/20 text-green-500';
  } else if (status === 'Chờ thanh toán') {
    return 'bg-yellow-500/20 text-yellow-500';
  } else if (status === 'Chưa thanh toán') {
    return 'bg-pink-500/20 text-pink-500';
  }
  return 'bg-gray-500/20 text-gray-500';
};

const getVariantText = (variant) => {
  if (!variant) return '';
  
  let text = '';
  
  if (variant.color) {
    text += `Màu: ${variant.color}`;
  }
  
  if (variant.size) {
    if (text) text += ' | ';
    text += `Phiên bản: ${variant.size}`;
  }
  
  return text;
};

const getOrderStepIndex = (status) => {
  switch (status) {
    case 'pending': return 0;
    case 'confirmed': return 1;
    case 'shipping': return 2;
    case 'completed': return 3;
    case 'cancelled': return 0;
    default: return 0;
  }
};

const getStepStatus = (orderStatus, stepName) => {
  if (orderStatus === 'cancelled') {
    if (stepName === 'confirmed') return 'error';
    return 'wait';
  }
  
  const statusOrder = ['pending', 'confirmed', 'shipping', 'completed'];
  const currentIndex = statusOrder.indexOf(orderStatus);
  const stepIndex = statusOrder.indexOf(stepName);
  
  if (stepIndex < currentIndex || orderStatus === stepName) {
    return 'finish';
  } else if (stepIndex === currentIndex + 1) {
    return 'process';
  } else {
    return 'wait';
  }
};

// Actions
const handleSearch = () => {
  // In a real app, this would trigger an API call
  console.log('Searching for:', searchTerm.value);
};

const applyFilters = () => {
  // In a real app, this would trigger an API call with filter params
  console.log('Applying filters');
};

const clearFilters = () => {
  orderStatus.value = 'all';
  dateRange.value = [null, null];
  searchTerm.value = '';
  // In a real app, this would trigger an API call to reset filters
};

const handlePageChange = (page) => {
  currentPage.value = page;
  // In a real app, this would trigger an API call to fetch the next page
};

const copyOrderId = (id) => {
  navigator.clipboard.writeText(id);
  message.success('Đã sao chép mã đơn hàng');
};

const showOrderDetail = (order) => {
  selectedOrder.value = order;
  orderDetailVisible.value = true;
};

const cancelOrder = (order) => {
  selectedOrder.value = order;
  cancelForm.value = { reason: 'changed_mind', detail: '' };
  cancelOrderModalVisible.value = true;
};

const reviewProduct = (product) => {
  selectedProduct.value = product;
  reviewForm.value = { rating: 5, comment: '', images: [] };
  reviewModalVisible.value = true;
};

const viewReview = (product) => {
  message.info(`Xem đánh giá của bạn về sản phẩm ${product.name}`);
  // In a real app, this would open a modal with the existing review
};

const buyAgain = (product) => {
  message.success(`Đã thêm ${product.name} vào giỏ hàng`);
  // In a real app, this would add the product to the cart
};

const confirmReceived = (order) => {
  // In a real app, this would call an API to update the order status
  const index = orders.value.findIndex(o => o.id === order.id);
  if (index !== -1) {
    orders.value[index].status = 'completed';
    orders.value[index].timeline = {
      ...orders.value[index].timeline,
      completed: new Date().toLocaleString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      })
    };
    message.success('Đã xác nhận nhận hàng thành công');
  }
};

const contactSeller = (order) => {
  message.info(`Liên hệ người bán về đơn hàng #${order.id}`);
  // In a real app, this would open a chat with the seller
};

const viewInvoice = (order) => {
  message.info(`Xem hóa đơn đơn hàng #${order.id}`);
  // In a real app, this would open the invoice in a new tab
};

const reportIssue = (order) => {
  selectedOrder.value = order;
  issueForm.value = { type: 'damaged', description: '', images: [], requestType: 'refund' };
  issueModalVisible.value = true;
};

const goToShopping = () => {
  router.push('/');
};

// Modal action handlers
const handleImagePreview = async (file) => {
  // In a real app, this would show a preview of the image
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj);
  }
  previewImage.value = file.url || file.preview;
  previewVisible.value = true;
};

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/');
  if (!isImage) {
    message.error('Bạn chỉ có thể tải lên file ảnh!');
  }
  
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    message.error('Ảnh phải nhỏ hơn 5MB!');
  }
  
  // Return false to stop the default upload behavior
  return false;
};

const submitReview = () => {
  if (!isReviewValid.value) return;
  
  // In a real app, this would submit the review to an API
  const index = orders.value.findIndex(o => o.items.some(item => item.id === selectedProduct.value.id));
  
  if (index !== -1) {
    // Find the item in the order
    const itemIndex = orders.value[index].items.findIndex(item => item.id === selectedProduct.value.id);
    if (itemIndex !== -1) {
      orders.value[index].items[itemIndex].reviewed = true;
    }
  }
  
  message.success('Đánh giá của bạn đã được gửi thành công');
  reviewModalVisible.value = false;
};

const submitIssueReport = () => {
  if (!isIssueFormValid.value) return;
  
  // In a real app, this would submit the issue to an API
  const index = orders.value.findIndex(o => o.id === selectedOrder.value.id);
  
  if (index !== -1) {
    orders.value[index].hasReported = true;
  }
  
  message.success('Báo cáo vấn đề đã được gửi đi, chúng tôi sẽ liên hệ với bạn sớm nhất có thể');
  issueModalVisible.value = false;
};

const confirmCancelOrder = () => {
  // In a real app, this would call an API to cancel the order
  const index = orders.value.findIndex(o => o.id === selectedOrder.value.id);
  
  if (index !== -1) {
    orders.value[index].status = 'cancelled';
    orders.value[index].timeline = {
      ...orders.value[index].timeline,
      cancelled: new Date().toLocaleString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      })
    };
    orders.value[index].note = cancelForm.value.reason === 'other' ? 
      cancelForm.value.detail : 
      `Hủy đơn do: ${cancelForm.value.reason}`;
    
    // If order detail is open, update it too
    if (orderDetailVisible.value && selectedOrder.value?.id === orders.value[index].id) {
      selectedOrder.value = {...orders.value[index]};
    }
  }
  
  message.success('Đơn hàng đã được hủy thành công');
  cancelOrderModalVisible.value = false;
};

const cancelOrderFromDetail = () => {
  cancelOrder(selectedOrder.value);
};

const contactSellerFromDetail = () => {
  contactSeller(selectedOrder.value);
  orderDetailVisible.value = false;
};
</script>

<style scoped>
:deep(.ant-select-selector), 
:deep(.ant-input), 
:deep(.ant-input-search),
:deep(.ant-picker),
:deep(.ant-textarea) {
  background-color: #222 !important;
  border-color: #333 !important;
  color: white !important;
}

:deep(.ant-select-selection-item),
:deep(.ant-picker-input > input) {
  color: white !important;
}

:deep(.ant-radio-button-wrapper) {
  background: #222 !important;
  border-color: #333 !important;
  color: #d9d9d9 !important;
}

:deep(.ant-radio-button-wrapper:not(:first-child)::before) {
  background-color: #333 !important;
}

:deep(.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)) {
  color: white !important;
  background: #ec4899 !important;
  border-color: #ec4899 !important;
}

:deep(.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)::before) {
  background-color: #ec4899 !important;
}

:deep(.ant-modal-content),
:deep(.ant-modal-header) {
  background-color: #121212 !important;
  color: white !important;
}

:deep(.ant-modal-title),
:deep(.ant-form-item-label > label) {
  color: white !important;
}

:deep(.ant-modal-close-x) {
  color: #d9d9d9 !important;
}

:deep(.ant-upload.ant-upload-select-picture-card) {
  background-color: #222 !important;
  border-color: #333 !important;
  color: #d9d9d9 !important;
}

:deep(.ant-upload-list-picture-card-container) {
  background-color: #222 !important;
}

:deep(.ant-tag) {
  border: none;
}

:deep(.ant-radio-wrapper) {
  color: #d9d9d9 !important;
}

:deep(.ant-radio-checked .ant-radio-inner) {
  border-color: #ec4899 !important;
}

:deep(.ant-radio-inner::after) {
  background-color: #ec4899 !important;
}

:deep(.ant-pagination-item),
:deep(.ant-pagination-prev .ant-pagination-item-link),
:deep(.ant-pagination-next .ant-pagination-item-link) {
  background-color: #222 !important;
  border-color: #333 !important;
}

:deep(.ant-pagination-item-active) {
  border-color: #ec4899 !important;
}

:deep(.ant-pagination-item a),
:deep(.ant-pagination-prev .ant-pagination-item-link),
:deep(.ant-pagination-next .ant-pagination-item-link) {
  color: #d9d9d9 !important;
}

:deep(.ant-pagination-item-active a) {
  color: #ec4899 !important;
}

:deep(.ant-rate-star) {
  color: rgba(236, 72, 153, 0.45) !important;
}

:deep(.ant-rate-star-full) {
  color: #ec4899 !important;
}

:deep(.ant-steps-item-process .ant-steps-item-icon) {
  background-color: #ec4899 !important;
  border-color: #ec4899 !important;
}

:deep(.ant-steps-item-finish .ant-steps-item-icon) {
  border-color: #ec4899 !important;
}

:deep(.ant-steps-item-finish .ant-steps-item-icon > .ant-steps-icon) {
  color: #ec4899 !important;
}

:deep(.ant-steps-item-finish > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title::after) {
  background-color: #ec4899 !important;
}
</style>