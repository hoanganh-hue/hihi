<template>
  <div class="mb-4">
    <div class="text-white font-medium mb-2">{{ title }}</div>
    <div class="flex flex-wrap gap-2">
      <a-checkbox-group 
        v-model:value="selected" 
        @change="updateSelected"
      >
        <div class="flex flex-wrap gap-2">
          <a-checkbox 
            v-for="option in options" 
            :key="option.value" 
            :value="option.value"
            class="filter-checkbox"
          >
            <span class="text-gray-300">{{ option.label }}</span>
          </a-checkbox>
        </div>
      </a-checkbox-group>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  options: {
    type: Array,
    default: () => []
  },
  selectedValues: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:selected']);

const selected = ref(props.selectedValues || []);

// Khi selected thay đổi, emit sự kiện để thông báo cho component cha
function updateSelected(values) {
  emit('update:selected', values);
}

// Sync khi props thay đổi
watch(() => props.selectedValues, (newVal) => {
  selected.value = newVal || [];
}, { deep: true });
</script>

<style scoped>
.filter-checkbox :deep(.ant-checkbox-wrapper) {
  color: #d9d9d9 !important;
}

.filter-checkbox :deep(.ant-checkbox-checked .ant-checkbox-inner) {
  background-color: #ec4899 !important;
  border-color: #ec4899 !important;
}
</style>
