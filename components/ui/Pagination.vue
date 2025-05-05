<template>
  <div class="pagination">
    <!-- Nút Previous -->
    <button 
      class="pagination-item pagination-button" 
      :class="{ 'disabled': currentPage <= 1 }"
      @click="changePage(currentPage - 1)" 
      :disabled="currentPage <= 1"
    >
      <left-outlined />
    </button>
    
    <!-- Trang đầu tiên -->
    <button 
      v-if="showFirstPage" 
      class="pagination-item" 
      :class="{ 'active': currentPage === 1 }"
      @click="changePage(1)"
    >
      1
    </button>
    
    <!-- Ellipsis đầu -->
    <span v-if="showLeftEllipsis" class="pagination-item pagination-ellipsis">...</span>
    
    <!-- Các trang giữa -->
    <button 
      v-for="page in middlePages" 
      :key="page"
      class="pagination-item" 
      :class="{ 'active': currentPage === page }"
      @click="changePage(page)"
    >
      {{ page }}
    </button>
    
    <!-- Ellipsis cuối -->
    <span v-if="showRightEllipsis" class="pagination-item pagination-ellipsis">...</span>
    
    <!-- Trang cuối cùng -->
    <button 
      v-if="showLastPage" 
      class="pagination-item" 
      :class="{ 'active': currentPage === totalPages }"
      @click="changePage(totalPages)"
    >
      {{ totalPages }}
    </button>
    
    <!-- Nút Next -->
    <button 
      class="pagination-item pagination-button" 
      :class="{ 'disabled': currentPage >= totalPages }"
      @click="changePage(currentPage + 1)" 
      :disabled="currentPage >= totalPages"
    >
      <right-outlined />
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
    validator: (value) => value > 0
  },
  totalPages: {
    type: Number,
    required: true,
    validator: (value) => value > 0
  },
  siblings: {
    type: Number,
    default: 1,
    validator: (value) => value >= 0
  },
  boundaries: {
    type: Number,
    default: 1,
    validator: (value) => value >= 0
  }
});

const emit = defineEmits(['update:currentPage', 'pageChange']);

// Tính toán các trang hiển thị
const middlePages = computed(() => {
  const totalNumbers = props.siblings * 2 + 1;
  const totalSiblings = props.siblings * 2;
  
  if (props.totalPages <= totalNumbers) {
    return Array.from({ length: props.totalPages }, (_, i) => i + 1);
  }
  
  const leftSiblingIndex = Math.max(props.currentPage - props.siblings, 1);
  const rightSiblingIndex = Math.min(props.currentPage + props.siblings, props.totalPages);
  
  const showLeftDots = leftSiblingIndex > 1 + props.boundaries;
  const showRightDots = rightSiblingIndex < props.totalPages - props.boundaries;
  
  if (!showLeftDots && showRightDots) {
    const leftItemCount = 1 + props.boundaries + totalSiblings;
    return Array.from({ length: leftItemCount }, (_, i) => i + 1);
  }
  
  if (showLeftDots && !showRightDots) {
    const rightItemCount = 1 + props.boundaries + totalSiblings;
    return Array.from({ length: rightItemCount }, (_, i) => props.totalPages - rightItemCount + i + 1);
  }
  
  if (showLeftDots && showRightDots) {
    return Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i
    );
  }
  
  return [];
});

// Kiểm tra khi nào hiển thị nút trang đầu tiên
const showFirstPage = computed(() => {
  return props.boundaries > 0 && props.currentPage > props.siblings + 1;
});

// Kiểm tra khi nào hiển thị nút trang cuối cùng
const showLastPage = computed(() => {
  return props.boundaries > 0 && props.currentPage < props.totalPages - props.siblings;
});

// Kiểm tra khi nào hiển thị dấu ellipsis bên trái
const showLeftEllipsis = computed(() => {
  return props.currentPage > props.siblings + props.boundaries + 1;
});

// Kiểm tra khi nào hiển thị dấu ellipsis bên phải
const showRightEllipsis = computed(() => {
  return props.currentPage < props.totalPages - props.siblings - props.boundaries;
});

// Thay đổi trang
const changePage = (page) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('update:currentPage', page);
    emit('pageChange', page);
  }
};
</script>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
}

.pagination-item {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2.5rem;
  height: 2.5rem;
  padding: 0 0.75rem;
  border-radius: 0.375rem;
  background-color: #1a1a1a;
  border: 1px solid #333;
  color: #d1d5db;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-item:hover:not(.disabled, .active, .pagination-ellipsis) {
  background-color: #333;
  color: #fff;
  border-color: #444;
}

.pagination-item.active {
  background: linear-gradient(to right, #ec4899, #8b5cf6);
  color: white;
  border: none;
}

.pagination-button {
  padding: 0;
}

.pagination-ellipsis {
  cursor: default;
  user-select: none;
}

.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>