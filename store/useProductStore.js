import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getMockProducts, getMockFlashSaleProducts, getMockFeaturedProducts, getMockProductDetails, getMockRelatedProducts } from '@/lib/api';

/**
 * Store quản lý trạng thái sản phẩm
 */
export const useProductStore = defineStore('product', () => {
  // State
  const products = ref([]);
  const featuredProducts = ref([]);
  const flashSaleProducts = ref([]);
  const currentProduct = ref(null);
  const relatedProducts = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Getters
  const getProductById = computed(() => {
    return (id) => products.value.find(product => product.id == id);
  });

  /**
   * Lấy danh sách sản phẩm
   * @param {Object} params Các tham số lọc và phân trang
   */
  async function fetchProducts(params = {}) {
    loading.value = true;
    error.value = null;
    
    try {
      const data = await getMockProducts(params);
      products.value = data;
      return data;
    } catch (err) {
      console.error('Lỗi khi lấy danh sách sản phẩm:', err);
      error.value = 'Không thể lấy danh sách sản phẩm. Vui lòng thử lại sau.';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Lấy sản phẩm flash sale
   */
  async function fetchFlashSaleProducts() {
    loading.value = true;
    error.value = null;
    
    try {
      const data = await getMockFlashSaleProducts();
      flashSaleProducts.value = data;
      return data;
    } catch (err) {
      console.error('Lỗi khi lấy sản phẩm flash sale:', err);
      error.value = 'Không thể lấy sản phẩm flash sale. Vui lòng thử lại sau.';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Lấy sản phẩm nổi bật
   */
  async function fetchFeaturedProducts() {
    loading.value = true;
    error.value = null;
    
    try {
      const data = await getMockFeaturedProducts();
      featuredProducts.value = data;
      return data;
    } catch (err) {
      console.error('Lỗi khi lấy sản phẩm nổi bật:', err);
      error.value = 'Không thể lấy sản phẩm nổi bật. Vui lòng thử lại sau.';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Lấy chi tiết sản phẩm theo ID
   * @param {string|number} id ID sản phẩm
   */
  async function fetchProductDetails(id) {
    loading.value = true;
    error.value = null;
    
    try {
      const data = await getMockProductDetails(id);
      currentProduct.value = data;
      return data;
    } catch (err) {
      console.error(`Lỗi khi lấy chi tiết sản phẩm ID=${id}:`, err);
      error.value = 'Không thể lấy chi tiết sản phẩm. Vui lòng thử lại sau.';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Lấy sản phẩm liên quan
   * @param {string|number} productId ID sản phẩm hiện tại
   */
  async function fetchRelatedProducts(productId) {
    loading.value = true;
    error.value = null;
    
    try {
      const data = await getMockRelatedProducts(productId);
      relatedProducts.value = data;
      return data;
    } catch (err) {
      console.error(`Lỗi khi lấy sản phẩm liên quan cho ID=${productId}:`, err);
      error.value = 'Không thể lấy sản phẩm liên quan. Vui lòng thử lại sau.';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    // State
    products,
    featuredProducts,
    flashSaleProducts,
    currentProduct,
    relatedProducts,
    loading,
    error,
    
    // Getters
    getProductById,
    
    // Actions
    fetchProducts,
    fetchFlashSaleProducts,
    fetchFeaturedProducts,
    fetchProductDetails,
    fetchRelatedProducts
  };
});