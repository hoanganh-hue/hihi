<template>
  <div class="min-h-screen bg-black text-white">
    <div class="container mx-auto px-6 py-8">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 class="text-3xl font-bold mb-4 md:mb-0">Quản lý đơn hàng</h1>
        <div class="flex items-center space-x-4">
          <a-input-search
            v-model:value="searchTerm"
            placeholder="Tìm theo mã đơn, sản phẩm, khách hàng..."
            class="w-64"
            @search="handleSearch"
          />
          <a-button
            type="primary"
            class="!rounded-button bg-gradient-to-r from-pink-500 to-purple-600 border-none text-white font-medium"
            @click="refreshOrders"
          >
            <sync-outlined :spin="isLoading" /> Làm mới
          </a-button>
        </div>
      </div>

      <!-- Order statistics -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-[#121212] rounded-xl border border-[#333] hover:border-pink-500/30 transition-colors duration-300 p-4">
          <div class="flex justify-between items-center mb-2">
            <span class="text-gray-400">Tất cả</span>
            <shopping-outlined class="text-gray-400" />
          </div>
          <div class="text-2xl font-bold">{{ orderCounts.all }}</div>
          <div class="text-xs text-gray-400 mt-1">{{ orderCounts.today }} đơn mới hôm nay</div>
        </div>
        <div class="bg-[#121212] rounded-xl border border-[#333] hover:border-pink-500/30 transition-colors duration-300 p-4">
          <div class="flex justify-between items-center mb-2">
            <span class="text-gray-400">Chờ xác nhận</span>
            <clock-circle-outlined class="text-yellow-500" />
          </div>
          <div class="text-2xl font-bold text-yellow-500">{{ orderCounts.pending }}</div>
          <div class="text-xs text-gray-400 mt-1">Cần xử lý trong 24h</div>
        </div>
        <div class="bg-[#121212] rounded-xl border border-[#333] hover:border-pink-500/30 transition-colors duration-300 p-4">
          <div class="flex justify-between items-center mb-2">
            <span class="text-gray-400">Đang giao</span>
            <car-outlined class="text-blue-500" />
          </div>
          <div class="text-2xl font-bold text-blue-500">{{ orderCounts.shipping }}</div>
          <div class="text-xs text-gray-400 mt-1">{{ orderCounts.delivery }} đơn giao hôm nay</div>
        </div>
        <div class="bg-[#121212] rounded-xl border border-[#333] hover:border-pink-500/30 transition-colors duration-300 p-4">
          <div class="flex justify-between items-center mb-2">
            <span class="text-gray-400">Hoàn tiền/Hủy</span>
            <rollback-outlined class="text-red-500" />
          </div>
          <div class="text-2xl font-bold text-red-500">{{ orderCounts.refund }}</div>
          <div class="text-xs text-gray-400 mt-1">{{ orderCounts.refundPending }} đang chờ xử lý</div>
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
            <a-radio-button value="completed">Đã giao</a-radio-button>
            <a-radio-button value="cancelled">Đã hủy</a-radio-button>
            <a-radio-button value="refund">Hoàn tiền</a-radio-button>
          </a-radio-group>
        </div>
        <div class="flex flex-wrap items-center gap-4">
          <div class="w-full md:w-auto flex items-center space-x-2">
            <span class="text-gray-400">Từ ngày:</span>
            <a-date-picker 
              v-model:value="dateRange[0]" 
              class="w-36" 
              format="DD/MM/YYYY"
            />
          </div>
          <div class="w-full md:w-auto flex items-center space-x-2">
            <span class="text-gray-400">Đến ngày:</span>
            <a-date-picker 
              v-model:value="dateRange[1]" 
              class="w-36" 
              format="DD/MM/YYYY" 
            />
          </div>
          <a-select 
            v-model:value="paymentMethod" 
            placeholder="Phương thức thanh toán" 
            class="w-48"
          >
            <a-select-option value="all">Tất cả PTTT</a-select-option>
            <a-select-option value="cod">Tiền mặt (COD)</a-select-option>
            <a-select-option value="bank">Chuyển khoản</a-select-option>
            <a-select-option value="momo">Ví MoMo</a-select-option>
            <a-select-option value="zalopay">ZaloPay</a-select-option>
            <a-select-option value="credit">Thẻ tín dụng</a-select-option>
          </a-select>
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
          <div class="flex-grow"></div>
          <a-button 
            type="default"
            @click="exportOrders"
          >
            <export-outlined /> Xuất Excel
          </a-button>
          <a-button 
            type="default" 
            @click="printOrders"
          >
            <printer-outlined /> In đơn hàng
          </a-button>
        </div>
      </div>

      <!-- Order table -->
      <div class="bg-[#121212] rounded-xl border border-[#333] p-6">
        <a-table
          :dataSource="filteredOrders"
          :columns="orderColumns"
          :loading="isLoading"
          :pagination="{ 
            pageSize: 10,
            total: filteredOrders.length,
            showTotal: total => `Tổng ${total} đơn hàng`
          }"
          class="custom-table"
          :rowClassName="(record) => record.isNew ? 'new-order-row' : ''"
        >
          <template #headerCell="{ column }">
            <template v-if="column.key === 'action'">
              <div class="text-right">Thao tác</div>
            </template>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'order_id'">
              <div>
                <div class="font-medium">{{ record.order_id }}</div>
                <div class="text-xs text-gray-400">{{ record.date }}</div>
              </div>
            </template>
            <template v-if="column.key === 'customer'">
              <div>
                <div class="font-medium">{{ record.customer.name }}</div>
                <div class="text-xs text-gray-400">{{ record.customer.phone }}</div>
              </div>
            </template>
            <template v-if="column.key === 'products'">
              <div>
                <div class="font-medium truncate" style="max-width: 250px;">{{ record.products[0].name }}</div>
                <div class="text-xs text-gray-400">
                  {{ record.products.length > 1 ? `+${record.products.length - 1} sản phẩm khác` : '' }}
                </div>
              </div>
            </template>
            <template v-if="column.key === 'total'">
              <div class="font-medium">{{ formatCurrency(record.total) }}</div>
              <div class="text-xs text-gray-400">{{ getPaymentMethodText(record.payment.method) }}</div>
            </template>
            <template v-if="column.key === 'status'">
              <a-tag :color="getStatusColor(record.status)">
                {{ getStatusText(record.status) }}
              </a-tag>
            </template>
            <template v-if="column.key === 'action'">
              <div class="flex justify-end space-x-2">
                <a-tooltip placement="top" title="Chi tiết">
                  <a-button 
                    type="text" 
                    size="small" 
                    class="text-white"
                    @click="showOrderDetail(record)"
                  >
                    <eye-outlined />
                  </a-button>
                </a-tooltip>
                <a-tooltip placement="top" title="In đơn hàng">
                  <a-button 
                    type="text" 
                    size="small" 
                    class="text-white"
                    @click="printSingleOrder(record)"
                  >
                    <printer-outlined />
                  </a-button>
                </a-tooltip>
                <a-dropdown v-if="record.status !== 'completed' && record.status !== 'cancelled'">
                  <a-button type="text" size="small" class="text-white">
                    <more-outlined />
                  </a-button>
                  <template #overlay>
                    <a-menu>
                      <a-menu-item 
                        v-if="record.status === 'pending'"
                        @click="confirmOrder(record)"
                      >
                        <check-outlined /> Xác nhận đơn
                      </a-menu-item>
                      <a-menu-item 
                        v-if="record.status === 'confirmed'"
                        @click="shipOrder(record)"
                      >
                        <car-outlined /> Giao hàng
                      </a-menu-item>
                      <a-menu-item 
                        v-if="record.status === 'shipping'"
                        @click="completeOrder(record)"
                      >
                        <check-circle-outlined /> Hoàn thành
                      </a-menu-item>
                      <a-menu-item 
                        v-if="['pending', 'confirmed'].includes(record.status)"
                        @click="cancelOrder(record)"
                      >
                        <close-circle-outlined /> Hủy đơn
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </div>
            </template>
          </template>
        </a-table>
      </div>
    </div>

    <!-- Order Detail Modal -->
    <a-modal
      v-model:visible="orderDetailVisible"
      :title="`Chi tiết đơn hàng #${selectedOrder?.order_id}`"
      width="800px"
      :footer="null"
      class="custom-modal"
    >
      <div v-if="selectedOrder">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <div class="mb-4">
              <div class="text-gray-400 mb-1">Mã đơn hàng</div>
              <div class="font-medium">{{ selectedOrder.order_id }}</div>
            </div>
            <div class="mb-4">
              <div class="text-gray-400 mb-1">Ngày đặt hàng</div>
              <div class="font-medium">{{ selectedOrder.date }} {{ selectedOrder.time }}</div>
            </div>
            <div class="mb-4">
              <div class="text-gray-400 mb-1">Trạng thái</div>
              <a-tag :color="getStatusColor(selectedOrder.status)">
                {{ getStatusText(selectedOrder.status) }}
              </a-tag>
            </div>
          </div>
          <div>
            <div class="mb-4">
              <div class="text-gray-400 mb-1">Khách hàng</div>
              <div class="font-medium">{{ selectedOrder.customer.name }}</div>
            </div>
            <div class="mb-4">
              <div class="text-gray-400 mb-1">Số điện thoại</div>
              <div class="font-medium">{{ selectedOrder.customer.phone }}</div>
            </div>
            <div class="mb-4">
              <div class="text-gray-400 mb-1">Email</div>
              <div class="font-medium">{{ selectedOrder.customer.email || 'Không có' }}</div>
            </div>
          </div>
        </div>

        <div class="mb-6">
          <div class="text-gray-400 mb-1">Địa chỉ giao hàng</div>
          <div class="font-medium">{{ selectedOrder.shipping.address }}</div>
        </div>

        <div class="mb-6">
          <div class="mb-2 font-medium">Danh sách sản phẩm</div>
          <div class="border border-[#333] rounded-lg overflow-hidden">
            <table class="min-w-full">
              <thead class="bg-[#1a1a1a]">
                <tr>
                  <th class="px-4 py-3 text-left text-sm font-medium text-gray-400">Sản phẩm</th>
                  <th class="px-4 py-3 text-center text-sm font-medium text-gray-400">Số lượng</th>
                  <th class="px-4 py-3 text-center text-sm font-medium text-gray-400">Đơn giá</th>
                  <th class="px-4 py-3 text-right text-sm font-medium text-gray-400">Thành tiền</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#333]">
                <tr v-for="(product, index) in selectedOrder.products" :key="index">
                  <td class="px-4 py-3 text-sm">
                    <div class="flex items-center">
                      <div class="w-10 h-10 rounded bg-[#333] overflow-hidden mr-3">
                        <img v-if="product.image" :src="product.image" class="w-full h-full object-cover">
                      </div>
                      <div>
                        <div class="font-medium">{{ product.name }}</div>
                        <div class="text-xs text-gray-400">{{ product.sku || '' }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-sm text-center">{{ product.quantity }}</td>
                  <td class="px-4 py-3 text-sm text-center">{{ formatCurrency(product.price) }}</td>
                  <td class="px-4 py-3 text-sm text-right">{{ formatCurrency(product.price * product.quantity) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div class="mb-4">
              <div class="text-gray-400 mb-1">Phương thức thanh toán</div>
              <div class="font-medium">{{ getPaymentMethodText(selectedOrder.payment.method) }}</div>
              <div class="text-xs text-gray-400">{{ selectedOrder.payment.status }}</div>
            </div>
            <div class="mb-4">
              <div class="text-gray-400 mb-1">Ghi chú</div>
              <div class="font-medium">{{ selectedOrder.note || 'Không có' }}</div>
            </div>
          </div>
          <div>
            <div class="bg-[#1a1a1a] p-4 rounded-lg">
              <div class="flex justify-between mb-2">
                <div class="text-gray-400">Tạm tính</div>
                <div>{{ formatCurrency(selectedOrder.subtotal) }}</div>
              </div>
              <div class="flex justify-between mb-2">
                <div class="text-gray-400">Phí vận chuyển</div>
                <div>{{ formatCurrency(selectedOrder.shipping.fee) }}</div>
              </div>
              <div class="flex justify-between mb-2" v-if="selectedOrder.discount">
                <div class="text-gray-400">Giảm giá</div>
                <div>-{{ formatCurrency(selectedOrder.discount) }}</div>
              </div>
              <div class="flex justify-between pt-2 border-t border-[#333] text-lg font-medium">
                <div>Tổng cộng</div>
                <div>{{ formatCurrency(selectedOrder.total) }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-between mt-6">
          <div>
            <a-button 
              v-if="selectedOrder.status === 'pending'" 
              danger
              @click="cancelOrder(selectedOrder)"
            >
              Hủy đơn hàng
            </a-button>
          </div>
          <div class="space-x-2">
            <a-button @click="orderDetailVisible = false">Đóng</a-button>
            <a-button 
              type="primary" 
              class="bg-gradient-to-r from-pink-500 to-purple-600 border-none"
              @click="updateOrderStatus"
              v-if="canUpdateStatus"
            >
              {{ getNextStatusAction() }}
            </a-button>
          </div>
        </div>
      </div>
    </a-modal>

    <!-- Order Cancel Modal -->
    <a-modal
      v-model:visible="cancelModalVisible"
      title="Hủy đơn hàng"
      :footer="null"
      class="custom-modal"
    >
      <div>
        <p class="mb-4">Bạn có chắc chắn muốn hủy đơn hàng này không?</p>
        <a-form layout="vertical">
          <a-form-item label="Lý do hủy đơn">
            <a-select v-model:value="cancelReason" placeholder="Chọn lý do hủy">
              <a-select-option value="out_of_stock">Hết hàng</a-select-option>
              <a-select-option value="customer_request">Theo yêu cầu khách hàng</a-select-option>
              <a-select-option value="address_issue">Địa chỉ không hợp lệ</a-select-option>
              <a-select-option value="delivery_issue">Không thể giao hàng</a-select-option>
              <a-select-option value="other">Lý do khác</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="Ghi chú" v-if="cancelReason === 'other'">
            <a-textarea v-model:value="cancelNote" placeholder="Nhập lý do hủy đơn" rows="3" />
          </a-form-item>
        </a-form>
        <div class="flex justify-end mt-4 gap-2">
          <a-button @click="cancelModalVisible = false">Không</a-button>
          <a-button 
            type="primary" 
            danger
            @click="confirmCancelOrder"
          >
            Xác nhận hủy
          </a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import {
  SyncOutlined,
  EyeOutlined,
  PrinterOutlined,
  ExportOutlined,
  FilterOutlined,
  MoreOutlined,
  ShoppingOutlined,
  ClockCircleOutlined,
  CarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  RollbackOutlined,
  CheckOutlined
} from '@ant-design/icons-vue';

// State
const searchTerm = ref('');
const isLoading = ref(false);
const orderStatus = ref('all');
const paymentMethod = ref('all');
const dateRange = ref([null, null]);
const orders = ref([]);
const selectedOrder = ref(null);
const orderDetailVisible = ref(false);
const cancelModalVisible = ref(false);
const cancelReason = ref('');
const cancelNote = ref('');

// Mock data
const orderCounts = ref({
  all: 253,
  today: 12,
  pending: 18,
  shipping: 42,
  delivery: 8,
  refund: 5,
  refundPending: 2
});

// Table columns
const orderColumns = [
  {
    title: 'Mã đơn hàng',
    key: 'order_id',
  },
  {
    title: 'Khách hàng',
    key: 'customer',
  },
  {
    title: 'Sản phẩm',
    key: 'products',
  },
  {
    title: 'Tổng tiền',
    key: 'total',
  },
  {
    title: 'Trạng thái',
    key: 'status',
  },
  {
    title: 'Thao tác',
    key: 'action',
  }
];

// Mock orders data
orders.value = [
  {
    key: '1',
    order_id: 'TT-20230615-001',
    date: '15/06/2023',
    time: '09:15:22',
    isNew: true,
    customer: {
      name: 'Nguyễn Văn A',
      phone: '0987654321',
      email: 'nguyenvana@email.com'
    },
    products: [
      {
        id: 1,
        name: 'iPhone 13 Pro Max 256GB',
        price: 28990000,
        quantity: 1,
        sku: 'IP13PM-256',
        image: '/images/iphone13promax.jpg'
      }
    ],
    subtotal: 28990000,
    shipping: {
      method: 'standard',
      fee: 30000,
      address: '123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM'
    },
    payment: {
      method: 'momo',
      status: 'Đã thanh toán'
    },
    discount: 0,
    total: 29020000,
    status: 'pending',
    note: ''
  },
  {
    key: '2',
    order_id: 'TT-20230614-023',
    date: '14/06/2023',
    time: '16:42:10',
    isNew: true,
    customer: {
      name: 'Trần Thị B',
      phone: '0912345678',
      email: 'tranthib@email.com'
    },
    products: [
      {
        id: 2,
        name: 'Samsung Galaxy S22 Ultra',
        price: 25990000,
        quantity: 1,
        sku: 'SGS22U-256',
        image: '/images/galaxys22ultra.jpg'
      },
      {
        id: 3,
        name: 'Ốp lưng Samsung Galaxy S22 Ultra',
        price: 350000,
        quantity: 1,
        sku: 'CASE-S22U',
        image: '/images/cases22u.jpg'
      }
    ],
    subtotal: 26340000,
    shipping: {
      method: 'express',
      fee: 45000,
      address: '456 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM'
    },
    payment: {
      method: 'bank',
      status: 'Đã thanh toán'
    },
    discount: 0,
    total: 26385000,
    status: 'confirmed',
    note: 'Giao hàng ngoài giờ hành chính'
  },
  {
    key: '3',
    order_id: 'TT-20230614-018',
    date: '14/06/2023',
    time: '10:22:47',
    isNew: false,
    customer: {
      name: 'Lê Văn C',
      phone: '0978123456',
      email: ''
    },
    products: [
      {
        id: 4,
        name: 'MacBook Air M2 13"',
        price: 27990000,
        quantity: 1,
        sku: 'MBA-M2-256',
        image: '/images/macbookair.jpg'
      }
    ],
    subtotal: 27990000,
    shipping: {
      method: 'standard',
      fee: 30000,
      address: '789 Đường 3/2, Phường 11, Quận 10, TP.HCM'
    },
    payment: {
      method: 'cod',
      status: 'Chưa thanh toán'
    },
    discount: 0,
    total: 28020000,
    status: 'shipping',
    note: ''
  },
  {
    key: '4',
    order_id: 'TT-20230613-042',
    date: '13/06/2023',
    time: '18:05:33',
    isNew: false,
    customer: {
      name: 'Phạm Thị D',
      phone: '0934567890',
      email: 'phamthid@email.com'
    },
    products: [
      {
        id: 5,
        name: 'Apple Watch Series 7',
        price: 9990000,
        quantity: 1,
        sku: 'AW-S7-41',
        image: '/images/applewatch.jpg'
      },
      {
        id: 6,
        name: 'Dây đeo Apple Watch Sport Band',
        price: 1190000,
        quantity: 1,
        sku: 'AW-BAND-1',
        image: '/images/awband.jpg'
      }
    ],
    subtotal: 11180000,
    shipping: {
      method: 'standard',
      fee: 30000,
      address: '101 Đường Hai Bà Trưng, Phường Bến Nghé, Quận 1, TP.HCM'
    },
    payment: {
      method: 'credit',
      status: 'Đã thanh toán'
    },
    discount: 500000,
    total: 10710000,
    status: 'completed',
    note: ''
  },
  {
    key: '5',
    order_id: 'TT-20230612-015',
    date: '12/06/2023',
    time: '09:34:21',
    isNew: false,
    customer: {
      name: 'Hoàng Văn E',
      phone: '0945678901',
      email: 'hoangvane@email.com'
    },
    products: [
      {
        id: 7,
        name: 'iPad Pro 11" M2',
        price: 19990000,
        quantity: 1,
        sku: 'IPR-11-M2-128',
        image: '/images/ipadpro.jpg'
      }
    ],
    subtotal: 19990000,
    shipping: {
      method: 'express',
      fee: 45000,
      address: '202 Đường Nguyễn Trãi, Phường 3, Quận 5, TP.HCM'
    },
    payment: {
      method: 'zalopay',
      status: 'Đã thanh toán'
    },
    discount: 0,
    total: 20035000,
    status: 'cancelled',
    note: 'Hủy theo yêu cầu của khách hàng'
  },
  {
    key: '6',
    order_id: 'TT-20230612-009',
    date: '12/06/2023',
    time: '08:15:40',
    isNew: false,
    customer: {
      name: 'Ngô Thị F',
      phone: '0901234567',
      email: 'ngothif@email.com'
    },
    products: [
      {
        id: 8,
        name: 'AirPods Pro 2',
        price: 5990000,
        quantity: 1,
        sku: 'APP-2',
        image: '/images/airpodspro.jpg'
      }
    ],
    subtotal: 5990000,
    shipping: {
      method: 'standard',
      fee: 30000,
      address: '303 Đường Điện Biên Phủ, Phường 15, Quận Bình Thạnh, TP.HCM'
    },
    payment: {
      method: 'momo',
      status: 'Đã thanh toán'
    },
    discount: 0,
    total: 6020000,
    status: 'refund',
    note: 'Sản phẩm lỗi, khách hàng yêu cầu hoàn tiền'
  }
];

// Computed properties
const filteredOrders = computed(() => {
  let result = [...orders.value];
  
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase();
    result = result.filter(order => 
      order.order_id.toLowerCase().includes(term) ||
      order.customer.name.toLowerCase().includes(term) ||
      order.customer.phone.includes(term) ||
      order.products.some(p => p.name.toLowerCase().includes(term))
    );
  }
  
  if (orderStatus.value !== 'all') {
    result = result.filter(order => order.status === orderStatus.value);
  }
  
  if (paymentMethod.value !== 'all') {
    result = result.filter(order => order.payment.method === paymentMethod.value);
  }
  
  // Date range filtering would go here
  
  return result;
});

const canUpdateStatus = computed(() => {
  if (!selectedOrder.value) return false;
  const status = selectedOrder.value.status;
  return status === 'pending' || status === 'confirmed' || status === 'shipping';
});

// Methods
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
    case 'completed': return 'Đã giao hàng';
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
    case 'cod': return 'Thanh toán khi nhận hàng (COD)';
    case 'bank': return 'Chuyển khoản ngân hàng';
    case 'momo': return 'Ví MoMo';
    case 'zalopay': return 'ZaloPay';
    case 'credit': return 'Thẻ tín dụng/ghi nợ';
    default: return method;
  }
};

const getNextStatusText = () => {
  if (!selectedOrder.value) return '';
  
  switch (selectedOrder.value.status) {
    case 'pending': return 'Đã xác nhận';
    case 'confirmed': return 'Đang giao hàng';
    case 'shipping': return 'Đã giao hàng';
    default: return '';
  }
};

const getNextStatusAction = () => {
  if (!selectedOrder.value) return '';
  
  switch (selectedOrder.value.status) {
    case 'pending': return 'Xác nhận đơn hàng';
    case 'confirmed': return 'Bắt đầu giao hàng';
    case 'shipping': return 'Hoàn thành đơn hàng';
    default: return '';
  }
};

const handleSearch = () => {
  console.log('Searching for:', searchTerm.value);
  // In a real app, this might trigger an API call
};

const refreshOrders = () => {
  isLoading.value = true;
  // Simulate API call
  setTimeout(() => {
    message.success('Đã cập nhật danh sách đơn hàng');
    isLoading.value = false;
  }, 1000);
};

const applyFilters = () => {
  console.log('Filters applied');
  // In a real app, this might trigger an API call with filter params
};

const clearFilters = () => {
  orderStatus.value = 'all';
  paymentMethod.value = 'all';
  dateRange.value = [null, null];
  searchTerm.value = '';
};

const exportOrders = () => {
  message.success('Đang xuất dữ liệu đơn hàng ra Excel');
  // In a real app, this would trigger an export function
};

const printOrders = () => {
  message.success('Đang chuẩn bị in đơn hàng');
  // In a real app, this would open a print dialog
};

const printSingleOrder = (order) => {
  message.success(`Đang chuẩn bị in đơn hàng #${order.order_id}`);
  // In a real app, this would open a print dialog for a specific order
};

const showOrderDetail = (order) => {
  selectedOrder.value = {...order};
  orderDetailVisible.value = true;
};

const updateOrderStatus = () => {
  if (!selectedOrder.value) return;
  
  const currentStatus = selectedOrder.value.status;
  let newStatus;
  
  switch (currentStatus) {
    case 'pending':
      newStatus = 'confirmed';
      break;
    case 'confirmed':
      newStatus = 'shipping';
      break;
    case 'shipping':
      newStatus = 'completed';
      break;
    default:
      return;
  }
  
  // Update the order status
  const orderIndex = orders.value.findIndex(o => o.key === selectedOrder.value.key);
  if (orderIndex !== -1) {
    orders.value[orderIndex].status = newStatus;
    selectedOrder.value.status = newStatus;
    message.success(`Đã cập nhật trạng thái đơn hàng thành "${getStatusText(newStatus)}"`);
  }
};

const cancelOrder = (order) => {
  selectedOrder.value = {...order};
  cancelReason.value = '';
  cancelNote.value = '';
  cancelModalVisible.value = true;
};

const confirmOrder = (order) => {
  const orderIndex = orders.value.findIndex(o => o.key === order.key);
  if (orderIndex !== -1) {
    orders.value[orderIndex].status = 'confirmed';
    message.success(`Đã xác nhận đơn hàng #${order.order_id}`);
  }
};

const shipOrder = (order) => {
  const orderIndex = orders.value.findIndex(o => o.key === order.key);
  if (orderIndex !== -1) {
    orders.value[orderIndex].status = 'shipping';
    message.success(`Đã chuyển đơn hàng #${order.order_id} sang trạng thái đang giao hàng`);
  }
};

const completeOrder = (order) => {
  const orderIndex = orders.value.findIndex(o => o.key === order.key);
  if (orderIndex !== -1) {
    orders.value[orderIndex].status = 'completed';
    message.success(`Đã hoàn thành đơn hàng #${order.order_id}`);
  }
};

const confirmCancelOrder = () => {
  if (!selectedOrder.value) {
    cancelModalVisible.value = false;
    return;
  }
  
  const orderIndex = orders.value.findIndex(o => o.key === selectedOrder.value.key);
  if (orderIndex !== -1) {
    orders.value[orderIndex].status = 'cancelled';
    orders.value[orderIndex].note = cancelReason.value === 'other' ? cancelNote.value : getCancelReasonText(cancelReason.value);
    message.success(`Đã hủy đơn hàng #${selectedOrder.value.order_id}`);
    
    if (orderDetailVisible.value) {
      selectedOrder.value.status = 'cancelled';
    }
  }
  
  cancelModalVisible.value = false;
};

const getCancelReasonText = (reason) => {
  switch (reason) {
    case 'out_of_stock': return 'Hết hàng';
    case 'customer_request': return 'Theo yêu cầu khách hàng';
    case 'address_issue': return 'Địa chỉ không hợp lệ';
    case 'delivery_issue': return 'Không thể giao hàng';
    case 'other': return cancelNote.value;
    default: return '';
  }
};

// Lifecycle hooks
onMounted(() => {
  // In real implementation, fetch orders data
  console.log('Orders page mounted');
});
</script>

<style scoped>
:deep(.custom-table) {
  background-color: transparent !important;
}

:deep(.ant-table) {
  background-color: transparent !important;
  color: white !important;
}

:deep(.ant-table-thead > tr > th) {
  background-color: #1a1a1a !important;
  color: #d9d9d9 !important;
  border-bottom: 1px solid #333 !important;
}

:deep(.ant-table-tbody > tr > td) {
  border-bottom: 1px solid #333 !important;
}

:deep(.ant-table-tbody > tr.ant-table-row:hover > td) {
  background-color: #1a1a1a !important;
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

:deep(.ant-select-selector),
:deep(.ant-input),
:deep(.ant-picker) {
  background-color: #222 !important;
  border-color: #333 !important;
  color: white !important;
}

:deep(.ant-select-arrow),
:deep(.ant-picker-suffix) {
  color: #d9d9d9 !important;
}

:deep(.ant-select-selection-item) {
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

:deep(.ant-tag) {
  border: none;
}

:deep(.ant-menu) {
  background-color: #222 !important;
  color: white !important;
}

:deep(.ant-menu-item:hover) {
  background-color: #333 !important;
}

:deep(.ant-dropdown-menu) {
  background-color: #222 !important;
}

:deep(.ant-dropdown-menu-item) {
  color: white !important;
}

:deep(.ant-dropdown-menu-item:hover) {
  background-color: #333 !important;
}

:deep(.ant-dropdown-menu-item > .anticon) {
  color: #d9d9d9 !important;
}

.new-order-row {
  background-color: rgba(236, 72, 153, 0.05);
}
</style>