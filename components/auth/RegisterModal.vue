<template>
  <div>
    <a-modal v-model:visible="localVisible" title="Đăng ký" :footer="null" width="600px" centered>
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
          @success="handleSuccess" 
          @login="$emit('login')"
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
          @success="handleSuccess" 
          @login="$emit('login')"
        />
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { UserOutlined, ShopOutlined, LeftOutlined } from '@ant-design/icons-vue';
import RegisterForm from './RegisterForm.vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:visible', 'success', 'login']);
const localVisible = ref(false);
const registerType = ref(null);

watch(() => props.visible, (newVal) => {
  console.log('Register Modal visible prop changed:', newVal);
  localVisible.value = newVal;
  
  if (!newVal) {
    registerType.value = null;
  }
});

watch(() => localVisible.value, (newVal) => {
  console.log('Register Modal local visible changed:', newVal);
  if (newVal !== props.visible) {
    emit('update:visible', newVal);
  }
  
  if (!newVal) {
    registerType.value = null;
  }
});

const handleSuccess = (userData) => {
  emit('success', userData);
  emit('update:visible', false);
  registerType.value = null;
};
</script>