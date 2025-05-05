<template>
  <div class="product-list">
    <div v-if="loading" class="loading-container flex justify-center items-center py-12">
      <a-spin size="large" />
    </div>
    
    <div v-else-if="error" class="error-container text-center py-12">
      <a-result status="error" :title="error">
        <template #extra>
          <a-button type="primary" @click="retry">
            Thử lại
          </a-button>
        </template>
      </a-result>
    </div>
    
    <div v-else-if="products.length === 0" class="empty-container text-center py-12">
      <a-empty description="Không tìm thấy sản phẩm nào" />
    </div>
    
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      <product-card
        v-for="(product, index) in products"
        :key="product.id || index"
        :product="product"
        :show-sold-count="showSoldCount"
        @add-to-cart="onAddToCart"
      />
    </div>
    
    <div v-if="pagination && totalProducts > pageSize" class="pagination-container flex justify-center mt-8">
      <a-pagination
        v-model:current="currentPage"
        :total="totalProducts"
        :page-size="pageSize"
        @change="onPageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import ProductCard from './ProductCard.vue'

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
  },
  pagination: {
    type: Boolean,
    default: false
  },
  totalProducts: {
    type: Number,
    default: 0
  },
  showSoldCount: {
    type: Boolean,
    default: true
  },
  pageSize: {
    type: Number,
    default: 20
  }
})

const emit = defineEmits(['retry', 'page-change', 'add-to-cart'])

const currentPage = ref(1)

// Theo dõi sự thay đổi của props.products để reset trang hiện tại
watch(() => props.products, () => {
  currentPage.value = 1
}, { deep: true })

// Xử lý sự kiện thay đổi trang
const onPageChange = (page) => {
  currentPage.value = page
  emit('page-change', page)
}

// Xử lý sự kiện thử lại khi có lỗi
const retry = () => {
  emit('retry')
}

// Xử lý sự kiện thêm sản phẩm vào giỏ hàng
const onAddToCart = (product) => {
  emit('add-to-cart', product)
}
</script>

<style scoped>
:deep(.ant-spin-dot-item) {
  background-color: #ec4899;
}

:deep(.ant-pagination-item-active) {
  border-color: #ec4899;
}

:deep(.ant-pagination-item-active a) {
  color: #ec4899;
}

:deep(.ant-pagination-item:hover) {
  border-color: #ec4899;
}

:deep(.ant-pagination-item:hover a) {
  color: #ec4899;
}

:deep(.ant-pagination-next:hover .ant-pagination-item-link),
:deep(.ant-pagination-prev:hover .ant-pagination-item-link) {
  color: #ec4899;
  border-color: #ec4899;
}
</style>
