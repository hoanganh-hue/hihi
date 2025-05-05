<template>
  <div class="rating" :class="{ 'readonly': readonly, 'large': size === 'large', 'small': size === 'small' }">
    <div v-for="star in maxStars" :key="star" class="star-wrapper" @mousemove="onStarHover(star, $event)" @mouseleave="resetHover" @click="onStarClick(star)">
      <star-filled v-if="isFilled(star)" :class="getStarColorClass" />
      <star-outlined v-else :class="getStarColorClass" />
    </div>
    <div v-if="showValue" class="rating-value">{{ displayValue }}</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { StarFilled, StarOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  maxStars: {
    type: Number,
    default: 5,
    validator: (value) => value > 0
  },
  readonly: {
    type: Boolean,
    default: false
  },
  precision: {
    type: Number,
    default: 1,
    validator: (value) => [0.5, 1].includes(value)
  },
  color: {
    type: String,
    default: 'yellow',
    validator: (value) => ['yellow', 'pink', 'primary'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  showValue: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'change']);

const hoveredStar = ref(0);
const halfSelected = ref(false);

// Định dạng giá trị hiển thị
const displayValue = computed(() => {
  return props.modelValue.toFixed(1);
});

// Lấy class màu sắc cho sao
const getStarColorClass = computed(() => {
  if (props.color === 'yellow') return 'text-yellow-400';
  if (props.color === 'pink') return 'text-pink-500';
  return 'text-gradient'; // primary có gradient
});

// Kiểm tra sao có được tô màu không
const isFilled = (star) => {
  if (hoveredStar.value > 0) {
    // Nếu đang hover
    if (props.precision === 0.5 && halfSelected.value && star === Math.ceil(hoveredStar.value)) {
      return false; // Nửa sao được tô màu bởi CSS
    }
    return star <= hoveredStar.value;
  } else {
    // Hiển thị giá trị thực
    if (props.precision === 0.5 && star === Math.ceil(props.modelValue) && !Number.isInteger(props.modelValue)) {
      return false; // Nửa sao được tô màu bởi CSS
    }
    return star <= props.modelValue;
  }
};

// Xử lý hover vào sao
const onStarHover = (star, event) => {
  if (props.readonly) return;
  
  const { left, width } = event.currentTarget.getBoundingClientRect();
  const position = (event.clientX - left) / width;
  
  // Nếu độ chính xác là 0.5 và vị trí chuột < 50% của sao
  if (props.precision === 0.5 && position < 0.5) {
    hoveredStar.value = star - 0.5;
    halfSelected.value = true;
  } else {
    hoveredStar.value = star;
    halfSelected.value = false;
  }
};

// Reset trạng thái hover
const resetHover = () => {
  hoveredStar.value = 0;
  halfSelected.value = false;
};

// Xử lý khi click vào sao
const onStarClick = (star) => {
  if (props.readonly) return;
  
  let newValue;
  
  if (props.precision === 0.5 && halfSelected.value) {
    newValue = star - 0.5;
  } else {
    newValue = star;
  }
  
  // Nếu click vào cùng giá trị hiện tại thì reset về 0
  if (newValue === props.modelValue) {
    newValue = 0;
  }
  
  emit('update:modelValue', newValue);
  emit('change', newValue);
};
</script>

<style scoped>
.rating {
  display: flex;
  align-items: center;
}

.star-wrapper {
  cursor: pointer;
  position: relative;
  color: #d1d5db;
}

.readonly .star-wrapper {
  cursor: default;
}

/* Star sizes */
.rating .star-wrapper {
  font-size: 1.25rem;
  margin-right: 0.25rem;
}

.rating.small .star-wrapper {
  font-size: 0.875rem;
  margin-right: 0.125rem;
}

.rating.large .star-wrapper {
  font-size: 1.75rem;
  margin-right: 0.5rem;
}

.rating-value {
  margin-left: 0.5rem;
  font-weight: 500;
}

/* Gradient color for primary */
.text-gradient {
  background: linear-gradient(to right, #ec4899, #8b5cf6);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>