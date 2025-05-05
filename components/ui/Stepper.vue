<template>
  <div class="stepper" :class="[orientation]">
    <div 
      v-for="(step, index) in steps" 
      :key="index"
      class="step"
      :class="[
        { 
          'active': index === modelValue, 
          'completed': isCompleted(index), 
          'error': step.error,
          'clickable': clickable
        },
        orientation
      ]"
      @click="clickable && onClick(index)"
    >
      <!-- Step connector -->
      <div v-if="index > 0" class="step-connector" :class="[orientation]">
        <div 
          class="step-connector-line"
          :class="{ 'active': isCompleted(index - 1) }"
        ></div>
      </div>
      
      <!-- Step content -->
      <div class="step-content">
        <!-- Step icon/number -->
        <div class="step-icon-container">
          <div v-if="step.error" class="step-icon error">
            <close-outlined />
          </div>
          <div v-else-if="isCompleted(index)" class="step-icon completed">
            <check-outlined />
          </div>
          <div v-else class="step-icon">
            <component v-if="step.icon" :is="step.icon" />
            <span v-else>{{ index + 1 }}</span>
          </div>
        </div>
        
        <!-- Step label and description -->
        <div class="step-text-container">
          <div class="step-label">{{ step.label }}</div>
          <div v-if="step.description" class="step-description">{{ step.description }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  steps: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every(step => 'label' in step);
    }
  },
  modelValue: {
    type: Number,
    default: 0
  },
  completed: {
    type: Array,
    default: () => []
  },
  orientation: {
    type: String,
    default: 'horizontal',
    validator: (value) => ['horizontal', 'vertical'].includes(value)
  },
  clickable: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'step-click']);

// Kiểm tra xem bước đã hoàn thành chưa
const isCompleted = (index) => {
  // Nếu có mảng completed thì kiểm tra tồn tại trong mảng
  if (props.completed.length > 0) {
    return props.completed.includes(index);
  }
  // Nếu không có mảng completed thì tất cả các bước trước bước hiện tại được coi là đã hoàn thành
  return index < props.modelValue;
};

// Xử lý khi click vào bước
const onClick = (index) => {
  emit('update:modelValue', index);
  emit('step-click', index);
};
</script>

<style scoped>
/* Base styles */
.stepper {
  display: flex;
  width: 100%;
}

.step {
  position: relative;
  display: flex;
}

/* Horizontal layout */
.stepper.horizontal {
  flex-direction: row;
}

.step.horizontal {
  flex: 1;
  flex-direction: column;
  align-items: center;
  padding: 0 0.5rem;
}

.step-connector.horizontal {
  position: absolute;
  top: 1rem;
  left: calc(-50% + 1rem);
  right: calc(50% + 1rem);
  height: 2px;
}

.step-connector-line {
  background-color: #333;
  height: 100%;
  width: 100%;
  transition: background-color 0.3s ease;
}

.step-connector-line.active {
  background: linear-gradient(to right, #ec4899, #8b5cf6);
}

/* Vertical layout */
.stepper.vertical {
  flex-direction: column;
}

.step.vertical {
  min-height: 4rem;
  flex-direction: row;
}

.step-connector.vertical {
  position: absolute;
  top: 0;
  left: 1rem;
  height: 100%;
  width: 2px;
  transform: translateX(-50%);
}

/* Step content */
.step-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.step.vertical .step-content {
  flex-direction: row;
  align-items: flex-start;
}

.step-icon-container {
  width: 2rem;
  height: 2rem;
  margin: 0 0 0.5rem;
  position: relative;
  z-index: 1;
}

.step.vertical .step-icon-container {
  margin: 0 1rem 0 0;
}

.step-icon {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #333;
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.step.active .step-icon {
  background-color: #ec4899;
  color: white;
}

.step-icon.completed {
  background: linear-gradient(to right, #ec4899, #8b5cf6);
  color: white;
}

.step-icon.error {
  background-color: #ef4444;
  color: white;
}

.step-text-container {
  text-align: center;
}

.step.vertical .step-text-container {
  text-align: left;
}

.step-label {
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: #d1d5db;
}

.step.active .step-label {
  color: #ec4899;
}

.step.completed .step-label {
  color: white;
}

.step.error .step-label {
  color: #ef4444;
}

.step-description {
  font-size: 0.75rem;
  color: #9ca3af;
  max-width: 15rem;
}

/* Clickable steps */
.step.clickable {
  cursor: pointer;
}

.step.clickable:hover .step-icon:not(.completed):not(.error) {
  background-color: #444;
}

.step.clickable:hover .step-label:not(.active):not(.completed):not(.error) {
  color: #f3f4f6;
}
</style>