<template>
  <div class="seller-stats-container">
    <h1>Thống kê doanh thu</h1>
    <div class="stats-grid">
      <div class="stats-card">
        <h3>Tổng doanh thu</h3>
        <p class="stat-value">12,500,000 ₫</p>
      </div>
      <div class="stats-card">
        <h3>Đơn hàng</h3>
        <p class="stat-value">45</p>
      </div>
      <div class="stats-card">
        <h3>Sản phẩm đã bán</h3>
        <p class="stat-value">78</p>
      </div>
      <div class="stats-card">
        <h3>Khách hàng mới</h3>
        <p class="stat-value">23</p>
      </div>
    </div>

    <div class="chart-section">
      <h2>Biểu đồ doanh thu</h2>
      <div class="chart-placeholder">
        <!-- Chart component sẽ được thêm vào đây -->
        <p>Đang tải biểu đồ...</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SellerStats',
  data() {
    return {
      // Dữ liệu sẽ được thêm vào đây
    };
  },
  methods: {
    // Các phương thức sẽ được thêm vào đây
  },
  mounted() {
    // Phương thức gọi khi component được mount
    console.log('Seller Stats component mounted');
  }
};
</script>

<style scoped>
.seller-stats-container {
  padding: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.stats-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #f5347f;
  margin-top: 10px;
}

.chart-section {
  margin-top: 40px;
}

.chart-placeholder {
  background-color: #f9f9f9;
  border-radius: 8px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}
</style>