<template>
  <div>
    <button @click="showModal = true" class="px-4 py-2 bg-pink-500 text-white rounded">Mở Modal Đăng nhập</button>
    <login-modal v-model:visible="showModal" @success="handleSuccess" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import LoginModal from './LoginModal.vue';

const showModal = ref(false);

const handleSuccess = (userData) => {
  alert('Đăng nhập thành công: ' + JSON.stringify(userData));
  showModal.value = false;
};
</script>
