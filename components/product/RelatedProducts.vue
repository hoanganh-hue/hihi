<template>
  <div class="related-products mt-12">
    <h2 class="text-xl font-bold mb-6">Sản phẩm liên quan</h2>
    
    <div v-if="loading" class="loading-container flex justify-center items-center py-8">
      <a-spin size="large" />
    </div>
    
    <div v-else-if="error" class="error-container py-8">
      <a-alert 
        type="error" 
        :message="error" 
        class="bg-[#222] border-red-500 text-white"
      />
    </div>
    
    <div v-else-if="products.length === 0" class="empty-container py-8">
      <a-empty description="Không có sản phẩm liên quan" />
    </div>
    
    <div v-else class="related-products-slider">
      <swiper
        :modules="[Navigation, Pagination]"
        :slides-per-view="1"
        :space-between="20"
        :navigation="true"
        :pagination="{ clickable: true }"
        :breakpoints="{
          '640': {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          '768': {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          '1024': {
            slidesPerView: 4,
            spaceBetween: 30,
          },
        }"
        class="related-products-swiper"
      >
        <swiper-slide v-for="(product, index) in products" :key="product.id || index">
          <product-card 
            :product="product" 
            :show-sold-count="false"
            @add-to-cart="$emit('add-to-cart', product)"
          />
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination } from 'swiper'
import ProductCard from './ProductCard.vue'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const props = defineProps({
  products: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
})

defineEmits(['add-to-cart'])
</script>

<style scoped>
:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: #ec4899;
}

:deep(.swiper-pagination-bullet) {
  background: #666;
}

:deep(.swiper-pagination-bullet-active) {
  background: #ec4899;
}

:deep(.ant-spin-dot-item) {
  background-color: #ec4899;
}
</style>