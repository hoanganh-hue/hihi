<template>
  <footer class="bg-[#121212] border-t border-[#333] py-12 mt-12">
    <div class="container mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <h3 class="text-lg font-medium mb-6">TikTok Shop</h3>
          <p class="text-gray-400 mb-6">Nền tảng mua sắm trực tuyến kết hợp với mạng xã hội, mang đến trải nghiệm mua sắm thú vị và tiện lợi nhất.</p>
          <div class="flex space-x-4">
            <a href="#" class="text-gray-400 hover:text-pink-500 transition-colors duration-300">
              <facebook-outlined class="text-2xl" />
            </a>
            <a href="#" class="text-gray-400 hover:text-pink-500 transition-colors duration-300">
              <twitter-outlined class="text-2xl" />
            </a>
            <a href="#" class="text-gray-400 hover:text-pink-500 transition-colors duration-300">
              <instagram-outlined class="text-2xl" />
            </a>
            <a href="#" class="text-gray-400 hover:text-pink-500 transition-colors duration-300">
              <youtube-outlined class="text-2xl" />
            </a>
          </div>
        </div>
        <div>
          <h3 class="text-lg font-medium mb-6">Danh mục</h3>
          <ul class="space-y-3">
            <li><router-link to="/category/thoi-trang-nam" class="text-gray-400 hover:text-pink-500 transition-colors duration-300 cursor-pointer">Thời trang nam</router-link></li>
            <li><router-link to="/category/thoi-trang-nu" class="text-gray-400 hover:text-pink-500 transition-colors duration-300 cursor-pointer">Thời trang nữ</router-link></li>
            <li><router-link to="/category/dien-thoai" class="text-gray-400 hover:text-pink-500 transition-colors duration-300 cursor-pointer">Điện thoại & phụ kiện</router-link></li>
            <li><router-link to="/category/may-tinh" class="text-gray-400 hover:text-pink-500 transition-colors duration-300 cursor-pointer">Máy tính & laptop</router-link></li>
            <li><router-link to="/category/may-anh" class="text-gray-400 hover:text-pink-500 transition-colors duration-300 cursor-pointer">Máy ảnh & quay phim</router-link></li>
            <li><router-link to="/category/giay-dep" class="text-gray-400 hover:text-pink-500 transition-colors duration-300 cursor-pointer">Giày dép</router-link></li>
            <li><router-link to="/category/tui-xach" class="text-gray-400 hover:text-pink-500 transition-colors duration-300 cursor-pointer">Túi xách</router-link></li>
          </ul>
        </div>
        <div>
          <h3 class="text-lg font-medium mb-6">Thông tin</h3>
          <ul class="space-y-3">
            <li><router-link to="/about" class="text-gray-400 hover:text-pink-500 transition-colors duration-300 cursor-pointer">Về chúng tôi</router-link></li>
            <li><router-link to="/privacy" class="text-gray-400 hover:text-pink-500 transition-colors duration-300 cursor-pointer">Chính sách bảo mật</router-link></li>
            <li><router-link to="/terms" class="text-gray-400 hover:text-pink-500 transition-colors duration-300 cursor-pointer">Điều khoản sử dụng</router-link></li>
            <li><router-link to="/return-policy" class="text-gray-400 hover:text-pink-500 transition-colors duration-300 cursor-pointer">Chính sách đổi trả</router-link></li>
            <li><router-link to="/affiliate" class="text-gray-400 hover:text-pink-500 transition-colors duration-300 cursor-pointer">Chương trình affiliate</router-link></li>
            <li><router-link to="/contact" class="text-gray-400 hover:text-pink-500 transition-colors duration-300 cursor-pointer">Liên hệ</router-link></li>
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
</template>

<script setup>
import { 
  FacebookOutlined, 
  TwitterOutlined, 
  InstagramOutlined, 
  YoutubeOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  CreditCardOutlined,
  BankOutlined,
  DollarOutlined
} from '@ant-design/icons-vue';
</script>