<template>
  <BaseCategoryPage
    category-slug="dung-cu-the-thao"
    category-name="Dụng cụ thể thao"
  >
    <!-- Bộ lọc nâng cao cho dụng cụ thể thao -->
    <template #advanced-filters>
      <a-collapse class="bg-transparent border-0">
        <a-collapse-panel key="1" header="Bộ lọc nâng cao" class="bg-transparent border-0 text-white">
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <!-- Môn thể thao -->
            <div class="filter-group">
              <div class="text-white mb-2">Môn thể thao:</div>
              <a-checkbox-group v-model:value="advancedFilters.sport" @change="applyFilters">
                <div class="flex flex-col space-y-2">
                  <a-checkbox value="gym">Gym & Fitness</a-checkbox>
                  <a-checkbox value="yoga">Yoga</a-checkbox>
                  <a-checkbox value="running">Chạy bộ</a-checkbox>
                  <a-checkbox value="football">Bóng đá</a-checkbox>
                </div>
              </a-checkbox-group>
            </div>
            
            <!-- Thương hiệu -->
            <div class="filter-group">
              <div class="text-white mb-2">Thương hiệu:</div>
              <a-checkbox-group v-model:value="advancedFilters.brand" @change="applyFilters">
                <div class="flex flex-col space-y-2">
                  <a-checkbox value="adidas">Adidas</a-checkbox>
                  <a-checkbox value="nike">Nike</a-checkbox>
                  <a-checkbox value="puma">Puma</a-checkbox>
                  <a-checkbox value="reebok">Reebok</a-checkbox>
                </div>
              </a-checkbox-group>
            </div>
            
            <!-- Chất liệu -->
            <div class="filter-group">
              <div class="text-white mb-2">Chất liệu:</div>
              <a-checkbox-group v-model:value="advancedFilters.material" @change="applyFilters">
                <div class="flex flex-col space-y-2">
                  <a-checkbox value="metal">Kim loại</a-checkbox>
                  <a-checkbox value="rubber">Cao su</a-checkbox>
                  <a-checkbox value="fabric">Vải</a-checkbox>
                  <a-checkbox value="plastic">Nhựa</a-checkbox>
                </div>
              </a-checkbox-group>
            </div>
            
            <!-- Mức độ -->
            <div class="filter-group">
              <div class="text-white mb-2">Mức độ:</div>
              <a-checkbox-group v-model:value="advancedFilters.level" @change="applyFilters">
                <div class="flex flex-col space-y-2">
                  <a-checkbox value="beginner">Người mới</a-checkbox>
                  <a-checkbox value="intermediate">Trung cấp</a-checkbox>
                  <a-checkbox value="advanced">Nâng cao</a-checkbox>
                  <a-checkbox value="professional">Chuyên nghiệp</a-checkbox>
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
        <div>Môn thể thao: {{ product['thông số kỹ thuật'].sport || '' }}</div>
        <div>Chất liệu: {{ product['thông số kỹ thuật'].material || '' }}</div>
        <div>Mức độ: {{ product['thông số kỹ thuật'].level || '' }}</div>
      </div>
    </template>
  </BaseCategoryPage>
</template>

<script setup>
import { ref } from 'vue'
import BaseCategoryPage from '@/components/category/BaseCategoryPage.vue'

// Advanced filters state
const advancedFilters = ref({
  sport: [],
  brand: [],
  material: [],
  level: []
})

// Methods
const resetFilters = () => {
  advancedFilters.value = {
    sport: [],
    brand: [],
    material: [],
    level: []
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