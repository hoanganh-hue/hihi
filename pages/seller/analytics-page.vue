<template>
  <div class="min-h-screen bg-black text-white">
    <div class="container mx-auto px-6 py-8">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 class="text-3xl font-bold mb-4 md:mb-0">Phân tích dữ liệu</h1>
        <div class="flex items-center space-x-4">
          <a-select v-model:value="timeRange" class="w-40 custom-select">
            <a-select-option value="7days">7 ngày qua</a-select-option>
            <a-select-option value="30days">30 ngày qua</a-select-option>
            <a-select-option value="90days">90 ngày qua</a-select-option>
            <a-select-option value="year">1 năm qua</a-select-option>
            <a-select-option value="custom">Tùy chỉnh</a-select-option>
          </a-select>
          <a-range-picker v-if="timeRange === 'custom'" class="custom-date-picker" />
          <a-button 
            type="primary" 
            class="!rounded-button bg-gradient-to-r from-pink-500 to-purple-600 border-none text-white font-medium"
          >
            <export-outlined />
            Xuất báo cáo
          </a-button>
        </div>
      </div>

      <!-- Tổng quan -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-gradient-to-br from-[#1a1a1a] to-[#111] rounded-xl p-6 border border-[#333] hover:border-pink-500/30 transition-colors duration-300">
          <div class="flex justify-between items-start mb-4">
            <div>
              <p class="text-gray-400 text-sm mb-1">Doanh thu</p>
              <h3 class="text-2xl font-bold">{{ formatCurrency(analytics.revenue) }}</h3>
            </div>
            <div class="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center">
              <dollar-outlined class="text-xl text-pink-500" />
            </div>
          </div>
          <div class="flex items-center">
            <span :class="analytics.revenueChange >= 0 ? 'text-green-500' : 'text-red-500'">
              {{ analytics.revenueChange >= 0 ? '+' : '' }}{{ analytics.revenueChange }}%
            </span>
            <span class="text-gray-400 text-sm ml-2">so với giai đoạn trước</span>
          </div>
        </div>

        <div class="bg-gradient-to-br from-[#1a1a1a] to-[#111] rounded-xl p-6 border border-[#333] hover:border-pink-500/30 transition-colors duration-300">
          <div class="flex justify-between items-start mb-4">
            <div>
              <p class="text-gray-400 text-sm mb-1">Đơn hàng</p>
              <h3 class="text-2xl font-bold">{{ analytics.orders }}</h3>
            </div>
            <div class="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <shopping-outlined class="text-xl text-blue-500" />
            </div>
          </div>
          <div class="flex items-center">
            <span :class="analytics.ordersChange >= 0 ? 'text-green-500' : 'text-red-500'">
              {{ analytics.ordersChange >= 0 ? '+' : '' }}{{ analytics.ordersChange }}%
            </span>
            <span class="text-gray-400 text-sm ml-2">so với giai đoạn trước</span>
          </div>
        </div>

        <div class="bg-gradient-to-br from-[#1a1a1a] to-[#111] rounded-xl p-6 border border-[#333] hover:border-pink-500/30 transition-colors duration-300">
          <div class="flex justify-between items-start mb-4">
            <div>
              <p class="text-gray-400 text-sm mb-1">Tỷ lệ chuyển đổi</p>
              <h3 class="text-2xl font-bold">{{ analytics.conversionRate }}%</h3>
            </div>
            <div class="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <funnel-plot-outlined class="text-xl text-green-500" />
            </div>
          </div>
          <div class="flex items-center">
            <span :class="analytics.conversionRateChange >= 0 ? 'text-green-500' : 'text-red-500'">
              {{ analytics.conversionRateChange >= 0 ? '+' : '' }}{{ analytics.conversionRateChange }}%
            </span>
            <span class="text-gray-400 text-sm ml-2">so với giai đoạn trước</span>
          </div>
        </div>

        <div class="bg-gradient-to-br from-[#1a1a1a] to-[#111] rounded-xl p-6 border border-[#333] hover:border-pink-500/30 transition-colors duration-300">
          <div class="flex justify-between items-start mb-4">
            <div>
              <p class="text-gray-400 text-sm mb-1">Giỏ hàng bị bỏ</p>
              <h3 class="text-2xl font-bold">{{ analytics.abandonedCart }}%</h3>
            </div>
            <div class="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <shopping-cart-outlined class="text-xl text-yellow-500" />
            </div>
          </div>
          <div class="flex items-center">
            <span :class="analytics.abandonedCartChange <= 0 ? 'text-green-500' : 'text-red-500'">
              {{ analytics.abandonedCartChange >= 0 ? '+' : '' }}{{ analytics.abandonedCartChange }}%
            </span>
            <span class="text-gray-400 text-sm ml-2">so với giai đoạn trước</span>
          </div>
        </div>
      </div>

      <!-- Biểu đồ doanh thu và đơn hàng -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div class="lg:col-span-2 bg-[#121212] rounded-xl border border-[#333] p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-medium">Doanh thu và Đơn hàng</h2>
            <a-select v-model:value="revenueChartView" class="w-32 custom-select">
              <a-select-option value="day">Ngày</a-select-option>
              <a-select-option value="week">Tuần</a-select-option>
              <a-select-option value="month">Tháng</a-select-option>
            </a-select>
          </div>
          <div class="h-80">
            <!-- Chart component would go here -->
            <div class="w-full h-full flex items-center justify-center text-gray-400">
              <line-chart-outlined class="text-4xl mr-2" />
              <span>Biểu đồ doanh thu và đơn hàng</span>
            </div>
          </div>
        </div>
        <div class="lg:col-span-1 bg-[#121212] rounded-xl border border-[#333] p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-medium">Phân bố khách hàng</h2>
          </div>
          <div class="h-80">
            <!-- Pie chart component would go here -->
            <div class="w-full h-full flex items-center justify-center text-gray-400">
              <pie-chart-outlined class="text-4xl mr-2" />
              <span>Biểu đồ phân bố khách hàng</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Sản phẩm bán chạy và Hành vi người dùng -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div class="bg-[#121212] rounded-xl border border-[#333] p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-medium">Sản phẩm bán chạy</h2>
            <a-select v-model:value="topProductsCount" class="w-24 custom-select">
              <a-select-option value="5">Top 5</a-select-option>
              <a-select-option value="10">Top 10</a-select-option>
              <a-select-option value="20">Top 20</a-select-option>
            </a-select>
          </div>
          <a-table
            :dataSource="topProducts"
            :columns="productColumns"
            :pagination="false"
            :loading="loading"
            class="custom-table"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'product'">
                <div class="flex items-center">
                  <img :src="record.image" :alt="record.name" class="w-10 h-10 object-cover rounded mr-3" />
                  <span class="text-white">{{ record.name }}</span>
                </div>
              </template>
              <template v-if="column.key === 'revenue'">
                <span class="text-white">{{ formatCurrency(record.revenue) }}</span>
              </template>
              <template v-if="column.key === 'trend'">
                <div class="flex items-center">
                  <component 
                    :is="record.trend > 0 ? 'rise-outlined' : record.trend < 0 ? 'fall-outlined' : 'minus-outlined'" 
                    :class="record.trend > 0 ? 'text-green-500' : record.trend < 0 ? 'text-red-500' : 'text-gray-500'"
                  />
                  <span 
                    class="ml-2" 
                    :class="record.trend > 0 ? 'text-green-500' : record.trend < 0 ? 'text-red-500' : 'text-gray-500'"
                  >
                    {{ Math.abs(record.trend) }}%
                  </span>
                </div>
              </template>
            </template>
          </a-table>
        </div>

        <div class="bg-[#121212] rounded-xl border border-[#333] p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-medium">Hành vi người dùng</h2>
          </div>
          <div class="space-y-6">
            <div>
              <div class="flex justify-between mb-2">
                <span class="text-gray-400">Tỷ lệ xem sản phẩm</span>
                <span class="text-white">{{ analytics.userBehavior.viewRate }}%</span>
              </div>
              <a-progress 
                :percent="analytics.userBehavior.viewRate" 
                :stroke-color="{ '0%': '#ec4899', '100%': '#8b5cf6' }"
                :show-info="false"
              />
            </div>
            <div>
              <div class="flex justify-between mb-2">
                <span class="text-gray-400">Tỷ lệ thêm vào giỏ hàng</span>
                <span class="text-white">{{ analytics.userBehavior.addToCartRate }}%</span>
              </div>
              <a-progress 
                :percent="analytics.userBehavior.addToCartRate" 
                :stroke-color="{ '0%': '#ec4899', '100%': '#8b5cf6' }"
                :show-info="false"
              />
            </div>
            <div>
              <div class="flex justify-between mb-2">
                <span class="text-gray-400">Tỷ lệ hoàn thành mua hàng</span>
                <span class="text-white">{{ analytics.userBehavior.checkoutRate }}%</span>
              </div>
              <a-progress 
                :percent="analytics.userBehavior.checkoutRate" 
                :stroke-color="{ '0%': '#ec4899', '100%': '#8b5cf6' }"
                :show-info="false"
              />
            </div>
            <div>
              <div class="flex justify-between mb-2">
                <span class="text-gray-400">Tỷ lệ khách hàng quay lại</span>
                <span class="text-white">{{ analytics.userBehavior.returnRate }}%</span>
              </div>
              <a-progress 
                :percent="analytics.userBehavior.returnRate" 
                :stroke-color="{ '0%': '#ec4899', '100%': '#8b5cf6' }"
                :show-info="false"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Phân tích địa lý và Nguồn lưu lượng -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="bg-[#121212] rounded-xl border border-[#333] p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-medium">Phân tích theo địa lý</h2>
          </div>
          <a-table
            :dataSource="geographicData"
            :columns="geoColumns"
            :pagination="{ pageSize: 5 }"
            :loading="loading"
            class="custom-table"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'performance'">
                <a-progress 
                  :percent="record.percentage" 
                  :stroke-color="{ '0%': '#ec4899', '100%': '#8b5cf6' }"
                  :format="percent => `${percent}%`"
                />
              </template>
              <template v-if="column.key === 'revenue'">
                <span class="text-white">{{ formatCurrency(record.revenue) }}</span>
              </template>
            </template>
          </a-table>
        </div>

        <div class="bg-[#121212] rounded-xl border border-[#333] p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-medium">Nguồn lưu lượng</h2>
          </div>
          <div class="h-80">
            <!-- Donut chart component would go here -->
            <div class="w-full h-full flex items-center justify-center text-gray-400">
              <dot-chart-outlined class="text-4xl mr-2" />
              <span>Biểu đồ nguồn lưu lượng</span>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4 mt-4">
            <div v-for="(source, index) in trafficSources" :key="index" class="flex items-center">
              <div class="w-3 h-3 rounded-full mr-2" :style="{backgroundColor: source.color}"></div>
              <span class="text-gray-400">{{ source.name }}:</span>
              <span class="text-white ml-2">{{ source.percentage }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { 
  DollarOutlined,
  ShoppingOutlined,
  FunnelPlotOutlined,
  ShoppingCartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  DotChartOutlined,
  RiseOutlined,
  FallOutlined,
  MinusOutlined,
  ExportOutlined
} from '@ant-design/icons-vue';

// State
const loading = ref(false);
const timeRange = ref('30days');
const revenueChartView = ref('day');
const topProductsCount = ref('5');

// Mock analytics data
const analytics = ref({
  revenue: 15750000,
  revenueChange: 12.5,
  orders: 126,
  ordersChange: 8.3,
  conversionRate: 3.2,
  conversionRateChange: 0.5,
  abandonedCart: 64.7,
  abandonedCartChange: -3.2,
  userBehavior: {
    viewRate: 78,
    addToCartRate: 32,
    checkoutRate: 18,
    returnRate: 42
  }
});

// Top products
const topProducts = [
  {
    key: '1',
    name: 'iPhone 14 Pro Max 256GB',
    image: 'https://cdn2.cellphones.com.vn/358x358,webp,q100/media/catalog/product/i/p/iphone-14-pro_2__5.jpg',
    sold: 24,
    revenue: 28990000 * 24,
    trend: 15
  },
  {
    key: '2',
    name: 'Samsung Galaxy S23 Ultra',
    image: 'https://cdn2.cellphones.com.vn/358x358,webp,q100/media/catalog/product/s/2/s23-ultra-tim.png',
    sold: 18,
    revenue: 26990000 * 18,
    trend: 8
  },
  {
    key: '3',
    name: 'Apple MacBook Air M2',
    image: 'https://cdn2.cellphones.com.vn/358x358,webp,q100/media/catalog/product/m/a/macbook_air_m2.png',
    sold: 12,
    revenue: 32990000 * 12,
    trend: -3
  },
  {
    key: '4',
    name: 'Apple Watch Series 8',
    image: 'https://cdn2.cellphones.com.vn/358x358,webp,q100/media/catalog/product/g/p/gps-cellular-45mm_2.png',
    sold: 10,
    revenue: 10990000 * 10,
    trend: 22
  },
  {
    key: '5',
    name: 'Samsung Galaxy Tab S8 Ultra',
    image: 'https://cdn2.cellphones.com.vn/358x358,webp,q100/media/catalog/product/t/a/tab_s8_ultra.jpg',
    sold: 8,
    revenue: 24990000 * 8,
    trend: 0
  },
];

const productColumns = [
  {
    title: 'Sản phẩm',
    key: 'product',
  },
  {
    title: 'Đã bán',
    dataIndex: 'sold',
    key: 'sold',
    sorter: (a, b) => a.sold - b.sold,
  },
  {
    title: 'Doanh thu',
    key: 'revenue',
    sorter: (a, b) => a.revenue - b.revenue,
  },
  {
    title: 'Xu hướng',
    key: 'trend',
  },
];

// Geographic data
const geographicData = [
  {
    key: '1',
    location: 'Hồ Chí Minh',
    orders: 54,
    percentage: 42.8,
    revenue: 6720000
  },
  {
    key: '2',
    location: 'Hà Nội',
    orders: 38,
    percentage: 30.2,
    revenue: 4750000
  },
  {
    key: '3',
    location: 'Đà Nẵng',
    orders: 12,
    percentage: 9.5,
    revenue: 1500000
  },
  {
    key: '4',
    location: 'Cần Thơ',
    orders: 8,
    percentage: 6.3,
    revenue: 990000
  },
  {
    key: '5',
    location: 'Hải Phòng',
    orders: 6,
    percentage: 4.8,
    revenue: 750000
  },
  {
    key: '6',
    location: 'Khác',
    orders: 8,
    percentage: 6.4,
    revenue: 1040000
  },
];

const geoColumns = [
  {
    title: 'Địa điểm',
    dataIndex: 'location',
    key: 'location',
  },
  {
    title: 'Đơn hàng',
    dataIndex: 'orders',
    key: 'orders',
    sorter: (a, b) => a.orders - b.orders,
  },
  {
    title: 'Tỷ lệ',
    key: 'performance',
  },
  {
    title: 'Doanh thu',
    key: 'revenue',
    sorter: (a, b) => a.revenue - b.revenue,
  },
];

// Traffic sources
const trafficSources = [
  { name: 'TikTok', percentage: 42, color: '#FF0050' },
  { name: 'Tìm kiếm', percentage: 28, color: '#00BFA5' },
  { name: 'Trực tiếp', percentage: 15, color: '#2196F3' },
  { name: 'Facebook', percentage: 10, color: '#4267B2' },
  { name: 'Instagram', percentage: 3, color: '#E1306C' },
  { name: 'Khác', percentage: 2, color: '#9E9E9E' },
];

// Utility functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};
</script>

<style scoped>
:deep(.ant-select-selector), 
:deep(.ant-input) {
  background-color: #222 !important;
  border-color: #333 !important;
  color: white !important;
}

:deep(.ant-select-selection-item) {
  color: white !important;
}

:deep(.ant-picker) {
  background-color: #222 !important;
  border-color: #333 !important;
}

:deep(.ant-picker-input > input) {
  color: white !important;
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

:deep(.ant-table-tbody > tr:hover > td) {
  background-color: #222 !important;
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

:deep(.ant-progress-inner) {
  background-color: #333 !important;
}

:deep(.ant-progress-text) {
  color: white !important;
}
</style>