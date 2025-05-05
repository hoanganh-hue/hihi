<template>
  <BaseCategoryPage
    category-slug="quan-ao"
    category-name="Quần áo"
  >
    <!-- Bộ lọc nâng cao cho quần áo -->
    <template #advanced-filters>
      <a-collapse class="bg-transparent border-0">
        <a-collapse-panel key="1" header="Bộ lọc nâng cao" class="bg-transparent border-0 text-white">
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <!-- Kích thước -->
            <div class="filter-group">
              <div class="text-white mb-2">Kích thước:</div>
              <a-checkbox-group v-model:value="advancedFilters.size" @change="applyFilters">
                <div class="flex flex-col space-y-2">
                  <a-checkbox value="s">S</a-checkbox>
                  <a-checkbox value="m">M</a-checkbox>
                  <a-checkbox value="l">L</a-checkbox>
                  <a-checkbox value="xl">XL</a-checkbox>
                  <a-checkbox value="xxl">XXL</a-checkbox>
                </div>
              </a-checkbox-group>
            </div>
            
            <!-- Chất liệu -->
            <div class="filter-group">
              <div class="text-white mb-2">Chất liệu:</div>
              <a-checkbox-group v-model:value="advancedFilters.material" @change="applyFilters">
                <div class="flex flex-col space-y-2">
                  <a-checkbox value="cotton">Cotton</a-checkbox>
                  <a-checkbox value="polyester">Polyester</a-checkbox>
                  <a-checkbox value="denim">Denim</a-checkbox>
                  <a-checkbox value="silk">Lụa</a-checkbox>
                  <a-checkbox value="wool">Len</a-checkbox>
                </div>
              </a-checkbox-group>
            </div>
            
            <!-- Phong cách -->
            <div class="filter-group">
              <div class="text-white mb-2">Phong cách:</div>
              <a-checkbox-group v-model:value="advancedFilters.style" @change="applyFilters">
                <div class="flex flex-col space-y-2">
                  <a-checkbox value="casual">Thời trang hàng ngày</a-checkbox>
                  <a-checkbox value="formal">Trang phục công sở</a-checkbox>
                  <a-checkbox value="sporty">Thể thao</a-checkbox>
                  <a-checkbox value="party">Dự tiệc</a-checkbox>
                </div>
              </a-checkbox-group>
            </div>
            
            <!-- Mùa -->
            <div class="filter-group">
              <div class="text-white mb-2">Mùa:</div>
              <a-checkbox-group v-model:value="advancedFilters.season" @change="applyFilters">
                <div class="flex flex-col space-y-2">
                  <a-checkbox value="spring">Xuân</a-checkbox>
                  <a-checkbox value="summer">Hè</a-checkbox>
                  <a-checkbox value="autumn">Thu</a-checkbox>
                  <a-checkbox value="winter">Đông</a-checkbox>
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
        <div>Size: {{ product['thông số kỹ thuật'].size || '' }}</div>
        <div>Chất liệu: {{ product['thông số kỹ thuật'].material || '' }}</div>
        <div>Phong cách: {{ product['thông số kỹ thuật'].style || '' }}</div>
      </div>
    </template>
  </BaseCategoryPage>
</template>

<script setup>
import { ref } from 'vue'
import BaseCategoryPage from '@/components/category/BaseCategoryPage.vue'

// Advanced filters state
const advancedFilters = ref({
  size: [],
  material: [],
  style: [],
  season: []
})

// Methods
const resetFilters = () => {
  advancedFilters.value = {
    size: [],
    material: [],
    style: [],
    season: []
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