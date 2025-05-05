<!-- The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work. -->
<template>
<div class="min-h-screen bg-black text-white">
<!-- Header -->
<header class="bg-gradient-to-r from-[#1a1a1a] to-[#121212] border-b border-[#333] py-4 px-6">
<div class="container mx-auto flex justify-between items-center">
<div class="flex items-center">
<h1 class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">TikTok Shop</h1>
</div>
<div class="flex items-center space-x-6">
<a href="#" class="text-pink-500 transition-colors duration-300">Trang chủ</a>
<router-link to="/category" class="text-gray-300 hover:text-pink-500 transition-colors duration-300">Danh mục</router-link>
<a href="#" class="text-gray-300 hover:text-pink-500 transition-colors duration-300">Khuyến mãi</a>
<router-link to="/seller" class="text-gray-300 hover:text-pink-500 transition-colors duration-300">Bán hàng</router-link>
<router-link to="/contact" class="text-gray-300 hover:text-pink-500 transition-colors duration-300">Liên hệ</router-link>
</div>
<div class="flex items-center space-x-4">
<a-input-search
placeholder="Tìm kiếm sản phẩm"
class="w-64 rounded-full bg-[#222] border-[#333]"
:style="{ background: '#222', borderColor: '#333' }"
>
<template #prefix>
<search-outlined class="text-gray-400" />
</template>
</a-input-search>
<a-dropdown :trigger="['click']" placement="bottomRight">
<a class="text-gray-300 hover:text-pink-500 cursor-pointer">
<shopping-cart-outlined class="text-xl" />
<span v-if="cartItems.length > 0" class="absolute -top-2 -right-2 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center text-xs text-white">
{{ cartItems.length }}
</span>
</a>
<template #overlay>
<div class="bg-[#1a1a1a] border border-[#333] rounded-lg p-4 w-[400px] max-h-[600px] overflow-y-auto">
<div v-if="cartItems.length === 0" class="text-center py-8">
<shopping-cart-outlined class="text-4xl text-gray-400 mb-4" />
<p class="text-gray-300 mb-4">Giỏ hàng của bạn đang trống</p>
<a-button type="primary" class="!rounded-button bg-gradient-to-r from-pink-500 to-purple-600 border-none text-white font-medium whitespace-nowrap cursor-pointer">
Tiếp tục mua sắm
</a-button>
</div>
<template v-else>
<div class="space-y-4">
<div v-for="(item, index) in cartItems" :key="index" class="flex items-center gap-4 pb-4 border-b border-[#333]">
<img :src="item.image" :alt="item.name" class="w-20 h-20 object-cover rounded-lg" />
<div class="flex-1">
<h4 class="text-sm text-white font-medium line-clamp-2">{{ item.name }}</h4>
<div class="flex items-center mt-2">
<div class="flex items-center border border-[#333] rounded-lg">
<button class="px-2 py-1 text-gray-400 hover:text-white" @click="decreaseQuantity(index)">-</button>
<span class="px-3 text-white">{{ item.quantity }}</span>
<button class="px-2 py-1 text-gray-400 hover:text-white" @click="increaseQuantity(index)">+</button>
</div>
<span class="ml-auto text-pink-500 font-medium">${{ formatPrice(item.price * item.quantity) }}</span>
</div>
</div>
<button class="text-gray-400 hover:text-white p-1" @click="removeFromCart(index)">
<delete-outlined />
</button>
</div>
</div>
<div class="mt-4 pt-4 border-t border-[#333]">
<div class="flex justify-between text-white mb-4">
<span>Tổng tiền:</span>
<span class="text-pink-500 font-bold">${{ formatPrice(totalAmount) }}</span>
</div>
<div class="flex gap-2">
<a-button class="flex-1 !rounded-button bg-[#222] border-[#333] text-gray-300 whitespace-nowrap cursor-pointer">
Xem giỏ hàng
</a-button>
<a-button type="primary" class="flex-1 !rounded-button bg-gradient-to-r from-pink-500 to-purple-600 border-none text-white font-medium whitespace-nowrap cursor-pointer">
Thanh toán
</a-button>
</div>
</div>
</template>
</div>
</template>
</a-dropdown>
<div class="relative">
<a-dropdown :trigger="['click']">
<a class="text-gray-300 hover:text-pink-500 cursor-pointer">
<user-outlined class="text-xl" />
</a>
<template #overlay>
<a-menu class="!bg-[#1a1a1a] !min-w-[200px] !border !border-[#333]">
<template v-if="!isLoggedIn">
<a-menu-item class="!text-gray-300 hover:!text-pink-500 !bg-transparent" @click="showAuthModal = true; authMode = 'login'">
<template #icon><login-outlined /></template>
Đăng nhập
</a-menu-item>
<a-menu-item class="!text-gray-300 hover:!text-pink-500 !bg-transparent" @click="showAuthModal = true; authMode = 'register'">
<template #icon><user-add-outlined /></template>
Đăng ký
</a-menu-item>
</template>
<template v-else>
<a-menu-item class="!text-gray-300 hover:!text-pink-500 !bg-transparent">
<template #icon><user-outlined /></template>
Tài khoản của tôi
</a-menu-item>
<a-menu-item class="!text-gray-300 hover:!text-pink-500 !bg-transparent">
<template #icon><shopping-outlined /></template>
Đơn hàng của tôi
</a-menu-item>
<a-menu-item class="!text-gray-300 hover:!text-pink-500 !bg-transparent">
<template #icon><heart-outlined /></template>
Sản phẩm yêu thích
</a-menu-item>
<a-menu-item class="!text-gray-300 hover:!text-pink-500 !bg-transparent">
<template #icon><setting-outlined /></template>
Cài đặt
</a-menu-item>
<a-menu-divider class="!bg-[#333]" />
<a-menu-item class="!text-gray-300 hover:!text-pink-500 !bg-transparent">
<template #icon><logout-outlined /></template>
Đăng xuất
</a-menu-item>
</template>
</a-menu>
</template>
</a-dropdown>
</div>
</div>
</div>
</header>
<!-- Hero Section -->
<section class="relative h-[500px] overflow-hidden">
<div class="absolute inset-0 bg-gradient-to-r from-[#121212] to-transparent z-10"></div>
<div
class="absolute inset-0 bg-cover bg-center"
:style="{ backgroundImage: `url('${heroImage}')` }"
></div>
<div class="container mx-auto relative z-20 h-full flex items-center">
<div class="max-w-lg">
<h2 class="text-4xl font-bold mb-4">Mua sắm thông minh cùng TikTok Shop</h2>
<p class="text-lg text-gray-300 mb-8">Khám phá thế giới sản phẩm 3D sống động với trải nghiệm mua sắm đột phá. Thanh toán an toàn, giao hàng nhanh chóng.</p>
<a-button type="primary" size="large" class="!rounded-button bg-gradient-to-r from-pink-500 to-purple-600 border-none text-white font-medium px-8 py-2 whitespace-nowrap cursor-pointer">
Khám phá ngay
</a-button>
</div>
</div>
</section>

