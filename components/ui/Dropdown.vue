<template>
  <div class="dropdown-container" ref="container">
    <div @click="toggleDropdown" class="dropdown-trigger">
      <slot name="trigger"></slot>
    </div>
    <div v-if="isOpen" class="dropdown-menu" :class="[positionClass, { 'with-arrow': showArrow }]">
      <div v-if="showArrow" class="dropdown-arrow"></div>
      <div class="dropdown-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';

const props = defineProps({
  position: {
    type: String,
    default: 'bottom-start',
    validator: (value) => [
      'top-start', 'top', 'top-end',
      'right-start', 'right', 'right-end',
      'bottom-start', 'bottom', 'bottom-end',
      'left-start', 'left', 'left-end'
    ].includes(value)
  },
  showArrow: {
    type: Boolean,
    default: false
  },
  closeOnClick: {
    type: Boolean,
    default: true
  },
  closeOnOutsideClick: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['open', 'close']);

const isOpen = ref(false);
const container = ref(null);

const positionClass = computed(() => `position-${props.position}`);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    emit('open');
  } else {
    emit('close');
  }
};

const closeDropdown = () => {
  if (isOpen.value) {
    isOpen.value = false;
    emit('close');
  }
};

const handleOutsideClick = (event) => {
  if (props.closeOnOutsideClick && container.value && !container.value.contains(event.target)) {
    closeDropdown();
  }
};

const handleMenuClick = (event) => {
  if (props.closeOnClick && event.target.closest('.dropdown-menu')) {
    closeDropdown();
  }
};

// Tự động đóng dropdown khi route thay đổi
watch(
  () => window.location.href,
  () => {
    closeDropdown();
  }
);

onMounted(() => {
  if (props.closeOnOutsideClick) {
    document.addEventListener('click', handleOutsideClick);
  }
  
  if (props.closeOnClick) {
    container.value?.addEventListener('click', handleMenuClick);
  }
});

onBeforeUnmount(() => {
  if (props.closeOnOutsideClick) {
    document.removeEventListener('click', handleOutsideClick);
  }
  
  if (props.closeOnClick) {
    container.value?.removeEventListener('click', handleMenuClick);
  }
});
</script>

<style scoped>
.dropdown-container {
  position: relative;
  display: inline-block;
}

.dropdown-trigger {
  cursor: pointer;
}

.dropdown-menu {
  position: absolute;
  z-index: 50;
  min-width: 180px;
  padding: 8px 0;
  margin-top: 4px;
  background-color: #1a1a1a;
  border: 1px solid #333;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.dropdown-content {
  padding: 0;
}

/* Positions */
.position-bottom-start {
  top: 100%;
  left: 0;
}

.position-bottom {
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
}

.position-bottom-end {
  top: 100%;
  right: 0;
}

.position-top-start {
  bottom: 100%;
  left: 0;
}

.position-top {
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
}

.position-top-end {
  bottom: 100%;
  right: 0;
}

.position-left-start {
  right: 100%;
  top: 0;
}

.position-left {
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
}

.position-left-end {
  right: 100%;
  bottom: 0;
}

.position-right-start {
  left: 100%;
  top: 0;
}

.position-right {
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
}

.position-right-end {
  left: 100%;
  bottom: 0;
}

/* Arrow */
.dropdown-arrow {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: #1a1a1a;
  border: 1px solid #333;
  transform: rotate(45deg);
  z-index: -1;
}

.with-arrow.position-bottom-start .dropdown-arrow,
.with-arrow.position-bottom .dropdown-arrow,
.with-arrow.position-bottom-end .dropdown-arrow {
  top: -5px;
  border-right: none;
  border-bottom: none;
}

.with-arrow.position-bottom-start .dropdown-arrow {
  left: 15px;
}

.with-arrow.position-bottom .dropdown-arrow {
  left: 50%;
  margin-left: -5px;
}

.with-arrow.position-bottom-end .dropdown-arrow {
  right: 15px;
}

.with-arrow.position-top-start .dropdown-arrow,
.with-arrow.position-top .dropdown-arrow,
.with-arrow.position-top-end .dropdown-arrow {
  bottom: -5px;
  border-left: none;
  border-top: none;
}

.with-arrow.position-top-start .dropdown-arrow {
  left: 15px;
}

.with-arrow.position-top .dropdown-arrow {
  left: 50%;
  margin-left: -5px;
}

.with-arrow.position-top-end .dropdown-arrow {
  right: 15px;
}

.with-arrow.position-left-start .dropdown-arrow,
.with-arrow.position-left .dropdown-arrow,
.with-arrow.position-left-end .dropdown-arrow {
  right: -5px;
  border-left: none;
  border-top: none;
}

.with-arrow.position-left-start .dropdown-arrow {
  top: 15px;
}

.with-arrow.position-left .dropdown-arrow {
  top: 50%;
  margin-top: -5px;
}

.with-arrow.position-left-end .dropdown-arrow {
  bottom: 15px;
}

.with-arrow.position-right-start .dropdown-arrow,
.with-arrow.position-right .dropdown-arrow,
.with-arrow.position-right-end .dropdown-arrow {
  left: -5px;
  border-right: none;
  border-bottom: none;
}

.with-arrow.position-right-start .dropdown-arrow {
  top: 15px;
}

.with-arrow.position-right .dropdown-arrow {
  top: 50%;
  margin-top: -5px;
}

.with-arrow.position-right-end .dropdown-arrow {
  bottom: 15px;
}
</style>