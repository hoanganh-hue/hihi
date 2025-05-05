<template>
  <div class="min-h-screen bg-black text-white">
    <div class="container mx-auto px-6 py-8">
      <h1 class="text-3xl font-bold mb-8">Quản lý đơn hàng</h1>
      
      <!-- Thanh tìm kiếm và lọc -->
      <div class="bg-[#121212] rounded-xl border border-[#333] p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <a-input-search
              v-model:value="searchText"
              placeholder="Tìm kiếm đơn hàng"
              class="w-full bg-[#222] border-[#333]"
              @search="handleSearch"
            >
              <template #prefix>
                <search-outlined class="text-gray-400" />
              </template>
            </a-input-search>
          </div>
          <div>
            <a-select
              v-model:value="statusFilter"
              placeholder="Lọc theo trạng thái"
              class="w-full custom-select"
              @change="handleStatusFilter"
            >
              <a-select-option value="">Tất cả trạng thái</a-select-option>
              <a-select-option value="pending">Chờ xử lý</a-select-option>
              <a-select-option value="processing">Đang xử lý</a-select-option>
              <a-select-option value="shipping">Đang giao</a-select-option>
              <a-select-option value="completed">Hoàn thành</a-select-option>
              <a-select-option value="cancelled">Đã hủy</a-select-option>
            </a-select>
          </div>
          <div>
            <a-range-picker
              v-model:value="dateRange"
              format="DD/MM/YYYY"
              class="w-full custom-date-picker"
              :placeholder="['Từ ngày', 'Đến ngày']"
              @change="handleDateRangeChange"
            />
          </div>
          <div>
            <a-button 
              class="w-full !rounded-button bg-[#222] border-[#333] text-gray-300 hover:border-pink-500 hover:text-pink-500"
              @click="handleFilter"
            >
              <filter-outlined />
              Lọc đơn hàng
            </a-button>
          </div>
        </div>
      </div>
      
      <!-- Tab trạng thái -->
      <div class="mb-8">
        <a-tabs v-model:activeKey="activeTabKey" class="custom-tabs">
          <a-tab-pane key="all" tab="Tất cả đơn hàng" />
          <a-tab-pane key="pending" tab="Chờ xử lý" />
          <a-tab-pane key="processing" tab="Đang xử lý" />
          <a-tab-pane key="shipping" tab="Đang giao" />
          <a-tab-pane key="completed" tab="Hoàn thành" />
          <a-tab-pane key="cancelled" tab="Đã hủy" />
        </a-tabs>
      </div>
      
      <!-- Bảng đơn hàng -->
      <div class="bg-[#121212] rounded-xl border border-[#333] overflow-hidden">
        <div v-if="loading" class="py-16 flex justify-center">
          <a-spin size="large" />
        </div>
        
        <template v-else>
          <div class="overflow-x-auto">
            <table class="w-full table-fixed">
              <thead>
                <tr class="bg-[#1a1a1a] border-b border-[#333]">
                  <th class="py-4 px-6 text-left w-32">Mã đơn hàng</th>
                  <th class="py-4 px-6 text-left">Khách hàng</th>
                  <th class="py-4 px-6 text-right w-36">Tổng tiền</th>
                  <th class="py-4 px-6 text-center w-36">Ngày đặt</th>
                  <th class="py-4 px-6 text-center w-36">Trạng thái</th>
                  <th class="py-4 px-6 text-center w-40">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in orders" :key="order.id" class="border-b border-[#333] hover:bg-[#1a1a1a]">
                  <td class="py-4 px-6 font-medium">{{ order.code }}</td>
                  <td class="py-4 px-6">
                    <div>
                      <div class="font-medium">{{ order.customer.name }}</div>
                      <div class="text-gray-400 text-sm">{{ order.customer.phone }}</div>
                    </div>
                  </td>
                  <td class="py-4 px-6 text-right text-pink-500 font-medium">{{ formatPrice(order.total) }}</td>
                  <td class="py-4 px-6 text-center text-gray-300">{{ order.date }}</td>
                  <td class="py-4 px-6 text-center">
                    <a-tag :color="getOrderStatusColor(order.status)">
                      {{ getOrderStatusText(order.status) }}
                    </a-tag>
                  </td>
                  <td class="py-4 px-6 text-center">
                    <div class="flex justify-center space-x-2">
                      <a-button 
                        class="!rounded-button bg-[#222] border-[#333] text-gray-300"
                        @click="viewOrderDetails(order)"
                      >
                        <eye-outlined />
                        Chi tiết
                      </a-button>
                      <a-dropdown :trigger="['click']">
                        <a-button class="!rounded-button bg-[#222] border-[#333] text-gray-300">
                          <template #icon><more-outlined /></template>
                        </a-button>
                        <template #overlay>
                          <a-menu class="custom-dropdown-menu">
                            <a-menu-item @click="updateOrderStatus(order, 'processing')">
                              <check-circle-outlined /> Xác nhận
                            </a-menu-item>
                            <a-menu-item @click="updateOrderStatus(order, 'shipping')">
                              <car-outlined /> Đang giao hàng
                            </a-menu-item>
                            <a-menu-item @click="updateOrderStatus(order, 'completed')">
                              <check-outlined /> Hoàn thành
                            </a-menu-item>
                            <a-menu-item @click="showCancelConfirm(order)">
                              <close-circle-outlined /> Hủy đơn
                            </a-menu-item>
                          </a-menu>
                        </template>
                      </a-dropdown>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Pagination -->
          <div class="p-6 flex justify-between items-center border-t border-[#333]">
            <div>
              <span class="text-gray-400">Hiển thị {{ startItem }}-{{ endItem }} của {{ totalItems }} đơn hàng</span>
            </div>
            <a-pagination
              v-model:current="currentPage"
              :total="totalItems"
              :page-size="pageSize"
              @change="handlePageChange"
              class="custom-pagination"
            />
          </div>
        </template>
      </div>
    </div>
    
    <!-- Xem chi tiết đơn hàng Modal -->
    <a-modal
      v-model:visible="orderDetailsVisible"
      title="Chi tiết đơn hàng"
      :width="800"
      :footer="null"
      class="custom-modal"
    >
      <div v-if="selectedOrder">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <!-- Thông tin đơn hàng -->
          <div class="bg-[#222] p-4 rounded-xl">
            <h3 class="font-medium mb-3">Thông tin đơn hàng</h3>
            <div class="text-gray-300">
              <p><span class="text-gray-400">Mã đơn hàng:</span> {{ selectedOrder.code }}</p>
              <p><span class="text-gray-400">Ngày đặt:</span> {{ selectedOrder.date }}</p>
              <p><span class="text-gray-400">Trạng thái:</span> 
                <a-tag :color="getOrderStatusColor(selectedOrder.status)">
                  {{ getOrderStatusText(selectedOrder.status) }}
                </a-tag>
              </p>
              <p><span class="text-gray-400">Phương thức thanh toán:</span> {{ selectedOrder.paymentMethod }}</p>
            </div>
          </div>
          
          <!-- Thông tin khách hàng -->
          <div class="bg-[#222] p-4 rounded-xl">
            <h3 class="font-medium mb-3">Thông tin khách hàng</h3>
            <div class="text-gray-300">
              <p><span class="text-gray-400">Họ tên:</span> {{ selectedOrder.customer.name }}</p>
              <p><span class="text-gray-400">Số điện thoại:</span> {{ selectedOrder.customer.phone }}</p>
              <p><span class="text-gray-400">Email:</span> {{ selectedOrder.customer.email }}</p>
              <p><span class="text-gray-400">Địa chỉ:</span> {{ selectedOrder.customer.address }}</p>
            </div>
          </div>
        </div>
        
        <!-- Sản phẩm đã đặt -->
        <div class="mb-6">
          <h3 class="font-medium mb-3">Sản phẩm đã đặt</h3>
          <div class="bg-[#222] rounded-xl overflow-hidden">
            <table class="w-full">
              <thead>
                <tr class="bg-[#1a1a1a] border-b border-[#333]">
                  <th class="p-3 text-left">Sản phẩm</th>
                  <th class="p-3 text-center w-24">Số lượng</th>
                  <th class="p-3 text-right w-32">Đơn giá</th>
                  <th class="p-3 text-right w-32">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in selectedOrder.items" :key="index" class="border-b border-[#333]">
                  <td class="p-3">
                    <div class="flex items-center">
                      <div class="w-12 h-12 rounded-lg bg-[#333] overflow-hidden mr-3">
                        <img :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div class="font-medium">{{ item.name }}</div>
                        <div v-if="item.variant" class="text-gray-400 text-sm">{{ item.variant }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="p-3 text-center">{{ item.quantity }}</td>
                  <td class="p-3 text-right">{{ formatPrice(item.price) }}</td>
                  <td class="p-3 text-right text-pink-500 font-medium">{{ formatPrice(item.price * item.quantity) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Tóm tắt đơn hàng -->
        <div class="bg-[#222] p-4 rounded-xl mb-6">
          <h3 class="font-medium mb-3">Tóm tắt đơn hàng</h3>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-400">Tạm tính:</span>
              <span>{{ formatPrice(selectedOrder.subtotal) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">Phí vận chuyển:</span>
              <span>{{ formatPrice(selectedOrder.shipping) }}</span>
            </div>
            <div v-if="selectedOrder.discount" class="flex justify-between">
              <span class="text-gray-400">Giảm giá:</span>
              <span class="text-pink-500">-{{ formatPrice(selectedOrder.discount) }}</span>
            </div>
            <div class="flex justify-between pt-2 border-t border-[#333] text-lg font-medium">
              <span>Tổng tiền:</span>
              <span class="text-pink-500">{{ formatPrice(selectedOrder.total) }}</span>
            </div>
          </div>
        </div>
        
        <!-- Lịch sử đơn hàng -->
        <div class="bg-[#222] p-4 rounded-xl">
          <h3 class="font-medium mb-3">Lịch sử đơn hàng</h3>
          <a-timeline class="custom-timeline">
            <a-timeline-item v-for="(history, index) in selectedOrder.history" :key="index">
              <div class="text-gray-300">
                <p class="font-medium">{{ history.status }}</p>
                <p class="text-gray-400 text-sm">{{ history.date }} - {{ history.time }}</p>
                <p v-if="history.note" class="mt-1">{{ history.note }}</p>
              </div>
            </a-timeline-item>
          </a-timeline>
        </div>
        
        <!-- Action buttons -->
        <div class="mt-6 flex justify-end gap-4">
          <a-button 
            class="!rounded-button bg-[#222] border-[#333] text-gray-300"
            @click="orderDetailsVisible = false"
          >
            Đóng
          </a-button>
          <a-button 
            type="primary" 
            class="!rounded-button bg-gradient-to-r from-pink-500 to-purple-600 border-none text-white font-medium"
            @click="printOrder"
          >
            <printer-outlined />
            In đơn hàng
          </a-button>
        </div>
      </div>
    </a-modal>
    
    <!-- Hủy đơn hàng Modal -->
    <a-modal
      v-model:visible="cancelOrderVisible"
      title="Xác nhận hủy đơn hàng"
      @ok="confirmCancelOrder"
      okText="Xác nhận hủy"
      cancelText="Đóng"
      class="custom-modal"
    >
      <p>Bạn có chắc chắn muốn hủy đơn hàng {{ orderToCancel?.code }} không?</p>
      <a-form-item label="Lý do hủy đơn hàng" class="mt-4">
        <a-textarea v-model:value="cancelReason" :rows="4" placeholder="Nhập lý do hủy đơn hàng..." />
      </a-form-item>
    </a-modal>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { 
  SearchOutlined, 
  FilterOutlined, 
  EyeOutlined, 
  MoreOutlined,
  CheckCircleOutlined,
  CarOutlined,
  CheckOutlined,
  CloseCircleOutlined,
  PrinterOutlined
} from '@ant-design/icons-vue';
import { formatCurrency } from '../../lib/formatters';

export default {
  name: 'SellerOrdersPage',
  components: {
    SearchOutlined,
    FilterOutlined,
    EyeOutlined,
    MoreOutlined,
    CheckCircleOutlined,
    CarOutlined,
    CheckOutlined,
    CloseCircleOutlined,
    PrinterOutlined
  },
  setup() {
    // State
    const searchText = ref('');
    const statusFilter = ref('');
    const dateRange = ref(null);
    const activeTabKey = ref('all');
    const loading = ref(false);
    const currentPage = ref(1);
    const pageSize = ref(10);
    const totalItems = ref(45);
    
    // Modal state
    const orderDetailsVisible = ref(false);
    const cancelOrderVisible = ref(false);
    const selectedOrder = ref(null);
    const orderToCancel = ref(null);
    const cancelReason = ref('');
    
    // Computed
    const startItem = computed(() => (currentPage.value - 1) * pageSize.value + 1);
    const endItem = computed(() => Math.min(currentPage.value * pageSize.value, totalItems.value));
    
    // Mock data
    const orders = ref([
      {
        id: 1,
        code: "TS12345",
        date: "15/06/2023",
        status: "pending",
        total: 1590000,
        subtotal: 1560000,
        shipping: 30000,
        discount: 0,
        paymentMethod: "COD - Thanh toán khi nhận hàng",
        customer: {
          name: "Nguyễn Văn A",
          phone: "0901234567",
          email: "nguyenvana@example.com",
          address: "123 Đường ABC, Quận 1, TP.HCM"
        },
        items: [
          {
            name: "Điện thoại Samsung Galaxy S21",
            price: 15990000,
            quantity: 1,
            image: "https://picsum.photos/200/200?random=1"
          }
        ],
        history: [
          {
            status: "Đơn hàng đã được tạo",
            date: "15/06/2023",
            time: "14:30:25"
          }
        ]
      },
      {
        id: 2,
        code: "TS12346",
        date: "14/06/2023",
        status: "processing",
        total: 3450000,
        subtotal: 3420000,
        shipping: 30000,
        discount: 0,
        paymentMethod: "Chuyển khoản ngân hàng",
        customer: {
          name: "Trần Thị B",
          phone: "0912345678",
          email: "tranthib@example.com",
          address: "456 Đường XYZ, Quận 2, TP.HCM"
        },
        items: [
          {
            name: "Tai nghe Bluetooth Apple AirPods Pro",
            price: 4990000,
            quantity: 1,
            image: "https://picsum.photos/200/200?random=2"
          }
        ],
        history: [
          {
            status: "Đơn hàng đã được tạo",
            date: "14/06/2023",
            time: "10:15:40"
          },
          {
            status: "Đơn hàng đã được xác nhận",
            date: "14/06/2023",
            time: "11:30:22"
          }
        ]
      },
      {
        id: 3,
        code: "TS12347",
        date: "13/06/2023",
        status: "shipping",
        total: 2980000,
        subtotal: 2950000,
        shipping: 30000,
        discount: 0,
        paymentMethod: "COD - Thanh toán khi nhận hàng",
        customer: {
          name: "Lê Văn C",
          phone: "0978123456",
          email: "levanc@example.com",
          address: "789 Đường KLM, Quận 7, TP.HCM"
        },
        items: [
          {
            name: "Smartwatch Apple Watch Series 7",
            price: 9990000,
            quantity: 1,
            image: "https://picsum.photos/200/200?random=4"
          }
        ],
        history: [
          {
            status: "Đơn hàng đã được tạo",
            date: "13/06/2023",
            time: "09:45:30"
          },
          {
            status: "Đơn hàng đã được xác nhận",
            date: "13/06/2023",
            time: "10:20:15"
          },
          {
            status: "Đang giao hàng",
            date: "14/06/2023",
            time: "08:30:00",
            note: "Đơn hàng đã được giao cho đơn vị vận chuyển"
          }
        ]
      },
      {
        id: 4,
        code: "TS12348",
        date: "12/06/2023",
        status: "completed",
        total: 1250000,
        subtotal: 1220000,
        shipping: 30000,
        discount: 0,
        paymentMethod: "Thẻ tín dụng/Thẻ ghi nợ",
        customer: {
          name: "Phạm Thị D",
          phone: "0934567890",
          email: "phamthid@example.com",
          address: "101 Đường DEF, Quận 3, TP.HCM"
        },
        items: [
          {
            name: "Áo Thun Nam Cotton Cổ Tròn",
            price: 199000,
            quantity: 3,
            variant: "Màu đen, Size XL",
            image: "https://picsum.photos/200/200?random=5"
          }
        ],
        history: [
          {
            status: "Đơn hàng đã được tạo",
            date: "12/06/2023",
            time: "15:10:20"
          },
          {
            status: "Đơn hàng đã được xác nhận",
            date: "12/06/2023",
            time: "16:30:45"
          },
          {
            status: "Đang giao hàng",
            date: "13/06/2023",
            time: "09:15:30",
            note: "Đơn hàng đã được giao cho đơn vị vận chuyển"
          },
          {
            status: "Đã giao hàng",
            date: "14/06/2023",
            time: "14:20:10",
            note: "Khách hàng đã nhận được hàng"
          }
        ]
      },
      {
        id: 5,
        code: "TS12349",
        date: "10/06/2023",
        status: "cancelled",
        total: 799000,
        subtotal: 769000,
        shipping: 30000,
        discount: 0,
        paymentMethod: "COD - Thanh toán khi nhận hàng",
        customer: {
          name: "Võ Văn E",
          phone: "0965432109",
          email: "vovane@example.com",
          address: "202 Đường GHI, Quận 5, TP.HCM"
        },
        items: [
          {
            name: "Quần Jeans Nam Slim Fit",
            price: 399000,
            quantity: 2,
            variant: "Màu xanh đậm, Size 32",
            image: "https://picsum.photos/200/200?random=8"
          }
        ],
        history: [
          {
            status: "Đơn hàng đã được tạo",
            date: "10/06/2023",
            time: "11:25:40"
          },
          {
            status: "Đơn hàng đã bị hủy",
            date: "11/06/2023",
            time: "09:40:15",
            note: "Khách hàng yêu cầu hủy đơn"
          }
        ]
      }
    ]);
    
    // Methods
    const handleSearch = (value) => {
      console.log('Search:', value);
      // Implement search logic here
    };
    
    const handleStatusFilter = (value) => {
      console.log('Status filter:', value);
      // Implement status filter logic here
    };
    
    const handleDateRangeChange = (dates, dateStrings) => {
      console.log('Date range:', dateStrings);
      // Implement date range filter logic here
    };
    
    const handleFilter = () => {
      console.log('Apply filters');
      // Implement combined filter logic here
    };
    
    const handlePageChange = (page) => {
      currentPage.value = page;
      // Implement pagination logic here
    };
    
    const getOrderStatusText = (status) => {
      switch (status) {
        case 'pending':
          return 'Chờ xử lý';
        case 'processing':
          return 'Đang xử lý';
        case 'shipping':
          return 'Đang giao';
        case 'completed':
          return 'Hoàn thành';
        case 'cancelled':
          return 'Đã hủy';
        default:
          return 'Không xác định';
      }
    };
    
    const getOrderStatusColor = (status) => {
      switch (status) {
        case 'pending':
          return 'blue';
        case 'processing':
          return 'gold';
        case 'shipping':
          return 'purple';
        case 'completed':
          return 'green';
        case 'cancelled':
          return 'red';
        default:
          return 'default';
      }
    };
    
    // Modal methods
    const viewOrderDetails = (order) => {
      selectedOrder.value = order;
      orderDetailsVisible.value = true;
    };
    
    const updateOrderStatus = (order, newStatus) => {
      console.log(`Update order ${order.code} status to ${newStatus}`);
      // Implement status update logic here
      
      // Update local data for demo
      const targetOrder = orders.value.find(o => o.id === order.id);
      if (targetOrder) {
        targetOrder.status = newStatus;
        targetOrder.history.push({
          status: getOrderStatusText(newStatus),
          date: new Date().toLocaleDateString('vi-VN'),
          time: new Date().toLocaleTimeString('vi-VN'),
        });
      }
    };
    
    const showCancelConfirm = (order) => {
      orderToCancel.value = order;
      cancelReason.value = '';
      cancelOrderVisible.value = true;
    };
    
    const confirmCancelOrder = () => {
      if (orderToCancel.value) {
        console.log(`Cancel order ${orderToCancel.value.code} with reason: ${cancelReason.value}`);
        // Implement cancel order logic here
        
        // Update local data for demo
        const targetOrder = orders.value.find(o => o.id === orderToCancel.value.id);
        if (targetOrder) {
          targetOrder.status = 'cancelled';
          targetOrder.history.push({
            status: 'Đơn hàng đã bị hủy',
            date: new Date().toLocaleDateString('vi-VN'),
            time: new Date().toLocaleTimeString('vi-VN'),
            note: cancelReason.value
          });
        }
        
        cancelOrderVisible.value = false;
      }
    };
    
    const printOrder = () => {
      console.log('Print order:', selectedOrder.value);
      // Implement print logic here
      window.print();
    };
    
    return {
      searchText,
      statusFilter,
      dateRange,
      activeTabKey,
      loading,
      currentPage,
      pageSize,
      totalItems,
      orders,
      startItem,
      endItem,
      orderDetailsVisible,
      cancelOrderVisible,
      selectedOrder,
      orderToCancel,
      cancelReason,
      handleSearch,
      handleStatusFilter,
      handleDateRangeChange,
      handleFilter,
      handlePageChange,
      getOrderStatusText,
      getOrderStatusColor,
      viewOrderDetails,
      updateOrderStatus,
      showCancelConfirm,
      confirmCancelOrder,
      printOrder,
      formatPrice: formatCurrency
    };
  }
};
</script>

<style scoped>
.custom-select :deep(.ant-select-selector) {
  background-color: #222 !important;
  border-color: #333 !important;
  color: white !important;
}

.custom-date-picker :deep(.ant-picker) {
  background-color: #222 !important;
  border-color: #333 !important;
}

.custom-date-picker :deep(.ant-picker-input > input) {
  color: white !important;
}

.custom-date-picker :deep(.ant-picker-suffix) {
  color: #9ca3af !important;
}

.custom-tabs :deep(.ant-tabs-nav) {
  margin-bottom: 1.5rem;
}

.custom-tabs :deep(.ant-tabs-tab) {
  color: #9ca3af;
  font-size: 1rem;
  padding: 0.75rem 1rem;
}

.custom-tabs :deep(.ant-tabs-tab-active) {
  color: white;
}

.custom-tabs :deep(.ant-tabs-ink-bar) {
  background: #ec4899;
}

.custom-pagination :deep(.ant-pagination-item) {
  background-color: #222;
  border-color: #333;
}

.custom-pagination :deep(.ant-pagination-item-active) {
  border-color: #ec4899;
}

.custom-pagination :deep(.ant-pagination-item-active a) {
  color: #ec4899;
}

.custom-pagination :deep(.ant-pagination-prev button),
.custom-pagination :deep(.ant-pagination-next button) {
  background-color: #222;
  border-color: #333;
  color: white;
}

.custom-modal :deep(.ant-modal-content) {
  background-color: #1a1a1a;
  border: 1px solid #333;
}

.custom-modal :deep(.ant-modal-header) {
  background-color: #1a1a1a;
  border-bottom: 1px solid #333;
}

.custom-modal :deep(.ant-modal-title) {
  color: white;
}

.custom-modal :deep(.ant-modal-close) {
  color: #9ca3af;
}

.custom-modal :deep(.ant-modal-footer) {
  border-top: 1px solid #333;
}

.custom-dropdown-menu {
  background-color: #1a1a1a !important;
  border: 1px solid #333 !important;
}

.custom-dropdown-menu :deep(.ant-dropdown-menu-item) {
  color: white !important;
}

.custom-dropdown-menu :deep(.ant-dropdown-menu-item:hover) {
  background-color: #222 !important;
}

.custom-timeline :deep(.ant-timeline-item-tail) {
  border-left-color: #333;
}

@media print {
  body * {
    visibility: hidden;
  }
  
  .ant-modal-content * {
    visibility: visible;
  }
  
  .ant-modal-content {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
}
</style>
