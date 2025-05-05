import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { loginUser, registerUser, logoutUser, getCurrentUser, updateUserProfile } from '@/lib/api';
import router from '@/router';

/**
 * Store quản lý trạng thái xác thực người dùng
 */
export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null);
  const token = ref(localStorage.getItem('token') || null);
  const loading = ref(false);
  const error = ref(null);
  const isAuthenticated = computed(() => !!token.value);

  /**
   * Đăng nhập
   * @param {Object} credentials Thông tin đăng nhập
   */
  async function login(credentials) {
    loading.value = true;
    error.value = null;

    try {
      const data = await loginUser(credentials);
      
      // Lưu token và user
      token.value = data.token;
      localStorage.setItem('token', data.token);
      user.value = data.user;

      return data;
    } catch (err) {
      console.error('Lỗi khi đăng nhập:', err);
      error.value = err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Đăng ký
   * @param {Object} userData Thông tin đăng ký
   */
  async function register(userData) {
    loading.value = true;
    error.value = null;

    try {
      const data = await registerUser(userData);
      
      // Lưu token và user nếu API trả về luôn (auto login)
      if (data.token) {
        token.value = data.token;
        localStorage.setItem('token', data.token);
        user.value = data.user;
      }

      return data;
    } catch (err) {
      console.error('Lỗi khi đăng ký:', err);
      error.value = err.message || 'Đăng ký thất bại. Vui lòng thử lại sau.';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Đăng xuất
   */
  async function logout() {
    loading.value = true;
    error.value = null;

    try {
      // Gọi API đăng xuất nếu cần
      await logoutUser();
      
      // Xóa token và user
      token.value = null;
      user.value = null;
      localStorage.removeItem('token');

      // Chuyển hướng về trang chủ
      router.push('/');
    } catch (err) {
      console.error('Lỗi khi đăng xuất:', err);
      error.value = err.message || 'Đăng xuất thất bại. Vui lòng thử lại sau.';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Lấy thông tin người dùng hiện tại
   */
  async function fetchCurrentUser() {
    if (!token.value) return null;
    
    loading.value = true;
    error.value = null;

    try {
      const data = await getCurrentUser();
      user.value = data;
      return data;
    } catch (err) {
      console.error('Lỗi khi lấy thông tin người dùng:', err);
      error.value = err.message || 'Không thể lấy thông tin người dùng. Vui lòng thử lại sau.';
      
      // Nếu token không hợp lệ, đăng xuất
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        logout();
      }
      
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Cập nhật thông tin người dùng
   * @param {Object} profileData Thông tin cần cập nhật
   */
  async function updateProfile(profileData) {
    if (!token.value) return null;
    
    loading.value = true;
    error.value = null;

    try {
      const data = await updateUserProfile(profileData);
      user.value = data;
      return data;
    } catch (err) {
      console.error('Lỗi khi cập nhật thông tin người dùng:', err);
      error.value = err.message || 'Không thể cập nhật thông tin người dùng. Vui lòng thử lại sau.';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Tự động lấy thông tin người dùng nếu có token
  if (token.value) {
    fetchCurrentUser().catch(() => {});
  }

  return {
    // State
    user,
    token,
    loading,
    error,
    isAuthenticated,
    
    // Actions
    login,
    register,
    logout,
    fetchCurrentUser,
    updateProfile
  };
});