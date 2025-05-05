<template>
  <a-modal
    v-model:visible="visible"
    width="400"
    :footer="null"
    centered
    body-style="{ backgroundColor: '#fff', padding: '24px' }"
    @cancel="handleCancel"
  >
    <div v-if="authMode === 'login'">
      <h2 class="text-2xl font-bold mb-4 text-center text-black">Đăng nhập</h2>
      <a-form @submit.prevent="handleLogin" layout="vertical">
        <a-form-item label="Email" name="email" :rules="[{ required: true, message: 'Vui lòng nhập email' }, { type: 'email', message: 'Email không hợp lệ' }]">
          <a-input v-model:value="loginForm.email" placeholder="Nhập email" />
        </a-form-item>
        <a-form-item label="Mật khẩu" name="password" :rules="[{ required: true, message: 'Vui lòng nhập mật khẩu' }]">
          <a-input-password v-model:value="loginForm.password" placeholder="Nhập mật khẩu" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" block>Đăng nhập</a-button>
        </a-form-item>
      </a-form>
      <div class="flex justify-center space-x-4 mt-4">
        <a-button type="default" icon="google" @click="handleGoogleLogin" class="flex items-center space-x-2">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png" alt="Google" class="w-5 h-5" />
          <span>Google</span>
        </a-button>
        <a-button type="default" icon="facebook" @click="handleFacebookLogin" class="flex items-center space-x-2">
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_(2019).png" alt="Facebook" class="w-5 h-5" />
          <span>Facebook</span>
        </a-button>
      </div>
      <div class="mt-4 text-center">
        <a @click="switchToRegister" class="cursor-pointer text-pink-500 hover:underline">Chưa có tài khoản? Đăng ký</a>
      </div>
    </div>
    <div v-else>
      <h2 class="text-2xl font-bold mb-4 text-center text-black">Đăng ký</h2>
      <a-radio-group v-model="registerType" class="mb-4" button-style="solid" style="width: 100%;">
        <a-radio-button value="customer" style="width: 50%; text-align: center;">Khách hàng cá nhân</a-radio-button>
        <a-radio-button value="seller" style="width: 50%; text-align: center;">Nhà bán hàng</a-radio-button>
      </a-radio-group>
      <a-form @submit.prevent="handleRegister" layout="vertical">
        <a-form-item label="Họ và tên" name="name" :rules="[{ required: true, message: 'Vui lòng nhập họ và tên' }]">
          <a-input v-model:value="registerForm.name" placeholder="Nhập họ và tên" />
        </a-form-item>
        <a-form-item label="Email" name="email" :rules="[{ required: true, message: 'Vui lòng nhập email' }, { type: 'email', message: 'Email không hợp lệ' }]">
          <a-input v-model:value="registerForm.email" placeholder="Nhập email" />
        </a-form-item>
        <a-form-item label="Mật khẩu" name="password" :rules="[{ required: true, message: 'Vui lòng nhập mật khẩu' }]">
          <a-input-password v-model:value="registerForm.password" placeholder="Nhập mật khẩu" />
        </a-form-item>
        <a-form-item v-if="registerType === 'seller'" label="Mã giới thiệu" name="referralCode">
          <a-input v-model:value="registerForm.referralCode" placeholder="Nhập mã giới thiệu (nếu có)" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" block>Đăng ký</a-button>
        </a-form-item>
      </a-form>
      <div class="mt-4 text-center">
        <a @click="switchToLogin" class="cursor-pointer text-pink-500 hover:underline">Đã có tài khoản? Đăng nhập</a>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, defineEmits, defineProps } from 'vue';

const props = defineProps({
  visible: Boolean,
  initialMode: {
    type: String,
    default: 'login'
  }
});
const emit = defineEmits(['update:visible']);

const authMode = ref(props.initialMode);
const registerType = ref('customer');

const loginForm = ref({
  email: '',
  password: ''
});

const registerForm = ref({
  name: '',
  email: '',
  password: '',
  referralCode: ''
});

const handleLogin = () => {
  alert(`Đăng nhập với email: ${loginForm.value.email}`);
};

const handleGoogleLogin = () => {
  alert('Đăng nhập bằng Google');
};

const handleFacebookLogin = () => {
  alert('Đăng nhập bằng Facebook');
};

const handleRegister = () => {
  if (registerType.value === 'customer') {
    alert(`Đăng ký khách hàng: ${registerForm.value.name}`);
  } else {
    alert(`Đăng ký nhà bán hàng: ${registerForm.value.name}, Mã giới thiệu: ${registerForm.value.referralCode}`);
  }
};

const switchToRegister = () => {
  authMode.value = 'register';
};

const switchToLogin = () => {
  authMode.value = 'login';
};

const handleCancel = () => {
  emit('update:visible', false);
  // Reset forms if needed
  loginForm.value = { email: '', password: '' };
  registerForm.value = { name: '', email: '', password: '', referralCode: '' };
  registerType.value = 'customer';
};
</script>
