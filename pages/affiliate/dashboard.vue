<template>
  <div class="affiliate-dashboard-container">
    <h1>Bảng điều khiển Tiếp thị liên kết</h1>

    <div class="stats-overview">
      <div class="stats-card">
        <h3>Tổng hoa hồng</h3>
        <p class="stat-value">5,250,000 ₫</p>
      </div>
      <div class="stats-card">
        <h3>Đơn hàng</h3>
        <p class="stat-value">32</p>
      </div>
      <div class="stats-card">
        <h3>Lượt nhấp</h3>
        <p class="stat-value">412</p>
      </div>
      <div class="stats-card">
        <h3>Tỷ lệ chuyển đổi</h3>
        <p class="stat-value">7.8%</p>
      </div>
    </div>

    <div class="performance-chart">
      <h2>Hiệu suất tiếp thị theo thời gian</h2>
      <div class="chart-placeholder">
        <!-- Chart component sẽ được thêm vào đây -->
        <p>Đang tải biểu đồ...</p>
      </div>
    </div>

    <div class="recent-orders">
      <h2>Đơn hàng gần đây từ liên kết của bạn</h2>
      <table class="orders-table">
        <thead>
          <tr>
            <th>Mã đơn hàng</th>
            <th>Ngày</th>
            <th>Sản phẩm</th>
            <th>Giá trị</th>
            <th>Hoa hồng</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in recentOrders" :key="order.id">
            <td>{{ order.id }}</td>
            <td>{{ order.date }}</td>
            <td>{{ order.product }}</td>
            <td>{{ order.value }}</td>
            <td>{{ order.commission }}</td>
            <td>{{ order.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AffiliateDashboard',
  data() {
    return {
      recentOrders: [
        { id: 'ORD-12345', date: '15/05/2024', product: 'Samsung Galaxy S21', value: '18,990,000 ₫', commission: '949,500 ₫', status: 'Hoàn thành' },
        { id: 'ORD-12346', date: '14/05/2024', product: 'Xiaomi Redmi Note 11', value: '4,590,000 ₫', commission: '229,500 ₫', status: 'Hoàn thành' },
        { id: 'ORD-12347', date: '13/05/2024', product: 'OPPO Reno7', value: '7,990,000 ₫', commission: '399,500 ₫', status: 'Đang xử lý' },
        { id: 'ORD-12348', date: '12/05/2024', product: 'iPhone 13', value: '21,990,000 ₫', commission: '1,099,500 ₫', status: 'Hoàn thành' }
      ]
    };
  },
  methods: {
    // Các phương thức sẽ được thêm vào đây
  },
  mounted() {
    console.log('Affiliate Dashboard component mounted');
    // Gọi API để lấy dữ liệu
  }
};
</script>

<style scoped>
.affiliate-dashboard-container {
  padding: 20px;
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  margin: 25px 0;
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

.performance-chart {
  margin-top: 40px;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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

.recent-orders {
  margin-top: 40px;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.orders-table th,
.orders-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.orders-table th {
  font-weight: 600;
  background-color: #f5f5f5;
}
</style>