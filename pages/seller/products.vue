<template>
  <div class="min-h-screen bg-black text-white">
    <div class="container mx-auto px-6 py-8">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 class="text-3xl font-bold mb-4 md:mb-0">Quản lý sản phẩm</h1>
        <a-button 
          type="primary" 
          class="!rounded-button bg-gradient-to-r from-pink-500 to-purple-600 border-none text-white font-medium"
          @click="showAddProductModal"
        >
          <plus-outlined />
          Thêm sản phẩm mới
        </a-button>
      </div>
      
      <!-- Thanh tìm kiếm và lọc -->
      <div class="bg-[#121212] rounded-xl border border-[#333] p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <a-input-search
              v-model:value="searchText"
              placeholder="Tìm kiếm sản phẩm"
              class="w-full bg-[#222] border-[#333]"
              @search="handleSearch"
            >
              <template #prefix>
                <search-outlined class="text-gray-400" />
              </template>
            </a-input-search>
          </div>
          <div>
            <a-select
              v-model:value="categoryFilter"
              placeholder="Lọc theo danh mục"
              class="w-full custom-select"
              @change="handleCategoryFilter"
            >
              <a-select-option value="">Tất cả danh mục</a-select-option>
              <a-select-option value="1">Điện thoại - Máy tính bảng</a-select-option>
              <a-select-option value="2">Thiết bị điện tử - Máy tính</a-select-option>
              <a-select-option value="3">Phụ kiện công nghệ</a-select-option>
              <a-select-option value="4">Thời trang nam/nữ</a-select-option>
            </a-select>
          </div>
          <div>
            <a-select
              v-model:value="statusFilter"
              placeholder="Lọc theo trạng thái"
              class="w-full custom-select"
              @change="handleStatusFilter"
            >
              <a-select-option value="">Tất cả trạng thái</a-select-option>
              <a-select-option value="active">Đang bán</a-select-option>
              <a-select-option value="out_of_stock">Hết hàng</a-select-option>
              <a-select-option value="draft">Bản nháp</a-select-option>
              <a-select-option value="hidden">Đang ẩn</a-select-option>
            </a-select>
          </div>
        </div>
      </div>
      
      <!-- Bảng sản phẩm -->
      <div class="bg-[#121212] rounded-xl border border-[#333] overflow-hidden">
        <div v-if="loading" class="py-16 flex justify-center">
          <a-spin size="large" />
        </div>
        
        <template v-else>
          <div class="overflow-x-auto">
            <table class="w-full table-fixed">
              <thead>
                <tr class="bg-[#1a1a1a] border-b border-[#333]">
                  <th class="py-4 px-6 text-left w-16">
                    <a-checkbox v-model:checked="allSelected" @change="toggleSelectAll" />
                  </th>
                  <th class="py-4 px-6 text-left">Sản phẩm</th>
                  <th class="py-4 px-6 text-left w-32 md:w-40">Danh mục</th>
                  <th class="py-4 px-6 text-right w-32 md:w-40">Giá</th>
                  <th class="py-4 px-6 text-center w-28 md:w-32">Tồn kho</th>
                  <th class="py-4 px-6 text-center w-32 md:w-36">Trạng thái</th>
                  <th class="py-4 px-6 text-center w-32 md:w-40">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(product, index) in products" :key="product.id" class="border-b border-[#333] hover:bg-[#1a1a1a]">
                  <td class="py-4 px-6">
                    <a-checkbox v-model:checked="selectedProducts[index]" />
                  </td>
                  <td class="py-4 px-6">
                    <div class="flex items-center">
                      <div class="w-12 h-12 rounded-lg bg-[#222] overflow-hidden mr-3">
                        <img :src="product.image" :alt="product.name" class="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 class="font-medium line-clamp-1">{{ product.name }}</h3>
                        <p class="text-gray-400 text-sm">Mã: {{ product.sku }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="py-4 px-6 text-gray-300">{{ product.category }}</td>
                  <td class="py-4 px-6 text-right">
                    <div class="text-pink-500 font-medium">{{ formatPrice(product.price) }}</div>
                    <div v-if="product.originalPrice" class="text-gray-400 text-sm line-through">
                      {{ formatPrice(product.originalPrice) }}
                    </div>
                  </td>
                  <td class="py-4 px-6 text-center">
                    <span :class="product.stock > 0 ? 'text-gray-300' : 'text-red-500'">
                      {{ product.stock }}
                    </span>
                  </td>
                  <td class="py-4 px-6 text-center">
                    <a-tag :color="getStatusColor(product.status)">
                      {{ getStatusText(product.status) }}
                    </a-tag>
                  </td>
                  <td class="py-4 px-6 text-center">
                    <div class="flex justify-center space-x-2">
                      <a-button 
                        class="!rounded-full bg-[#222] border-[#333] text-gray-300"
                        @click="editProduct(product)"
                      >
                        <edit-outlined />
                      </a-button>
                      <a-button 
                        class="!rounded-full bg-[#222] border-[#333] text-gray-300"
                        @click="confirmDelete(product)"
                      >
                        <delete-outlined />
                      </a-button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Pagination -->
          <div class="p-6 flex justify-between items-center border-t border-[#333]">
            <div>
              <span class="text-gray-400">Hiển thị {{ startItem }}-{{ endItem }} của {{ totalItems }} sản phẩm</span>
            </div>
            <a-pagination
              v-model:current="currentPage"
              :total="totalItems"
              :page-size="pageSize"
              @change="handlePageChange"
              class="custom-pagination"
            />
          </div>
        </template>
      </div>
    </div>
    
    <!-- Thêm/Sửa Sản phẩm Modal -->
    <a-modal
      v-model:visible="productModalVisible"
      :title="isEditing ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'"
      :width="800"
      @ok="handleSubmitProduct"
      class="custom-modal"
    >
      <a-form
        :model="productForm"
        layout="vertical"
        class="custom-form"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a-form-item label="Tên sản phẩm" name="name" :rules="[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]">
            <a-input v-model:value="productForm.name" placeholder="Nhập tên sản phẩm" />
          </a-form-item>
          
          <a-form-item label="Mã sản phẩm (SKU)" name="sku" :rules="[{ required: true, message: 'Vui lòng nhập mã sản phẩm' }]">
            <a-input v-model:value="productForm.sku" placeholder="Nhập mã sản phẩm" />
          </a-form-item>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a-form-item label="Giá bán" name="price" :rules="[{ required: true, message: 'Vui lòng nhập giá bán' }]">
            <a-input-number v-model:value="productForm.price" class="w-full" :formatter="value => `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" :parser="value => value.replace(/₫\s?|(,*)/g, '')" />
          </a-form-item>
          
          <a-form-item label="Giá gốc" name="originalPrice">
            <a-input-number v-model:value="productForm.originalPrice" class="w-full" :formatter="value => `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" :parser="value => value.replace(/₫\s?|(,*)/g, '')" />
          </a-form-item>
          
          <a-form-item label="Số lượng trong kho" name="stock" :rules="[{ required: true, message: 'Vui lòng nhập số lượng' }]">
            <a-input-number v-model:value="productForm.stock" class="w-full" />
          </a-form-item>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a-form-item label="Danh mục" name="categoryId" :rules="[{ required: true, message: 'Vui lòng chọn danh mục' }]">
            <a-select v-model:value="productForm.categoryId" placeholder="Chọn danh mục">
              <a-select-option value="1">Điện thoại - Máy tính bảng</a-select-option>
              <a-select-option value="2">Thiết bị điện tử - Máy tính</a-select-option>
              <a-select-option value="3">Phụ kiện công nghệ</a-select-option>
              <a-select-option value="4">Thời trang nam/nữ</a-select-option>
            </a-select>
          </a-form-item>
          
          <a-form-item label="Trạng thái" name="status">
            <a-select v-model:value="productForm.status" placeholder="Chọn trạng thái">
              <a-select-option value="active">Đang bán</a-select-option>
              <a-select-option value="out_of_stock">Hết hàng</a-select-option>
              <a-select-option value="draft">Bản nháp</a-select-option>
              <a-select-option value="hidden">Đang ẩn</a-select-option>
            </a-select>
          </a-form-item>
        </div>
        
        <a-form-item label="Mô tả sản phẩm" name="description">
          <a-textarea v-model:value="productForm.description" :rows="4" placeholder="Nhập mô tả sản phẩm" />
        </a-form-item>
        
        <a-form-item label="Hình ảnh sản phẩm" name="images">
          <a-upload
            v-model:fileList="fileList"
            list-type="picture-card"
            class="custom-upload"
            :before-upload="beforeUpload"
          >
            <div v-if="fileList.length < 5">
              <plus-outlined />
              <div class="ant-upload-text">Tải lên</div>
            </div>
          </a-upload>
        </a-form-item>
      </a-form>
    </a-modal>
    
    <!-- Xóa Sản phẩm Modal -->
    <a-modal
      v-model:visible="deleteModalVisible"
      title="Xác nhận xóa"
      @ok="handleDeleteProduct"
      okText="Xóa"
      cancelText="Hủy"
      class="custom-modal"
    >
      <p>Bạn có chắc chắn muốn xóa sản phẩm "{{ productToDelete?.name }}" không?</p>
      <p class="text-gray-400">Hành động này không thể hoàn tác.</p>
    </a-modal>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { formatCurrency } from '../../lib/formatters';

export default {
  name: 'SellerProductsPage',
  components: {
    SearchOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined
  },
  setup() {
    // State
    const searchText = ref('');
    const categoryFilter = ref('');
    const statusFilter = ref('');
    const loading = ref(false);
    const currentPage = ref(1);
    const pageSize = ref(10);
    const totalItems = ref(58);
    const allSelected = ref(false);
    const selectedProducts = reactive({});
    
    // Modal state
    const productModalVisible = ref(false);
    const deleteModalVisible = ref(false);
    const isEditing = ref(false);
    const productToDelete = ref(null);
    const fileList = ref([]);
    
    // Product form
    const productForm = reactive({
      name: '',
      sku: '',
      price: 0,
      originalPrice: 0,
      stock: 0,
      categoryId: '',
      status: 'active',
      description: '',
      images: []
    });
    
    // Computed
    const startItem = computed(() => (currentPage.value - 1) * pageSize.value + 1);
    const endItem = computed(() => Math.min(currentPage.value * pageSize.value, totalItems.value));
    
    // Mock data
    const products = ref([
      {
        id: 1,
        name: 'Điện thoại Samsung Galaxy S21',
        sku: 'SP001',
        price: 15990000,
        originalPrice: 18990000,
        stock: 25,
        category: 'Điện thoại - Máy tính bảng',
        status: 'active',
        image: 'https://picsum.photos/200/200?random=1'
      },
      {
        id: 2,
        name: 'Tai nghe Bluetooth Apple AirPods Pro',
        sku: 'SP002',
        price: 4990000,
        originalPrice: 5990000,
        stock: 18,
        category: 'Phụ kiện công nghệ',
        status: 'active',
        image: 'https://picsum.photos/200/200?random=2'
      },
      {
        id: 3,
        name: 'Laptop Dell XPS 13',
        sku: 'SP003',
        price: 29990000,
        originalPrice: 32990000,
        stock: 15,
        category: 'Thiết bị điện tử - Máy tính',
        status: 'active',
        image: 'https://picsum.photos/200/200?random=3'
      },
      {
        id: 4,
        name: 'Smartwatch Apple Watch Series 7',
        sku: 'SP004',
        price: 9990000,
        originalPrice: 11990000,
        stock: 12,
        category: 'Phụ kiện công nghệ',
        status: 'active',
        image: 'https://picsum.photos/200/200?random=4'
      },
      {
        id: 5,
        name: 'Áo Thun Nam Cotton Cổ Tròn',
        sku: 'SP005',
        price: 199000,
        originalPrice: 299000,
        stock: 0,
        category: 'Thời trang nam/nữ',
        status: 'out_of_stock',
        image: 'https://picsum.photos/200/200?random=5'
      },
      {
        id: 6,
        name: 'Máy ảnh Canon EOS 850D',
        sku: 'SP006',
        price: 17990000,
        originalPrice: 19990000,
        stock: 8,
        category: 'Thiết bị điện tử - Máy tính',
        status: 'active',
        image: 'https://picsum.photos/200/200?random=6'
      },
      {
        id: 7,
        name: 'iPad Pro 11 inch M1 2021',
        sku: 'SP007',
        price: 21990000,
        originalPrice: 23990000,
        stock: 10,
        category: 'Điện thoại - Máy tính bảng',
        status: 'active',
        image: 'https://picsum.photos/200/200?random=7'
      },
      {
        id: 8,
        name: 'Quần Jeans Nam Slim Fit',
        sku: 'SP008',
        price: 399000,
        originalPrice: 499000,
        stock: 30,
        category: 'Thời trang nam/nữ',
        status: 'active',
        image: 'https://picsum.photos/200/200?random=8'
      },
      {
        id: 9,
        name: 'Tai nghe Over-ear Sony WH-1000XM4',
        sku: 'SP009',
        price: 6490000,
        originalPrice: 7990000,
        stock: 5,
        category: 'Phụ kiện công nghệ',
        status: 'draft',
        image: 'https://picsum.photos/200/200?random=9'
      },
      {
        id: 10,
        name: 'Router WiFi Mesh Google Nest',
        sku: 'SP010',
        price: 1990000,
        originalPrice: 2490000,
        stock: 20,
        category: 'Thiết bị điện tử - Máy tính',
        status: 'hidden',
        image: 'https://picsum.photos/200/200?random=10'
      }
    ]);
    
    // Methods
    const handleSearch = (value) => {
      console.log('Search:', value);
      // Implement search logic here
    };
    
    const handleCategoryFilter = (value) => {
      console.log('Category filter:', value);
      // Implement category filter logic here
    };
    
    const handleStatusFilter = (value) => {
      console.log('Status filter:', value);
      // Implement status filter logic here
    };
    
    const handlePageChange = (page) => {
      currentPage.value = page;
      // Implement pagination logic here
    };
    
    const toggleSelectAll = (e) => {
      const checked = e.target.checked;
      products.value.forEach((_, index) => {
        selectedProducts[index] = checked;
      });
    };
    
    const getStatusText = (status) => {
      switch (status) {
        case 'active':
          return 'Đang bán';
        case 'out_of_stock':
          return 'Hết hàng';
        case 'draft':
          return 'Bản nháp';
        case 'hidden':
          return 'Đang ẩn';
        default:
          return 'Không xác định';
      }
    };
    
    const getStatusColor = (status) => {
      switch (status) {
        case 'active':
          return 'green';
        case 'out_of_stock':
          return 'red';
        case 'draft':
          return 'blue';
        case 'hidden':
          return 'gray';
        default:
          return 'default';
      }
    };
    
    // Modal methods
    const showAddProductModal = () => {
      // Reset form
      Object.keys(productForm).forEach(key => {
        productForm[key] = key === 'price' || key === 'originalPrice' || key === 'stock' ? 0 : 
                          key === 'status' ? 'active' : 
                          key === 'images' ? [] : '';
      });
      
      fileList.value = [];
      isEditing.value = false;
      productModalVisible.value = true;
    };
    
    const editProduct = (product) => {
      // Fill form with product data
      Object.keys(productForm).forEach(key => {
        if (key === 'categoryId') {
          // Map category name to id (mock implementation)
          const categoryMap = {
            'Điện thoại - Máy tính bảng': '1',
            'Thiết bị điện tử - Máy tính': '2',
            'Phụ kiện công nghệ': '3',
            'Thời trang nam/nữ': '4'
          };
          productForm[key] = categoryMap[product.category] || '';
        } else if (key !== 'images') {
          productForm[key] = product[key] || '';
        }
      });
      
      // Mock file list
      fileList.value = [
        {
          uid: '-1',
          name: 'product-image.jpg',
          status: 'done',
          url: product.image,
        }
      ];
      
      isEditing.value = true;
      productModalVisible.value = true;
    };
    
    const handleSubmitProduct = () => {
      console.log('Submit product:', productForm);
      // Implement submit logic here
      productModalVisible.value = false;
    };
    
    const confirmDelete = (product) => {
      productToDelete.value = product;
      deleteModalVisible.value = true;
    };
    
    const handleDeleteProduct = () => {
      console.log('Delete product:', productToDelete.value);
      // Implement delete logic here
      deleteModalVisible.value = false;
    };
    
    const beforeUpload = (file) => {
      // Just for mock purposes
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        fileList.value.push({
          uid: Date.now(),
          name: file.name,
          status: 'done',
          url: reader.result,
        });
      };
      return false;
    };
    
    return {
      searchText,
      categoryFilter,
      statusFilter,
      loading,
      currentPage,
      pageSize,
      totalItems,
      products,
      allSelected,
      selectedProducts,
      startItem,
      endItem,
      productModalVisible,
      deleteModalVisible,
      isEditing,
      productToDelete,
      productForm,
      fileList,
      handleSearch,
      handleCategoryFilter,
      handleStatusFilter,
      handlePageChange,
      toggleSelectAll,
      getStatusText,
      getStatusColor,
      showAddProductModal,
      editProduct,
      handleSubmitProduct,
      confirmDelete,
      handleDeleteProduct,
      beforeUpload,
      formatPrice: formatCurrency
    };
  }
};
</script>

<style scoped>
.custom-select :deep(.ant-select-selector) {
  background-color: #222 !important;
  border-color: #333 !important;
  color: white !important;
}

.custom-pagination :deep(.ant-pagination-item) {
  background-color: #222;
  border-color: #333;
}

.custom-pagination :deep(.ant-pagination-item-active) {
  border-color: #ec4899;
}

.custom-pagination :deep(.ant-pagination-item-active a) {
  color: #ec4899;
}

.custom-pagination :deep(.ant-pagination-prev button),
.custom-pagination :deep(.ant-pagination-next button) {
  background-color: #222;
  border-color: #333;
  color: white;
}

.custom-modal :deep(.ant-modal-content) {
  background-color: #1a1a1a;
  border: 1px solid #333;
}

.custom-modal :deep(.ant-modal-header) {
  background-color: #1a1a1a;
  border-bottom: 1px solid #333;
}

.custom-modal :deep(.ant-modal-title) {
  color: white;
}

.custom-modal :deep(.ant-modal-close) {
  color: #9ca3af;
}

.custom-modal :deep(.ant-modal-footer) {
  border-top: 1px solid #333;
}

.custom-form :deep(.ant-form-item-label > label) {
  color: #e5e7eb;
}

.custom-form :deep(.ant-input),
.custom-form :deep(.ant-input-affix-wrapper),
.custom-form :deep(.ant-select-selector),
.custom-form :deep(.ant-input-number-input),
.custom-form :deep(.ant-input-number),
.custom-form :deep(.ant-input-textarea) {
  background-color: #222;
  border-color: #333;
  color: white;
}

.custom-form :deep(.ant-select-arrow) {
  color: #9ca3af;
}

.custom-upload :deep(.ant-upload-list-item-info) {
  background-color: #222;
  border-color: #333;
}

.custom-upload :deep(.ant-upload.ant-upload-select-picture-card) {
  background-color: #222;
  border-color: #333;
  color: #9ca3af;
}
</style>
