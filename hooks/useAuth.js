import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { 
  login as apiLogin, 
  logout as apiLogout,
  register as apiRegister,
  verifyEmail as apiVerifyEmail,
  resendVerificationEmail as apiResendVerification,
  forgotPassword as apiForgotPassword,
  resetPassword as apiResetPassword,
  changePassword as apiChangePassword,
  getCurrentUser as apiGetCurrentUser
} from '../lib/apiClient';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null);
  const token = ref(localStorage.getItem('token') || null);
  const loading = ref(false);
  const error = ref(null);
  
  // Computed
  const isAuthenticated = computed(() => !!user.value);
  const isCustomer = computed(() => user.value?.role === 'customer');
  const isSeller = computed(() => user.value?.role === 'seller');
  const isAdmin = computed(() => user.value?.role === 'admin');
  
  // Actions
  /**
   * Đăng nhập
   * @param {Object} credentials - Thông tin đăng nhập (email, password)
   */
  async function login(credentials) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await apiLogin(credentials);
      user.value = response.user;
      // token đã được lưu trong apiClient
      return response;
    } catch (err) {
      console.error('Lỗi đăng nhập:', err);
      error.value = err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
      throw err;
    } finally {
      loading.value = false;
    }
  }
  
  /**
   * Đăng ký
   * @param {Object} userData - Thông tin đăng ký (name, email, password)
   */
  async function register(userData) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await apiRegister(userData);
      return response;
    } catch (err) {
      console.error('Lỗi đăng ký:', err);
      error.value = err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
      throw err;
    } finally {
      loading.value = false;
    }
  }
  
  /**
   * Đăng xuất
   */
  function logout() {
    apiLogout();
    user.value = null;
  }
  
  /**
   * Xác thực email
   * @param {string} token - Token xác thực email
   */
  async function verifyEmail(token) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await apiVerifyEmail(token);
      return response;
    } catch (err) {
      console.error('Lỗi xác thực email:', err);
      error.value = err.response?.data?.message || 'Xác thực email thất bại. Vui lòng thử lại.';
      throw err;
    } finally {
      loading.value = false;
    }
  }
  
  /**
   * Gửi lại email xác thực
   * @param {string} email - Email cần gửi lại xác thực
   */
  async function resendVerificationEmail(email) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await apiResendVerification(email);
      return response;
    } catch (err) {
      console.error('Lỗi gửi lại email xác thực:', err);
      error.value = err.response?.data?.message || 'Gửi lại email xác thực thất bại. Vui lòng thử lại.';
      throw err;
    } finally {
      loading.value = false;
    }
  }
  
  /**
   * Yêu cầu đặt lại mật khẩu
   * @param {string} email - Email cần đặt lại mật khẩu
   */
  async function forgotPassword(email) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await apiForgotPassword(email);
      return response;
    } catch (err) {
      console.error('Lỗi yêu cầu đặt lại mật khẩu:', err);
      error.value = err.response?.data?.message || 'Yêu cầu đặt lại mật khẩu thất bại. Vui lòng thử lại.';
      throw err;
    } finally {
      loading.value = false;
    }
  }
  
  /**
   * Đặt lại mật khẩu
   * @param {Object} resetData - Dữ liệu đặt lại mật khẩu (token, password)
   */
  async function resetPassword(resetData) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await apiResetPassword(resetData.token, resetData.password);
      return response;
    } catch (err) {
      console.error('Lỗi đặt lại mật khẩu:', err);
      error.value = err.response?.data?.message || 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.';
      throw err;
    } finally {
      loading.value = false;
    }
  }
  
  /**
   * Thay đổi mật khẩu
   * @param {Object} passwordData - Dữ liệu thay đổi mật khẩu (currentPassword, newPassword)
   */
  async function changePassword(passwordData) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await apiChangePassword(passwordData.currentPassword, passwordData.newPassword);
      return response;
    } catch (err) {
      console.error('Lỗi thay đổi mật khẩu:', err);
      error.value = err.response?.data?.message || 'Thay đổi mật khẩu thất bại. Vui lòng thử lại.';
      throw err;
    } finally {
      loading.value = false;
    }
  }
  
  /**
   * Lấy thông tin người dùng hiện tại
   */
  async function loadUser() {
    if (!token.value) {
      user.value = null;
      return null;
    }
    
    loading.value = true;
    error.value = null;
    
    try {
      const userData = await apiGetCurrentUser();
      user.value = userData;
      return userData;
    } catch (err) {
      console.error('Lỗi lấy thông tin người dùng:', err);
      if (err.response?.status === 401) {
        // Token không hợp lệ hoặc hết hạn
        user.value = null;
        token.value = null;
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      } else {
        error.value = err.response?.data?.message || 'Không thể lấy thông tin người dùng. Vui lòng thử lại.';
      }
      return null;
    } finally {
      loading.value = false;
    }
  }
  
  // Tự động tải thông tin người dùng nếu có token
  if (token.value) {
    loadUser();
  }
  
  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    isCustomer,
    isSeller,
    isAdmin,
    login,
    register,
    logout,
    verifyEmail,
    resendVerificationEmail,
    forgotPassword,
    resetPassword,
    changePassword,
    loadUser
  };
});