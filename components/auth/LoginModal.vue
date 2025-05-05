<template>
  <div>
    <a-modal v-model:visible="localVisible" title="Đăng nhập" :footer="null" width="400px" centered>
      <login-form @success="handleSuccess" @register="$emit('register')" />
    </a-modal>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import LoginForm from './LoginForm.vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

const localVisible = ref(false);
const emit = defineEmits(['update:visible', 'success', 'register']);

watch(() => props.visible, (newVal) => {
  console.log('Login Modal visible prop changed:', newVal);
  localVisible.value = newVal;
});

watch(() => localVisible.value, (newVal) => {
  console.log('Login Modal local visible changed:', newVal);
  if (newVal !== props.visible) {
    emit('update:visible', newVal);
  }
});

const handleSuccess = (userData) => {
  emit('success', userData);
  emit('update:visible', false);
};
</script>