<template>
  <div 
    class="skeleton" 
    :class="[
      `shape-${shape}`, 
      { 'animate': animate, 'dark': variant === 'dark', 'light': variant === 'light' }
    ]"
    :style="calculatedStyle"
  ></div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  // Kích thước
  width: {
    type: [String, Number],
    default: '100%'
  },
  height: {
    type: [String, Number],
    default: '1.5rem'
  },
  // Hình dạng
  shape: {
    type: String,
    default: 'rectangle',
    validator: (value) => ['rectangle', 'circle', 'rounded'].includes(value)
  },
  // Hiệu ứng animation
  animate: {
    type: Boolean,
    default: true
  },
  // Variant
  variant: {
    type: String,
    default: 'dark',
    validator: (value) => ['dark', 'light'].includes(value)
  }
});

// Tính toán style dựa trên props
const calculatedStyle = computed(() => {
  const style = {};
  
  // Xử lý width
  if (typeof props.width === 'number') {
    style.width = `${props.width}px`;
  } else {
    style.width = props.width;
  }
  
  // Xử lý height
  if (typeof props.height === 'number') {
    style.height = `${props.height}px`;
  } else {
    style.height = props.height;
  }
  
  return style;
});
</script>

<style scoped>
.skeleton {
  display: inline-block;
  position: relative;
  overflow: hidden;
}

/* Shapes */
.shape-rectangle {
  border-radius: 0;
}

.shape-rounded {
  border-radius: 0.375rem;
}

.shape-circle {
  border-radius: 50%;
}

/* Variants */
.skeleton.dark {
  background-color: #2a2a2a;
}

.skeleton.light {
  background-color: #333333;
}

/* Animation */
.skeleton.animate::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.05),
    transparent
  );
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>