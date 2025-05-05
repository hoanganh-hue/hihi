<template>
  <div class="min-h-screen bg-black text-white">
    <div class="container mx-auto px-6 py-8">
      <h1 class="text-3xl font-bold mb-8">Bảng điều khiển người bán</h1>
      
      <!-- Thông tin tổng quan -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div v-for="(card, index) in dashboardCards" :key="index" class="bg-[#121212] rounded-xl border border-[#333] p-6">
          <div class="flex justify-between items-start mb-4">
            <div>
              <p class="text-gray-400 text-sm mb-1">{{ card.title }}</p>
              <h3 class="text-2xl font-bold">{{ card.value }}</h3>
            </div>
            <div class="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center">
              <component :is="card.icon" class="text-xl text-pink-500" />
            </div>
          </div>
          <div class="flex items-center">
            <span :class="card.change >= 0 ? 'text-green-500' : 'text-red-500'">
              {{ card.change >= 0 ? '+' : '' }}{{ card.change }}%
            </span>
            <span class="text-gray-400 text-sm ml-2">so với tuần trước</span>
          </div>
        </div>
      </div>
      
      <!-- Biểu đồ doanh thu -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div class="lg:col-span-2 bg-[#121212] rounded-xl border border-[#333] p-6">
          <div class="flex justify-between items-center mb-8">
            <h2 class="text-xl font-medium">Doanh thu</h2>
            <a-select v-model:value="revenueTimeRange" class="w-32 custom-select">
              <a-select-option value="7days">7 ngày</a-select-option>
              <a-select-option value="30days">30 ngày</a-select-option>
              <a-select-option value="90days">90 ngày</a-select-option>
            </a-select>
          </div>
          <div class="h-80 relative">
            <!-- Placeholder for Chart -->
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-full h-full">
                <svg viewBox="0 0 500 300" class="w-full h-full text-gray-600">
                  <!-- Chart Grid -->
                  <line x1="50" y1="50" x2="50" y2="250" stroke="currentColor" stroke-opacity="0.2" />
                  <line x1="50" y1="250" x2="450" y2="250" stroke="currentColor" stroke-opacity="0.2" />
                  
                  <!-- Chart Labels -->
                  <text x="45" y="50" text-anchor="end" class="text-xs fill-gray-400">10M</text>
                  <text x="45" y="100" text-anchor="end" class="text-xs fill-gray-400">7.5M</text>
                  <text x="45" y="150" text-anchor="end" class="text-xs fill-gray-400">5M</text>
                  <text x="45" y="200" text-anchor="end" class="text-xs fill-gray-400">2.5M</text>
                  <text x="45" y="250" text-anchor="end" class="text-xs fill-gray-400">0</text>
                  
                  <!-- X-axis Labels -->
                  <text x="75" y="270" text-anchor="middle" class="text-xs fill-gray-400">T2</text>
                  <text x="125" y="270" text-anchor="middle" class="text-xs fill-gray-400">T3</text>
                  <text x="175" y="270" text-anchor="middle" class="text-xs fill-gray-400">T4</text>
                  <text x="225" y="270" text-anchor="middle" class="text-xs fill-gray-400">T5</text>
                  <text x="275" y="270" text-anchor="middle" class="text-xs fill-gray-400">T6</text>
                  <text x="325" y="270" text-anchor="middle" class="text-xs fill-gray-400">T7</text>
                  <text x="375" y="270" text-anchor="middle" class="text-xs fill-gray-400">CN</text>
                  
                  <!-- Revenue Line Chart -->
                  <path d="M75,180 L125,200 L175,150 L225,120 L275,80 L325,90 L375,70" 
                        fill="none" stroke="#EC4899" stroke-width="3" />
                  
                  <!-- Data Points -->
                  <circle cx="75" cy="180" r="4" fill="#EC4899" />
                  <circle cx="125" cy="200" r="4" fill="#EC4899" />
                  <circle cx="175" cy="150" r="4" fill="#EC4899" />
                  <circle cx="225" cy="120" r="4" fill="#EC4899" />
                  <circle cx="275" cy="80" r="4" fill="#EC4899" />
                  <circle cx="325" cy="90" r="4" fill="#EC4899" />
                  <circle cx="375" cy="70" r="4" fill="#EC4899" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Top sản phẩm -->
        <div class="bg-[#121212] rounded-xl border border-[#333] p-6">
          <h2 class="text-xl font-medium mb-6">Top sản phẩm bán chạy</h2>
          <div class="space-y-4">
            <div v-for="(product, index) in topProducts" :key="index" class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-lg bg-[#1a1a1a] overflow-hidden">
                <img :src="product.image" :alt="product.name" class="w-full h-full object-cover" />
              </div>
              <div class="flex-grow">
                <h3 class="font-medium line-clamp-1">{{ product.name }}</h3>
                <div class="flex items-center justify-between">
                  <span class="text-pink-500">{{ formatPrice(product.price) }}</span>
                  <span class="text-gray-400 text-sm">{{ product.sold }} đã bán</span>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-6 pt-4 border-t border-[#333]">
            <router-link to="/seller/products" class="text-pink-500 hover:text-pink-400 flex items-center justify-center">
              <span>Xem tất cả sản phẩm</span>
              <right-outlined class="ml-1" />
            </router-link>
          </div>
        </div>
      </div>
      
      <!-- Đơn hàng gần đây & Đánh giá mới -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Đơn hàng gần đây -->
        <div class="bg-[#121212] rounded-xl border border-[#333] p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-medium">Đơn hàng gần đây</h2>
            <router-link to="/seller/orders" class="text-pink-500 hover:text-pink-400">
              Xem tất cả
            </router-link>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-[#333]">
                  <th class="text-left py-3 text-gray-400 font-medium">Mã đơn hàng</th>
                  <th class="text-left py-3 text-gray-400 font-medium">Khách hàng</th>
                  <th class="text-left py-3 text-gray-400 font-medium">Trạng thái</th>
                  <th class="text-right py-3 text-gray-400 font-medium">Tổng tiền</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(order, index) in recentOrders" :key="index" class="border-b border-[#333]">
                  <td class="py-3">{{ order.code }}</td>
                  <td class="py-3">{{ order.customer }}</td>
                  <td class="py-3">
                    <a-tag :color="getOrderStatusColor(order.status)">
                      {{ order.status }}
                    </a-tag>
                  </td>
                  <td class="py-3 text-right">{{ formatPrice(order.total) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Đánh giá mới -->
        <div class="bg-[#121212] rounded-xl border border-[#333] p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-medium">Đánh giá mới</h2>
            <a href="#" class="text-pink-500 hover:text-pink-400">
              Xem tất cả
            </a>
          </div>
          <div class="space-y-6">
            <div v-for="(review, index) in recentReviews" :key="index" class="border-b border-[#333] pb-4 last:border-b-0">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-8 h-8 rounded-full overflow-hidden">
                  <img :src="review.avatar" :alt="review.name" class="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 class="font-medium">{{ review.name }}</h3>
                  <div class="flex items-center">
                    <a-rate :value="review.rating" disabled :count="5" class="text-xs custom-rate" />
                    <span class="ml-2 text-gray-400 text-xs">{{ review.date }}</span>
                  </div>
                </div>
              </div>
              <p class="text-gray-300 mb-2">{{ review.comment }}</p>
              <div class="text-gray-400 text-sm">Sản phẩm: {{ review.product }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { RightOutlined, ShoppingOutlined, UserOutlined, DollarOutlined, RiseOutlined } from '@ant-design/icons-vue';
import { formatCurrency } from '../../lib/formatters';

export default {
  name: 'SellerDashboard',
  components: {
    RightOutlined,
    ShoppingOutlined,
    UserOutlined,
    DollarOutlined,
    RiseOutlined
  },
  setup() {
    const revenueTimeRange = ref('7days');
    
    // Dashboard Cards
    const dashboardCards = [
      {
        title: 'Tổng doanh thu',
        value: formatCurrency(24850000),
        icon: 'DollarOutlined',
        change: 12.5
      },
      {
        title: 'Đơn hàng',
        value: '132',
        icon: 'ShoppingOutlined',
        change: 8.3
      },
      {
        title: 'Khách hàng',
        value: '845',
        icon: 'UserOutlined',
        change: 15.7
      },
      {
        title: 'Tỷ lệ chuyển đổi',
        value: '3.4%',
        icon: 'RiseOutlined',
        change: -2.1
      }
    ];
    
    // Top Products
    const topProducts = [
      {
        name: 'Điện thoại Samsung Galaxy S21',
        price: 15990000,
        sold: 25,
        image: 'https://picsum.photos/200/200?random=1'
      },
      {
        name: 'Tai nghe Bluetooth Apple AirPods Pro',
        price: 4990000,
        sold: 18,
        image: 'https://picsum.photos/200/200?random=2'
      },
      {
        name: 'Laptop Dell XPS 13',
        price: 29990000,
        sold: 15,
        image: 'https://picsum.photos/200/200?random=3'
      },
      {
        name: 'Smartwatch Apple Watch Series 7',
        price: 9990000,
        sold: 12,
        image: 'https://picsum.photos/200/200?random=4'
      }
    ];
    
    // Recent Orders
    const recentOrders = [
      {
        code: 'TS12345',
        customer: 'Nguyễn Văn A',
        status: 'Chờ xử lý',
        total: 1590000
      },
      {
        code: 'TS12346',
        customer: 'Trần Thị B',
        status: 'Đang giao',
        total: 3450000
      },
      {
        code: 'TS12347',
        customer: 'Lê Văn C',
        status: 'Hoàn thành',
        total: 2980000
      },
      {
        code: 'TS12348',
        customer: 'Phạm Thị D',
        status: 'Đã hủy',
        total: 1250000
      }
    ];
    
    // Recent Reviews
    const recentReviews = [
      {
        name: 'Nguyễn Văn A',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        rating: 5,
        date: '15/06/2023',
        comment: 'Sản phẩm rất tốt, đúng như mô tả. Đóng gói cẩn thận, giao hàng nhanh.',
        product: 'Điện thoại Samsung Galaxy S21'
      },
      {
        name: 'Trần Thị B',
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
        rating: 4,
        date: '14/06/2023',
        comment: 'Chất lượng sản phẩm tốt, nhưng giao hàng hơi chậm.',
        product: 'Tai nghe Bluetooth Apple AirPods Pro'
      },
      {
        name: 'Lê Văn C',
        avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
        rating: 3,
        date: '13/06/2023',
        comment: 'Sản phẩm tạm được, không xuất sắc nhưng cũng không tệ.',
        product: 'Laptop Dell XPS 13'
      }
    ];
    
    // Get order status color
    const getOrderStatusColor = (status) => {
      switch (status) {
        case 'Chờ xử lý':
          return 'blue';
        case 'Đang giao':
          return 'gold';
        case 'Hoàn thành':
          return 'green';
        case 'Đã hủy':
          return 'red';
        default:
          return 'default';
      }
    };
    
    return {
      revenueTimeRange,
      dashboardCards,
      topProducts,
      recentOrders,
      recentReviews,
      getOrderStatusColor,
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

.custom-rate :deep(.ant-rate-star-zero .ant-rate-star-first),
.custom-rate :deep(.ant-rate-star-zero .ant-rate-star-second) {
  color: #444;
}

.custom-rate :deep(.ant-rate-star-full .ant-rate-star-first),
.custom-rate :deep(.ant-rate-star-full .ant-rate-star-second) {
  color: #f5a623;
}
</style>
