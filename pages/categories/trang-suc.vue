<template>
  <BaseCategoryPage
    category-slug="trang-suc"
    category-name="Trang sức"
  >
    <!-- Bộ lọc nâng cao cho trang sức -->
    <template #advanced-filters>
      <a-collapse class="bg-transparent border-0">
        <a-collapse-panel key="1" header="Bộ lọc nâng cao" class="bg-transparent border-0 text-white">
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <!-- Chất liệu -->
            <div class="filter-group">
              <div class="text-white mb-2">Chất liệu:</div>
              <a-checkbox-group v-model:value="advancedFilters.material" @change="applyFilters">
                <div class="flex flex-col space-y-2">
                  <a-checkbox value="gold">Vàng</a-checkbox>
                  <a-checkbox value="silver">Bạc</a-checkbox>
                  <a-checkbox value="platinum">Bạch kim</a-checkbox>
                  <a-checkbox value="diamond">Kim cương</a-checkbox>
                  <a-checkbox value="pearl">Ngọc trai</a-checkbox>
                </div>
              </a-checkbox-group>
            </div>
            
            <!-- Loại trang sức -->
            <div class="filter-group">
              <div class="text-white mb-2">Loại trang sức:</div>
              <a-checkbox-group v-model:value="advancedFilters.type" @change="applyFilters">
                <div class="flex flex-col space-y-2">
                  <a-checkbox value="necklace">Dây chuyền</a-checkbox>
                  <a-checkbox value="ring">Nhẫn</a-checkbox>
                  <a-checkbox value="earring">Bông tai</a-checkbox>
                  <a-checkbox value="bracelet">Vòng tay</a-checkbox>
                  <a-checkbox value="watch">Đồng hồ</a-checkbox>
                </div>
              </a-checkbox-group>
            </div>
            
            <!-- Phong cách -->
            <div class="filter-group">
              <div class="text-white mb-2">Phong cách:</div>
              <a-checkbox-group v-model:value="advancedFilters.style" @change="applyFilters">
                <div class="flex flex-col space-y-2">
                  <a-checkbox value="classic">Cổ điển</a-checkbox>
                  <a-checkbox value="modern">Hiện đại</a-checkbox>
                  <a-checkbox value="minimalist">Tối giản</a-checkbox>
                  <a-checkbox value="luxury">Sang trọng</a-checkbox>
                  <a-checkbox value="vintage">Vintage</a-checkbox>
                </div>
              </a-checkbox-group>
            </div>
            
            <!-- Dịp -->
            <div class="filter-group">
              <div class="text-white mb-2">Dịp:</div>
              <a-checkbox-group v-model:value="advancedFilters.occasion" @change="applyFilters">
                <div class="flex flex-col space-y-2">
                  <a-checkbox value="wedding">Cưới</a-checkbox>
                  <a-checkbox value="party">Dự tiệc</a-checkbox>
                  <a-checkbox value="daily">Hàng ngày</a-checkbox>
                  <a-checkbox value="gift">Quà tặng</a-checkbox>
                  <a-checkbox value="anniversary">Kỷ niệm</a-checkbox>
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
        <div>Loại: {{ product['thông số kỹ thuật'].type || '' }}</div>
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
  material: [],
  type: [],
  style: [],
  occasion: []
})

// Methods
const resetFilters = () => {
  advancedFilters.value = {
    material: [],
    type: [],
    style: [],
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