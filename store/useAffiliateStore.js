import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { 
  getMockAffiliateLinks, 
  createMockAffiliateLink, 
  getMockAffiliateStats, 
  getMockAffiliateCommissions,
  getMockAffiliateWithdrawals,
  createMockAffiliateWithdrawal
} from '@/lib/api';

/**
 * Store quản lý trạng thái tiếp thị liên kết
 */
export const useAffiliateStore = defineStore('affiliate', () => {
  // State
  const affiliateLinks = ref([]);
  const stats = ref(null);
  const commissions = ref([]);
  const withdrawals = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Getters
  const totalEarnings = computed(() => {
    return stats.value?.totalEarnings || 0;
  });

  const pendingCommissions = computed(() => {
    return commissions.value.filter(item => item.status === 'pending');
  });

  const pendingWithdrawals = computed(() => {
    return withdrawals.value.filter(item => item.status === 'pending');
  });

  const availableBalance = computed(() => {
    const totalCommission = commissions.value
      .filter(item => item.status === 'approved')
      .reduce((sum, item) => sum + item.amount, 0);
    
    const totalWithdrawn = withdrawals.value
      .filter(item => ['processing', 'completed'].includes(item.status))
      .reduce((sum, item) => sum + item.amount, 0);
    
    return totalCommission - totalWithdrawn;
  });

  /**
   * Lấy danh sách các link tiếp thị liên kết
   */
  async function fetchAffiliateLinks() {
    loading.value = true;
    error.value = null;

    try {
      const data = await getMockAffiliateLinks();
      affiliateLinks.value = data;
      return data;
    } catch (err) {
      console.error('Lỗi khi lấy danh sách liên kết tiếp thị:', err);
      error.value = 'Không thể lấy danh sách liên kết tiếp thị. Vui lòng thử lại sau.';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Tạo link tiếp thị liên kết mới
   * @param {Object} linkData Thông tin liên kết
   */
  async function createAffiliateLink(linkData) {
    loading.value = true;
    error.value = null;

    try {
      const data = await createMockAffiliateLink(linkData);
      affiliateLinks.value.unshift(data);
      return data;
    } catch (err) {
      console.error('Lỗi khi tạo liên kết tiếp thị:', err);
      error.value = 'Không thể tạo liên kết tiếp thị. Vui lòng thử lại sau.';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Lấy thống kê tiếp thị liên kết
   * @param {Object} params Tham số lọc (thời gian)
   */
  async function fetchAffiliateStats(params = {}) {
    loading.value = true;
    error.value = null;

    try {
      const data = await getMockAffiliateStats(params);
      stats.value = data;
      return data;
    } catch (err) {
      console.error('Lỗi khi lấy thống kê tiếp thị liên kết:', err);
      error.value = 'Không thể lấy thống kê tiếp thị liên kết. Vui lòng thử lại sau.';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Lấy danh sách hoa hồng tiếp thị liên kết
   * @param {Object} params Tham số lọc
   */
  async function fetchAffiliateCommissions(params = {}) {
    loading.value = true;
    error.value = null;

    try {
      const data = await getMockAffiliateCommissions(params);
      commissions.value = data;
      return data;
    } catch (err) {
      console.error('Lỗi khi lấy danh sách hoa hồng:', err);
      error.value = 'Không thể lấy danh sách hoa hồng. Vui lòng thử lại sau.';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Lấy danh sách rút tiền
   * @param {Object} params Tham số lọc
   */
  async function fetchAffiliateWithdrawals(params = {}) {
    loading.value = true;
    error.value = null;

    try {
      const data = await getMockAffiliateWithdrawals(params);
      withdrawals.value = data;
      return data;
    } catch (err) {
      console.error('Lỗi khi lấy danh sách rút tiền:', err);
      error.value = 'Không thể lấy danh sách rút tiền. Vui lòng thử lại sau.';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Tạo yêu cầu rút tiền mới
   * @param {Object} withdrawalData Thông tin yêu cầu rút tiền
   */
  async function createWithdrawal(withdrawalData) {
    loading.value = true;
    error.value = null;

    try {
      const data = await createMockAffiliateWithdrawal(withdrawalData);
      withdrawals.value.unshift(data);
      return data;
    } catch (err) {
      console.error('Lỗi khi tạo yêu cầu rút tiền:', err);
      error.value = 'Không thể tạo yêu cầu rút tiền. Vui lòng thử lại sau.';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    // State
    affiliateLinks,
    stats,
    commissions,
    withdrawals,
    loading,
    error,
    
    // Getters
    totalEarnings,
    pendingCommissions,
    pendingWithdrawals,
    availableBalance,
    
    // Actions
    fetchAffiliateLinks,
    createAffiliateLink,
    fetchAffiliateStats,
    fetchAffiliateCommissions,
    fetchAffiliateWithdrawals,
    createWithdrawal
  };
});