<!-- Categories Section - Thay thế bằng CategoryGrid component -->
<CategoryGrid />

<!-- Featured Products -->
<section class="py-16 bg-[#121212]">
<div class="container mx-auto">
<div class="flex justify-between items-center mb-10">
<h2 class="text-2xl font-bold">Sản phẩm nổi bật</h2>
<div class="flex space-x-2">
<a-button
class="!rounded-button bg-[#222] border-[#333] text-gray-300 whitespace-nowrap cursor-pointer"
@click="currentCategory = 'all'"
:class="{'bg-gradient-to-r from-pink-500 to-purple-600 border-none text-white': currentCategory === 'all'}"
>
Tất cả
</a-button>
<a-button
v-for="(cat, index) in ['Giày dép', 'Điện thoại', 'Thời trang']"
:key="index"
class="!rounded-button bg-[#222] border-[#333] text-gray-300 whitespace-nowrap cursor-pointer"
@click="currentCategory = cat"
:class="{'bg-gradient-to-r from-pink-500 to-purple-600 border-none text-white': currentCategory === cat}"
>
{{ cat }}
</a-button>
</div>
</div>
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
<div v-for="(product, index) in featuredProducts" :key="index" class="bg-gradient-to-br from-[#1a1a1a] to-[#111] rounded-xl overflow-hidden hover:shadow-lg hover:shadow-pink-500/10 transition-all duration-300 border border-[#333] group">
<div class="relative h-64 overflow-hidden">
<img :src="product.image" :alt="product.name" class="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110" />
<div class="absolute top-0 right-0 m-2 bg-pink-500 text-white text-xs px-2 py-1 rounded-full">
-{{ product.discount }}%
</div>
<div class="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
<a-button type="primary" class="!rounded-button bg-white text-black border-none font-medium whitespace-nowrap cursor-pointer">
<eye-outlined />
Xem chi tiết
</a-button>
</div>
</div>
<div class="p-4">
<div class="flex items-center mb-2">
<div class="text-xs text-gray-400">{{ product.brand }}</div>
<div class="ml-auto flex">
<star-filled class="text-yellow-400 text-xs" v-for="i in 5" :key="i" />
</div>
</div>
<h3 class="font-medium mb-2 line-clamp-2 h-12">{{ product.name }}</h3>
<div class="flex items-center justify-between">
<div>
<span class="text-pink-500 font-bold">${{ formatPrice(product.price) }}</span>
<span class="text-gray-400 text-sm line-through ml-2">${{ formatPrice(product.originalPrice) }}</span>
</div>
<a-button type="primary" shape="circle" class="!rounded-button bg-gradient-to-r from-pink-500 to-purple-600 border-none whitespace-nowrap cursor-pointer">
<shopping-cart-outlined />
</a-button>
</div>
</div>
</div>
</div>
<div class="flex justify-center mt-10">
<a-button type="primary" class="!rounded-button bg-gradient-to-r from-pink-500 to-purple-600 border-none text-white font-medium px-8 py-2 whitespace-nowrap cursor-pointer">
Xem thêm sản phẩm
</a-button>
</div>
</div>
</section>
<!-- 3D Experience Banner -->
<section class="py-16 bg-[#0a0a0a] relative overflow-hidden">
<div class="absolute inset-0 bg-gradient-to-r from-[#121212] to-transparent z-10"></div>
<div
class="absolute inset-0 bg-cover bg-center"
:style="{ backgroundImage: `url('${experienceBannerImage}')` }"
></div>
<div class="container mx-auto relative z-20">
<div class="max-w-lg">
<h2 class="text-3xl font-bold mb-4">Trải nghiệm mua sắm 3D</h2>
<p class="text-gray-300 mb-8">Khám phá sản phẩm với công nghệ 3D tiên tiến. Xoay, phóng to và xem chi tiết sản phẩm từ mọi góc độ trước khi quyết định mua hàng.</p>
<div class="flex space-x-4">
<a-button type="primary" class="!rounded-button bg-gradient-to-r from-pink-500 to-purple-600 border-none text-white font-medium whitespace-nowrap cursor-pointer">
Khám phá ngay
</a-button>
<a-button class="!rounded-button bg-transparent border border-white text-white font-medium whitespace-nowrap cursor-pointer">
Tìm hiểu thêm
</a-button>
</div>
</div>
</div>
</section>
<!-- Brands Section -->
<section class="py-16 bg-[#121212]">
<div class="container mx-auto">
<h2 class="text-2xl font-bold mb-10 text-center">Thương hiệu nổi bật</h2>
<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-6">
<div v-for="(brand, index) in brands" :key="index" class="bg-[#1a1a1a] rounded-xl p-6 flex flex-col items-center justify-center hover:bg-[#222] transition-colors duration-300 border border-[#333] cursor-pointer">
<component :is="brand.icon" class="text-4xl text-gray-300 mb-3" />
<h3 class="font-medium text-center">{{ brand.name }}</h3>
</div>
</div>
</div>
</section>
<!-- Features Section -->
<section class="py-16 bg-[#0a0a0a]">
<div class="container mx-auto">
<h2 class="text-2xl font-bold mb-12 text-center">Tại sao chọn TikTok Shop?</h2>
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
<div v-for="(feature, index) in features" :key="index" class="bg-gradient-to-br from-[#1a1a1a] to-[#111] rounded-xl p-6 border border-[#333] hover:border-pink-500/30 transition-colors duration-300">
<div class="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center mb-4">
<component :is="feature.icon" class="text-2xl text-white" />
</div>
<h3 class="text-xl font-medium mb-3">{{ feature.title }}</h3>
<p class="text-gray-400">{{ feature.description }}</p>
</div>
</div>
</div>
</section>
<!-- Affiliate Section -->
<section class="py-16 bg-[#121212]">
<div class="container mx-auto">
<div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
<div>
<h2 class="text-3xl font-bold mb-6">Chương trình tiếp thị liên kết</h2>
<p class="text-gray-300 mb-6">Kiếm thu nhập bằng cách chia sẻ sản phẩm từ TikTok Shop. Nhận hoa hồng hấp dẫn cho mỗi đơn hàng thành công.</p>
<ul class="space-y-4 mb-8">
<li class="flex items-start">
<check-circle-outlined class="text-pink-500 mt-1 mr-2" />
<span>Đăng ký miễn phí, bắt đầu ngay</span>
</li>
<li class="flex items-start">
<check-circle-outlined class="text-pink-500 mt-1 mr-2" />
<span>Hoa hồng hấp dẫn lên đến 30%</span>
</li>
<li class="flex items-start">
<check-circle-outlined class="text-pink-500 mt-1 mr-2" />
<span>Thanh toán nhanh chóng và an toàn</span>
</li>
<li class="flex items-start">
<check-circle-outlined class="text-pink-500 mt-1 mr-2" />
<span>Công cụ tiếp thị chuyên nghiệp</span>
</li>
</ul>
<a-button type="primary" class="!rounded-button bg-gradient-to-r from-pink-500 to-purple-600 border-none text-white font-medium px-8 py-2 whitespace-nowrap cursor-pointer">
Đăng ký ngay
</a-button>
</div>
<div class="relative">
<img :src="affiliateImage" alt="Affiliate Program" class="w-full h-auto rounded-xl shadow-2xl" />
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
<p class="text-gray-400 mb-6">Nền tảng thương mại điện tử hiện đại với trải nghiệm mua sắm 3D độc đáo.</p>
<div class="flex space-x-4">
<a href="#" class="w-10 h-10 rounded-full bg-[#222] flex items-center justify-center text-gray-300 hover:bg-pink-500 hover:text-white transition-colors duration-300">
<facebook-outlined />
</a>
<a href="#" class="w-10 h-10 rounded-full bg-[#222] flex items-center justify-center text-gray-300 hover:bg-pink-500 hover:text-white transition-colors duration-300">
<twitter-outlined />
</a>
<a href="#" class="w-10 h-10 rounded-full bg-[#222] flex items-center justify-center text-gray-300 hover:bg-pink-500 hover:text-white transition-colors duration-300">
<instagram-outlined />
</a>
<a href="#" class="w-10 h-10 rounded-full bg-[#222] flex items-center justify-center text-gray-300 hover:bg-pink-500 hover:text-white transition-colors duration-300">
<youtube-outlined />
</a>
</div>
</div>
<div>
<h3 class="text-lg font-medium mb-6">Danh mục</h3>
<ul class="space-y-3">
<li><router-link to="/category/giay-dep" class="text-gray-400 hover:text-pink-500 transition-colors duration-300">Giày dép</router-link></li>
<li><router-link to="/category/do-choi-me-be" class="text-gray-400 hover:text-pink-500 transition-colors duration-300">Mẹ & Bé</router-link></li>
<li><router-link to="/category/dung-cu-the-thao" class="text-gray-400 hover:text-pink-500 transition-colors duration-300">Thiết bị thể thao</router-link></li>
<li><router-link to="/category/the-nap-dich-vu-so" class="text-gray-400 hover:text-pink-500 transition-colors duration-300">Thẻ quà tặng kỹ thuật số</router-link></li>
<li><router-link to="/category/quan-ao" class="text-gray-400 hover:text-pink-500 transition-colors duration-300">Trang phục</router-link></li>
<li><router-link to="/category/dien-thoai" class="text-gray-400 hover:text-pink-500 transition-colors duration-300">Điện thoại</router-link></li>
</ul>
</div>
<div>
<h3 class="text-lg font-medium mb-6">Thông tin</h3>
<ul class="space-y-3">
<li><a href="#" class="text-gray-400 hover:text-pink-500 transition-colors duration-300">Về chúng tôi</a></li>
<li><a href="#" class="text-gray-400 hover:text-pink-500 transition-colors duration-300">Chính sách bảo mật</a></li>
<li><a href="#" class="text-gray-400 hover:text-pink-500 transition-colors duration-300">Điều khoản sử dụng</a></li>
<li><a href="#" class="text-gray-400 hover:text-pink-500 transition-colors duration-300">Chính sách đổi trả</a></li>
<li><a href="#" class="text-gray-400 hover:text-pink-500 transition-colors duration-300">Chương trình affiliate</a></li>
<li><a href="#" class="text-gray-400 hover:text-pink-500 transition-colors duration-300">Liên hệ</a></li>
</ul>
</div>
<div>
<h3 class="text-lg font-medium mb-6">Liên hệ</h3>
<ul class="space-y-3">
<li class="flex items-start">
<environment-outlined class="text-gray-400 mt-1 mr-2" />
<span class="text-gray-400">123 Đường Nguyễn Huệ, Quận 1, TP.HCM</span>
</li>
<li class="flex items-start">
<phone-outlined class="text-gray-400 mt-1 mr-2" />
<span class="text-gray-400">+84 123 456 789</span>
</li>
<li class="flex items-start">
<mail-outlined class="text-gray-400 mt-1 mr-2" />
<span class="text-gray-400">contact@tiktokshop.vn</span>
</li>
</ul>
<div class="mt-6">
<h4 class="text-sm font-medium mb-3">Phương thức thanh toán</h4>
<div class="flex space-x-3">
<credit-card-outlined class="text-2xl text-gray-400" />
<bank-outlined class="text-2xl text-gray-400" />
<dollar-outlined class="text-2xl text-gray-400" />
</div>
</div>
</div>
</div>
<div class="border-t border-[#333] pt-8 mt-8 text-center text-gray-500 text-sm">
<p>© 2025 TikTok Shop. Tất cả các quyền được bảo lưu.</p>
</div>
</div>
</footer>
</div>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue';
import CategoryGrid from '../components/category/CategoryGrid.vue';
import AuthPopup from '../components/auth/AuthPopup.vue';
import {
SearchOutlined,
ShoppingCartOutlined,
UserOutlined,
RightOutlined,
EyeOutlined,
StarFilled,
CheckCircleOutlined,
FacebookOutlined,
TwitterOutlined,
InstagramOutlined,
YoutubeOutlined,
EnvironmentOutlined,
PhoneOutlined,
MailOutlined,
CreditCardOutlined,
BankOutlined,
DollarOutlined,
LoginOutlined,
UserAddOutlined,
ShoppingOutlined,
HeartOutlined,
SettingOutlined,
LogoutOutlined,
DeleteOutlined
} from '@ant-design/icons-vue';
// Hero image
const heroImage = 'https://readdy.ai/api/search-image?query=Modern%20futuristic%203D%20e-commerce%20shopping%20scene%20with%20floating%20product%20displays%20on%20dark%20background%2C%20neon%20pink%20and%20purple%20lighting%20effects%2C%20high-tech%20digital%20marketplace%20with%20holographic%20product%20showcases&width=1200&height=500&seq=1&orientation=landscape';
// Experience banner image
const experienceBannerImage = 'https://readdy.ai/api/search-image?query=Immersive%203D%20shopping%20experience%20with%20customer%20viewing%20detailed%20product%20models%20in%20virtual%20reality%2C%20futuristic%20digital%20retail%20environment%20with%20holographic%20displays%20and%20neon%20lighting%2C%20dark%20background%20with%20pink%20and%20purple%20accents&width=1200&height=500&seq=2&orientation=landscape';
// Affiliate image
const affiliateImage = 'https://readdy.ai/api/search-image?query=Professional%20affiliate%20marketer%20working%20with%20multiple%20screens%20displaying%20analytics%20and%20product%20promotions%2C%20modern%20workspace%20with%20holographic%20displays%20showing%20commission%20rates%20and%20marketing%20tools%2C%20dark%20futuristic%20environment%20with%20pink%20and%20purple%20accent%20lighting&width=600&height=400&seq=3&orientation=landscape';
const currentCategory = ref('all');

