import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * Quản lý giỏ hàng với Pinia Store
 */
export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref([])
  const discountCode = ref('')
  const discountAmount = ref(0)
  const shippingAmount = ref(30000) // Mặc định phí vận chuyển: 30.000 VND
  
  // Computed
  const subtotal = computed(() => {
    return items.value.reduce((total, item) => {
      return total + (item.price * item.quantity)
    }, 0)
  })
  
  const total = computed(() => {
    return subtotal.value - discountAmount.value + shippingAmount.value
  })
  
  // Actions
  /**
   * Thêm sản phẩm vào giỏ hàng
   * @param {Object} newItem Thông tin sản phẩm cần thêm
   */
  function addItem(newItem) {
    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const existingItemIndex = items.value.findIndex((item) => {
      // Nếu sản phẩm có biến thể, so sánh cả ID và biến thể
      if (newItem.variations && item.variations) {
        return item.id === newItem.id && item.variations === newItem.variations
      }
      // Nếu không có biến thể, chỉ so sánh ID
      return item.id === newItem.id
    })
    
    if (existingItemIndex !== -1) {
      // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng
      items.value[existingItemIndex].quantity += newItem.quantity || 1
    } else {
      // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
      items.value.push({
        ...newItem,
        quantity: newItem.quantity || 1
      })
    }
    
    saveCart()
  }
  
  /**
   * Cập nhật số lượng sản phẩm
   * @param {number} index Vị trí sản phẩm trong giỏ hàng
   * @param {number} change Thay đổi (+1 hoặc -1)
   */
  function updateQuantity(index, change) {
    if (index < 0 || index >= items.value.length) return
    
    const newQuantity = items.value[index].quantity + change
    if (newQuantity > 0) {
      items.value[index].quantity = newQuantity
      saveCart()
    }
  }
  
  /**
   * Cập nhật số lượng sản phẩm trực tiếp
   * @param {number} index Vị trí sản phẩm trong giỏ hàng
   * @param {number} quantity Số lượng mới
   */
  function updateItemQuantity(index, quantity) {
    if (index < 0 || index >= items.value.length) return
    if (quantity > 0) {
      items.value[index].quantity = quantity
      saveCart()
    }
  }
  
  /**
   * Xóa sản phẩm khỏi giỏ hàng
   * @param {number} index Vị trí sản phẩm cần xóa
   */
  function removeItem(index) {
    if (index < 0 || index >= items.value.length) return
    
    items.value.splice(index, 1)
    saveCart()
  }
  
  /**
   * Xóa toàn bộ giỏ hàng
   */
  function clearCart() {
    items.value = []
    discountCode.value = ''
    discountAmount.value = 0
    saveCart()
  }
  
  /**
   * Áp dụng mã giảm giá
   * @param {string} code Mã giảm giá
   * @param {number} amount Số tiền giảm
   */
  function applyDiscount(code, amount) {
    discountCode.value = code
    discountAmount.value = amount
    saveCart()
  }
  
  /**
   * Cập nhật phí vận chuyển
   * @param {number} amount Phí vận chuyển mới
   */
  function updateShipping(amount) {
    shippingAmount.value = amount
    saveCart()
  }
  
  /**
   * Lưu giỏ hàng vào localStorage
   */
  function saveCart() {
    // Lưu trữ dữ liệu giỏ hàng vào localStorage
    const cartData = {
      items: items.value,
      discountCode: discountCode.value,
      discountAmount: discountAmount.value,
      shippingAmount: shippingAmount.value
    }
    
    localStorage.setItem('tiktok-shop-cart', JSON.stringify(cartData))
  }
  
  /**
   * Tải giỏ hàng từ localStorage
   */
  function loadCart() {
    try {
      const cartData = localStorage.getItem('tiktok-shop-cart')
      if (cartData) {
        const parsedData = JSON.parse(cartData)
        
        items.value = parsedData.items || []
        discountCode.value = parsedData.discountCode || ''
        discountAmount.value = parsedData.discountAmount || 0
        shippingAmount.value = parsedData.shippingAmount || 30000
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
      // Nếu có lỗi, reset giỏ hàng
      clearCart()
    }
  }
  
  return {
    items,
    discount: discountAmount,
    shipping: shippingAmount,
    subtotal,
    total,
    addItem,
    updateQuantity,
    updateItemQuantity,
    removeItem,
    clearCart,
    applyDiscount,
    updateShipping,
    saveCart,
    loadCart
  }
})