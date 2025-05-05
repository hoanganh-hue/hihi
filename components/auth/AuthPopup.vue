<template>
  <div>
    <!-- Overlays cho cả popup -->
    <div v-if="modelValue" class="fixed inset-0 bg-black bg-opacity-60 z-[1000] flex items-center justify-center" @click="handleBackdropClick">
      <!-- Main Popup Container -->
      <div class="bg-[#1a1a1a] border border-[#333] rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden" @click.stop>
        <div class="flex flex-col md:flex-row h-full">
          <!-- Column 1: Form Section (Left) -->
          <div class="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-bold text-white">{{ activeTab === 'login' ? 'Đăng nhập' : 'Đăng ký' }}</h2>
              <button @click="close" class="text-gray-400 hover:text-pink-500 transition-colors">
                <close-outlined class="text-xl" />
              </button>
            </div>

            <!-- Auth Tabs -->
            <div class="mb-6">
              <a-tabs v-model:activeKey="activeTab" class="auth-tabs">
                <a-tab-pane key="login" tab="Đăng nhập">
                  <!-- Login Form -->
                  <login-form @success="handleLoginSuccess" @register="activeTab = 'register'" />
                </a-tab-pane>
                <a-tab-pane key="register" tab="Đăng ký">
                  <!-- Register Type Selection -->
                  <div v-if="!registerType" class="mb-6">
                    <h3 class="text-lg font-medium mb-4 text-white">Chọn loại tài khoản</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div 
                        class="border border-[#333] hover:border-pink-500 rounded-xl p-4 cursor-pointer transition-all duration-300"
                        :class="{ 'border-pink-500 bg-[#1E1E1E]': registerType === 'personal' }"
                        @click="registerType = 'personal'"
                      >
                        <div class="flex items-center mb-3">
                          <user-outlined class="text-2xl text-pink-500 mr-3" />
                          <h4 class="text-lg font-medium">Cá nhân</h4>
                        </div>
                        <p class="text-gray-400 text-sm">Dành cho người dùng muốn mua sắm trên TikTok Shop</p>
                      </div>
                      <div 
                        class="border border-[#333] hover:border-pink-500 rounded-xl p-4 cursor-pointer transition-all duration-300"
                        :class="{ 'border-pink-500 bg-[#1E1E1E]': registerType === 'seller' }"
                        @click="registerType = 'seller'"
                      >
                        <div class="flex items-center mb-3">
                          <shop-outlined class="text-2xl text-pink-500 mr-3" />
                          <h4 class="text-lg font-medium">Nhà bán hàng</h4>
                        </div>
                        <p class="text-gray-400 text-sm">Dành cho người muốn bán sản phẩm trên TikTok Shop</p>
                      </div>
                    </div>
                  </div>

                  <!-- Register Forms -->
                  <div v-if="registerType === 'personal'">
                    <div class="flex items-center mb-4">
                      <button @click="registerType = null" class="flex items-center text-gray-400 hover:text-pink-500 mr-2">
                        <left-outlined />
                      </button>
                      <h3 class="text-lg font-medium">Đăng ký tài khoản cá nhân</h3>
                    </div>
                    <register-form 
                      type="personal" 
                      @success="handleRegisterSuccess" 
                      @login="activeTab = 'login'"
                    />
                  </div>

                  <div v-if="registerType === 'seller'">
                    <div class="flex items-center mb-4">
                      <button @click="registerType = null" class="flex items-center text-gray-400 hover:text-pink-500 mr-2">
                        <left-outlined />
                      </button>
                      <h3 class="text-lg font-medium">Đăng ký tài khoản nhà bán hàng</h3>
                    </div>
                    <register-form 
                      type="seller" 
                      @success="handleRegisterSuccess" 
                      @login="activeTab = 'login'"
                    />
                  </div>
                </a-tab-pane>
              </a-tabs>
            </div>
          </div>

          <!-- Column 2: Info Section (Right) -->
          <div class="hidden md:block w-1/2 bg-gradient-to-br from-[#121212] to-[#0a0a0a] p-8 relative overflow-hidden">
            <!-- Background gradient overlay -->
            <div class="absolute inset-0 bg-gradient-to-r from-[#121212] via-[#12121299] to-transparent z-10"></div>
            
            <!-- Background image -->
            <div class="absolute inset-0 bg-cover bg-center" :style="{
              backgroundImage: `url('https://readdy.ai/api/search-image?query=Futuristic%20virtual%20shopping%20experience%20holographic%20display%20floating%20products%20dark%20atmosphere%20with%20pink%20and%20purple%20neon%20accents&width=800&height=1200&seq=10&orientation=portrait')`
            }"></div>
            
            <!-- Content -->
            <div class="relative z-20 h-full flex flex-col justify-between">
              <div>
                <h2 class="text-2xl font-bold mb-4 mt-6">{{ activeTab === 'login' ? 'Chào mừng trở lại!' : 'Tham gia TikTok Shop' }}</h2>
                <p class="text-gray-300 mb-6">{{ 
                  activeTab === 'login' 
                    ? 'Đăng nhập để tiếp tục trải nghiệm mua sắm cùng TikTok Shop với hàng ngàn sản phẩm độc đáo và ưu đãi hấp dẫn.' 
                    : 'Tạo tài khoản để khám phá thế giới mua sắm thông minh cùng TikTok Shop - nơi công nghệ và xu hướng gặp gỡ.'
                }}</p>
              </div>

              <div class="bg-[#1E1E1E] p-4 rounded-xl border border-[#333]">
                <h3 class="text-lg font-medium mb-3">Tại sao nên chọn TikTok Shop?</h3>
                <ul class="space-y-3">
                  <li class="flex items-center">
                    <check-circle-outlined class="text-pink-500 mr-2" />
                    <span>Mua sắm an toàn và bảo mật</span>
                  </li>
                  <li class="flex items-center">
                    <check-circle-outlined class="text-pink-500 mr-2" />
                    <span>Hàng ngàn thương hiệu uy tín</span>
                  </li>
                  <li class="flex items-center">
                    <check-circle-outlined class="text-pink-500 mr-2" />
                    <span>Giao hàng nhanh chóng toàn quốc</span>
                  </li>
                  <li class="flex items-center">
                    <check-circle-outlined class="text-pink-500 mr-2" />
                    <span>Ưu đãi độc quyền cho thành viên</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import {

  UserOutlined, 
  ShopOutlined, 
  CheckCircleOutlined, 
  CloseOutlined,
  LeftOutlined
} from '@ant-design/icons-vue';
import LoginForm from './LoginForm.vue';
import RegisterForm from './RegisterForm.vue';

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  initialTab: {
    type: String,
    default: 'login'
  }
});