// Featured Products
const featuredProducts = [
{
name: 'Giày Nike Air Max 270 React - Phiên bản giới hạn 2025',
brand: 'Nike',
price: 2790000,
originalPrice: 3500000,
discount: 20,
image: 'https://readdy.ai/api/search-image?query=Hyper-realistic%203D%20render%20of%20Nike%20Air%20Max%20270%20React%20limited%20edition%20sneakers%20on%20dark%20background%20with%20subtle%20pink%20lighting%2C%20premium%20athletic%20footwear%20with%20detailed%20texture%20and%20materials%2C%20professional%20product%20photography%20style&width=400&height=400&seq=4&orientation=squarish'
},
{
name: 'Điện thoại Samsung Galaxy S25 Ultra - 512GB',
brand: 'Samsung',
price: 28990000,
originalPrice: 32990000,
discount: 12,
image: 'https://readdy.ai/api/search-image?query=Hyper-realistic%203D%20render%20of%20Samsung%20Galaxy%20S25%20Ultra%20smartphone%20on%20dark%20background%20with%20subtle%20pink%20lighting%2C%20premium%20flagship%20device%20with%20detailed%20camera%20system%20and%20sleek%20design%2C%20professional%20product%20photography%20style&width=400&height=400&seq=5&orientation=squarish'
},
{
name: 'Tai nghe Apple AirPods Pro 2 - Chống ồn chủ động',
brand: 'Apple',
price: 5990000,
originalPrice: 6990000,
discount: 15,
image: 'https://readdy.ai/api/search-image?query=Hyper-realistic%203D%20render%20of%20Apple%20AirPods%20Pro%202%20with%20noise%20cancellation%20on%20dark%20background%20with%20subtle%20pink%20lighting%2C%20premium%20wireless%20earbuds%20with%20detailed%20texture%20and%20materials%2C%20professional%20product%20photography%20style&width=400&height=400&seq=6&orientation=squarish'
},
{
name: 'Đồng hồ thông minh Garmin Fenix 8 Pro - Titanium',
brand: 'Garmin',
price: 18990000,
originalPrice: 21990000,
discount: 14,
image: 'https://readdy.ai/api/search-image?query=Hyper-realistic%203D%20render%20of%20Garmin%20Fenix%208%20Pro%20Titanium%20smartwatch%20on%20dark%20background%20with%20subtle%20pink%20lighting%2C%20premium%20sports%20watch%20with%20detailed%20display%20and%20materials%2C%20professional%20product%20photography%20style&width=400&height=400&seq=7&orientation=squarish'
},
{
name: 'Laptop Gaming Asus ROG Zephyrus G16 2025',
brand: 'Asus',
price: 42990000,
originalPrice: 47990000,
discount: 10,
image: 'https://readdy.ai/api/search-image?query=Hyper-realistic%203D%20render%20of%20Asus%20ROG%20Zephyrus%20G16%202025%20gaming%20laptop%20on%20dark%20background%20with%20subtle%20pink%20lighting%2C%20premium%20gaming%20device%20with%20detailed%20keyboard%20and%20screen%2C%20professional%20product%20photography%20style&width=400&height=400&seq=8&orientation=squarish'
},
{
name: 'Máy ảnh Sony Alpha A7R V - Full Frame 61MP',
brand: 'Sony',
price: 79990000,
originalPrice: 89990000,
discount: 11,
image: 'https://readdy.ai/api/search-image?query=Hyper-realistic%203D%20render%20of%20Sony%20Alpha%20A7R%20V%20full%20frame%20camera%20on%20dark%20background%20with%20subtle%20pink%20lighting%2C%20premium%20photography%20equipment%20with%20detailed%20lens%20and%20body%2C%20professional%20product%20photography%20style&width=400&height=400&seq=9&orientation=squarish'
},
{
name: 'Túi xách Louis Vuitton Neverfull MM - Monogram',
brand: 'Louis Vuitton',
price: 39990000,
originalPrice: 42990000,
discount: 7,
image: 'https://readdy.ai/api/search-image?query=Hyper-realistic%203D%20render%20of%20Louis%20Vuitton%20Neverfull%20MM%20Monogram%20handbag%20on%20dark%20background%20with%20subtle%20pink%20lighting%2C%20premium%20luxury%20fashion%20accessory%20with%20detailed%20texture%20and%20materials%2C%20professional%20product%20photography%20style&width=400&height=400&seq=10&orientation=squarish'
},
{
name: 'Áo khoác The North Face Summit Series GORE-TEX Pro',
brand: 'The North Face',
price: 12990000,
originalPrice: 15990000,
discount: 19,
image: 'https://readdy.ai/api/search-image?query=Hyper-realistic%203D%20render%20of%20The%20North%20Face%20Summit%20Series%20GORE-TEX%20Pro%20jacket%20on%20dark%20background%20with%20subtle%20pink%20lighting%2C%20premium%20outdoor%20apparel%20with%20detailed%20texture%20and%20materials%2C%20professional%20product%20photography%20style&width=400&height=400&seq=11&orientation=squarish'
}
];
// Brands
const brands = [
{ name: 'Nike', icon: ShoppingCartOutlined },
{ name: 'Adidas', icon: ShoppingCartOutlined },
{ name: 'Samsung', icon: ShoppingCartOutlined },
{ name: 'Apple', icon: ShoppingCartOutlined },
{ name: 'Louis Vuitton', icon: ShoppingCartOutlined },
{ name: 'Hublot', icon: ShoppingCartOutlined },
{ name: 'Gucci', icon: ShoppingCartOutlined }
];
// Features
const isLoggedIn = ref(false);
const cartItems = ref([
  {
    name: 'Giày Nike Air Max 270 React - Phiên bản giới hạn 2025',
    price: 2790000,
    quantity: 1,
    image: 'https://readdy.ai/api/search-image?query=Hyper-realistic%203D%20render%20of%20Nike%20Air%20Max%20270%20React%20limited%20edition%20sneakers%20on%20dark%20background%20with%20subtle%20pink%20lighting%2C%20premium%20athletic%20footwear%20with%20detailed%20texture%20and%20materials%2C%20professional%20product%20photography%20style&width=400&height=400&seq=4&orientation=squarish'
  },
  {
    name: 'Tai nghe Apple AirPods Pro 2 - Chống ồn chủ động',
    price: 5990000,
    quantity: 1,
    image: 'https://readdy.ai/api/search-image?query=Hyper-realistic%203D%20render%20of%20Apple%20AirPods%20Pro%202%20with%20noise%20cancellation%20on%20dark%20background%20with%20subtle%20pink%20lighting%2C%20premium%20wireless%20earbuds%20with%20detailed%20texture%20and%20materials%2C%20professional%20product%20photography%20style&width=400&height=400&seq=6&orientation=squarish'
  }
]);



