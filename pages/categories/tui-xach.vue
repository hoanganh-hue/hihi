<template>
  <BaseCategoryPage
    category-slug="tui-xach"
    category-name="Túi xách"
  >
    <!-- Bộ lọc nâng cao cho túi xách -->
    <template #advanced-filters>
      <a-collapse class="bg-transparent border-0">
        <a-collapse-panel key="1" header="Bộ lọc nâng cao" class="bg-transparent border-0 text-white">
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <!-- Chất liệu -->
            <div class="filter-group">
              <div class="text-white mb-2">Chất liệu:</div>
              <a-checkbox-group v-model:value="advancedFilters.material" @change="applyFilters">
                <div class="flex flex-col space-y-2">
                  <a-checkbox value="leather">Da thật</a-checkbox>
                  <a-checkbox value="pu_leather">Da PU</a-checkbox>
                  <a-checkbox value="canvas">Vải canvas</a-checkbox>
                  <a-checkbox value="nylon">Nylon</a-checkbox>
                  <a-checkbox value="suede">Da lộn</a-checkbox>
                </div>
              </a-checkbox-group>
            </div>
            
            <!-- Kiểu dáng -->
            <div class="filter-group">
              <div class="text-white mb-2">Kiểu dáng:</div>
              <a-checkbox-group v-model:value="advancedFilters.style" @change="applyFilters">
                <div class="flex flex-col space-y-2">
                  <a-checkbox value="tote">Tote</a-checkbox>
                  <a-checkbox value="crossbody">Đeo chéo</a-checkbox>
                  <a-checkbox value="backpack">Balo</a-checkbox>
                  <a-checkbox value="clutch">Clutch</a-checkbox>
                  <a-checkbox value="shoulder">Đeo vai</a-checkbox>
                </div>
              </a-checkbox-group>
            </div>
            
            <!-- Kích thước -->
            <div class="filter-group">
              <div class="text-white mb-2">Kích thước:</div>
              <a-checkbox-group v-model:value="advancedFilters.size" @change="applyFilters">
                <div class="flex flex-col space-y-2">
                  <a-checkbox value="mini">Mini</a-checkbox>
                  <a-checkbox value="small">Nhỏ</a-checkbox>
                  <a-checkbox value="medium">Trung bình</a-checkbox>
                  <a-checkbox value="large">Lớn</a-checkbox>
                  <a-checkbox value="extra_large">Rất lớn</a-checkbox>
                </div>
              </a-checkbox-group>
            </div>
            
            <!-- Dịp sử dụng -->
            <div class="filter-group">
              <div class="text-white mb-2">Dịp sử dụng:</div>
              <a-checkbox-group v-model:value="advancedFilters.occasion" @change="applyFilters">
                <div class="flex flex-col space-y-2">
                  <a-checkbox value="daily">Hàng ngày</a-checkbox>
                  <a-checkbox value="work">Công sở</a-checkbox>
                  <a-checkbox value="travel">Du lịch</a-checkbox>
                  <a-checkbox value="party">Dự tiệc</a-checkbox>
                  <a-checkbox value="shopping">Mua sắm</a-checkbox>
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
        <div>Chất liệu: {{ product['thông số kỹ thuật'].material || '' }}</div>
        <div>Kiểu dáng: {{ product['thông số kỹ thuật'].style || '' }}</div>
        <div>Kích thước: {{ product['thông số kỹ thuật'].size || '' }}</div>
      </div>
    </template>
  </BaseCategoryPage>
</template>

<script setup>
import { ref } from 'vue'
import BaseCategoryPage from '@/components/category/BaseCategoryPage.vue'

// Advanced filters state
const advancedFilters = ref({
  material: [],
  style: [],
  size: [],
  occasion: []
})

// Methods
const resetFilters = () => {
  advancedFilters.value = {
    material: [],
    style: [],
    size: [],
    occasion: []
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