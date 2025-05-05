<template>
  <div 
    class="avatar" 
    :class="[sizeClass, shapeClass, statusClass, { 'clickable': clickable }]"
    :style="avatarStyle"
    @click="handleClick"
  >
    <!-- Image avatar -->
    <img
      v-if="src && !error"
      :src="src"
      :alt="alt"
      @error="handleError"
      class="avatar-image"
    />
    
    <!-- Icon avatar -->
    <div v-else-if="icon" class="avatar-fallback avatar-icon">
      <component :is="icon" :class="iconClass" />
    </div>
    
    <!-- Text avatar -->
    <div v-else class="avatar-fallback avatar-text">
      {{ avatarText }}
    </div>
    
    <!-- Badge or indicator -->
    <span v-if="status" class="avatar-status" :class="statusClass"></span>
    
    <!-- Badge with text/number -->
    <span v-if="badge" class="avatar-badge">{{ badge }}</span>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { UserOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  // Source của avatar
  src: {
    type: String,
    default: ''
  },
  // Alt text cho image
  alt: {
    type: String,
    default: 'User avatar'
  },
  // Text hiển thị khi không có image
  text: {
    type: String,
    default: ''
  },
  // Icon hiển thị khi không có image và text
  icon: {
    type: Object,
    default: () => UserOutlined
  },
  // Kích thước
  size: {
    type: [Number, String],
    default: 'medium',
    validator: (val) => typeof val === 'number' || ['small', 'medium', 'large', 'xlarge'].includes(val)
  },
  // Shape
  shape: {
    type: String,
    default: 'circle',
    validator: (val) => ['circle', 'square', 'rounded'].includes(val)
  },
  // Màu nền
  bgColor: {
    type: String,
    default: ''
  },
  // Màu text
  color: {
    type: String,
    default: ''
  },
  // Status (online, offline, away)
  status: {
    type: String,
    default: '',
    validator: (val) => ['', 'online', 'offline', 'away', 'busy'].includes(val)
  },
  // Badge
  badge: {
    type: [String, Number],
    default: ''
  },
  // Clickable
  clickable: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['click', 'error']);

// Theo dõi lỗi hình ảnh
const error = ref(false);

// Xử lý sự kiện lỗi hình ảnh
const handleError = (e) => {
  error.value = true;
  emit('error', e);
};

// Xử lý click
const handleClick = (e) => {
  if (props.clickable) {
    emit('click', e);
  }
};

// Class dựa trên kích thước
const sizeClass = computed(() => {
  if (typeof props.size === 'number') return 'size-custom';
  return `size-${props.size}`;
});

// Class dựa trên hình dạng
const shapeClass = computed(() => `shape-${props.shape}`);

// Class dựa trên trạng thái
const statusClass = computed(() => props.status ? `status-${props.status}` : '');

// Class cho icon
const iconClass = computed(() => {
  return typeof props.size === 'number' ? 
    { fontSize: `${props.size / 2}px` } : 
    {};
});

// Style cho avatar
const avatarStyle = computed(() => {
  const style = {};
  
  // Kích thước tùy chỉnh
  if (typeof props.size === 'number') {
    style.width = `${props.size}px`;
    style.height = `${props.size}px`;
    
    // Điều chỉnh font-size cho text
    style.fontSize = `${props.size / 2.5}px`;
  }
  
  // Màu nền
  if (props.bgColor) {
    style.backgroundColor = props.bgColor;
  }
  
  // Màu text
  if (props.color) {
    style.color = props.color;
  }
  
  return style;
});

// Text hiển thị khi không có image
const avatarText = computed(() => {
  if (!props.text) return '';
  
  // Lấy ký tự đầu của mỗi từ (tối đa 2 ký tự)
  const words = props.text.split(' ');
  if (words.length === 1) {
    return props.text.charAt(0).toUpperCase();
  }
  
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
});
</script>

<style scoped>
.avatar {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-weight: 600;
  color: #fff;
  background-color: #333;
  overflow: hidden;
}

/* Size variants */
.avatar.size-small {
  width: 1.75rem;
  height: 1.75rem;
  font-size: 0.7rem;
}

.avatar.size-medium {
  width: 2.5rem;
  height: 2.5rem;
  font-size: 1rem;
}

.avatar.size-large {
  width: 3.5rem;
  height: 3.5rem;
  font-size: 1.4rem;
}

.avatar.size-xlarge {
  width: 5rem;
  height: 5rem;
  font-size: 2rem;
}

/* Shape variants */
.avatar.shape-circle {
  border-radius: 50%;
}

.avatar.shape-square {
  border-radius: 0;
}

.avatar.shape-rounded {
  border-radius: 0.375rem;
}

/* Avatar content */
.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Status indicator */
.avatar-status {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 25%;
  height: 25%;
  border-radius: 50%;
  border: 2px solid #1a1a1a;
  background-color: #9ca3af;
}

.avatar.status-online .avatar-status {
  background-color: #10b981;
}

.avatar.status-offline .avatar-status {
  background-color: #6b7280;
}

.avatar.status-away .avatar-status {
  background-color: #f59e0b;
}

.avatar.status-busy .avatar-status {
  background-color: #ef4444;
}

/* Badge */
.avatar-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: linear-gradient(to right, #ec4899, #8b5cf6);
  color: white;
  font-size: 0.75rem;
  min-width: 1.25rem;
  height: 1.25rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.25rem;
  transform: translate(25%, -25%);
  z-index: 1;
  box-shadow: 0 0 0 2px #1a1a1a;
}

/* Hover effect for clickable */
.avatar.clickable {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.avatar.clickable:hover {
  transform: scale(1.05);
  box-shadow: 0 0 0 2px rgba(236, 72, 153, 0.3);
}
</style>