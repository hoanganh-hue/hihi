<template>
  <BaseCategoryPage
    category-slug="dong-ho"
    category-name="Đồng hồ"
  >
    <!-- Bộ lọc nâng cao cho đồng hồ -->
    <template #advanced-filters>
      <a-collapse class="bg-transparent border-0">
        <a-collapse-panel key="1" header="Bộ lọc nâng cao" class="bg-transparent border-0 text-white">
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <!-- Thương hiệu -->
            <div class="filter-group">
              <div class="text-white mb-2">Thương hiệu:</div>
              <a-checkbox-group v-model:value="advancedFilters.brand" @change="applyFilters">
                <div class="flex flex-col space-y-2">
                  <a-checkbox value="rolex">Rolex</a-checkbox>
                  <a-checkbox value="omega">Omega</a-checkbox>
                  <a-checkbox value="cartier">Cartier</a-checkbox>
                  <a-checkbox value="tissot">Tissot</a-checkbox>
                </div>
              </a-checkbox-group>
            </div>
            
            <!-- Loại đồng hồ -->
            <div class="filter-group">
              <div class="text-white mb-2">Loại:</div>
              <a-checkbox-group v-model:value="advancedFilters.type" @change="applyFilters">
                <div class="flex flex-col space-y-2">
                  <a-checkbox value="analog">Analog</a-checkbox>
                  <a-checkbox value="digital">Digital</a-checkbox>
                  <a-checkbox value="smart">Smart Watch</a-checkbox>
                  <a-checkbox value="luxury">Luxury</a-checkbox>
                </div>
              </a-checkbox-group>
            </div>
            
            <!-- Chất liệu -->
            <div class="filter-group">
              <div class="text-white mb-2">Chất liệu:</div>
              <a-checkbox-group v-model:value="advancedFilters.material" @change="applyFilters">
                <div class="flex flex-col space-y-2">
                  <a-checkbox value="steel">Thép không gỉ</a-checkbox>
                  <a-checkbox value="gold">Vàng</a-checkbox>
                  <a-checkbox value="titanium">Titanium</a-checkbox>
                  <a-checkbox value="ceramic">Ceramic</a-checkbox>
                </div>
              </a-checkbox-group>
            </div>
            
            <!-- Tính năng -->
            <div class="filter-group">
              <div class="text-white mb-2">Tính năng:</div>
              <a-checkbox-group v-model:value="advancedFilters.features" @change="applyFilters">
                <div class="flex flex-col space-y-2">
                  <a-checkbox value="waterproof">Chống nước</a-checkbox>
                  <a-checkbox value="chronograph">Chronograph</a-checkbox>
                  <a-checkbox value="automatic">Automatic</a-checkbox>
                  <a-checkbox value="smartfeatures">Smart Features</a-checkbox>
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
        <div>{{ product['thông số kỹ thuật'].material || '' }}</div>
        <div>{{ product['thông số kỹ thuật'].type || '' }}</div>
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
  material: [],
  features: []
})

// Methods
const resetFilters = () => {
  advancedFilters.value = {
    brand: [],
    type: [],
    material: [],
    features: []
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