<template>
  <BaseCategoryPage
    category-slug="thiet-bi-dien-tu"
    category-name="Thiết bị điện tử"
  >
    <!-- Bộ lọc nâng cao cho thiết bị điện tử -->
    <template #advanced-filters>
      <a-collapse class="bg-transparent border-0">
        <a-collapse-panel key="1" header="Bộ lọc nâng cao" class="bg-transparent border-0 text-white">
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <!-- Thương hiệu -->
            <div class="filter-group">
              <div class="text-white mb-2">Thương hiệu:</div>
              <a-checkbox-group v-model:value="advancedFilters.brand" @change="applyFilters">
                <div class="flex flex-col space-y-2">
                  <a-checkbox value="sony">Sony</a-checkbox>
                  <a-checkbox value="samsung">Samsung</a-checkbox>
                  <a-checkbox value="lg">LG</a-checkbox>
                  <a-checkbox value="panasonic">Panasonic</a-checkbox>
                  <a-checkbox value="philips">Philips</a-checkbox>
                </div>
              </a-checkbox-group>
            </div>
            
            <!-- Loại thiết bị -->
            <div class="filter-group">
              <div class="text-white mb-2">Loại thiết bị:</div>
              <a-checkbox-group v-model:value="advancedFilters.type" @change="applyFilters">
                <div class="flex flex-col space-y-2">
                  <a-checkbox value="tv">TV</a-checkbox>
                  <a-checkbox value="audio">Âm thanh</a-checkbox>
                  <a-checkbox value="camera">Máy ảnh</a-checkbox>
                  <a-checkbox value="gaming">Gaming</a-checkbox>
                  <a-checkbox value="accessories">Phụ kiện</a-checkbox>
                </div>
              </a-checkbox-group>
            </div>
            
            <!-- Tính năng -->
            <div class="filter-group">
              <div class="text-white mb-2">Tính năng:</div>
              <a-checkbox-group v-model:value="advancedFilters.features" @change="applyFilters">
                <div class="flex flex-col space-y-2">
                  <a-checkbox value="smart">Smart TV</a-checkbox>
                  <a-checkbox value="4k">4K Ultra HD</a-checkbox>
                  <a-checkbox value="hdr">HDR</a-checkbox>
                  <a-checkbox value="bluetooth">Bluetooth</a-checkbox>
                  <a-checkbox value="wifi">Wi-Fi</a-checkbox>
                </div>
              </a-checkbox-group>
            </div>
            
            <!-- Kích thước màn hình -->
            <div class="filter-group">
              <div class="text-white mb-2">Kích thước màn hình:</div>
              <a-checkbox-group v-model:value="advancedFilters.screenSize" @change="applyFilters">
                <div class="flex flex-col space-y-2">
                  <a-checkbox value="32">32 inch</a-checkbox>
                  <a-checkbox value="43">43 inch</a-checkbox>
                  <a-checkbox value="50">50 inch</a-checkbox>
                  <a-checkbox value="55">55 inch</a-checkbox>
                  <a-checkbox value="65">65 inch trở lên</a-checkbox>
                </div>
              </a-checkbox-group>
            </div>
          </div>
          
          <div class="flex justify-end mt-4">
            <a-button @click="resetFilters" class="mr-2">Đặt lại</a-button>
            <a-button type="primary" @click="applyFilters">Áp dụng</a-button>
          </div>
        </a-collapse-panel>
      </a-collapse>
    </template>

    <!-- Thông tin sản phẩm tùy chỉnh -->
    <template #product-info="{ product }">
      <div class="specs text-sm text-gray-400 mb-3">
        <div>Loại: {{ product['thông số kỹ thuật'].type || '' }}</div>
        <div>Màn hình: {{ product['thông số kỹ thuật'].screenSize || '' }}</div>
        <div>Tính năng: {{ product['thông số kỹ thuật'].features?.join(', ') || '' }}</div>
      </div>
    </template>
  </BaseCategoryPage>
</template>

<script setup>
import { ref } from 'vue'
import BaseCategoryPage from '@/components/category/BaseCategoryPage.vue'

// Advanced filters state
const advancedFilters = ref({
  brand: [],
  type: [],
  features: [],
  screenSize: []
})

// Methods
const resetFilters = () => {
  advancedFilters.value = {
    brand: [],
    type: [],
    features: [],
    screenSize: []
  }
}

const applyFilters = () => {
  // Filters are handled by the base component
}
</script>

<style scoped>
:deep(.ant-checkbox-wrapper) {
  color: #d9d9d9 !important;
}

:deep(.ant-checkbox-checked .ant-checkbox-inner) {
  background-color: #ec4899 !important;
  border-color: #ec4899 !important;
}

:deep(.ant-collapse) {
  border: none !important;
}

:deep(.ant-collapse-header) {
  color: #fff !important;
  padding: 0 !important;
  font-weight: 500;
}

:deep(.ant-collapse-content) {
  background-color: transparent !important;
  border: none !important;
}

:deep(.ant-collapse-item) {
  border: none !important;
}
</style>