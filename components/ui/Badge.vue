<template>
  <div class="badge" :class="[sizeClass, typeClass, { 'dot-only': dotOnly }]">
    <slot v-if="!dotOnly">{{ content }}</slot>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  content: {
    type: [String, Number],
    default: ''
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  type: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'success', 'warning', 'error', 'info'].includes(value)
  },
  dotOnly: {
    type: Boolean,
    default: false
  }
});

const sizeClass = computed(() => `size-${props.size}`);
const typeClass = computed(() => `type-${props.type}`);
</script>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  font-weight: 500;
  white-space: nowrap;
}

.size-small {
  height: 16px;
  padding: 0 6px;
  font-size: 10px;
  min-width: 16px;
}

.size-medium {
  height: 20px;
  padding: 0 8px;
  font-size: 12px;
  min-width: 20px;
}

.size-large {
  height: 24px;
  padding: 0 10px;
  font-size: 14px;
  min-width: 24px;
}

.type-primary {
  background: linear-gradient(to right, #ec4899, #8b5cf6);
  color: white;
}

.type-success {
  background-color: #10b981;
  color: white;
}

.type-warning {
  background-color: #f59e0b;
  color: white;
}

.type-error {
  background-color: #ef4444;
  color: white;
}

.type-info {
  background-color: #3b82f6;
  color: white;
}

.dot-only {
  height: 8px;
  width: 8px;
  min-width: 8px;
  padding: 0;
}

.dot-only.size-small {
  height: 6px;
  width: 6px;
  min-width: 6px;
}

.dot-only.size-large {
  height: 10px;
  width: 10px;
  min-width: 10px;
}
</style>