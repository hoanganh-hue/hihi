import { ref } from 'vue'
import axios from 'axios'

const API_URL = '/api/products'

// Danh sách danh mục cứng cho trường hợp không có API
const hardcodedCategories = [
  { id: 'dien-thoai', name: 'Điện thoại', slug: 'dien-thoai', icon: 'mobile-outlined' },
  { id: 'do-choi-me-va-be', name: 'Đồ chơi - Mẹ & Bé', slug: 'do-choi-me-va-be', icon: 'robot-outlined' },
  { id: 'dong-ho', name: 'Đồng hồ', slug: 'dong-ho', icon: 'field-time-outlined' },
  { id: 'dung-cu-the-thao', name: 'Dụng cụ thể thao', slug: 'dung-cu-the-thao', icon: 'sliders-outlined' },
  { id: 'giay-dep', name: 'Giày dép', slug: 'giay-dep', icon: 'skin-outlined' },
  { id: 'quan-ao', name: 'Quần áo', slug: 'quan-ao', icon: 'skin-outlined' },
  { id: 'the-nap-ki-thuat-so', name: 'Thẻ nạp & Kĩ thuật số', slug: 'the-nap-ki-thuat-so', icon: 'credit-card-outlined' },
  { id: 'thiet-bi-dien-tu', name: 'Thiết bị điện tử', slug: 'thiet-bi-dien-tu', icon: 'laptop-outlined' },
  { id: 'trang-suc', name: 'Trang sức', slug: 'trang-suc', icon: 'heart-outlined' },
  { id: 'tui-xach', name: 'Túi xách', slug: 'tui-xach', icon: 'skin-outlined' }
]

/**
 * Hook để quản lý và lấy dữ liệu danh mục
 */
export function useCategories() {
  const categories = ref(hardcodedCategories) // Khởi tạo với dữ liệu cứng ngay từ đầu
  const loading = ref(false)
  const error = ref(null)

  /**
   * Lấy danh sách tất cả danh mục
   */
  async function fetchCategories() {
    loading.value = true
    error.value = null

    try {
      // Thử gọi API để lấy danh mục
      const response = await axios.get(`${API_URL}/categories`)
      const apiCategories = response.data.map(category => ({
        id: category,
        name: formatCategoryName(category),
        slug: category,
        icon: getCategoryIcon(category)
      }))
      
      categories.value = apiCategories
      return apiCategories
    } catch (err) {
      console.error('Error fetching categories:', err)
      error.value = 'Không thể tải danh sách danh mục từ API. Sử dụng dữ liệu sẵn có.'
      
      // Luôn trả về dữ liệu cứng khi có lỗi
      return hardcodedCategories
    } finally {
      loading.value = false
    }
  }

  /**
   * Lấy thông tin danh mục theo ID
   * @param {string} categoryId - ID của danh mục
   */
  async function fetchCategoryById(categoryId) {
    loading.value = true
    error.value = null

    try {
      // Trước tiên thử tìm trong danh sách hiện có
      const existingCategory = categories.value.find(cat => cat.id === categoryId || cat.slug === categoryId)
      if (existingCategory) return existingCategory
      
      // Nếu không tìm thấy, thử lấy danh sách mới
      const allCategories = await fetchCategories()
      return allCategories.find(cat => cat.id === categoryId || cat.slug === categoryId) ||
        // Fallback: Tìm trong danh sách cứng
        hardcodedCategories.find(cat => cat.id === categoryId || cat.slug === categoryId) ||
        null
    } catch (err) {
      console.error(`Error fetching category ${categoryId}:`, err)
      error.value = 'Không thể tải thông tin danh mục. Vui lòng thử lại sau.'
      
      // Tìm trong danh sách cứng
      return hardcodedCategories.find(cat => cat.id === categoryId || cat.slug === categoryId) || null
    } finally {
      loading.value = false
    }
  }

  /**
   * Format tên danh mục từ slug
   * @param {string} slug - Slug của danh mục
   */
  function formatCategoryName(slug) {
    const nameMap = {
      'dien-thoai': 'Điện thoại',
      'do-choi-me-va-be': 'Đồ chơi - Mẹ & Bé',
      'do_choi-me_be': 'Đồ chơi - Mẹ & Bé',
      'dong-ho': 'Đồng hồ',
      'dung-cu-the-thao': 'Dụng cụ thể thao',
      'giay-dep': 'Giày dép',
      'quan-ao': 'Quần áo',
      'the-nap-ki-thuat-so': 'Thẻ nạp & Kĩ thuật số',
      'the-nap_ki-thuat-so': 'Thẻ nạp & Kĩ thuật số',
      'thiet-bi-dien-tu': 'Thiết bị điện tử',
      'trang-suc': 'Trang sức',
      'tui-xach': 'Túi xách'
    }
    return nameMap[slug] || slug
  }
  
  /**
   * Gán icon cho danh mục dựa trên slug
   * @param {string} slug - Slug của danh mục
   */
  function getCategoryIcon(slug) {
    const iconMap = {
      'dien-thoai': 'mobile-outlined',
      'do-choi-me-va-be': 'robot-outlined',
      'do_choi-me_be': 'robot-outlined',
      'dong-ho': 'field-time-outlined',
      'dung-cu-the-thao': 'sliders-outlined',
      'giay-dep': 'skin-outlined',
      'quan-ao': 'skin-outlined',
      'the-nap-ki-thuat-so': 'credit-card-outlined',
      'the-nap_ki-thuat-so': 'credit-card-outlined',
      'thiet-bi-dien-tu': 'laptop-outlined',
      'trang-suc': 'heart-outlined',
      'tui-xach': 'skin-outlined'
    }
    return iconMap[slug] || 'question-outlined'
  }

  return {
    categories,
    loading,
    error,
    fetchCategories,
    fetchCategoryById
  }
}