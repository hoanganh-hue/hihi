<template>
  <div class="tabs-container">
    <!-- Tab headers -->
    <div class="tabs-header" :class="{ 'bordered': type === 'card', 'pill': type === 'pill' }">
      <div 
        v-for="(tab, index) in tabs" 
        :key="index"
        class="tab-item"
        :class="{ 
          'active': modelValue === tab.value,
          'disabled': tab.disabled,
          [type]: true
        }"
        @click="!tab.disabled && updateValue(tab.value)"
      >
        <component v-if="tab.icon" :is="tab.icon" class="tab-icon" />
        <span>{{ tab.label }}</span>
      </div>
      
      <!-- Active indicator for line type -->
      <div v-if="type === 'line' && activeIndex !== null" class="active-indicator" :style="indicatorStyle"></div>
    </div>
    
    <!-- Tab content -->
    <div class="tab-content" v-if="!tabsOnly">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, provide, onMounted, watch } from 'vue';

const props = defineProps({
  tabs: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every(tab => 'label' in tab && 'value' in tab);
    }
  },
  modelValue: {
    type: [String, Number],
    required: true
  },
  type: {
    type: String,
    default: 'line',
    validator: (value) => ['line', 'card', 'pill'].includes(value)
  },
  tabsOnly: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'change']);

// Tìm chỉ số của tab đang được chọn
const activeIndex = computed(() => {
  return props.tabs.findIndex(tab => tab.value === props.modelValue);
});

// Tính toán style cho thanh active indicator
const indicatorStyle = computed(() => {
  if (activeIndex.value === -1) return { display: 'none' };
  
  const tabsCount = props.tabs.length;
  const width = `${100 / tabsCount}%`;
  const left = `${(100 / tabsCount) * activeIndex.value}%`;
  
  return {
    width,
    left
  };
});

// Cung cấp giá trị cho các tab panel con
provide('activeTabValue', computed(() => props.modelValue));

// Cập nhật tab được chọn
const updateValue = (value) => {
  emit('update:modelValue', value);
  emit('change', value);
};

// Thiết lập giá trị mặc định khi không có tab nào được chọn
onMounted(() => {
  if (activeIndex.value === -1 && props.tabs.length > 0) {
    const firstEnabledTab = props.tabs.find(tab => !tab.disabled);
    if (firstEnabledTab) {
      updateValue(firstEnabledTab.value);
    }
  }
});
</script>

<style scoped>
.tabs-container {
  width: 100%;
}

.tabs-header {
  display: flex;
  position: relative;
  margin-bottom: 1rem;
}

/* Line tabs style */
.tabs-header.bordered {
  border-bottom: 1px solid #333;
}

.tab-item {
  padding: 0.75rem 1.25rem;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  transition: all 0.3s ease;
  user-select: none;
  white-space: nowrap;
}

.tab-icon {
  margin-right: 0.5rem;
}

/* Line tab style */
.tab-item.line {
  border-bottom: 2px solid transparent;
}

.tab-item.line:hover:not(.disabled) {
  color: #d1d5db;
}

.tab-item.line.active {
  color: #ec4899;
  border-bottom-color: #ec4899;
}

/* Active indicator for line style */
.active-indicator {
  position: absolute;
  bottom: 0;
  height: 2px;
  background: linear-gradient(to right, #ec4899, #8b5cf6);
  transition: all 0.3s ease;
}

/* Card tab style */
.tab-item.card {
  border: 1px solid transparent;
  border-bottom: none;
  border-radius: 0.5rem 0.5rem 0 0;
  margin-right: 0.25rem;
  background-color: transparent;
}

.tab-item.card:hover:not(.disabled) {
  background-color: #1a1a1a;
  color: #d1d5db;
}

.tab-item.card.active {
  background-color: #1a1a1a;
  border-color: #333;
  color: #ec4899;
  margin-bottom: -1px;
  border-bottom: 1px solid #1a1a1a;
}

/* Pill tab style */
.tabs-header.pill {
  background-color: #1a1a1a;
  border-radius: 9999px;
  padding: 0.25rem;
  gap: 0.25rem;
}

.tab-item.pill {
  border-radius: 9999px;
  padding: 0.5rem 1rem;
}

.tab-item.pill:hover:not(.disabled) {
  background-color: #333;
  color: #d1d5db;
}

.tab-item.pill.active {
  background: linear-gradient(to right, #ec4899, #8b5cf6);
  color: white;
}

/* Disabled state */
.tab-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Tab content */
.tab-content {
  width: 100%;
}
</style>