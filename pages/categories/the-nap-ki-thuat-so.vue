<template>
  <BaseCategoryPage
    category-slug="the-nap-ki-thuat-so"
    category-name="Thẻ nạp - Dịch vụ số"
  >
    <!-- Bộ lọc nâng cao cho thẻ nạp và dịch vụ số -->
    <template #advanced-filters>
      <a-collapse class="bg-transparent border-0">
        <a-collapse-panel key="1" header="Bộ lọc nâng cao" class="bg-transparent border-0 text-white">
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <!-- Loại dịch vụ -->
            <div class="filter-group">
              <div class="text-white mb-2">Loại dịch vụ:</div>
              <a-checkbox-group v-model:value="advancedFilters.serviceType" @change="applyFilters">
                <div class="flex flex-col space-y-2">
                  <a-checkbox value="prepaid">Trả trước</a-checkbox>
                  <a-checkbox value="postpaid">Trả sau</a-checkbox>
                  <a-checkbox value="subscription">Đăng ký</a-checkbox>
                  <a-checkbox value="license">Bản quyền</a-checkbox>
                </div>
              </a-checkbox-group>
            </div>
            
            <!-- Thời hạn -->
            <div class="filter-group">
              <div class="text-white mb-2">Thời hạn:</div>
              <a-checkbox-group v-model:value="advancedFilters.duration" @change="applyFilters">
                <div class="flex flex-col space-y-2">
                  <a-checkbox value="one_time">Một lần</a-checkbox>
                  <a-checkbox value="monthly">Hàng tháng</a-checkbox>
                  <a-checkbox value="quarterly">3 tháng</a-checkbox>
                  <a-checkbox value="yearly">Hàng năm</a-checkbox>
                </div>
              </a-checkbox-group>
            </div>
            
            <!-- Đối tượng sử dụng -->
            <div class="filter-group">
              <div class="text-white mb-2">Đối tượng:</div>
              <a-checkbox-group v-model:value="advancedFilters.userType" @change="applyFilters">
                <div class="flex flex-col space-y-2">
                  <a-checkbox value="personal">Cá nhân</a-checkbox>
                  <a-checkbox value="family">Gia đình</a-checkbox>
                  <a-checkbox value="business">Doanh nghiệp</a-checkbox>
                  <a-checkbox value="edu">Giáo dục</a-checkbox>
                </div>
              </a-checkbox-group>
            </div>
            
            <!-- Ưu đãi -->
            <div class="filter-group">
              <div class="text-white mb-2">Ưu đãi:</div>
              <a-checkbox-group v-model:value="advancedFilters.promotion" @change="applyFilters">
                <div class="flex flex-col space-y-2">
                  <a-checkbox value="discount">Đang giảm giá</a-checkbox>
                  <a-checkbox value="bundle">Combo tiết kiệm</a-checkbox>
                  <a-checkbox value="free_trial">Có dùng thử</a-checkbox>
                  <a-checkbox value="promo_code">Mã khuyến mãi</a-checkbox>
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
        <div>Loại: {{ product['thông số kỹ thuật'].serviceType || '' }}</div>
        <div>Thời hạn: {{ product['thông số kỹ thuật'].duration || '' }}</div>
        <div>Đối tượng: {{ product['thông số kỹ thuật'].userType || '' }}</div>
      </div>
    </template>
  </BaseCategoryPage>
</template>

<script setup>
import { ref } from 'vue'
import BaseCategoryPage from '@/components/category/BaseCategoryPage.vue'

// Advanced filters state
const advancedFilters = ref({
  serviceType: [],
  duration: [],
  userType: [],
  promotion: []
})

// Methods
const resetFilters = () => {
  advancedFilters.value = {
    serviceType: [],
    duration: [],
    userType: [],
    promotion: []
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