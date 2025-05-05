<template>
  <button
    class="icon-button"
    :class="[
      `size-${size}`,
      `variant-${variant}`,
      { rounded, loading, disabled }
    ]"
    :disabled="disabled || loading"
    :aria-label="ariaLabel"
    :type="type"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="icon-button-loading"></span>
    <span v-else class="icon-button-content">
      <slot></slot>
    </span>
  </button>
</template>

<script setup>
defineProps({
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'ghost', 'outline'].includes(value)
  },
  rounded: {
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
  ariaLabel: {
    type: String,
    default: 'Button'
  },
  type: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value)
  }
});

defineEmits(['click']);
</script>

<style scoped>
.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

/* Size variants */
.icon-button.size-small {
  width: 32px;
  height: 32px;
  font-size: 0.875rem;
}

.icon-button.size-medium {
  width: 40px;
  height: 40px;
  font-size: 1rem;
}

.icon-button.size-large {
  width: 48px;
  height: 48px;
  font-size: 1.25rem;
}

/* Shape variants */
.icon-button:not(.rounded) {
  border-radius: 0.375rem;
}

.icon-button.rounded {
  border-radius: 50%;
}

/* Color variants */
.icon-button.variant-primary {
  background: linear-gradient(to right, #ec4899, #8b5cf6);
  color: white;
}

.icon-button.variant-primary:hover:not(:disabled):not(.loading) {
  background: linear-gradient(to right, #db2777, #7c3aed);
  box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.15);
}

.icon-button.variant-secondary {
  background-color: #333;
  color: #d1d5db;
}

.icon-button.variant-secondary:hover:not(:disabled):not(.loading) {
  background-color: #444;
  color: white;
}

.icon-button.variant-ghost {
  background-color: transparent;
  color: #d1d5db;
}

.icon-button.variant-ghost:hover:not(:disabled):not(.loading) {
  background-color: rgba(255, 255, 255, 0.08);
  color: white;
}

.icon-button.variant-outline {
  background-color: transparent;
  border: 1px solid #444;
  color: #d1d5db;
}

.icon-button.variant-outline:hover:not(:disabled):not(.loading) {
  background-color: rgba(255, 255, 255, 0.04);
  border-color: #d1d5db;
  color: white;
}

/* States */
.icon-button:active:not(:disabled):not(.loading) {
  transform: scale(0.97);
}

.icon-button.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.icon-button.loading {
  cursor: wait;
}

.icon-button-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 16px;
  height: 16px;
  margin: -8px 0 0 -8px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: icon-button-loading 0.8s infinite linear;
}

@keyframes icon-button-loading {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.icon-button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
  transition: opacity 0.2s;
}

.icon-button.loading .icon-button-content {
  opacity: 0;
}
</style>