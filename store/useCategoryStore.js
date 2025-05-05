import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getMockCategories, getMockFeaturedCategories, getMockCategoryDetails } from '@/lib/api';

/**
 * Store quản lý trạng thái danh mục
 */
export const useCategoryStore = defineStore('category', () => {
  // State
  const categories = ref([]);
  const featuredCategories = ref([]);
  const currentCategory = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // Getters
  const getCategoryById = computed(() => {
    return (id) => categories.value.find(category => category.id == id);
  });

  const getCategoryBySlug = computed(() => {
    return (slug) => categories.value.find(category => 
      category.slug === slug || 
      category.name.toLowerCase().replace(/\s+/g, '-') === slug
    );
  });

  /**
   * Lấy tất cả danh mục
   */
  async function fetchCategories() {
    loading.value = true;
    error.value = null;

    try {
      const data = await getMockCategories();
      categories.value = data;
      return data;
    } catch (err) {
      console.error('Lỗi khi lấy danh sách danh mục:', err);
      error.value = 'Không thể lấy danh sách danh mục. Vui lòng thử lại sau.';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Lấy danh mục nổi bật
   */
  async function fetchFeaturedCategories() {
    loading.value = true;
    error.value = null;

    try {
      const data = await getMockFeaturedCategories();
      featuredCategories.value = data;
      return data;
    } catch (err) {
      console.error('Lỗi khi lấy danh mục nổi bật:', err);
      error.value = 'Không thể lấy danh mục nổi bật. Vui lòng thử lại sau.';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Lấy chi tiết danh mục theo ID
   * @param {string|number} id ID hoặc slug của danh mục
   */
  async function fetchCategoryDetails(id) {
    loading.value = true;
    error.value = null;

    try {
      const data = await getMockCategoryDetails(id);
      currentCategory.value = data;
      return data;
    } catch (err) {
      console.error(`Lỗi khi lấy chi tiết danh mục ID=${id}:`, err);
      error.value = 'Không thể lấy chi tiết danh mục. Vui lòng thử lại sau.';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    // State
    categories,
    featuredCategories,
    currentCategory,
    loading,
    error,
    
    // Getters
    getCategoryById,
    getCategoryBySlug,
    
    // Actions
    fetchCategories,
    fetchFeaturedCategories,
    fetchCategoryDetails
  };
});