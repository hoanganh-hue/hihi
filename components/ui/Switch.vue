<template>
  <button
    type="button"
    class="switch"
    :class="[
      sizeClass,
      { 
        'active': modelValue, 
        'disabled': disabled, 
        'loading': loading,
        'with-label': hasLabelSlot || (showLabels && (onLabel || offLabel))
      }
    ]"
    :style="{ backgroundColor: bgColor }"
    role="switch"
    :aria-checked="modelValue"
    :disabled="disabled || loading"
    @click="toggle"
  >
    <div class="switch-track">
      <!-- Labels inside switch -->
      <span v-if="showLabels && !round" class="switch-text on">{{ onLabel }}</span>
      <span v-if="showLabels && !round" class="switch-text off">{{ offLabel }}</span>
      
      <!-- Loading indicator -->
      <span v-if="loading" class="switch-loading"></span>
      
      <!-- Thumb/Handle -->
      <span class="switch-thumb" :style="thumbStyle">
        <slot name="thumb"></slot>
      </span>
    </div>
    
    <!-- Label slots -->
    <div v-if="hasLabelSlot" class="switch-label">
      <slot name="label" :active="modelValue"></slot>
    </div>
  </button>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'medium',
    validator: (val) => ['small', 'medium', 'large'].includes(val)
  },
  color: {
    type: String,
    default: ''
  },
  round: {
    type: Boolean,
    default: false
  },
  showLabels: {
    type: Boolean,
    default: false
  },
  onLabel: {
    type: String,
    default: 'ON'
  },
  offLabel: {
    type: String,
    default: 'OFF'
  }
});

const emit = defineEmits(['update:modelValue', 'change']);

// Kiểm tra nếu có slot label
const hasLabelSlot = computed(() => !!slots.label);

// Classes dựa trên kích thước
const sizeClass = computed(() => `size-${props.size}`);

// Màu nền dựa trên trạng thái
const bgColor = computed(() => {
  if (props.disabled) return undefined;
  if (!props.modelValue) return undefined;
  return props.color || undefined;
});

// Style cho thumb
const thumbStyle = computed(() => {
  const style = {};
  if (props.loading) {
    style.transform = 'scale(0.8)';
  }
  return style;
});

// Toggle trạng thái
const toggle = () => {
  if (props.disabled || props.loading) return;
  
  const newValue = !props.modelValue;
  emit('update:modelValue', newValue);
  emit('change', newValue);
};
</script>

<script>
export default {
  // Cần này để truy cập slots trong setup script
  inject: ['slots']
};
</script>

<style scoped>
.switch {
  display: inline-flex;
  align-items: center;
  position: relative;
  appearance: none;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  background: transparent;
  transition: all 0.3s;
  outline: none;
}

.switch-track {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #333;
  border-radius: 9999px;
  transition: background-color 0.3s ease;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}

.switch.active .switch-track {
  background: linear-gradient(to right, #ec4899, #8b5cf6);
}

.switch-thumb {
  position: absolute;
  left: 2px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.3s ease, left 0.3s ease, width 0.15s ease, height 0.15s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.switch.active .switch-thumb {
  transform: translateX(calc(var(--switch-width) - var(--thumb-size) - 4px));
}

/* Size variants */
.switch.size-small {
  --switch-width: 36px;
  --switch-height: 20px;
  --thumb-size: 16px;
}

.switch.size-medium {
  --switch-width: 44px;
  --switch-height: 24px;
  --thumb-size: 20px;
}

.switch.size-large {
  --switch-width: 52px;
  --switch-height: 28px;
  --thumb-size: 24px;
}

.switch-track {
  width: var(--switch-width);
  height: var(--switch-height);
}

.switch-thumb {
  width: var(--thumb-size);
  height: var(--thumb-size);
}

/* Switch text labels */
.switch-text {
  position: absolute;
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  transition: opacity 0.3s ease;
  white-space: nowrap;
}

.switch-text.on {
  left: 6px;
  color: white;
  opacity: 0;
}

.switch-text.off {
  right: 6px;
  color: #9ca3af;
  opacity: 1;
}

.switch.active .switch-text.on {
  opacity: 1;
}

.switch.active .switch-text.off {
  opacity: 0;
}

/* Loading indicator */
.switch-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 14px;
  height: 14px;
  margin: -7px 0 0 -7px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: switch-loading 0.6s linear infinite;
}

@keyframes switch-loading {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Disabled state */
.switch.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Switch with label */
.switch.with-label {
  display: inline-flex;
  align-items: center;
}

.switch-label {
  margin-left: 0.5rem;
  font-size: 0.875rem;
  color: #d1d5db;
}
</style>