<template>
  <teleport to="body">
    <div v-if="modelValue" class="modal-overlay" :class="{ 'fade-in': modelValue }" @click="closeOnOverlayClick && close()">
      <div class="modal-container" :class="[sizeClass, { 'zoom-in': modelValue }]" @click.stop>
        <div class="modal-header">
          <h3 v-if="title" class="modal-title">{{ title }}</h3>
          <button v-if="showCloseButton" class="modal-close" @click="close">
            <close-outlined />
          </button>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
        <div v-if="$slots.footer" class="modal-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { computed, watch } from 'vue';
import { CloseOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large', 'full'].includes(value)
  },
  showCloseButton: {
    type: Boolean,
    default: true
  },
  closeOnOverlayClick: {
    type: Boolean,
    default: true
  },
  closeOnEsc: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:modelValue', 'close']);

const sizeClass = computed(() => `size-${props.size}`);

const close = () => {
  emit('update:modelValue', false);
  emit('close');
};

// Đóng modal khi nhấn ESC
const handleKeyDown = (e) => {
  if (props.closeOnEsc && e.key === 'Escape' && props.modelValue) {
    close();
  }
};

// Xử lý khóa cuộn khi modal mở
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
  } else {
    document.removeEventListener('keydown', handleKeyDown);
    document.body.style.overflow = '';
  }
}, { immediate: true });
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.fade-in {
  opacity: 1;
}

.modal-container {
  background-color: #1a1a1a;
  border: 1px solid #333;
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  margin: 0 1rem;
  max-height: calc(100vh - 40px);
  opacity: 0;
  overflow: hidden;
  transform: scale(0.95);
  transition: all 0.3s ease;
}

.zoom-in {
  opacity: 1;
  transform: scale(1);
}

.modal-header {
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #333;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #fff;
}

.modal-close {
  background: transparent;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0.25rem;
  transition: color 0.3s ease;
}

.modal-close:hover {
  color: #ec4899;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
}

.modal-footer {
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  border-top: 1px solid #333;
}

/* Sizes */
.size-small {
  width: 400px;
}

.size-medium {
  width: 600px;
}

.size-large {
  width: 800px;
}

.size-full {
  width: calc(100vw - 2rem);
  height: calc(100vh - 2rem);
}

@media (max-width: 640px) {
  .size-small,
  .size-medium,
  .size-large {
    width: calc(100vw - 2rem);
  }
}
</style>