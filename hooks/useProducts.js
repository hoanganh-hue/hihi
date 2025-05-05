import { ref } from 'vue'
import axios from 'axios'
import { mockProducts } from '../data/mockProducts.js'

const API_URL = '/api/products'

/**
 * Hook để quản lý và lấy dữ liệu sản phẩm
 */
export function useProducts() {
  const products = ref([])
  const loading = ref(false)
  const error = ref(null)

  /**
   * Tải danh sách sản phẩm theo danh mục
   * @param {string} category - Tên danh mục
   */
  async function fetchProductsByCategory(category) {
    console.log('Fetching products for category:', category)
    loading.value = true
    error.value = null

    try {
      if (category === 'dien-thoai') {
        // Đọc dữ liệu danh mục điện thoại, tải dữ liệu từ các file JSON
        const brands = ['honor', 'huawei', 'iphone', 'oppo', 'samsung', 'vivo', 'xiaomi']
        let allPhoneProducts = []
        
        await Promise.all(brands.map(async (brand) => {
          try {
            const response = await fetch(`/images/dien-thoai/data/${brand}.json`)
            if (response.ok) {
              const data = await response.json()
              // Xử lý đường dẫn hình ảnh
              const processedData = data.map(product => {
                if (product.image && !product.image.startsWith('/')) {
                  product.image = `/images/dien-thoai/images/${brand}/${product.image}`
                }
                if (product.images && Array.isArray(product.images)) {
                  product.images = product.images.map(img => {
                    if (!img.startsWith('/')) {
                      return `/images/dien-thoai/images/${brand}/${img}`
                    }
                    return img
                  })
                }
                // Asegúrate de que 'thông số kỹ thuật' tiene el formato correcto
                if (product['thông số kỹ thuật'] === undefined && product['thu00f4ng su1ed1 ku1ef9 thuu1eadt'] !== undefined) {
                  product['thông số kỹ thuật'] = product['thu00f4ng su1ed1 ku1ef9 thuu1eadt'];
                  delete product['thu00f4ng su1ed1 ku1ef9 thuu1eadt'];
                }
                return product
              })
              allPhoneProducts = [...allPhoneProducts, ...processedData]
            }
          } catch (err) {
            console.error(`Error loading data for ${brand}:`, err)
          }
        }))
        
        products.value = allPhoneProducts
        console.log(`Loaded ${allPhoneProducts.length} phone products from JSON files`)
      } else {
        // Các danh mục khác, gửi yêu cầu API để lấy sản phẩm
        try {
          const response = await axios.get(`${API_URL}/${category}`)
          products.value = response.data
          console.log(`Loaded ${products.value.length} products from API for category ${category}`)
        } catch (apiErr) {
          console.error('API error:', apiErr)
          // Nếu lỗi (ví dụ không có API backend), fallback về mock data
          if (mockProducts[category]) {
            products.value = mockProducts[category]
            console.log(`Using mock data for ${category} with ${products.value.length} products`)
          } else {
            products.value = []
            console.log(`No mock data available for ${category}`)
          }
        }
      }
      
      loading.value = false
      return products.value
    } catch (err) {
      console.error('Error in fetchProductsByCategory:', err)
      error.value = 'Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.'
      loading.value = false
      // Sử dụng dữ liệu mock nếu có lỗi
      if (mockProducts[category]) {
        products.value = mockProducts[category]
        return products.value
      }
      return []
    }
  }

  /**
   * Tải chi tiết sản phẩm theo ID và danh mục
   * @param {string} category - Tên danh mục
   * @param {string|number} productId - ID sản phẩm
   */
  async function fetchProductById(category, productId) {
    loading.value = true
    error.value = null

    try {
      const response = await axios.get(`${API_URL}/${category}/${productId}`)
      loading.value = false
      return response.data
    } catch (err) {
      console.error('Error in fetchProductById:', err)
      error.value = 'Không thể tải chi tiết sản phẩm. Vui lòng thử lại sau.'
      loading.value = false
      
      // Sử dụng dữ liệu mock nếu có lỗi
      if (mockProducts[category]) {
        const mockProduct = mockProducts[category].find(p => p.id == productId)
        if (mockProduct) {
          return mockProduct
        }
      }
      return null
    }
  }

  return {
    products,
    loading,
    error,
    fetchProductsByCategory,
    fetchProductById
  }
}