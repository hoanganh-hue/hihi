<template>
  <BaseCategoryPage
    category-slug="do-choi-me-va-be"
    category-name="Đồ chơi mẹ và bé"
  >
    <!-- Bộ lọc nâng cao cho đồ chơi mẹ và bé -->
    <template #advanced-filters>
      <a-collapse class="bg-transparent border-0">
        <a-collapse-panel key="1" header="Bộ lọc nâng cao" class="bg-transparent border-0 text-white">
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <!-- Loại sản phẩm -->
            <div class="filter-group">
              <div class="text-white mb-2">Loại sản phẩm:</div>
              <a-checkbox-group v-model:value="advancedFilters.type" @change="applyFilters">
                <div class="flex flex-col space-y-2">
                  <a-checkbox value="do-choi">Đồ chơi</a-checkbox>
                  <a-checkbox value="do-dung">Đồ dùng cho bé</a-checkbox>
                  <a-checkbox value="do-an">Đồ ăn dặm</a-checkbox>
                  <a-checkbox value="do-mac">Đồ mặc</a-checkbox>
                </div>
              </a-checkbox-group>
            </div>
            
            <!-- Độ tuổi -->
            <div class="filter-group">
              <div class="text-white mb-2">Độ tuổi:</div>
              <a-checkbox-group v-model:value="advancedFilters.age" @change="applyFilters">
                <div class="flex flex-col space-y-2">
                  <a-checkbox value="0-6">0-6 tháng</a-checkbox>
                  <a-checkbox value="6-12">6-12 tháng</a-checkbox>
                  <a-checkbox value="1-3">1-3 tuổi</a-checkbox>
                  <a-checkbox value="3-6">3-6 tuổi</a-checkbox>
                </div>
              </a-checkbox-group>
            </div>
            
            <!-- Thương hiệu -->
            <div class="filter-group">
              <div class="text-white mb-2">Thương hiệu:</div>
              <a-checkbox-group v-model:value="advancedFilters.brand" @change="applyFilters">
                <div class="flex flex-col space-y-2">
                  <a-checkbox value="fisher-price">Fisher Price</a-checkbox>
                  <a-checkbox value="lego">Lego</a-checkbox>
                  <a-checkbox value="mattel">Mattel</a-checkbox>
                  <a-checkbox value="hasbro">Hasbro</a-checkbox>
                </div>
              </a-checkbox-group>
            </div>
            
            <!-- Chất liệu -->
            <div class="filter-group">
              <div class="text-white mb-2">Chất liệu:</div>
              <a-checkbox-group v-model:value="advancedFilters.material" @change="applyFilters">
                <div class="flex flex-col space-y-2">
                  <a-checkbox value="plastic">Nhựa an toàn</a-checkbox>
                  <a-checkbox value="wood">Gỗ</a-checkbox>
                  <a-checkbox value="fabric">Vải</a-checkbox>
                  <a-checkbox value="silicone">Silicone</a-checkbox>
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
        <div>Độ tuổi: {{ product['thông số kỹ thuật'].age || '' }}</div>
        <div>Chất liệu: {{ product['thông số kỹ thuật'].material || '' }}</div>
      </div>
    </template>
  </BaseCategoryPage>
</template>

<script setup>
import { ref } from 'vue'
import BaseCategoryPage from '@/components/category/BaseCategoryPage.vue'

// Advanced filters state
const advancedFilters = ref({
  type: [],
  age: [],
  brand: [],
  material: []
})

// Methods
const resetFilters = () => {
  advancedFilters.value = {
    type: [],
    age: [],
    brand: [],
    material: []
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