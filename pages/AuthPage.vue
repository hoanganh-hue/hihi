<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900 p-4">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
      <a-tabs v-model:activeKey="activeTab" class="auth-tabs">
        <a-tab-pane key="login" tab="Đăng nhập">
          <login-form @success="handleLoginSuccess" @register="activeTab = 'register'" />
        </a-tab-pane>
        <a-tab-pane key="register" tab="Đăng ký">
          <register-form @success="handleRegisterSuccess" @login="activeTab = 'login'" />
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import LoginForm from '../components/auth/LoginForm.vue';
import RegisterForm from '../components/auth/RegisterForm.vue';

const activeTab = ref('login');

const handleLoginSuccess = (userData) => {
  alert('Đăng nhập thành công: ' + JSON.stringify(userData));
  // Có thể thêm logic chuyển hướng hoặc cập nhật trạng thái đăng nhập
};

const handleRegisterSuccess = (userData) => {
  alert('Đăng ký thành công: ' + JSON.stringify(userData));
  activeTab.value = 'login';
};
</script>

<style scoped>
.auth-tabs >>> .ant-tabs-tab {
  font-weight: 600;
  font-size: 1.125rem;
}
</style>
