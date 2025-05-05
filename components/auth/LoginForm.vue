<template>
  <div>
    <a-form
      layout="vertical"
      :model="formState"
      @finish="handleSubmit"
      class="auth-form"
    >
      <a-form-item
        name="username"
        label="Email hoặc tên đăng nhập"
        :rules="[{ required: true, message: 'Vui lòng nhập email hoặc tên đăng nhập!' }]"
      >
        <a-input v-model:value="formState.username" size="large" />
      </a-form-item>

      <a-form-item
        name="password"
        label="Mật khẩu"
        :rules="[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]"
      >
        <a-input-password v-model:value="formState.password" size="large" />
      </a-form-item>

      <div class="flex items-center justify-between mb-4">
        <a-checkbox v-model:checked="formState.remember">Nhớ tài khoản</a-checkbox>
        <a class="text-pink-500 hover:text-pink-600">Quên mật khẩu?</a>
      </div>

      <a-form-item>
        <a-button
          type="primary"
          html-type="submit"
          :loading="loading"
          class="w-full bg-pink-500 hover:bg-pink-600 border-0 hover:border-0"
          size="large"
        >
          Đăng nhập
        </a-button>
      </a-form-item>

      <div class="text-center text-gray-400 my-2">Hoặc đăng nhập với</div>

      <div class="flex space-x-2 mb-4">
        <a-button class="flex-1 flex items-center justify-center" size="large">
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="mr-2" viewBox="0 0 16 16">
              <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
            </svg>
            <span>Facebook</span>
          </template>
        </a-button>
        <a-button class="flex-1 flex items-center justify-center" size="large">
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="mr-2" viewBox="0 0 16 16">
              <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"/>
            </svg>
            <span>Google</span>
          </template>
        </a-button>
      </div>

      <div class="text-center text-gray-400">
        Chưa có tài khoản? 
        <a @click="$emit('register')" class="text-pink-500 hover:text-pink-600 cursor-pointer">Đăng ký ngay</a>
      </div>
    </a-form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useAuthStore } from '../../hooks/useAuth';

const emit = defineEmits(['success', 'register']);
const authStore = useAuthStore();
const loading = ref(false);

const formState = reactive({
  username: '',
  password: '',
  remember: false,
});

const handleSubmit = async () => {
  loading.value = true;
  
  try {
    // Gọi API đăng nhập từ authStore
    const userData = await authStore.login({
      email: formState.username,
      password: formState.password,
      remember: formState.remember
    });
    
    // Emit sự kiện thành công và truyền dữ liệu người dùng
    emit('success', userData);
  } catch (error) {
    console.error('Đăng nhập thất bại:', error);
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
