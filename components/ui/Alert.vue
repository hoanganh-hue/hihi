<template>
  <div 
    v-if="show" 
    class="alert" 
    :class="[
      `type-${type}`,
      { 'with-icon': showIcon, 'with-close': closable, bordered }
    ]"
    role="alert"
  >
    <div v-if="showIcon" class="alert-icon">
      <component :is="iconComponent" />
    </div>
    <div class="alert-content">
      <div v-if="title" class="alert-title">{{ title }}</div>
      <div class="alert-message">
        <slot>{{ message }}</slot>
      </div>
      <div v-if="$slots.action" class="alert-action">
        <slot name="action"></slot>
      </div>
    </div>
    <button v-if="closable" class="alert-close" @click="closeAlert">
      <close-outlined />
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { 
  CheckCircleOutlined, 
  InfoCircleOutlined, 
  ExclamationCircleOutlined, 
  CloseCircleOutlined,
  CloseOutlined
} from '@ant-design/icons-vue';

const props = defineProps({
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'info', 'warning', 'error'].includes(value)
  },
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  closable: {
    type: Boolean,
    default: false
  },
  showIcon: {
    type: Boolean,
    default: true
  },
  duration: {
    type: Number,
    default: 0,
    validator: (value) => value >= 0
  },
  bordered: {
    type: Boolean,
    default: true
  },
  modelValue: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['close', 'update:modelValue']);

const show = ref(props.modelValue);

// Xác định icon component dựa trên type
const iconComponent = computed(() => {
  switch (props.type) {
    case 'success':
      return CheckCircleOutlined;
    case 'warning':
      return ExclamationCircleOutlined;
    case 'error':
      return CloseCircleOutlined;
    case 'info':
    default:
      return InfoCircleOutlined;
  }
});

// Đóng alert
const closeAlert = () => {
  show.value = false;
  emit('close');
  emit('update:modelValue', false);
};

// Tự động đóng alert sau một khoảng thời gian
if (props.duration > 0) {
  setTimeout(() => {
    closeAlert();
  }, props.duration);
}
</script>

<style scoped>
.alert {
  display: flex;
  padding: 1rem;
  border-radius: 0.5rem;
  position: relative;
  margin-bottom: 1rem;
}

.alert.bordered {
  border: 1px solid;
}

.alert-icon {
  flex-shrink: 0;
  margin-right: 0.75rem;
  display: flex;
  align-items: flex-start;
  font-size: 1.25rem;
}

.alert-content {
  flex: 1;
}

.alert-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.alert-message {
  font-size: 0.875rem;
}

.alert-action {
  margin-top: 0.75rem;
}

.alert-close {
  display: flex;
  align-items: center;
  background: transparent;
  border: none;
  color: currentColor;
  opacity: 0.6;
  cursor: pointer;
  padding: 0.25rem;
  margin: -0.25rem;
  transition: opacity 0.3s ease;
}

.alert-close:hover {
  opacity: 1;
}

/* Alert types */
.alert.type-success {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.alert.type-success.bordered {
  border-color: #10b981;
}

.alert.type-info {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.alert.type-info.bordered {
  border-color: #3b82f6;
}

.alert.type-warning {
  background-color: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.alert.type-warning.bordered {
  border-color: #f59e0b;
}

.alert.type-error {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.alert.type-error.bordered {
  border-color: #ef4444;
}
</style>