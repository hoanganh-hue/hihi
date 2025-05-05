<template>
  <div>
    <a-form
      layout="vertical"
      :model="formState"
      @finish="handleSubmit"
      class="auth-form"
    >
      <!-- Form cá nhân -->
      <template v-if="type === 'personal'">
        <a-form-item
          name="fullName"
          label="Họ và tên"
          :rules="[{ required: true, message: 'Vui lòng nhập họ và tên!' }]"
        >
          <a-input v-model:value="formState.fullName" size="large" />
        </a-form-item>

        <a-form-item
          name="email"
          label="Email"
          :rules="[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'email', message: 'Email không hợp lệ!' }
          ]"
        >
          <a-input v-model:value="formState.email" size="large" />
        </a-form-item>

        <a-form-item
          name="username"
          label="Tên đăng nhập"
          :rules="[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]"
        >
          <a-input v-model:value="formState.username" size="large" />
        </a-form-item>

        <a-form-item
          name="password"
          label="Mật khẩu"
          :rules="[
            { required: true, message: 'Vui lòng nhập mật khẩu!' },
            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
          ]"
        >
          <a-input-password v-model:value="formState.password" size="large" />
        </a-form-item>

        <a-form-item
          name="confirmPassword"
          label="Nhập lại mật khẩu"
          :rules="[
            { required: true, message: 'Vui lòng nhập lại mật khẩu!' },
            { validator: validateConfirmPassword }
          ]"
        >
          <a-input-password v-model:value="formState.confirmPassword" size="large" />
        </a-form-item>

        <a-form-item
          name="phone"
          label="Số điện thoại"
          :rules="[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]"
        >
          <a-input v-model:value="formState.phone" size="large" />
        </a-form-item>
      </template>

      <!-- Form nhà bán hàng -->
      <template v-else-if="type === 'seller'">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a-form-item
            name="fullName"
            label="Họ và tên"
            :rules="[{ required: true, message: 'Vui lòng nhập họ và tên!' }]"
          >
            <a-input v-model:value="formState.fullName" size="large" />
          </a-form-item>

          <a-form-item
            name="storeName"
            label="Tên cửa hàng"
            :rules="[{ required: true, message: 'Vui lòng nhập tên cửa hàng!' }]"
          >
            <a-input v-model:value="formState.storeName" size="large" />
          </a-form-item>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a-form-item
            name="email"
            label="Email liên hệ"
            :rules="[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]"
          >
            <a-input v-model:value="formState.email" size="large" />
          </a-form-item>

          <a-form-item
            name="phone"
            label="Số điện thoại"
            :rules="[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]"
          >
            <a-input v-model:value="formState.phone" size="large" />
          </a-form-item>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a-form-item
            name="username"
            label="Tên đăng nhập"
            :rules="[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]"
          >
            <a-input v-model:value="formState.username" size="large" />
          </a-form-item>

          <a-form-item
            name="businessType"
            label="Loại hình kinh doanh"
            :rules="[{ required: true, message: 'Vui lòng chọn loại hình kinh doanh!' }]"
          >
            <a-select v-model:value="formState.businessType" size="large">
              <a-select-option value="individual">Cá nhân</a-select-option>
              <a-select-option value="company">Doanh nghiệp</a-select-option>
              <a-select-option value="household">Hộ kinh doanh</a-select-option>
            </a-select>
          </a-form-item>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a-form-item
            name="password"
            label="Mật khẩu"
            :rules="[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
            ]"
          >
            <a-input-password v-model:value="formState.password" size="large" />
          </a-form-item>

          <a-form-item
            name="confirmPassword"
            label="Nhập lại mật khẩu"
            :rules="[
              { required: true, message: 'Vui lòng nhập lại mật khẩu!' },
              { validator: validateConfirmPassword }
            ]"
          >
            <a-input-password v-model:value="formState.confirmPassword" size="large" />
          </a-form-item>
        </div>

        <a-form-item
          name="referralCode"
          label="Mã giới thiệu (không bắt buộc)"
        >
          <a-input v-model:value="formState.referralCode" size="large" />
        </a-form-item>

        <a-form-item name="agreement" :wrapper-col="{ span: 24 }">
          <a-checkbox v-model:checked="formState.agreement">
            Tôi đồng ý với <a class="text-pink-500">Điều khoản dịch vụ</a> và <a class="text-pink-500">Chính sách bảo mật</a> của TikTok Shop
          </a-checkbox>
        </a-form-item>
      </template>

      <a-form-item>
        <a-button
          type="primary"
          html-type="submit"
          :loading="loading"
          :disabled="type === 'seller' && !formState.agreement"
          class="w-full bg-pink-500 hover:bg-pink-600 border-0 hover:border-0"
          size="large"
        >
          Đăng ký
        </a-button>
      </a-form-item>

      <div class="text-center text-gray-400">
        Đã có tài khoản? 
        <a @click="$emit('login')" class="text-pink-500 hover:text-pink-600 cursor-pointer">Đăng nhập</a>
      </div>
    </a-form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useAuthStore } from '../../hooks/useAuth';

const props = defineProps({
  type: {
    type: String,
    default: 'personal',
    validator: (value) => ['personal', 'seller'].includes(value)
  }
});

const emit = defineEmits(['success', 'login']);
const authStore = useAuthStore();
const loading = ref(false);

const formState = reactive({
  fullName: '',
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
  phone: '',
  // Fields for seller
  storeName: '',
  businessType: 'individual',
  referralCode: '',
  agreement: false
});

const validateConfirmPassword = async (rule, value) => {
  if (value !== formState.password) {
    throw new Error('Hai mật khẩu không khớp!');
  }
};

const handleSubmit = async () => {
  loading.value = true;
  
  try {
    // Xây dựng dữ liệu đăng ký dựa trên loại form
    const registerData = {
      name: formState.fullName,
      email: formState.email,
      username: formState.username,
      password: formState.password,
      phone: formState.phone,
      userType: props.type
    };
    
    // Bổ sung dữ liệu cho nhà bán hàng
    if (props.type === 'seller') {
      registerData.storeName = formState.storeName;
      registerData.businessType = formState.businessType;
      registerData.referralCode = formState.referralCode;
    }
    
    // Gọi API đăng ký từ authStore
    const userData = await authStore.register(registerData);
    
    // Emit sự kiện thành công và truyền dữ liệu người dùng
    emit('success', userData);
  } catch (error) {
    console.error('Đăng ký thất bại:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
:deep(.ant-form-item-label > label) {
  color: white;
}
</style>
