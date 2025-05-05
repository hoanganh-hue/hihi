<template>
  <div class="carousel-container" :class="{ 'has-indicators': showIndicators, 'has-controls': showControls }">
    <div class="carousel-wrapper" ref="carouselWrapper">
      <div 
        class="carousel-track" 
        ref="carouselTrack"
        :style="{ transform: `translateX(-${currentOffset}px)` }"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
      >
        <slot></slot>
      </div>
    </div>
    
    <!-- Controls -->
    <div v-if="showControls" class="carousel-controls">
      <button class="carousel-control prev" @click="prev" aria-label="Previous slide">
        <left-outlined />
      </button>
      <button class="carousel-control next" @click="next" aria-label="Next slide">
        <right-outlined />
      </button>
    </div>
    
    <!-- Indicators -->
    <div v-if="showIndicators && totalSlides > 1" class="carousel-indicators">
      <button
        v-for="i in totalSlides" 
        :key="i"
        class="carousel-indicator"
        :class="{ 'active': currentIndex === i - 1 }"
        @click="goToSlide(i - 1)"
        :aria-label="`Go to slide ${i}`"
      ></button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  autoplay: {
    type: Boolean,
    default: false
  },
  interval: {
    type: Number,
    default: 3000,
    validator: (value) => value >= 0
  },
  showControls: {
    type: Boolean,
    default: true
  },
  showIndicators: {
    type: Boolean,
    default: true
  },
  pauseOnHover: {
    type: Boolean,
    default: true
  },
  loop: {
    type: Boolean,
    default: true
  },
  modelValue: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['update:modelValue', 'slide']);

const carouselWrapper = ref(null);
const carouselTrack = ref(null);
const currentIndex = ref(props.modelValue);
const totalSlides = ref(0);
const slideWidth = ref(0);
const currentOffset = ref(0);
const autoplayTimer = ref(null);
const isPaused = ref(false);
const touchStartX = ref(0);
const touchMoveX = ref(0);

// Tính toán vị trí hiện tại dựa trên index
const updateOffset = () => {
  if (!carouselTrack.value) return;
  currentOffset.value = currentIndex.value * slideWidth.value;
};

// Đi đến slide trước đó
const prev = () => {
  if (currentIndex.value > 0) {
    goToSlide(currentIndex.value - 1);
  } else if (props.loop) {
    goToSlide(totalSlides.value - 1);
  }
};

// Đi đến slide tiếp theo
const next = () => {
  if (currentIndex.value < totalSlides.value - 1) {
    goToSlide(currentIndex.value + 1);
  } else if (props.loop) {
    goToSlide(0);
  }
};

// Đi đến slide cụ thể
const goToSlide = (index) => {
  if (index >= 0 && index < totalSlides.value) {
    currentIndex.value = index;
    emit('update:modelValue', index);
    emit('slide', index);
    updateOffset();
  }
};

// Khởi tạo autoplay
const startAutoplay = () => {
  if (props.autoplay && !autoplayTimer.value && !isPaused.value) {
    autoplayTimer.value = setInterval(() => {
      next();
    }, props.interval);
  }
};

// Dừng autoplay
const stopAutoplay = () => {
  if (autoplayTimer.value) {
    clearInterval(autoplayTimer.value);
    autoplayTimer.value = null;
  }
};

// Xử lý sự kiện touch để vuốt trên mobile
const onTouchStart = (e) => {
  touchStartX.value = e.touches[0].clientX;
  stopAutoplay();
};

const onTouchMove = (e) => {
  touchMoveX.value = e.touches[0].clientX;
};

const onTouchEnd = () => {
  const diff = touchStartX.value - touchMoveX.value;
  const threshold = slideWidth.value * 0.15; // Ngưỡng để xác định vuốt
  
  if (Math.abs(diff) > threshold) {
    if (diff > 0) {
      next();
    } else {
      prev();
    }
  }
  
  startAutoplay();
};

// Đồng bộ với v-model
watch(() => props.modelValue, (newVal) => {
  if (newVal !== currentIndex.value) {
    goToSlide(newVal);
  }
});

// Khởi tạo và theo dõi thay đổi kích thước
const initCarousel = () => {
  if (!carouselWrapper.value || !carouselTrack.value) return;
  
  const slides = carouselTrack.value.children;
  totalSlides.value = slides.length;
  slideWidth.value = carouselWrapper.value.offsetWidth;
  
  // Cập nhật chiều rộng cho các slides
  Array.from(slides).forEach(slide => {
    slide.style.width = `${slideWidth.value}px`;
  });
  
  // Cập nhật chiều rộng của track
  carouselTrack.value.style.width = `${slideWidth.value * totalSlides.value}px`;
  
  // Cập nhật offset
  updateOffset();
};

// Theo dõi sự thay đổi kích thước cửa sổ
const onResize = () => {
  initCarousel();
};

// Xử lý hover pause
const onMouseEnter = () => {
  if (props.pauseOnHover) {
    isPaused.value = true;
    stopAutoplay();
  }
};

const onMouseLeave = () => {
  if (props.pauseOnHover) {
    isPaused.value = false;
    startAutoplay();
  }
};

onMounted(() => {
  // Khởi tạo carousel
  initCarousel();
  
  // Xử lý resize
  window.addEventListener('resize', onResize);
  
  // Xử lý hover
  if (props.pauseOnHover) {
    carouselWrapper.value.addEventListener('mouseenter', onMouseEnter);
    carouselWrapper.value.addEventListener('mouseleave', onMouseLeave);
  }
  
  // Bắt đầu autoplay
  startAutoplay();
});

onUnmounted(() => {
  // Cleanup
  window.removeEventListener('resize', onResize);
  stopAutoplay();
  
  if (props.pauseOnHover && carouselWrapper.value) {
    carouselWrapper.value.removeEventListener('mouseenter', onMouseEnter);
    carouselWrapper.value.removeEventListener('mouseleave', onMouseLeave);
  }
});
</script>

<style scoped>
.carousel-container {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.carousel-wrapper {
  width: 100%;
  overflow: hidden;
}

.carousel-track {
  display: flex;
  transition: transform 0.5s ease;
}

/* Controls */
.carousel-controls {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  pointer-events: none;
  z-index: 5;
  padding: 0 1rem;
}

.carousel-control {
  width: 40px;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  pointer-events: auto;
  transition: all 0.3s ease;
  opacity: 0.7;
}

.carousel-control:hover {
  background-color: rgba(0, 0, 0, 0.7);
  opacity: 1;
}

.carousel-control.prev {
  margin-right: auto;
}

.carousel-control.next {
  margin-left: auto;
}

/* Indicators */
.carousel-indicators {
  position: absolute;
  bottom: 1rem;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  z-index: 5;
}

.carousel-indicator {
  width: 10px;
  height: 10px;
  background-color: rgba(255, 255, 255, 0.5);
  border: none;
  border-radius: 50%;
  padding: 0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.carousel-indicator.active {
  background-color: #ec4899;
  transform: scale(1.2);
}

/* Responsive controls */
@media (max-width: 640px) {
  .carousel-control {
    width: 32px;
    height: 32px;
    font-size: 0.75rem;
  }
  
  .carousel-indicators {
    bottom: 0.5rem;
  }
  
  .carousel-indicator {
    width: 8px;
    height: 8px;
  }
}
</style>