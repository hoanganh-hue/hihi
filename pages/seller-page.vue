<!-- The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work. -->
<template>
<div class="min-h-screen bg-black text-white">
<!-- Header -->
<header class="bg-gradient-to-r from-[#1a1a1a] to-[#121212] border-b border-[#333] py-4 px-6 sticky top-0 z-50">
<div class="container mx-auto flex justify-between items-center">
<div class="flex items-center">
<h1 class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">TikTok Shop</h1>
</div>
<div class="flex items-center space-x-6">
<router-link to="/" class="text-gray-300 hover:text-pink-500 transition-colors duration-300">Trang chủ</router-link>
<div class="relative group">
  <a href="#" class="text-gray-300 hover:text-pink-500 transition-colors duration-300 flex items-center">
    Danh mục
    <down-outlined class="ml-1 text-xs transition-transform duration-300 group-hover:rotate-180" />
  </a>
  <div class="absolute top-full left-0 mt-2 w-[280px] bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-[#333] rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
    <div class="p-4">
      <div v-for="(category, index) in categories" :key="index" class="group/item relative">
        <router-link :to="`/category/${category.name.toLowerCase().replace(/ /g, '-')}`" class="flex items-center justify-between py-3 px-4 hover:bg-white/5 rounded-lg transition-colors duration-300">
          <div class="flex items-center">
            <component :is="category.icon" class="text-pink-500 mr-3" />
            <span class="text-gray-300 group-hover/item:text-pink-500 transition-colors duration-300">{{ category.name }}</span>
          </div>
          <right-outlined v-if="category.subCategories" class="text-xs text-gray-500" />
        </router-link>
        <div v-if="category.subCategories" class="absolute left-full top-0 ml-2 w-[240px] bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-[#333] rounded-xl shadow-xl opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-300">
          <div class="p-2">
            <router-link v-for="(subCategory, subIndex) in category.subCategories" :key="subIndex" :to="`/category/${subCategory.toLowerCase().replace(/ /g, '-')}`" class="block py-2 px-4 text-gray-300 hover:text-pink-500 hover:bg-white/5 rounded-lg transition-colors duration-300">
              {{ subCategory }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<router-link to="/promotions" class="text-gray-300 hover:text-pink-500 transition-colors duration-300">Khuyến mãi</router-link>
<router-link to="/seller" class="text-pink-500 font-medium transition-colors duration-300">Bán hàng</router-link>
<router-link to="/contact" class="text-gray-300 hover:text-pink-500 transition-colors duration-300">Liên hệ</router-link>
</div>
<div class="flex items-center space-x-4">
<a-button type="primary" class="!rounded-button bg-gradient-to-r from-pink-500 to-purple-600 border-none text-white font-medium whitespace-nowrap cursor-pointer">
<user-outlined class="mr-1" />
Đăng nhập
</a-button>
</div>
</div>
</header>
<!-- Hero Section -->
<section class="relative h-[600px] overflow-hidden">
<div class="absolute inset-0 bg-cover bg-center"
:style="{ backgroundImage: `url('${heroImage}')` }">
</div>
<div class="absolute inset-0 bg-gradient-to-r from-[#121212] via-[#12121299] to-transparent z-10"></div>
<div class="container mx-auto relative z-20 h-full flex items-center">
<div class="max-w-xl">
<h2 class="text-4xl font-bold mb-4">Bắt đầu kinh doanh trên TikTok Shop</h2>
<p class="text-lg text-gray-300 mb-8">Tiếp cận hàng triệu khách hàng tiềm năng và phát triển doanh nghiệp của bạn với nền tảng thương mại điện tử hàng đầu Việt Nam.</p>
<div class="flex space-x-4">
<a-button type="primary" size="large" class="!rounded-button bg-gradient-to-r from-pink-500 to-purple-600 border-none text-white font-medium px-8 py-2 whitespace-nowrap cursor-pointer" @click="showRegisterModal = true">
Đăng ký bán hàng
</a-button>
<a-button size="large" class="!rounded-button bg-transparent border border-white text-white font-medium px-8 py-2 whitespace-nowrap cursor-pointer hover:bg-white/10 transition-colors duration-300" @click="showLoginModal = true">
Đăng nhập cho người bán
</a-button>
</div>
</div>
</div>
</section>
<!-- Benefits Section -->
<section class="py-16 bg-[#0a0a0a]">
<div class="container mx-auto">
<h2 class="text-3xl font-bold mb-12 text-center">Lợi ích khi bán hàng trên TikTok Shop</h2>
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
<div v-for="(benefit, index) in benefits" :key="index" class="bg-gradient-to-br from-[#1a1a1a] to-[#111] rounded-xl p-6 border border-[#333] hover:border-pink-500/30 transition-colors duration-300">
<div class="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center mb-4">
<component :is="benefit.icon" class="text-2xl text-white" />
</div>
<h3 class="text-xl font-medium mb-3">{{ benefit.title }}</h3>
<p class="text-gray-400">{{ benefit.description }}</p>
</div>
</div>
</div>
</section>
<!-- Getting Started Steps -->
<section class="py-16 bg-[#121212]">
<div class="container mx-auto">
<h2 class="text-3xl font-bold mb-12 text-center">Bắt đầu bán hàng trong 4 bước đơn giản</h2>
<div class="relative">
<div class="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-500 to-purple-600 transform -translate-x-1/2 hidden md:block"></div>
<div class="space-y-16 md:space-y-0">
<div v-for="(step, index) in steps" :key="index" class="relative">
<div class="flex flex-col md:flex-row items-center md:items-start gap-8">
<div class="md:w-1/2 md:text-right md:pr-12" :class="{ 'md:order-2 md:text-left md:pr-0 md:pl-12': index % 2 !== 0 }">
<div class="bg-gradient-to-br from-[#1a1a1a] to-[#111] rounded-xl p-6 border border-[#333] hover:border-pink-500/30 transition-colors duration-300">
<h3 class="text-xl font-medium mb-3">{{ step.title }}</h3>
<p class="text-gray-400">{{ step.description }}</p>
</div>
</div>
<div class="absolute left-1/2 transform -translate-x-1/2 z-10 hidden md:flex items-center justify-center">
<div class="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold">
{{ index + 1 }}
</div>
</div>
<div class="md:w-1/2 md:pl-12" :class="{ 'md:order-1 md:pl-0 md:pr-12': index % 2 !== 0 }">
<div class="h-48 rounded-xl overflow-hidden">
<img :src="step.image" :alt="step.title" class="w-full h-full object-cover object-top" />
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</section>
<!-- Management Tools -->
<section class="py-16 bg-[#0a0a0a]">
<div class="container mx-auto">
<h2 class="text-3xl font-bold mb-12 text-center">Công cụ quản lý chuyên nghiệp</h2>
<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
<div v-for="(tool, index) in managementTools" :key="index" class="bg-gradient-to-br from-[#1a1a1a] to-[#111] rounded-xl overflow-hidden border border-[#333] hover:border-pink-500/30 transition-colors duration-300 group">
<div class="h-48 overflow-hidden">
<img :src="tool.image" :alt="tool.title" class="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
</div>
<div class="p-6">
<h3 class="text-xl font-medium mb-3">{{ tool.title }}</h3>
<p class="text-gray-400 mb-4">{{ tool.description }}</p>
<a-button type="link" class="!rounded-button p-0 text-pink-500 hover:text-pink-400 whitespace-nowrap cursor-pointer">
Tìm hiểu thêm
<right-outlined />
</a-button>
</div>
</div>
</div>
</div>
</section>
<!-- Stats Section -->
<section class="py-16 bg-[#121212] relative overflow-hidden">
<div class="absolute inset-0 bg-gradient-to-r from-[#121212] to-transparent z-10"></div>
<div class="absolute inset-0 bg-cover bg-center opacity-20"
:style="{ backgroundImage: `url('${statsBgImage}')` }">
</div>
<div class="container mx-auto relative z-20">
<h2 class="text-3xl font-bold mb-12 text-center">TikTok Shop trong con số</h2>
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
<div v-for="(stat, index) in stats" :key="index" class="bg-[#1a1a1a]/60 backdrop-blur-md rounded-xl p-6 border border-[#333] hover:border-pink-500/30 transition-colors duration-300 text-center">
<div class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-2">{{ stat.value }}</div>
<p class="text-gray-300">{{ stat.label }}</p>
</div>
</div>
</div>
</section>
<!-- Sales Performance -->
<section class="py-16 bg-[#0a0a0a]">
<div class="container mx-auto">
<div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
<div>
<h2 class="text-3xl font-bold mb-6">Theo dõi hiệu suất bán hàng</h2>
<p class="text-gray-300 mb-6">Nền tảng phân tích dữ liệu tiên tiến giúp bạn nắm bắt xu hướng thị trường, hiểu rõ khách hàng và tối ưu hóa chiến lược kinh doanh.</p>
<ul class="space-y-4 mb-8">
<li class="flex items-start">
<check-circle-outlined class="text-pink-500 mt-1 mr-2" />
<span>Báo cáo doanh số theo thời gian thực</span>
</li>
<li class="flex items-start">
<check-circle-outlined class="text-pink-500 mt-1 mr-2" />
<span>Phân tích hành vi người dùng chi tiết</span>
</li>
<li class="flex items-start">
<check-circle-outlined class="text-pink-500 mt-1 mr-2" />
<span>Dự báo xu hướng thị trường</span>
</li>
<li class="flex items-start">
<check-circle-outlined class="text-pink-500 mt-1 mr-2" />
<span>Tối ưu hóa hiệu suất quảng cáo</span>
</li>
</ul>
<a-button type="primary" class="!rounded-button bg-gradient-to-r from-pink-500 to-purple-600 border-none text-white font-medium px-8 py-2 whitespace-nowrap cursor-pointer" @click="goToSalesDemo">
Xem demo
</a-button>
</div>
<div class="bg-[#1a1a1a] rounded-xl p-6 border border-[#333]">
<h3 class="text-xl font-medium mb-4">Biểu đồ doanh số theo tháng</h3>
<div ref="chartContainer" class="h-80 w-full"></div>
</div>
</div>
</div>
</section>

<!-- Seller Policies -->
<section class="py-16 bg-[#121212]">
<div class="container mx-auto">
<h2 class="text-3xl font-bold mb-12 text-center">Chính sách người bán</h2>
<div class="max-w-3xl mx-auto">
<a-collapse v-model:activeKey="activeKeys" :bordered="false">
<a-collapse-panel v-for="policy in policies" :key="policy.key" :header="policy.title">
<div class="text-gray-300">
<p class="mb-4">{{ policy.description }}</p>
<ul class="list-disc pl-5 space-y-2">
<li v-for="(point, index) in policy.points" :key="index">{{ point }}</li>
</ul>
<a-button type="link" class="!rounded-button p-0 mt-4 text-pink-500 hover:text-pink-400 whitespace-nowrap cursor-pointer">
Xem chi tiết
<right-outlined />
</a-button>
</div>
</a-collapse-panel>
</a-collapse>
</div>
</div>
</section>
<!-- CTA Section -->
<section class="py-16 bg-[#0a0a0a] relative overflow-hidden">
<div class="absolute inset-0 bg-gradient-to-r from-[#121212] via-[#12121299] to-transparent z-10"></div>
<div class="absolute inset-0 bg-cover bg-center"
:style="{ backgroundImage: `url('${ctaImage}')` }">
</div>
<div class="container mx-auto relative z-20">
<div class="max-w-xl">
<h2 class="text-3xl font-bold mb-4">Sẵn sàng phát triển doanh nghiệp của bạn?</h2>
<p class="text-gray-300 mb-8">Tham gia cộng đồng người bán TikTok Shop ngay hôm nay và mở rộng tầm với kinh doanh của bạn.</p>
<div class="flex space-x-4">
<a-button type="primary" size="large" class="!rounded-button bg-gradient-to-r from-pink-500 to-purple-600 border-none text-white font-medium px-8 py-2 whitespace-nowrap cursor-pointer" @click="showRegisterModal = true">
Đăng ký ngay
</a-button>
<a-button size="large" class="!rounded-button bg-transparent border border-white text-white font-medium px-8 py-2 whitespace-nowrap cursor-pointer hover:bg-white/10 transition-colors duration-300">
Tư vấn miễn phí
</a-button>
</div>
</div>
</div>
</section>
<!-- Footer -->
<footer class="bg-[#0a0a0a] border-t border-[#333] pt-16 pb-8">
<div class="container mx-auto">
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
<div>
<h3 class="text-xl font-bold mb-6">TikTok Shop</h3>
<p class="text-gray-400 mb-6">Nền tảng thương mại điện tử hiện đại với trải nghiệm mua sắm và bán hàng tối ưu.</p>
<div class="flex space-x-4">
<a href="#" class="w-10 h-10 rounded-full bg-[#222] flex items-center justify-center text-gray-300 hover:bg-pink-500 hover:text-white transition-colors duration-300 cursor-pointer">
<facebook-outlined />
</a>
<a href="#" class="w-10 h-10 rounded-full bg-[#222] flex items-center justify-center text-gray-300 hover:bg-pink-500 hover:text-white transition-colors duration-300 cursor-pointer">
<twitter-outlined />
</a>
<a href="#" class="w-10 h-10 rounded-full bg-[#222] flex items-center justify-center text-gray-300 hover:bg-pink-500 hover:text-white transition-colors duration-300 cursor-pointer">
<instagram-outlined />
</a>
<a href="#" class="w-10 h-10 rounded-full bg-[#222] flex items-center justify-center text-gray-300 hover:bg-pink-500 hover:text-white transition-colors duration-300 cursor-pointer">
<youtube-outlined />
</a>
</div>
</div>
<div>
<h3 class="text-lg font-medium mb-6">Về chúng tôi</h3>
<ul class="space-y-3">
<li><a href="#" class="text-gray-400 hover:text-pink-500 transition-colors duration-300 cursor-pointer">Giới thiệu</a></li>
<li><a href="#" class="text-gray-400 hover:text-pink-500 transition-colors duration-300 cursor-pointer">Tuyển dụng</a></li>
<li><a href="#" class="text-gray-400 hover:text-pink-500 transition-colors duration-300 cursor-pointer">Tin tức</a></li>
<li><a href="#" class="text-gray-400 hover:text-pink-500 transition-colors duration-300 cursor-pointer">Liên hệ</a></li>
</ul>
</div>
<div>
<h3 class="text-lg font-medium mb-6">Hỗ trợ người bán</h3>
<ul class="space-y-3">
<li><a href="#" class="text-gray-400 hover:text-pink-500 transition-colors duration-300 cursor-pointer">Trung tâm hỗ trợ</a></li>
<li><a href="#" class="text-gray-400 hover:text-pink-500 transition-colors duration-300 cursor-pointer">Quy định người bán</a></li>
<li><a href="#" class="text-gray-400 hover:text-pink-500 transition-colors duration-300 cursor-pointer">Hướng dẫn bán hàng</a></li>
<li><a href="#" class="text-gray-400 hover:text-pink-500 transition-colors duration-300 cursor-pointer">Chính sách vận chuyển</a></li>
<li><a href="#" class="text-gray-400 hover:text-pink-500 transition-colors duration-300 cursor-pointer">Chương trình đối tác</a></li>
</ul>
</div>
<div>
<h3 class="text-lg font-medium mb-6">Chính sách</h3>
<ul class="space-y-3">
<li><a href="#" class="text-gray-400 hover:text-pink-500 transition-colors duration-300 cursor-pointer">Điều khoản dịch vụ</a></li>
<li><a href="#" class="text-gray-400 hover:text-pink-500 transition-colors duration-300 cursor-pointer">Chính sách bảo mật</a></li>
<li><a href="#" class="text-gray-400 hover:text-pink-500 transition-colors duration-300 cursor-pointer">Quyền sở hữu trí tuệ</a></li>
<li><a href="#" class="text-gray-400 hover:text-pink-500 transition-colors duration-300 cursor-pointer">Chính sách hoàn tiền</a></li>
<li><a href="#" class="text-gray-400 hover:text-pink-500 transition-colors duration-300 cursor-pointer">Giải quyết tranh chấp</a></li>
</ul>
</div>
</div>
<div class="border-t border-[#333] pt-8 mt-8 text-center text-gray-500 text-sm">
<p>© 2023 TikTok Shop. Tất cả các quyền được bảo lưu.</p>
</div>
</div>
</footer>
<!-- Login Modal -->
<a-modal v-model:visible="showLoginModal" title="Đăng nhập cho người bán" :footer="null" centered :width="400">
<a-form layout="vertical">
<a-form-item label="Email" name="email">
<a-input placeholder="Nhập email" />
</a-form-item>
<a-form-item label="Mật khẩu" name="password">
<a-input-password placeholder="Nhập mật khẩu" />
</a-form-item>
<div class="flex justify-between mb-4">
<a-checkbox>Ghi nhớ đăng nhập</a-checkbox>
<a href="#" class="text-pink-500 hover:text-pink-400 cursor-pointer">Quên mật khẩu?</a>
</div>
<a-button type="primary" block class="bg-gradient-to-r from-pink-500 to-purple-600 border-none">Đăng nhập</a-button>
<div class="text-center mt-4">
<p>Chưa có tài khoản? <a href="#" class="text-pink-500 hover:text-pink-400 cursor-pointer" @click="showRegisterModal = true; showLoginModal = false">Đăng ký ngay</a></p>
</div>
</a-form>
</a-modal>
<!-- Register Modal -->
<a-modal v-model:visible="showRegisterModal" title="Đăng ký bán hàng" :footer="null" centered :width="600">
<a-form layout="vertical">
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
<a-form-item label="Họ và tên" name="fullName">
<a-input placeholder="Nhập họ và tên" />
</a-form-item>
<a-form-item label="Email" name="email">
<a-input placeholder="Nhập email" />
</a-form-item>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
<a-form-item label="Số điện thoại" name="phone">
<a-input placeholder="Nhập số điện thoại" />
</a-form-item>
<a-form-item label="Loại người bán" name="sellerType">
<a-select placeholder="Chọn loại người bán">
<a-select-option value="individual">Cá nhân</a-select-option>
<a-select-option value="business">Doanh nghiệp</a-select-option>
</a-select>
</a-form-item>
</div>
<a-form-item label="Tên cửa hàng" name="storeName">
<a-input placeholder="Nhập tên cửa hàng" />
</a-form-item>
<a-form-item label="Mô tả cửa hàng" name="storeDescription">
<a-textarea placeholder="Nhập mô tả cửa hàng" :rows="3" />
</a-form-item>
<a-form-item label="Mật khẩu" name="password">
<a-input-password placeholder="Nhập mật khẩu" />
</a-form-item>
<a-form-item label="Nhập lại mật khẩu" name="confirmPassword">
<a-input-password placeholder="Nhập lại mật khẩu" />
</a-form-item>
<a-form-item>
<a-checkbox>Tôi đồng ý với <a href="#" class="text-pink-500 hover:text-pink-400 cursor-pointer">Điều khoản dịch vụ</a> và <a href="#" class="text-pink-500 hover:text-pink-400 cursor-pointer">Chính sách bảo mật</a> của TikTok Shop</a-checkbox>
</a-form-item>
<a-button type="primary" block class="bg-gradient-to-r from-pink-500 to-purple-600 border-none">Đăng ký</a-button>
<div class="text-center mt-4">
<p>Đã có tài khoản? <a href="#" class="text-pink-500 hover:text-pink-400 cursor-pointer" @click="showLoginModal = true; showRegisterModal = false">Đăng nhập</a></p>
</div>
</a-form>
</a-modal>
</div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import {
  UserOutlined,
  RightOutlined,
  DownOutlined,
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  CheckCircleOutlined,
  ShopOutlined,
  BarChartOutlined,
  UserSwitchOutlined,
  RocketOutlined,
  GiftOutlined,
  LineChartOutlined,
  BulbOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  TrophyOutlined,
  TeamOutlined,
  GlobalOutlined,
  SmileOutlined,
  CustomerServiceOutlined,
  ShoppingOutlined,
  MobileOutlined,
  TagOutlined,
  GoldOutlined,
  CrownOutlined
} from '@ant-design/icons-vue';
import ApexCharts from 'apexcharts/dist/apexcharts.common';

// Hero image
const heroImage = 'https://readdy.ai/api/search-image?query=Futuristic%2520fashion%2520store%2520interior%2520with%2520holographic%2520displays%2520showing%2520trendy%2520spring%2520summer%2520clothing%2520collection%2520floating%2520in%2520dark%2520space%2520with%2520pink%2520and%2520purple%2520neon%2520lighting%2520creating%2520a%2520high-tech%2520shopping%2520atmosphere%2520with%2520digital%2520product%2520information%2520panels&width=1280&height=720&seq=101&orientation=landscape';

// Other background images
const statsBgImage = 'https://readdy.ai/api/search-image?query=Abstract%2520dark%2520purple%2520and%2520blue%2520data%2520visualization%2520with%2520glowing%2520connections%2520and%2520nodes%2520high-tech%2520business%2520analytics%2520concept%2520digital%2520marketing%2520background%2520with%2520minimal%2520design%2520elegant%2520tech%2520pattern&width=1280&height=720&seq=102&orientation=landscape';

const ctaImage = 'https://readdy.ai/api/search-image?query=Professional%2520woman%2520and%2520man%2520in%2520modern%2520office%2520looking%2520at%2520holographic%2520display%2520with%2520shopping%2520analytics%2520and%2520product%2520data%2520high-tech%2520e-commerce%2520management%2520concept%2520with%2520purple%2520and%2520blue%2520lighting%2520premium%2520business%2520atmosphere&width=1280&height=720&seq=103&orientation=landscape';

// Charts container
const chartContainer = ref(null);

// Login/Register modals
const showLoginModal = ref(false);
const showRegisterModal = ref(false);

// Active collapse panels
const activeKeys = ref(['1']);

// Category menu
const categories = [
  {
    name: 'Thời trang',
    icon: ShopOutlined,
    subCategories: ['Thời trang nam', 'Thời trang nữ', 'Giày dép', 'Túi xách', 'Phụ kiện']
  },
  {
    name: 'Điện tử',
    icon: MobileOutlined,
    subCategories: ['Điện thoại', 'Máy tính', 'Máy ảnh', 'Thiết bị âm thanh', 'Phụ kiện']
  },
  {
    name: 'Nhà cửa',
    icon: ShoppingOutlined,
    subCategories: ['Nội thất', 'Đồ dùng nhà bếp', 'Trang trí', 'Đèn', 'Dụng cụ']
  },
  {
    name: 'Sức khỏe & Làm đẹp',
    icon: SmileOutlined,
    subCategories: ['Mỹ phẩm', 'Chăm sóc da', 'Nước hoa', 'Thực phẩm chức năng', 'Dụng cụ làm đẹp']
  },
  {
    name: 'Thể thao & Du lịch',
    icon: TrophyOutlined,
    subCategories: ['Đồ thể thao', 'Thiết bị tập luyện', 'Đồ dùng dã ngoại', 'Vali & Túi du lịch']
  },
  {
    name: 'Quản lý shop',
    icon: CrownOutlined,
    subCategories: ['Đăng nhập', 'Đăng ký bán hàng', 'Trung tâm người bán', 'Thống kê', 'Hỗ trợ']
  }
];

// Benefits
const benefits = [
  {
    title: 'Tiếp cận khách hàng',
    description: 'Tiếp cận hàng triệu người dùng TikTok mỗi ngày, mở rộng thị trường và tăng doanh số bán hàng.',
    icon: UserSwitchOutlined
  },
  {
    title: 'Công cụ marketing',
    description: 'Tận dụng các công cụ marketing mạnh mẽ, từ quảng cáo có nhắm mục tiêu đến các chiến dịch khuyến mãi.',
    icon: RocketOutlined
  },
  {
    title: 'Phân tích dữ liệu',
    description: 'Theo dõi hiệu suất bán hàng với các báo cáo và phân tích chi tiết, tối ưu hóa chiến lược kinh doanh.',
    icon: BarChartOutlined
  },
  {
    title: 'Thanh toán an toàn',
    description: 'Hệ thống thanh toán an toàn và bảo mật, đảm bảo các giao dịch được xử lý nhanh chóng và đáng tin cậy.',
    icon: DollarOutlined
  }
];

// Steps
const steps = [
  {
    title: 'Đăng ký tài khoản người bán',
    description: 'Tạo tài khoản người bán trên TikTok Shop chỉ trong vài phút với thông tin cơ bản của bạn.',
    image: 'https://readdy.ai/api/search-image?query=Person%2520setting%2520up%2520online%2520shop%2520account%2520on%2520laptop%2520with%2520digital%2520registration%2520form%2520and%2520verification%2520screen%2520modern%2520workspace%2520with%2520purple%2520ambient%2520lighting%2520professional%2520e-commerce%2520setup%2520process&width=600&height=400&seq=201&orientation=landscape'
  },
  {
    title: 'Thiết lập cửa hàng của bạn',
    description: 'Tùy chỉnh giao diện cửa hàng, thêm logo, mô tả và thông tin liên hệ để tạo thương hiệu riêng.',
    image: 'https://readdy.ai/api/search-image?query=Person%2520designing%2520online%2520store%2520interface%2520on%2520computer%2520with%2520product%2520layout%2520and%2520branding%2520elements%2520modern%2520workspace%2520with%2520pink%2520and%2520blue%2520ambient%2520lighting%2520professional%2520e-commerce%2520customization%2520process&width=600&height=400&seq=202&orientation=landscape'
  },
  {
    title: 'Đăng sản phẩm và đặt giá',
    description: 'Thêm sản phẩm với hình ảnh chất lượng, mô tả chi tiết và giá cả hợp lý để thu hút khách hàng.',
    image: 'https://readdy.ai/api/search-image?query=Person%2520uploading%2520product%2520photos%2520and%2520setting%2520prices%2520on%2520laptop%2520with%2520digital%2520catalog%2520interface%2520modern%2520workspace%2520with%2520purple%2520ambient%2520lighting%2520professional%2520e-commerce%2520product%2520management%2520process&width=600&height=400&seq=203&orientation=landscape'
  },
  {
    title: 'Quản lý đơn hàng và phát triển',
    description: 'Xử lý đơn hàng, theo dõi vận chuyển và sử dụng analytics để tăng trưởng doanh nghiệp.',
    image: 'https://readdy.ai/api/search-image?query=Person%2520managing%2520e-commerce%2520orders%2520on%2520laptop%2520with%2520shipping%2520tracking%2520and%2520analytics%2520dashboard%2520modern%2520workspace%2520with%2520blue%2520ambient%2520lighting%2520professional%2520online%2520business%2520management%2520process&width=600&height=400&seq=204&orientation=landscape'
  }
];

// Management tools
const managementTools = [
  {
    title: 'Quản lý sản phẩm',
    description: 'Hệ thống quản lý sản phẩm trực quan giúp bạn dễ dàng thêm, sửa và tổ chức danh mục sản phẩm.',
    image: 'https://readdy.ai/api/search-image?query=Digital%2520product%2520management%2520dashboard%2520with%2520inventory%2520tracking%2520and%2520catalog%2520organization%2520features%2520on%2520laptop%2520screen%2520with%2520purple%2520ambient%2520lighting%2520professional%2520e-commerce%2520management%2520interface&width=600&height=400&seq=301&orientation=landscape'
  },
  {
    title: 'Phân tích doanh số',
    description: 'Công cụ phân tích hiệu suất bán hàng mạnh mẽ giúp bạn đưa ra quyết định kinh doanh sáng suốt.',
    image: 'https://readdy.ai/api/search-image?query=Sales%2520analytics%2520dashboard%2520with%2520charts%2520graphs%2520and%2520KPIs%2520showing%2520e-commerce%2520performance%2520metrics%2520on%2520computer%2520screen%2520with%2520blue%2520ambient%2520lighting%2520professional%2520business%2520intelligence%2520interface&width=600&height=400&seq=302&orientation=landscape'
  },
  {
    title: 'Marketing tích hợp',
    description: 'Tạo và quản lý chiến dịch quảng cáo, khuyến mãi và chương trình khách hàng thân thiết.',
    image: 'https://readdy.ai/api/search-image?query=Integrated%2520marketing%2520platform%2520with%2520campaign%2520management%2520promotion%2520creator%2520and%2520customer%2520loyalty%2520program%2520tools%2520on%2520screen%2520with%2520pink%2520ambient%2520lighting%2520professional%2520e-commerce%2520marketing%2520interface&width=600&height=400&seq=303&orientation=landscape'
  }
];

// Stats
const stats = [
  {
    value: '20+ triệu',
    label: 'Người dùng hoạt động'
  },
  {
    value: '5.000+',
    label: 'Người bán thành công'
  },
  {
    value: '150+ tỷ',
    label: 'Doanh số hàng năm'
  },
  {
    value: '98.5%',
    label: 'Đánh giá tích cực'
  }
];

// Policies
const policies = [
  {
    key: '1',
    title: 'Chính sách đăng ký người bán',
    description: 'Để trở thành người bán trên TikTok Shop, bạn cần đáp ứng các yêu cầu sau:',
    points: [
      'Có giấy phép kinh doanh hợp lệ (đối với doanh nghiệp)',
      'Cung cấp thông tin xác thực và đầy đủ',
      'Tuân thủ các quy định về sản phẩm được phép kinh doanh',
      'Hoàn thành quá trình xác minh danh tính'
    ]
  },
  {
    key: '2',
    title: 'Phí và thanh toán',
    description: 'TikTok Shop áp dụng mô hình phí hợp lý và minh bạch cho người bán:',
    points: [
      'Phí đăng ký: Miễn phí',
      'Phí giao dịch: 2-5% tùy theo danh mục sản phẩm',
      'Chu kỳ thanh toán: 7-15 ngày sau khi đơn hàng hoàn thành',
      'Phương thức thanh toán: Chuyển khoản ngân hàng, ví điện tử'
    ]
  },
  {
    key: '3',
    title: 'Vận chuyển và giao hàng',
    description: 'TikTok Shop cung cấp nhiều tùy chọn vận chuyển cho người bán:',
    points: [
      'Tích hợp với nhiều đơn vị vận chuyển uy tín',
      'Theo dõi đơn hàng theo thời gian thực',
      'Tự động cập nhật trạng thái cho người mua',
      'Chính sách hoàn trả và đổi hàng linh hoạt'
    ]
  },
  {
    key: '4',
    title: 'Hỗ trợ người bán',
    description: 'TikTok Shop cam kết hỗ trợ người bán trong suốt quá trình kinh doanh:',
    points: [
      'Đội ngũ hỗ trợ chuyên nghiệp 24/7',
      'Tài liệu hướng dẫn và khóa học trực tuyến',
      'Cộng đồng người bán để chia sẻ kinh nghiệm',
      'Công cụ giải quyết tranh chấp hiệu quả'
    ]
  }
];

// Chart initialization
onMounted(() => {
  setTimeout(() => {
    if (chartContainer.value) {
      try {
        const options = {
          series: [{
            name: "Doanh số",
            data: [80, 120, 105, 160, 150, 180, 200, 230, 240, 250, 260, 280]
          }],
          chart: {
            height: 320,
            type: 'area',
            fontFamily: 'inherit',
            toolbar: {
              show: false
            },
            background: 'transparent'
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: 'smooth',
            width: 3
          },
          colors: ['#ec4899'],
          fill: {
            type: 'gradient',
            gradient: {
              shadeIntensity: 1,
              opacityFrom: 0.7,
              opacityTo: 0.3,
              stops: [0, 90, 100],
              colorStops: [
                {
                  offset: 0,
                  color: '#ec4899',
                  opacity: 0.4
                },
                {
                  offset: 100,
                  color: '#9333ea',
                  opacity: 0
                },
              ]
            }
          },
          grid: {
            borderColor: '#333',
            strokeDashArray: 5,
            xaxis: {
              lines: {
                show: true
              }
            },
            yaxis: {
              lines: {
                show: true
              }
            }
          },
          xaxis: {
            categories: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
            labels: {
              style: {
                colors: '#9ca3af'
              }
            },
            axisBorder: {
              show: false
            },
            axisTicks: {
              show: false
            }
          },
          yaxis: {
            labels: {
              style: {
                colors: '#9ca3af'
              },
              formatter: function (value) {
                // Chuyển đổi sang USD với tỷ giá 26.000 VND = 1 USD
                const valueInUSD = (value / 26).toFixed(2);
                return "$" + valueInUSD + "K";
              }
            }
          },
          tooltip: {
            theme: 'dark',
            y: {
              formatter: function(value) {
                // Chuyển đổi sang USD với tỷ giá 26.000 VND = 1 USD
                const valueInUSD = (value / 26).toFixed(2);
                return "$" + valueInUSD + " nghìn USD";
              }
            }
          }
        };

        // Sử dụng import đã cài đặt
        const chart = new ApexCharts(chartContainer.value, options);
        chart.render();
      } catch (error) {
        console.error("Lỗi khi khởi tạo biểu đồ:", error);
      }
    }
  }, 500); // Thêm độ trễ để đảm bảo DOM đã được tạo
});
</script>

<style scoped>
:deep(.ant-collapse) {
  background: transparent;
}

:deep(.ant-collapse-item) {
  border-color: #333;
}

:deep(.ant-collapse-header) {
  color: white !important;
  font-weight: 500;
}

:deep(.ant-collapse-content) {
  background: #1a1a1a;
  border-color: #333;
}

:deep(.ant-select-dropdown) {
  background-color: #1a1a1a;
  border: 1px solid #333;
}

:deep(.ant-select-item) {
  color: #f3f4f6;
}

:deep(.ant-select-item-option-active:not(.ant-select-item-option-disabled)) {
  background-color: rgba(255, 255, 255, 0.08);
}

:deep(.ant-select-item-option-selected:not(.ant-select-item-option-disabled)) {
  background-color: rgba(236, 72, 153, 0.1);
  color: #ec4899;
}

:deep(.ant-btn-link) {
  color: #ec4899;
  border: none;
  background: transparent;
  padding: 0;
}

:deep(.ant-btn-link:hover) {
  color: #f472b6;
}
</style>
