import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { v4 as uuidv4 } from 'uuid';

/**
 * Store quản lý giỏ hàng
 */
export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Getters
  const totalItems = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0);
  });

  const totalPrice = computed(() => {
    return items.value.reduce((total, item) => total + item.price * item.quantity, 0);
  });

  const totalOriginalPrice = computed(() => {
    return items.value.reduce((total, item) => {
      const originalPrice = item.originalPrice || item.price;
      return total + originalPrice * item.quantity;
    }, 0);
  });

  const totalDiscount = computed(() => {
    return totalOriginalPrice.value - totalPrice.value;
  });

  const selectedItems = computed(() => {
    return items.value.filter(item => item.isSelected);
  });

  const selectedTotalPrice = computed(() => {
    return selectedItems.value.reduce((total, item) => total + item.price * item.quantity, 0);
  });

  /**
   * Thêm sản phẩm vào giỏ hàng
   */
  function addItem(product, quantity = 1, variant = []) {
    // Kiểm tra sản phẩm đã tồn tại trong giỏ hàng hay chưa
    const existingItemIndex = items.value.findIndex(item => 
      item.productId === product.id && 
      JSON.stringify(item.variant || []) === JSON.stringify(variant)
    );

    if (existingItemIndex >= 0) {
      // Nếu đã tồn tại, tăng số lượng
      items.value[existingItemIndex].quantity += quantity;
    } else {
      // Nếu chưa tồn tại, thêm mới
      items.value.push({
        id: uuidv4(),
        productId: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        quantity,
        variant,
        maxQuantity: product.stock || 100,
        isSelected: true
      });
    }

    // Lưu vào localStorage
    saveToLocalStorage();
  }

  /**
   * Cập nhật số lượng sản phẩm
   */
  function updateQuantity(itemId, quantity) {
    const index = items.value.findIndex(item => item.id === itemId);
    
    if (index >= 0) {
      if (quantity <= 0) {
        // Nếu số lượng <= 0, xóa sản phẩm
        items.value.splice(index, 1);
      } else {
        // Nếu số lượng > 0, cập nhật
        items.value[index].quantity = Math.min(quantity, items.value[index].maxQuantity || 100);
      }
      
      // Lưu vào localStorage
      saveToLocalStorage();
    }
  }

  /**
   * Xóa sản phẩm khỏi giỏ hàng
   */
  function removeItem(itemId) {
    const index = items.value.findIndex(item => item.id === itemId);
    
    if (index >= 0) {
      items.value.splice(index, 1);
      
      // Lưu vào localStorage
      saveToLocalStorage();
    }
  }

  /**
   * Cập nhật trạng thái chọn của sản phẩm
   */
  function updateSelection(itemId, isSelected) {
    const index = items.value.findIndex(item => item.id === itemId);
    
    if (index >= 0) {
      items.value[index].isSelected = isSelected;
      
      // Lưu vào localStorage
      saveToLocalStorage();
    }
  }

  /**
   * Chọn/bỏ chọn tất cả sản phẩm
   */
  function selectAll(isSelected = true) {
    items.value.forEach(item => {
      item.isSelected = isSelected;
    });
    
    // Lưu vào localStorage
    saveToLocalStorage();
  }

  /**
   * Xóa giỏ hàng
   */
  function clearCart() {
    items.value = [];
    
    // Lưu vào localStorage
    saveToLocalStorage();
  }

  /**
   * Lưu giỏ hàng vào localStorage
   */
  function saveToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(items.value));
  }

  /**
   * Khôi phục giỏ hàng từ localStorage
   */
  function loadFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    
    if (savedCart) {
      try {
        items.value = JSON.parse(savedCart);
      } catch (err) {
        console.error('Lỗi khi đọc giỏ hàng từ localStorage:', err);
      }
    }
  }

  // Khôi phục giỏ hàng khi khởi tạo store
  loadFromLocalStorage();

  return {
    // State
    items,
    loading,
    error,
    
    // Getters
    totalItems,
    totalPrice,
    totalOriginalPrice,
    totalDiscount,
    selectedItems,
    selectedTotalPrice,
    
    // Actions
    addItem,
    updateQuantity,
    removeItem,
    updateSelection,
    selectAll,
    clearCart,
    loadFromLocalStorage
  };
});