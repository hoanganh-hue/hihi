<template>
  <teleport to="body">
    <div class="toast-container" :class="[position]">
      <transition-group name="toast">
        <div 
          v-for="toast in toasts" 
          :key="toast.id"
          class="toast"
          :class="[
            `type-${toast.type}`, 
            { 'with-action': !!toast.actionLabel }
          ]"
          @click="toast.dismissible && closeToast(toast.id)"
          @mouseenter="pauseToast(toast.id)"
          @mouseleave="resumeToast(toast.id)"
        >
          <!-- Icon -->
          <div v-if="toast.showIcon" class="toast-icon">
            <component :is="getIconForType(toast.type)" />
          </div>
          
          <!-- Content -->
          <div class="toast-content">
            <div v-if="toast.title" class="toast-title">{{ toast.title }}</div>
            <div class="toast-message">{{ toast.message }}</div>
            
            <!-- Progress bar -->
            <div v-if="toast.duration > 0" class="toast-progress">
              <div 
                class="toast-progress-bar" 
                :style="{ 
                  width: `${getProgressPercentage(toast)}%`,
                  animationDuration: `${toast.duration}ms`,
                  animationPlayState: toast.isPaused ? 'paused' : 'running'
                }"
              ></div>
            </div>
          </div>
          
          <!-- Action button -->
          <button 
            v-if="toast.actionLabel" 
            class="toast-action"
            @click.stop="handleAction(toast)"
          >
            {{ toast.actionLabel }}
          </button>
          
          <!-- Close button -->
          <button 
            v-if="toast.dismissible" 
            class="toast-close"
            @click.stop="closeToast(toast.id)"
          >
            <close-outlined />
          </button>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script setup>
import { ref, reactive, computed, onBeforeUnmount } from 'vue';
import { 
  CheckCircleOutlined, 
  InfoCircleOutlined, 
  ExclamationCircleOutlined, 
  CloseCircleOutlined,
  CloseOutlined
} from '@ant-design/icons-vue';

let toastIdCounter = 0;
const toasts = reactive([]);
const toastTimeouts = ref({});

// Vị trí của toasts (góc trên phải, dưới phải, etc)
const position = ref('top-right');

// Thêm toast mới
const showToast = (options) => {
  const id = toastIdCounter++;
  
  // Tạo toast mới với các thuộc tính mặc định và các options được ghi đè
  const toast = {
    id,
    type: 'info',
    title: '',
    message: '',
    duration: 5000,
    showIcon: true,
    dismissible: true,
    pauseOnHover: true,
    position: position.value,
    actionLabel: '',
    actionHandler: null,
    onClose: null,
    isPaused: false,
    startTime: Date.now(),
    remainingTime: 0,
    ...options
  };
  
  // Thêm toast vào mảng hiển thị
  toasts.unshift(toast);
  
  // Nếu có duration > 0, tự động đóng sau khoảng thời gian
  if (toast.duration > 0) {
    toastTimeouts.value[id] = setTimeout(() => {
      closeToast(id);
    }, toast.duration);
  }
  
  return id;
};

// Đóng toast
const closeToast = (id) => {
  const index = toasts.findIndex(toast => toast.id === id);
  
  if (index !== -1) {
    const toast = toasts[index];
    
    // Gọi callback onClose nếu có
    if (typeof toast.onClose === 'function') {
      toast.onClose(toast);
    }
    
    // Xóa timeout
    if (toastTimeouts.value[id]) {
      clearTimeout(toastTimeouts.value[id]);
      delete toastTimeouts.value[id];
    }
    
    // Xóa toast khỏi mảng
    toasts.splice(index, 1);
  }
};

// Xử lý khi hover để tạm dừng đếm ngược
const pauseToast = (id) => {
  const toast = toasts.find(t => t.id === id);
  if (!toast || !toast.pauseOnHover || toast.duration <= 0) return;
  
  // Tạm dừng timeout
  if (toastTimeouts.value[id]) {
    clearTimeout(toastTimeouts.value[id]);
    toast.remainingTime = toast.duration - (Date.now() - toast.startTime);
    toast.isPaused = true;
  }
};

// Tiếp tục đếm ngược khi hover ra
const resumeToast = (id) => {
  const toast = toasts.find(t => t.id === id);
  if (!toast || !toast.pauseOnHover || toast.duration <= 0 || !toast.isPaused) return;
  
  // Tiếp tục timeout với thời gian còn lại
  toast.startTime = Date.now();
  toast.isPaused = false;
  
  toastTimeouts.value[id] = setTimeout(() => {
    closeToast(id);
  }, toast.remainingTime);
};