// Emits
const emit = defineEmits(['update:modelValue', 'login-success', 'register-success']);

// State
const activeTab = ref(props.initialTab);
const registerType = ref(null);

// Watch for visibility changes
watch(() => props.modelValue, (newVal) => {
  if (!newVal) {
    // Reset state when closing
    registerType.value = null;
  }
});

// Watch for tab changes
watch(() => props.initialTab, (newVal) => {
  activeTab.value = newVal;
});

// Methods
const close = () => {
  emit('update:modelValue', false);
  // Reset state
  registerType.value = null;
};

const handleBackdropClick = (e) => {
  // Close when clicking on backdrop
  if (e.target === e.currentTarget) {
    close();
  }
};

const handleLoginSuccess = (userData) => {
  emit('login-success', userData);
  close();
};

const handleRegisterSuccess = (userData) => {
  emit('register-success', userData);
  close();
};
</script>

<style scoped>
/* Custom styles for auth tabs */
:deep(.auth-tabs .ant-tabs-nav) {
  margin-bottom: 20px;
}

:deep(.auth-tabs .ant-tabs-nav::before) {
  border-bottom-color: #333;
}

:deep(.auth-tabs .ant-tabs-tab) {
  color: #d1d5db;
  font-size: 16px;
  padding: 12px 0;
  margin: 0 20px 0 0;
}

:deep(.auth-tabs .ant-tabs-tab-active) {
  color: #ec4899;
}

:deep(.auth-tabs .ant-tabs-ink-bar) {
  background-color: #ec4899;
  height: 3px;
  border-radius: 3px;
}

:deep(.auth-tabs .ant-tabs-content-holder) {
  overflow: auto;
  max-height: 70vh;
}
</style>
