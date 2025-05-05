<template>
  <div class="affiliate-stats-container">
    <h1>Phân tích hiệu suất</h1>
    
    <div class="filter-section">
      <div class="form-group">
        <label for="dateRange">Khoảng thời gian</label>
        <select id="dateRange" v-model="dateRange" class="form-control">
          <option value="7">7 ngày qua</option>
          <option value="30">30 ngày qua</option>
          <option value="90">90 ngày qua</option>
          <option value="180">6 tháng qua</option>
          <option value="365">1 năm qua</option>
          <option value="custom">Tùy chỉnh</option>
        </select>
      </div>
      
      <div class="date-picker-container" v-if="dateRange === 'custom'">
        <div class="form-group">
          <label for="startDate">Ngày bắt đầu</label>
          <input type="date" id="startDate" v-model="startDate" class="form-control" />
        </div>
        <div class="form-group">
          <label for="endDate">Ngày kết thúc</label>
          <input type="date" id="endDate" v-model="endDate" class="form-control" />
        </div>
      </div>
      
      <button @click="applyFilter" class="btn-apply">Áp dụng</button>
    </div>
    
    <div class="stats-overview">
      <div class="stats-card">
        <h3>Tổng lượt nhấp</h3>
        <p class="stat-value">1,245</p>
        <p class="stat-change increase">+12.5% so với kỳ trước</p>
      </div>
      <div class="stats-card">
        <h3>Tỷ lệ chuyển đổi</h3>
        <p class="stat-value">7.8%</p>
        <p class="stat-change increase">+1.2% so với kỳ trước</p>
      </div>
      <div class="stats-card">
        <h3>Đơn hàng</h3>
        <p class="stat-value">97</p>
        <p class="stat-change increase">+8.5% so với kỳ trước</p>
      </div>
      <div class="stats-card">
        <h3>Doanh thu tạo ra</h3>
        <p class="stat-value">45,780,000 ₫</p>
        <p class="stat-change increase">+15.2% so với kỳ trước</p>
      </div>
      <div class="stats-card">
        <h3>Hoa hồng</h3>
        <p class="stat-value">5,250,000 ₫</p>
        <p class="stat-change increase">+15.2% so với kỳ trước</p>
      </div>
    </div>
    
    <div class="chart-section">
      <h2>Hiệu suất theo thời gian</h2>
      <div class="chart-placeholder">
        <!-- Chart component sẽ được thêm vào đây -->
        <p>Đang tải biểu đồ hiệu suất...</p>
      </div>
    </div>
    
    <div class="performance-by-product">
      <h2>Hiệu suất theo sản phẩm</h2>
      <table class="product-stats-table">
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Lượt nhấp</th>
            <th>Đơn hàng</th>
            <th>Tỷ lệ chuyển đổi</th>
            <th>Doanh thu</th>
            <th>Hoa hồng</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in productStats" :key="product.id">
            <td>{{ product.name }}</td>
            <td>{{ product.clicks }}</td>
            <td>{{ product.orders }}</td>
            <td>{{ product.conversionRate }}%</td>
            <td>{{ product.revenue }}</td>
            <td>{{ product.commission }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AffiliateStats',
  data() {
    return {
      dateRange: '30',
      startDate: '',
      endDate: '',
      productStats: [
        { id: 1, name: 'Samsung Galaxy S21', clicks: 427, orders: 35, conversionRate: 8.2, revenue: '18,550,000 ₫', commission: '927,500 ₫' },
        { id: 2, name: 'iPhone 13 Pro Max', clicks: 389, orders: 28, conversionRate: 7.2, revenue: '16,940,000 ₫', commission: '847,000 ₫' },
        { id: 3, name: 'Xiaomi Redmi Note 11', clicks: 265, orders: 22, conversionRate: 8.3, revenue: '5,940,000 ₫', commission: '297,000 ₫' },
        { id: 4, name: 'OPPO Reno7', clicks: 164, orders: 12, conversionRate: 7.3, revenue: '4,350,000 ₫', commission: '217,500 ₫' }
      ]
    };
  },
  methods: {
    applyFilter() {
      console.log('Áp dụng bộ lọc:', {
        dateRange: this.dateRange,
        startDate: this.startDate,
        endDate: this.endDate
      });
      
      // Trong thực tế, bạn sẽ gọi API để lấy dữ liệu phù hợp với bộ lọc
      alert('Đã áp dụng bộ lọc thời gian!');
    }
  },
  mounted() {
    console.log('Affiliate Stats component mounted');
    // Trong thực tế, bạn sẽ gọi API để lấy dữ liệu thống kê
  }
};
</script>

<style scoped>
.affiliate-stats-container {
  padding: 20px;
}

.filter-section {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: flex-end;
}

.form-group {
  margin-bottom: 0;
  min-width: 200px;
}

.date-picker-container {
  display: flex;
  gap: 15px;
}

.form-control {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  width: 100%;
}

.btn-apply {
  background-color: #f5347f;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  height: 42px;
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stats-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #f5347f;
  margin: 10px 0 5px 0;
}

.stat-change {
  font-size: 14px;
  margin: 0;
}

.increase {
  color: #52c41a;
}

.decrease {
  color: #ff4d4f;
}

.chart-section {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

.performance-by-product {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.product-stats-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.product-stats-table th,
.product-stats-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.product-stats-table th {
  font-weight: 600;
  background-color: #f5f5f5;
}

h1, h2, h3 {
  margin-top: 0;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}
</style>