// Xử lý khi click vào nút hành động
const handleAction = (toast) => {
  if (typeof toast.actionHandler === 'function') {
    toast.actionHandler(toast);
  }
  
  // Tự động đóng toast sau khi thực hiện hành động
  closeToast(toast.id);
};

// Tính toán phần trăm thời gian còn lại cho progress bar
const getProgressPercentage = (toast) => {
  if (toast.duration <= 0) return 100;
  
  if (toast.isPaused) {
    return (toast.remainingTime / toast.duration) * 100;
  }
  
  const elapsed = Date.now() - toast.startTime;
  const remaining = Math.max(0, toast.duration - elapsed);
  return (remaining / toast.duration) * 100;
};

// Lấy icon dựa trên loại toast
const getIconForType = (type) => {
  switch (type) {
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
};

// Tạo các helpers cho các loại toast khác nhau
const success = (message, options = {}) => {
  return showToast({ message, type: 'success', ...options });
};

const info = (message, options = {}) => {
  return showToast({ message, type: 'info', ...options });
};

const warning = (message, options = {}) => {
  return showToast({ message, type: 'warning', ...options });
};

const error = (message, options = {}) => {
  return showToast({ message, type: 'error', ...options });
};

// Thay đổi vị trí mặc định
const setPosition = (newPosition) => {
  position.value = newPosition;
};

// Xóa tất cả toasts
const clearAll = () => {
  toasts.forEach(toast => {
    if (toastTimeouts.value[toast.id]) {
      clearTimeout(toastTimeouts.value[toast.id]);
      delete toastTimeouts.value[toast.id];
    }
  });
  
  toasts.splice(0, toasts.length);
};

// Clean up khi component bị destroy
onBeforeUnmount(() => {
  Object.values(toastTimeouts.value).forEach(clearTimeout);
});

// Expose the API
defineExpose({
  showToast,
  success,
  info,
  warning,
  error,
  closeToast,
  clearAll,
  setPosition
});
</script>

<style scoped>
.toast-container {
  position: fixed;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 24rem;
  width: calc(100% - 2rem);
  pointer-events: none;
  padding: 1rem;
}

/* Positions */
.toast-container.top-right {
  top: 0;
  right: 0;
}

.toast-container.top-left {
  top: 0;
  left: 0;
}

.toast-container.top-center {
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.toast-container.bottom-right {
  bottom: 0;
  right: 0;
}

.toast-container.bottom-left {
  bottom: 0;
  left: 0;
}

.toast-container.bottom-center {
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}

.toast {
  display: flex;
  align-items: flex-start;
  background-color: #1a1a1a;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.2);
  padding: 1rem;
  pointer-events: auto;
  position: relative;
  overflow: hidden;
  border-left: 4px solid;
}

/* Toast types */
.toast.type-success {
  border-left-color: #10b981;
}

.toast.type-info {
  border-left-color: #3b82f6;
}

.toast.type-warning {
  border-left-color: #f59e0b;
}

.toast.type-error {
  border-left-color: #ef4444;
}

.toast-icon {
  margin-right: 0.75rem;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.toast.type-success .toast-icon {
  color: #10b981;
}

.toast.type-info .toast-icon {
  color: #3b82f6;
}

.toast.type-warning .toast-icon {
  color: #f59e0b;
}

.toast.type-error .toast-icon {
  color: #ef4444;
}

.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: white;
}

.toast-message {
  color: #d1d5db;
  font-size: 0.875rem;
  word-wrap: break-word;
}

.toast-close {
  background: transparent;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  font-size: 1rem;
  margin: -0.25rem -0.25rem -0.25rem 0.5rem;
  padding: 0.25rem;
  transition: color 0.2s;
  flex-shrink: 0;
}

.toast-close:hover {
  color: white;
}

.toast-action {
  background: transparent;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  margin: -0.25rem 0.5rem;
  transition: color 0.2s;
  white-space: nowrap;
}

.toast-action:hover {
  color: #60a5fa;
}

.toast.with-action .toast-content {
  margin-right: 0.5rem;
}

/* Progress bar */
.toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background-color: rgba(255, 255, 255, 0.1);
}

.toast-progress-bar {
  height: 100%;
  transition: width 0.1s linear;
}

.toast.type-success .toast-progress-bar {
  background-color: #10b981;
}

.toast.type-info .toast-progress-bar {
  background-color: #3b82f6;
}

.toast.type-warning .toast-progress-bar {
  background-color: #f59e0b;
}

.toast.type-error .toast-progress-bar {
  background-color: #ef4444;
}

/* Animations */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-1rem);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>