const showAuthPopup = ref(false);
const authPopupInitialTab = ref('login');

const totalAmount = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0);
});
const formatPrice = (price: number) => {
  // Chuyển đổi giá tiền từ VND sang USD với tỷ giá 26.000 VND = 1 USD
  const priceInUSD = price / 26000;
  return priceInUSD.toFixed(2).toLocaleString();
};
const increaseQuantity = (index: number) => {
  cartItems.value[index].quantity++;
};
const decreaseQuantity = (index: number) => {
  if (cartItems.value[index].quantity > 1) {
    cartItems.value[index].quantity--;
  }
};
const removeFromCart = (index: number) => {
  cartItems.value.splice(index, 1);
};
const openLoginPopup = () => {
  authPopupInitialTab.value = 'login';
  showAuthPopup.value = true;
};
const openRegisterPopup = () => {
  authPopupInitialTab.value = 'register';
  showAuthPopup.value = true;
};
const handleLoginSuccess = (userData) => {
  showAuthPopup.value = false;
  // Xử lý sau khi đăng nhập thành công (nếu cần)
};
const handleRegisterSuccess = (userData) => {
  showAuthPopup.value = false;
  // Xử lý sau khi đăng ký thành công (nếu cần)
};


/* Removed duplicate declaration of totalAmount to fix redeclaration error */
const features = [
{
title: 'Trải nghiệm 3D',
icon: EyeOutlined,
description: 'Xem sản phẩm với công nghệ 3D tiên tiến, xoay 360° và phóng to chi tiết.'
},
{
title: 'Thanh toán an toàn',
icon: CreditCardOutlined,
description: 'Nhiều phương thức thanh toán với bảo mật cao, đảm bảo an toàn giao dịch.'
},
{
title: 'Giao hàng nhanh chóng',
icon: ShoppingCartOutlined,
description: 'Giao hàng toàn quốc trong vòng 24h với đội ngũ vận chuyển chuyên nghiệp.'
},
{
title: 'Hỗ trợ 24/7',
icon: PhoneOutlined,
description: 'Đội ngũ hỗ trợ khách hàng luôn sẵn sàng giúp đỡ bạn mọi lúc mọi nơi.'
}
];
</script>
<style scoped>
:deep(.ant-dropdown-menu) {
background-color: #1a1a1a !important;
border-color: #333 !important;
}
:deep(.ant-dropdown-menu-item:hover) {
background-color: rgba(236, 72, 153, 0.1) !important;
}
:deep(.ant-menu-item-divider) {
background-color: #333 !important;
}
/* Custom scrollbar */
::-webkit-scrollbar {
width: 8px;
height: 8px;
}
::-webkit-scrollbar-track {
background: #1a1a1a;
}
::-webkit-scrollbar-thumb {
background: #333;
border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
background: #555;
}
/* Animations */
@keyframes fadeIn {
from { opacity: 0; }
to { opacity: 1; }
}
@keyframes slideUp {
from { transform: translateY(20px); opacity: 0; }
to { transform: translateY(0); opacity: 1; }
}
/* Apply animations */
.container {
animation: fadeIn 0.5s ease-out;
}
/* Custom input styling */
:deep(.ant-input-affix-wrapper) {
background-color: #222 !important;
border-color: #333 !important;
}
:deep(.ant-input) {
background-color: transparent !important;
color: #fff !important;
}
:deep(.ant-input-search-button) {
background-color: #333 !important;
border-color: #444 !important;
}
/* Custom button styling */
:deep(.ant-btn-primary) {
background: linear-gradient(to right, #ec4899, #9333ea) !important;
border: none !important;
}
:deep(.ant-btn-primary:hover) {
background: linear-gradient(to right, #db2777, #7e22ce) !important;
}
</style>
