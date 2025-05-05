<template>
  <BaseCategoryPage
    category-slug="giay-dep"
    category-name="Giày dép"
  >
    <!-- Bộ lọc nâng cao cho giày dép -->
    <template #advanced-filters>
      <a-collapse class="bg-transparent border-0">
        <a-collapse-panel key="1" header="Bộ lọc nâng cao" class="bg-transparent border-0 text-white">
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <!-- Loại giày -->
            <div class="filter-group">
              <div class="text-white mb-2">Loại giày:</div>
              <a-checkbox-group v-model:value="advancedFilters.type" @change="applyFilters">
                <div class="flex flex-col space-y-2">
                  <a-checkbox value="sneaker">Sneaker</a-checkbox>
                  <a-checkbox value="sandal">Sandal</a-checkbox>
                  <a-checkbox value="boots">Boots</a-checkbox>
                  <a-checkbox value="loafer">Loafer</a-checkbox>
                </div>
              </a-checkbox-group>
            </div>
            
            <!-- Thương hiệu -->
            <div class="filter-group">
              <div class="text-white mb-2">Thương hiệu:</div>
              <a-checkbox-group v-model:value="advancedFilters.brand" @change="applyFilters">
                <div class="flex flex-col space-y-2">
                  <a-checkbox value="nike">Nike</a-checkbox>
                  <a-checkbox value="adidas">Adidas</a-checkbox>
                  <a-checkbox value="puma">Puma</a-checkbox>
                  <a-checkbox value="converse">Converse</a-checkbox>
                </div>
              </a-checkbox-group>
            </div>
            
            <!-- Size -->
            <div class="filter-group">
              <div class="text-white mb-2">Size:</div>
              <a-checkbox-group v-model:value="advancedFilters.size" @change="applyFilters">
                <div class="flex flex-col space-y-2">
                  <a-checkbox value="35-36">35-36</a-checkbox>
                  <a-checkbox value="37-38">37-38</a-checkbox>
                  <a-checkbox value="39-40">39-40</a-checkbox>
                  <a-checkbox value="41-42">41-42</a-checkbox>
                </div>
              </a-checkbox-group>
            </div>
            
            <!-- Màu sắc -->
            <div class="filter-group">
              <div class="text-white mb-2">Màu sắc:</div>
              <a-checkbox-group v-model:value="advancedFilters.color" @change="applyFilters">
                <div class="flex flex-col space-y-2">
                  <a-checkbox value="black">Đen</a-checkbox>
                  <a-checkbox value="white">Trắng</a-checkbox>
                  <a-checkbox value="blue">Xanh</a-checkbox>
                  <a-checkbox value="red">Đỏ</a-checkbox>
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
        <div>Màu sắc: {{ product['thông số kỹ thuật'].color || '' }}</div>
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
  brand: [],
  size: [],
  color: []
})

// Methods
const resetFilters = () => {
  advancedFilters.value = {
    type: [],
    brand: [],
    size: [],
    color: []
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