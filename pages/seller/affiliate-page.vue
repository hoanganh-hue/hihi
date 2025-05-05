<template>
  <div class="min-h-screen bg-black text-white">
    <div class="container mx-auto px-6 py-8">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 class="text-3xl font-bold mb-4 md:mb-0">Tiếp thị liên kết</h1>
        <a-button 
          type="primary" 
          class="!rounded-button bg-gradient-to-r from-pink-500 to-purple-600 border-none text-white font-medium"
          @click="showCreateLinkModal"
        >
          <link-outlined />
          Tạo liên kết mới
        </a-button>
      </div>

      <!-- Stats overview -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-gradient-to-br from-[#1a1a1a] to-[#111] rounded-xl p-6 border border-[#333] hover:border-pink-500/30 transition-colors duration-300">
          <div class="flex justify-between items-start mb-4">
            <div>
              <p class="text-gray-400 text-sm mb-1">Tổng lượt click</p>
              <h3 class="text-2xl font-bold">{{ affiliateStats.totalClicks }}</h3>
            </div>
            <div class="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center">
              <click-outlined class="text-xl text-pink-500" />
            </div>
          </div>
          <div class="flex items-center">
            <span :class="affiliateStats.clicksChange >= 0 ? 'text-green-500' : 'text-red-500'">
              {{ affiliateStats.clicksChange >= 0 ? '+' : '' }}{{ affiliateStats.clicksChange }}%
            </span>
            <span class="text-gray-400 text-sm ml-2">so với giai đoạn trước</span>
          </div>
        </div>

        <div class="bg-gradient-to-br from-[#1a1a1a] to-[#111] rounded-xl p-6 border border-[#333] hover:border-pink-500/30 transition-colors duration-300">
          <div class="flex justify-between items-start mb-4">
            <div>
              <p class="text-gray-400 text-sm mb-1">Tổng lượt chuyển đổi</p>
              <h3 class="text-2xl font-bold">{{ affiliateStats.totalConversions }}</h3>
            </div>
            <div class="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <check-circle-outlined class="text-xl text-green-500" />
            </div>
          </div>
          <div class="flex items-center">
            <span :class="affiliateStats.conversionsChange >= 0 ? 'text-green-500' : 'text-red-500'">
              {{ affiliateStats.conversionsChange >= 0 ? '+' : '' }}{{ affiliateStats.conversionsChange }}%
            </span>
            <span class="text-gray-400 text-sm ml-2">so với giai đoạn trước</span>
          </div>
        </div>

        <div class="bg-gradient-to-br from-[#1a1a1a] to-[#111] rounded-xl p-6 border border-[#333] hover:border-pink-500/30 transition-colors duration-300">
          <div class="flex justify-between items-start mb-4">
            <div>
              <p class="text-gray-400 text-sm mb-1">Tỷ lệ chuyển đổi</p>
              <h3 class="text-2xl font-bold">{{ affiliateStats.conversionRate }}%</h3>
            </div>
            <div class="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <percentage-outlined class="text-xl text-blue-500" />
            </div>
          </div>
          <div class="flex items-center">
            <span :class="affiliateStats.rateChange >= 0 ? 'text-green-500' : 'text-red-500'">
              {{ affiliateStats.rateChange >= 0 ? '+' : '' }}{{ affiliateStats.rateChange }}%
            </span>
            <span class="text-gray-400 text-sm ml-2">so với giai đoạn trước</span>
          </div>
        </div>

        <div class="bg-gradient-to-br from-[#1a1a1a] to-[#111] rounded-xl p-6 border border-[#333] hover:border-pink-500/30 transition-colors duration-300">
          <div class="flex justify-between items-start mb-4">
            <div>
              <p class="text-gray-400 text-sm mb-1">Doanh thu hoa hồng</p>
              <h3 class="text-2xl font-bold">{{ formatCurrency(affiliateStats.commissionRevenue) }}</h3>
            </div>
            <div class="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <dollar-outlined class="text-xl text-yellow-500" />
            </div>
          </div>
          <div class="flex items-center">
            <span :class="affiliateStats.revenueChange >= 0 ? 'text-green-500' : 'text-red-500'">
              {{ affiliateStats.revenueChange >= 0 ? '+' : '' }}{{ affiliateStats.revenueChange }}%
            </span>
            <span class="text-gray-400 text-sm ml-2">so với giai đoạn trước</span>
          </div>
        </div>
      </div>

      <!-- Performance chart -->
      <div class="bg-[#121212] rounded-xl border border-[#333] p-6 mb-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-medium">Hiệu suất tiếp thị liên kết</h2>
          <div class="flex items-center space-x-4">
            <a-select v-model:value="chartMetric" class="w-40 custom-select">
              <a-select-option value="clicks">Lượt click</a-select-option>
              <a-select-option value="conversions">Lượt chuyển đổi</a-select-option>
              <a-select-option value="revenue">Doanh thu</a-select-option>
            </a-select>
            <a-select v-model:value="chartTimeRange" class="w-32 custom-select">
              <a-select-option value="7days">7 ngày</a-select-option>
              <a-select-option value="30days">30 ngày</a-select-option>
              <a-select-option value="90days">90 ngày</a-select-option>
            </a-select>
          </div>
        </div>
        <div class="h-80">
          <!-- Chart component would go here -->
          <div class="w-full h-full flex items-center justify-center text-gray-400">
            <line-chart-outlined class="text-4xl mr-2" />
            <span>Biểu đồ hiệu suất tiếp thị liên kết</span>
          </div>
        </div>
      </div>

      <!-- Affiliate links -->
      <div class="bg-[#121212] rounded-xl border border-[#333] p-6 mb-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-medium">Liên kết tiếp thị</h2>
          <div class="flex items-center space-x-4">
            <a-input-search 
              v-model:value="searchQuery" 
              placeholder="Tìm liên kết hoặc sản phẩm" 
              class="w-64 custom-search"
              @search="handleSearch"
            />
            <a-select v-model:value="filterStatus" class="w-32 custom-select">
              <a-select-option value="all">Tất cả</a-select-option>
              <a-select-option value="active">Đang hoạt động</a-select-option>
              <a-select-option value="inactive">Không hoạt động</a-select-option>
            </a-select>
            <a-select v-model:value="sortBy" class="w-48 custom-select">
              <a-select-option value="newest">Mới nhất</a-select-option>
              <a-select-option value="oldest">Cũ nhất</a-select-option>
              <a-select-option value="clicks">Lượt click: cao → thấp</a-select-option>
              <a-select-option value="conversions">Chuyển đổi: cao → thấp</a-select-option>
            </a-select>
          </div>
        </div>
        
        <a-table
          :dataSource="filteredLinks"
          :columns="linkColumns"
          :pagination="{ pageSize: 5 }"
          :loading="loading"
          class="custom-table"
        >
          <!-- Product column template -->
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'product'">
              <div class="flex items-center">
                <img :src="record.productImage" :alt="record.productName" class="w-10 h-10 object-cover rounded mr-3" />
                <div>
                  <div class="font-medium">{{ record.productName }}</div>
                  <div class="text-gray-400 text-xs">{{ record.productCategory }}</div>
                </div>
              </div>
            </template>
            
            <!-- Link column template -->
            <template v-if="column.key === 'link'">
              <div class="flex items-center">
                <a-tooltip placement="top" :title="record.url">
                  <span class="text-gray-400 truncate block max-w-[200px]">{{ record.url }}</span>
                </a-tooltip>
                <a-button type="text" class="ml-2 text-gray-400" @click="copyLink(record.url)">
                  <copy-outlined />
                </a-button>
              </div>
            </template>
            
            <!-- Status column template -->
            <template v-if="column.key === 'status'">
              <a-tag :color="record.status === 'active' ? 'green' : 'red'">
                {{ record.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động' }}
              </a-tag>
            </template>
            
            <!-- Actions column template -->
            <template v-if="column.key === 'actions'">
              <div class="flex">
                <a-tooltip placement="top" title="Thống kê chi tiết">
                  <a-button type="text" class="text-blue-500" @click="showLinkDetail(record)">
                    <bar-chart-outlined />
                  </a-button>
                </a-tooltip>
                <a-tooltip placement="top" title="Chia sẻ">
                  <a-button type="text" class="text-green-500" @click="shareLink(record)">
                    <share-alt-outlined />
                  </a-button>
                </a-tooltip>
                <a-tooltip placement="top" title="Chỉnh sửa">
                  <a-button type="text" class="text-yellow-500" @click="editLink(record)">
                    <edit-outlined />
                  </a-button>
                </a-tooltip>
                <a-tooltip placement="top" title="Xóa">
                  <a-button type="text" class="text-red-500" @click="confirmDeleteLink(record)">
                    <delete-outlined />
                  </a-button>
                </a-tooltip>
              </div>
            </template>
          </template>
        </a-table>
      </div>
      
      <!-- Top Performing Products -->
      <div class="bg-[#121212] rounded-xl border border-[#333] p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-medium">Sản phẩm hiệu quả nhất</h2>
          <a-select v-model:value="topProductsMetric" class="w-48 custom-select">
            <a-select-option value="clicks">Theo lượt click</a-select-option>
            <a-select-option value="conversions">Theo chuyển đổi</a-select-option>
            <a-select-option value="revenue">Theo doanh thu</a-select-option>
          </a-select>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="(product, index) in topProducts" :key="index" class="bg-[#1a1a1a] border border-[#333] rounded-lg overflow-hidden">
            <div class="relative">
              <img :src="product.image" :alt="product.name" class="w-full h-40 object-cover" />
              <div class="absolute top-0 right-0 bg-black bg-opacity-70 text-white text-xs font-bold px-2 py-1 rounded-bl">
                # {{ index + 1 }}
              </div>
            </div>
            <div class="p-4">
              <h3 class="font-medium line-clamp-2 mb-2">{{ product.name }}</h3>
              <div class="flex justify-between items-center text-sm mb-1">
                <span class="text-gray-400">Lượt click:</span>
                <span class="font-medium">{{ product.clicks }}</span>
              </div>
              <div class="flex justify-between items-center text-sm mb-1">
                <span class="text-gray-400">Chuyển đổi:</span>
                <span class="font-medium">{{ product.conversions }}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-400">Doanh thu:</span>
                <span class="font-medium text-green-500">{{ formatCurrency(product.revenue) }}</span>
              </div>
              <a-button 
                type="primary" 
                block 
                class="mt-4 bg-gradient-to-r from-pink-500 to-purple-600 border-none"
                @click="createProductLink(product.id)"
              >
                Tạo liên kết mới
              </a-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Link Modal -->
    <a-modal
      v-model:visible="linkModalVisible"
      :title="editingLink ? 'Chỉnh sửa liên kết' : 'Tạo liên kết mới'"
      :footer="null"
      class="custom-modal"
      width="700px"
    >
      <a-form layout="vertical" :model="linkForm">
        <div class="flex gap-6">
          <div class="w-1/3">
            <div v-if="linkForm.productImage" class="mb-4">
              <img :src="linkForm.productImage" alt="Product" class="w-full aspect-square object-cover rounded-lg border border-[#333]" />
            </div>
            <a-form-item label="Sản phẩm">
              <a-select 
                v-model:value="linkForm.productId" 
                placeholder="Chọn sản phẩm" 
                show-search
                :filter-option="filterProductOption"
                @change="handleProductSelect"
              >
                <a-select-option v-for="product in products" :key="product.id" :value="product.id">
                  {{ product.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </div>
          
          <div class="w-2/3">
            <a-form-item label="Tên liên kết (chỉ hiển thị với bạn)">
              <a-input v-model:value="linkForm.name" placeholder="Nhập tên mô tả cho liên kết này" />
            </a-form-item>
            
            <div class="grid grid-cols-2 gap-4">
              <a-form-item label="Mã giảm giá (tùy chọn)">
                <a-input v-model:value="linkForm.couponCode" placeholder="Thêm mã giảm giá" />
              </a-form-item>
              
              <a-form-item label="UTM Source">
                <a-input v-model:value="linkForm.utmSource" placeholder="Nguồn (vd: facebook, tiktok)" />
              </a-form-item>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <a-form-item label="UTM Medium">
                <a-input v-model:value="linkForm.utmMedium" placeholder="Kênh (vd: social, email)" />
              </a-form-item>
              
              <a-form-item label="UTM Campaign">
                <a-input v-model:value="linkForm.utmCampaign" placeholder="Chiến dịch (vd: summer-sale)" />
              </a-form-item>
            </div>
            
            <a-form-item label="Trạng thái">
              <a-switch v-model:checked="linkForm.isActive" />
              <span class="ml-2">{{ linkForm.isActive ? 'Đang hoạt động' : 'Không hoạt động' }}</span>
            </a-form-item>
            
            <a-form-item v-if="generatedLink" label="Liên kết tiếp thị">
              <div class="flex">
                <a-input v-model:value="generatedLink" readonly class="flex-grow" />
                <a-button type="primary" class="ml-2" @click="copyLink(generatedLink)">
                  <copy-outlined />
                  Sao chép
                </a-button>
              </div>
            </a-form-item>
          </div>
        </div>
        
        <div class="flex justify-end gap-2 mt-4">
          <a-button @click="linkModalVisible = false">Hủy</a-button>
          <a-button 
            type="primary" 
            class="bg-gradient-to-r from-pink-500 to-purple-600 border-none"
            @click="saveLink"
          >
            {{ editingLink ? 'Cập nhật liên kết' : 'Tạo liên kết' }}
          </a-button>
        </div>
      </a-form>
    </a-modal>
    
    <!-- Link Detail Modal -->
    <a-modal
      v-model:visible="detailModalVisible"
      title="Thống kê chi tiết liên kết"
      :footer="null"
      class="custom-modal"
      width="800px"
    >
      <div v-if="selectedLink">
        <div class="flex items-center mb-6">
          <img :src="selectedLink.productImage" :alt="selectedLink.productName" class="w-16 h-16 object-cover rounded mr-4" />
          <div>
            <h3 class="font-medium text-lg">{{ selectedLink.productName }}</h3>
            <p class="text-gray-400">{{ selectedLink.name }}</p>
          </div>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div class="bg-[#1a1a1a] border border-[#333] rounded-lg p-4">
            <p class="text-gray-400 text-sm">Lượt click</p>
            <h3 class="text-xl font-medium">{{ selectedLink.clicks }}</h3>
          </div>
          <div class="bg-[#1a1a1a] border border-[#333] rounded-lg p-4">
            <p class="text-gray-400 text-sm">Chuyển đổi</p>
            <h3 class="text-xl font-medium">{{ selectedLink.conversions }}</h3>
          </div>
          <div class="bg-[#1a1a1a] border border-[#333] rounded-lg p-4">
            <p class="text-gray-400 text-sm">Tỷ lệ chuyển đổi</p>
            <h3 class="text-xl font-medium">{{ (selectedLink.conversions / selectedLink.clicks * 100).toFixed(1) }}%</h3>
          </div>
        </div>
        
        <div class="h-64 mb-6">
          <!-- Link performance chart -->
          <div class="w-full h-full flex items-center justify-center text-gray-400">
            <area-chart-outlined class="text-4xl mr-2" />
            <span>Biểu đồ hiệu suất theo thời gian</span>
          </div>
        </div>
        
        <div class="bg-[#1a1a1a] border border-[#333] rounded-lg p-4 mb-6">
          <h4 class="font-medium mb-2">Liên kết tiếp thị</h4>
          <div class="flex">
            <a-input v-model:value="selectedLink.url" readonly class="flex-grow" />
            <a-button type="primary" class="ml-2" @click="copyLink(selectedLink.url)">
              <copy-outlined />
              Sao chép
            </a-button>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-[#1a1a1a] border border-[#333] rounded-lg p-4">
            <h4 class="font-medium mb-3">Thiết bị</h4>
            <div class="space-y-3">
              <div v-for="(device, index) in deviceStats" :key="index" class="flex items-center">
                <span class="text-gray-400 w-24">{{ device.name }}</span>
                <div class="flex-grow mx-2">
                  <a-progress 
                    :percent="device.percentage" 
                    :stroke-color="device.color"
                    :show-info="false"
                  />
                </div>
                <span>{{ device.percentage }}%</span>
              </div>
            </div>
          </div>
          <div class="bg-[#1a1a1a] border border-[#333] rounded-lg p-4">
            <h4 class="font-medium mb-3">Nguồn lưu lượng</h4>
            <div class="space-y-3">
              <div v-for="(source, index) in sourceStats" :key="index" class="flex items-center">
                <span class="text-gray-400 w-24">{{ source.name }}</span>
                <div class="flex-grow mx-2">
                  <a-progress 
                    :percent="source.percentage" 
                    :stroke-color="source.color"
                    :show-info="false"
                  />
                </div>
                <span>{{ source.percentage }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-modal>
    
    <!-- Share Link Modal -->
    <a-modal
      v-model:visible="shareModalVisible"
      title="Chia sẻ liên kết"
      :footer="null"
      class="custom-modal"
    >
      <div v-if="selectedLink">
        <p class="mb-4">Chia sẻ liên kết tiếp thị này tới:</p>
        
        <div class="grid grid-cols-4 gap-4 mb-6">
          <a-button class="flex flex-col items-center h-auto p-4" @click="shareToSocial('facebook')">
            <facebook-filled class="text-2xl text-[#1877f2] mb-2" />
            <span>Facebook</span>
          </a-button>
          <a-button class="flex flex-col items-center h-auto p-4" @click="shareToSocial('twitter')">
            <twitter-outlined class="text-2xl text-[#1da1f2] mb-2" />
            <span>Twitter</span>
          </a-button>
          <a-button class="flex flex-col items-center h-auto p-4" @click="shareToSocial('tiktok')">
            <audio-outlined class="text-2xl text-[#ff0050] mb-2" />
            <span>TikTok</span>
          </a-button>
          <a-button class="flex flex-col items-center h-auto p-4" @click="shareToSocial('email')">
            <mail-outlined class="text-2xl text-[#f5a623] mb-2" />
            <span>Email</span>
          </a-button>
        </div>
        
        <div class="bg-[#1a1a1a] border border-[#333] rounded-lg p-4 mb-4">
          <h4 class="font-medium mb-2">Liên kết tiếp thị</h4>
          <div class="flex">
            <a-input v-model:value="selectedLink.url" readonly class="flex-grow" />
            <a-button type="primary" class="ml-2" @click="copyLink(selectedLink.url)">
              <copy-outlined />
              Sao chép
            </a-button>
          </div>
        </div>
        
        <p class="text-gray-400 text-sm mb-2">Sản phẩm:</p>
        <div class="flex items-center mb-4">
          <img :src="selectedLink.productImage" :alt="selectedLink.productName" class="w-12 h-12 object-cover rounded mr-3" />
          <div>
            <div class="font-medium">{{ selectedLink.productName }}</div>
            <div class="text-gray-400 text-xs">{{ selectedLink.productCategory }}</div>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { 
  LinkOutlined, 
  ClickOutlined, 
  CheckCircleOutlined,
  PercentageOutlined,
  DollarOutlined,
  LineChartOutlined,
  AreaChartOutlined,
  BarChartOutlined, 
  ShareAltOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  FacebookFilled,
  TwitterOutlined,
  AudioOutlined,
  MailOutlined
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

// State
const loading = ref(false);
const searchQuery = ref('');
const filterStatus = ref('all');
const sortBy = ref('newest');
const chartMetric = ref('clicks');
const chartTimeRange = ref('30days');
const topProductsMetric = ref('clicks');

// Modals
const linkModalVisible = ref(false);
const detailModalVisible = ref(false);
const shareModalVisible = ref(false);
const editingLink = ref(false);
const selectedLink = ref(null);
const generatedLink = ref('');

// Forms
const linkForm = ref({
  id: null,
  name: '',
  productId: null,
  productName: '',
  productImage: '',
  couponCode: '',
  utmSource: 'tiktok',
  utmMedium: 'social',
  utmCampaign: '',
  isActive: true
});

// Mock data
const affiliateStats = ref({
  totalClicks: 12458,
  clicksChange: 15.2,
  totalConversions: 438,
  conversionsChange: 8.7,
  conversionRate: 3.5,
  rateChange: -0.3,
  commissionRevenue: 18650000,
  revenueChange: 22.4
});

const products = ref([
  {
    id: 1,
    name: 'iPhone 14 Pro Max 256GB',
    image: 'https://cdn2.cellphones.com.vn/358x358,webp,q100/media/catalog/product/i/p/iphone-14-pro_2__5.jpg',
    category: 'Điện thoại & Máy tính bảng',
    price: 28990000
  },
  {
    id: 2,
    name: 'Samsung Galaxy S23 Ultra 12GB/256GB',
    image: 'https://cdn2.cellphones.com.vn/358x358,webp,q100/media/catalog/product/s/2/s23-ultra-tim.png',
    category: 'Điện thoại & Máy tính bảng',
    price: 23990000
  },
  {
    id: 3,
    name: 'Apple MacBook Air M2',
    image: 'https://cdn2.cellphones.com.vn/358x358,webp,q100/media/catalog/product/m/a/macbook_air_m2.png',
    category: 'Laptop & Máy tính',
    price: 32990000
  },
  {
    id: 4,
    name: 'Xiaomi Redmi Watch 3 Active',
    image: 'https://cdn2.cellphones.com.vn/358x358,webp,q100/media/catalog/product/1/_/1_252.jpg',
    category: 'Đồng hồ thông minh',
    price: 990000
  },
  {
    id: 5,
    name: 'Xiaomi Robot Vacuum S10+',
    image: 'https://cdn2.cellphones.com.vn/358x358,webp,q100/media/catalog/product/r/o/robot-hut-bui-lau-nha-xiaomi-vacuum-s10-plus.jpg',
    category: 'Thiết bị thông minh',
    price: 7990000
  },
  {
    id: 6,
    name: 'Tai nghe Sony WH-1000XM4',
    image: 'https://cdn2.cellphones.com.vn/358x358,webp,q100/media/catalog/product/g/r/group_157_1_12.png',
    category: 'Tai nghe',
    price: 5990000
  },
  {
    id: 7,
    name: 'Samsung Galaxy Watch 5',
    image: 'https://cdn2.cellphones.com.vn/358x358,webp,q100/media/catalog/product/s/a/samsung-galaxy-watch-5.jpg',
    category: 'Đồng hồ thông minh',
    price: 6490000
  },
  {
    id: 8,
    name: 'Apple iPad Pro 11 inch M2 WiFi 128GB',
    image: 'https://cdn2.cellphones.com.vn/358x358,webp,q100/media/catalog/product/i/p/ipad-pro-11-m1-wifi-gray-1.jpg',
    category: 'Điện thoại & Máy tính bảng',
    price: 20990000
  }
]);

const affiliateLinks = ref([
  {
    id: 1,
    name: 'iPhone 14 promo FB',
    productId: 1,
    productName: 'iPhone 14 Pro Max 256GB',
    productImage: 'https://cdn2.cellphones.com.vn/358x358,webp,q100/media/catalog/product/i/p/iphone-14-pro_2__5.jpg',
    productCategory: 'Điện thoại & Máy tính bảng',
    url: 'https://tiktokshop.example.com/p/iphone14promax?ref=abc123&utm_source=facebook&utm_medium=social&utm_campaign=summer',
    clicks: 5843,
    conversions: 237,
    revenue: 6870000,
    status: 'active',
    createdAt: '2023-07-15T10:30:00Z',
    couponCode: 'SALE10',
    utmSource: 'facebook',
    utmMedium: 'social',
    utmCampaign: 'summer'
  },
  {
    id: 2,
    name: 'S23 Ultra TikTok campaign',
    productId: 2,
    productName: 'Samsung Galaxy S23 Ultra 12GB/256GB',
    productImage: 'https://cdn2.cellphones.com.vn/358x358,webp,q100/media/catalog/product/s/2/s23-ultra-tim.png',
    productCategory: 'Điện thoại & Máy tính bảng',
    url: 'https://tiktokshop.example.com/p/s23ultra?ref=xyz789&utm_source=tiktok&utm_medium=social&utm_campaign=galaxy',
    clicks: 3265,
    conversions: 98,
    revenue: 2350000,
    status: 'active',
    createdAt: '2023-07-10T08:15:00Z',
    couponCode: '',
    utmSource: 'tiktok',
    utmMedium: 'social',
    utmCampaign: 'galaxy'
  },
  {
    id: 3,
    name: 'MacBook Email Newsletter',
    productId: 3,
    productName: 'Apple MacBook Air M2',
    productImage: 'https://cdn2.cellphones.com.vn/358x358,webp,q100/media/catalog/product/m/a/macbook_air_m2.png',
    productCategory: 'Laptop & Máy tính',
    url: 'https://tiktokshop.example.com/p/macbookairm2?ref=def456&utm_source=email&utm_medium=newsletter&utm_campaign=backtoschool',
    clicks: 1589,
    conversions: 45,
    revenue: 1485000,
    status: 'active',
    createdAt: '2023-08-01T14:20:00Z',
    couponCode: 'SCHOOL20',
    utmSource: 'email',
    utmMedium: 'newsletter',
    utmCampaign: 'backtoschool'
  },
  {
    id: 4,
    name: 'Watch Promotion Instagram',
    productId: 7,
    productName: 'Samsung Galaxy Watch 5',
    productImage: 'https://cdn2.cellphones.com.vn/358x358,webp,q100/media/catalog/product/s/a/samsung-galaxy-watch-5.jpg',
    productCategory: 'Đồng hồ thông minh',
    url: 'https://tiktokshop.example.com/p/galaxywatch5?ref=ghi789&utm_source=instagram&utm_medium=social&utm_campaign=fitness',
    clicks: 978,
    conversions: 32,
    revenue: 960000,
    status: 'inactive',
    createdAt: '2023-07-25T09:45:00Z',
    couponCode: 'FIT15',
    utmSource: 'instagram',
    utmMedium: 'social',
    utmCampaign: 'fitness'
  },
  {
    id: 5,
    name: 'iPad Pro Blog Post',
    productId: 8,
    productName: 'Apple iPad Pro 11 inch M2 WiFi 128GB',
    productImage: 'https://cdn2.cellphones.com.vn/358x358,webp,q100/media/catalog/product/i/p/ipad-pro-11-m1-wifi-gray-1.jpg',
    productCategory: 'Điện thoại & Máy tính bảng',
    url: 'https://tiktokshop.example.com/p/ipadprom2?ref=jkl012&utm_source=blog&utm_medium=article&utm_campaign=creativity',
    clicks: 783,
    conversions: 26,
    revenue: 780000,
    status: 'active',
    createdAt: '2023-08-05T11:10:00Z',
    couponCode: '',
    utmSource: 'blog',
    utmMedium: 'article',
    utmCampaign: 'creativity'
  }
]);

// Table columns
const linkColumns = [
  {
    title: 'Sản phẩm',
    key: 'product',
  },
  {
    title: 'Liên kết',
    key: 'link',
  },
  {
    title: 'Lượt click',
    dataIndex: 'clicks',
    key: 'clicks',
    sorter: (a, b) => a.clicks - b.clicks,
  },
  {
    title: 'Chuyển đổi',
    dataIndex: 'conversions',
    key: 'conversions',
    sorter: (a, b) => a.conversions - b.conversions,
  },
  {
    title: 'Trạng thái',
    key: 'status',
  },
  {
    title: '',
    key: 'actions',
  }
];

// Stats for detail modal
const deviceStats = [
  { name: 'Di động', percentage: 68, color: '#FF2C55' },
  { name: 'Máy tính', percentage: 24, color: '#36CFC9' },
  { name: 'Tablet', percentage: 8, color: '#722ED1' }
];

const sourceStats = [
  { name: 'Trực tiếp', percentage: 42, color: '#FF2C55' },
  { name: 'Facebook', percentage: 28, color: '#1877F2' },
  { name: 'Google', percentage: 18, color: '#4285F4' },
  { name: 'Email', percentage: 12, color: '#F5A623' }
];

// Top performing products
const topProducts = computed(() => {
  // Sort products based on selected metric
  const sortedLinks = [...affiliateLinks.value].sort((a, b) => {
    if (topProductsMetric.value === 'clicks') {
      return b.clicks - a.clicks;
    } else if (topProductsMetric.value === 'conversions') {
      return b.conversions - a.conversions;
    } else {
      return b.revenue - a.revenue;
    }
  });

  // Get unique products from links
  const uniqueProductIds = new Set();
  const topProductsList = [];

  for (const link of sortedLinks) {
    if (!uniqueProductIds.has(link.productId)) {
      uniqueProductIds.add(link.productId);
      const product = products.value.find(p => p.id === link.productId);
      
      if (product) {
        // Combine stats from all links for this product
        const productLinks = affiliateLinks.value.filter(l => l.productId === link.productId);
        const clicks = productLinks.reduce((sum, link) => sum + link.clicks, 0);
        const conversions = productLinks.reduce((sum, link) => sum + link.conversions, 0);
        const revenue = productLinks.reduce((sum, link) => sum + link.revenue, 0);
        
        topProductsList.push({
          id: product.id,
          name: product.name,
          image: product.image,
          category: product.category,
          clicks,
          conversions,
          revenue
        });
      }
    }
    
    // Limit to top 8 products
    if (topProductsList.length >= 4) {
      break;
    }
  }

  return topProductsList;
});

// Filtered links
const filteredLinks = computed(() => {
  let results = [...affiliateLinks.value];
  
  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    results = results.filter(link => 
      link.name.toLowerCase().includes(query) || 
      link.productName.toLowerCase().includes(query)
    );
  }
  
  // Apply status filter
  if (filterStatus.value !== 'all') {
    results = results.filter(link => link.status === filterStatus.value);
  }
  
  // Apply sorting
  switch (sortBy.value) {
    case 'newest':
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case 'oldest':
      results.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      break;
    case 'clicks':
      results.sort((a, b) => b.clicks - a.clicks);
      break;
    case 'conversions':
      results.sort((a, b) => b.conversions - a.conversions);
      break;
  }
  
  return results;
});

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

const showCreateLinkModal = () => {
  editingLink.value = false;
  linkForm.value = {
    id: null,
    name: '',
    productId: null,
    productName: '',
    productImage: '',
    couponCode: '',
    utmSource: 'tiktok',
    utmMedium: 'social',
    utmCampaign: '',
    isActive: true
  };
  generatedLink.value = '';
  linkModalVisible.value = true;
};

const editLink = (link) => {
  editingLink.value = true;
  linkForm.value = {
    id: link.id,
    name: link.name,
    productId: link.productId,
    productName: link.productName,
    productImage: link.productImage,
    couponCode: link.couponCode,
    utmSource: link.utmSource,
    utmMedium: link.utmMedium,
    utmCampaign: link.utmCampaign,
    isActive: link.status === 'active'
  };
  generatedLink.value = link.url;
  linkModalVisible.value = true;
};

const handleProductSelect = (value) => {
  const selectedProduct = products.value.find(p => p.id === value);
  if (selectedProduct) {
    linkForm.value.productName = selectedProduct.name;
    linkForm.value.productImage = selectedProduct.image;
    
    // Generate link name if empty
    if (!linkForm.value.name) {
      linkForm.value.name = `${selectedProduct.name} - ${new Date().toLocaleDateString('vi-VN')}`;
    }
    
    // Generate preview link
    generateAffiliateLink();
  }
};

const generateAffiliateLink = () => {
  if (!linkForm.value.productId) return;
  
  const selectedProduct = products.value.find(p => p.id === linkForm.value.productId);
  if (!selectedProduct) return;
  
  // Create slug from product name
  const productSlug = selectedProduct.name
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, '');
  
  // Generate random ref code
  const refCode = Math.random().toString(36).substring(2, 8);
  
  // Build UTM parameters
  let utmParams = '';
  if (linkForm.value.utmSource) {
    utmParams += `&utm_source=${linkForm.value.utmSource}`;
  }
  if (linkForm.value.utmMedium) {
    utmParams += `&utm_medium=${linkForm.value.utmMedium}`;
  }
  if (linkForm.value.utmCampaign) {
    utmParams += `&utm_campaign=${linkForm.value.utmCampaign}`;
  }
  
  // Add coupon code if present
  if (linkForm.value.couponCode) {
    utmParams += `&coupon=${linkForm.value.couponCode}`;
  }
  
  // Build the final URL
  generatedLink.value = `https://tiktokshop.example.com/p/${productSlug}?ref=${refCode}${utmParams}`;
};

// Watch for changes to form and update link
watch(
  () => [
    linkForm.value.productId,
    linkForm.value.utmSource,
    linkForm.value.utmMedium,
    linkForm.value.utmCampaign,
    linkForm.value.couponCode
  ],
  () => {
    if (linkForm.value.productId) {
      generateAffiliateLink();
    }
  }
);

const saveLink = () => {
  if (!linkForm.value.productId) {
    message.error('Vui lòng chọn sản phẩm');
    return;
  }

  if (!linkForm.value.name) {
    message.error('Vui lòng nhập tên cho liên kết');
    return;
  }

  if (editingLink.value) {
    // Update existing link
    const linkIndex = affiliateLinks.value.findIndex(link => link.id === linkForm.value.id);
    if (linkIndex !== -1) {
      affiliateLinks.value[linkIndex].name = linkForm.value.name;
      affiliateLinks.value[linkIndex].productId = linkForm.value.productId;
      affiliateLinks.value[linkIndex].productName = linkForm.value.productName;
      affiliateLinks.value[linkIndex].productImage = linkForm.value.productImage;
      affiliateLinks.value[linkIndex].couponCode = linkForm.value.couponCode;
      affiliateLinks.value[linkIndex].utmSource = linkForm.value.utmSource;
      affiliateLinks.value[linkIndex].utmMedium = linkForm.value.utmMedium;
      affiliateLinks.value[linkIndex].utmCampaign = linkForm.value.utmCampaign;
      affiliateLinks.value[linkIndex].status = linkForm.value.isActive ? 'active' : 'inactive';
      affiliateLinks.value[linkIndex].url = generatedLink.value;
    }
    message.success('Liên kết đã được cập nhật');
  } else {
    // Create new link
    const newLink = {
      id: affiliateLinks.value.length + 1,
      name: linkForm.value.name,
      productId: linkForm.value.productId,
      productName: linkForm.value.productName,
      productImage: linkForm.value.productImage,
      productCategory: products.value.find(p => p.id === linkForm.value.productId)?.category || '',
      url: generatedLink.value,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      status: linkForm.value.isActive ? 'active' : 'inactive',
      createdAt: new Date().toISOString(),
      couponCode: linkForm.value.couponCode,
      utmSource: linkForm.value.utmSource,
      utmMedium: linkForm.value.utmMedium,
      utmCampaign: linkForm.value.utmCampaign
    };
    
    affiliateLinks.value.unshift(newLink);
    message.success('Liên kết mới đã được tạo');
  }
  
  linkModalVisible.value = false;
};

const createProductLink = (productId) => {
  const product = products.value.find(p => p.id === productId);
  if (product) {
    linkForm.value = {
      id: null,
      name: `${product.name} - ${new Date().toLocaleDateString('vi-VN')}`,
      productId: product.id,
      productName: product.name,
      productImage: product.image,
      couponCode: '',
      utmSource: 'tiktok',
      utmMedium: 'social',
      utmCampaign: '',
      isActive: true
    };
    
    editingLink.value = false;
    generateAffiliateLink();
    linkModalVisible.value = true;
  }
};

const showLinkDetail = (link) => {
  selectedLink.value = { ...link };
  detailModalVisible.value = true;
};

const shareLink = (link) => {
  selectedLink.value = { ...link };
  shareModalVisible.value = true;
};

const confirmDeleteLink = (link) => {
  // Show confirm modal
  if (confirm(`Bạn có chắc chắn muốn xóa liên kết "${link.name}"?`)) {
    const index = affiliateLinks.value.findIndex(l => l.id === link.id);
    if (index !== -1) {
      affiliateLinks.value.splice(index, 1);
      message.success('Đã xóa liên kết');
    }
  }
};

const copyLink = (url) => {
  navigator.clipboard.writeText(url).then(() => {
    message.success('Đã sao chép liên kết vào clipboard');
  });
};

const handleSearch = () => {
  console.log('Searching for:', searchQuery.value);
};

const filterProductOption = (input, option) => {
  return option.children[0].toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const shareToSocial = (platform) => {
  if (!selectedLink.value) return;
  
  const url = selectedLink.value.url;
  const text = `Khám phá ngay: ${selectedLink.value.productName}`;
  
  switch (platform) {
    case 'facebook':
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
      break;
    case 'twitter':
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
      break;
    case 'tiktok':
      // TikTok doesn't have a direct share URL, would need to use their API
      message.info('Tính năng chia sẻ trực tiếp TikTok đang được phát triển');
      break;
    case 'email':
      window.location.href = `mailto:?subject=${encodeURIComponent(`Chia sẻ: ${selectedLink.value.productName}`)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`;
      break;
  }
  
  message.success(`Đã chia sẻ liên kết qua ${platform}`);
  
  // Close the modal after sharing
  shareModalVisible.value = false;
};
</script>

<style scoped>
:deep(.ant-select-selector), 
:deep(.ant-input), 
:deep(.ant-input-search) {
  background-color: #222 !important;
  border-color: #333 !important;
  color: white !important;
}

:deep(.ant-select-selection-item) {
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

:deep(.ant-modal-content),
:deep(.ant-modal-header) {
  background-color: #121212 !important;
}

:deep(.ant-modal-title),
:deep(.ant-form-item-label > label) {
  color: white !important;
}

:deep(.ant-modal-close-x) {
  color: #d9d9d9 !important;
}

:deep(.ant-switch-checked) {
  background-color: #ec4899 !important;
}

:deep(.ant-progress-inner) {
  background-color: #333 !important;
}

:deep(.ant-progress-text) {
  color: white !important;
}

:deep(.ant-tag) {
  border: none;
}
</style>