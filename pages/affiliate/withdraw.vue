<template>
  <div class="affiliate-withdraw-container">
    <h1>Rút hoa hồng</h1>
    
    <div class="balance-summary">
      <div class="balance-card">
        <h3>Tổng hoa hồng</h3>
        <p class="balance-value">5,250,000 ₫</p>
      </div>
      <div class="balance-card">
        <h3>Đã rút</h3>
        <p class="balance-value">2,500,000 ₫</p>
      </div>
      <div class="balance-card highlight">
        <h3>Khả dụng</h3>
        <p class="balance-value">2,750,000 ₫</p>
      </div>
      <div class="balance-card pending">
        <h3>Đang chờ xử lý</h3>
        <p class="balance-value">0 ₫</p>
      </div>
    </div>
    
    <div class="withdraw-section">
      <h2>Tạo yêu cầu rút tiền</h2>
      
      <form @submit.prevent="submitWithdrawal" class="withdraw-form">
        <div class="form-group">
          <label for="amount">Số tiền (VNĐ)</label>
          <input
            type="number"
            id="amount"
            v-model="withdrawalAmount"
            class="form-control"
            :min="50000"
            :max="2750000"
            step="10000"
            required
          />
          <p class="form-hint">Số tiền tối thiểu: 50,000 ₫. Số tiền tối đa: 2,750,000 ₫</p>
        </div>
        
        <div class="form-group">
          <label>Phương thức thanh toán</label>
          <div class="payment-methods">
            <div
              v-for="method in paymentMethods"
              :key="method.id"
              class="payment-method"
              :class="{ active: selectedPaymentMethod === method.id }"
              @click="selectPaymentMethod(method.id)"
            >
              <div class="payment-method-icon">{{ method.icon }}</div>
              <div class="payment-method-details">
                <h4>{{ method.name }}</h4>
                <p>{{ method.accountInfo }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <button type="submit" class="btn-withdraw" :disabled="!canSubmit">
            Yêu cầu rút tiền
          </button>
        </div>
      </form>
    </div>
    
    <div class="withdrawal-history">
      <h2>Lịch sử rút tiền</h2>
      <table class="history-table">
        <thead>
          <tr>
            <th>Mã giao dịch</th>
            <th>Ngày yêu cầu</th>
            <th>Số tiền</th>
            <th>Phương thức</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="transaction in withdrawalHistory" :key="transaction.id">
            <td>{{ transaction.id }}</td>
            <td>{{ transaction.date }}</td>
            <td>{{ transaction.amount }}</td>
            <td>{{ transaction.method }}</td>
            <td :class="'status-' + transaction.status.toLowerCase()">
              {{ transaction.status }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AffiliateWithdraw',
  data() {
    return {
      withdrawalAmount: 50000,
      selectedPaymentMethod: 1,
      paymentMethods: [
        {
          id: 1,
          name: 'Chuyển khoản ngân hàng',
          icon: '🏦',
          accountInfo: 'Vietcombank - 1234567890 - Nguyen Van A'
        },
        {
          id: 2,
          name: 'Ví MoMo',
          icon: '📱',
          accountInfo: 'MoMo - 0987654321 - Nguyen Van A'
        }
      ],
      withdrawalHistory: [
        {
          id: 'WD-12345',
          date: '01/05/2024',
          amount: '1,500,000 ₫',
          method: 'Chuyển khoản ngân hàng',
          status: 'Hoàn thành'
        },
        {
          id: 'WD-12344',
          date: '15/04/2024',
          amount: '1,000,000 ₫',
          method: 'Ví MoMo',
          status: 'Hoàn thành'
        }
      ]
    };
  },
  computed: {
    canSubmit() {
      return this.withdrawalAmount >= 50000 &&
             this.withdrawalAmount <= 2750000 &&
             this.selectedPaymentMethod !== null;
    }
  },
  methods: {
    selectPaymentMethod(id) {
      this.selectedPaymentMethod = id;
    },
    submitWithdrawal() {
      if (!this.canSubmit) return;
      
      // Trong thực tế, bạn sẽ gọi API để tạo yêu cầu rút tiền
      const withdrawalRequest = {
        amount: this.withdrawalAmount,
        paymentMethod: this.selectedPaymentMethod,
        date: new Date().toISOString()
      };
      
      console.log('Tạo yêu cầu rút tiền:', withdrawalRequest);
      
      // Giả lập việc tạo yêu cầu thành công
      alert(`Đã gửi yêu cầu rút ${this.withdrawalAmount.toLocaleString('vi-VN')} ₫`);
      
      // Đặt lại giá trị mặc định
      this.withdrawalAmount = 50000;
    }
  },
  mounted() {
    console.log('Affiliate Withdraw component mounted');
    // Trong thực tế, bạn sẽ gọi API để lấy dữ liệu số dư và lịch sử giao dịch
  }
};
</script>

<style scoped>
.affiliate-withdraw-container {
  padding: 20px;
}

h1, h2 {
  margin-top: 0;
}

.balance-summary {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.balance-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.balance-value {
  font-size: 24px;
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 0;
  color: #444;
}

.highlight .balance-value {
  color: #f5347f;
}

.pending .balance-value {
  color: #faad14;
}

.withdraw-section {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.withdraw-form {
  margin-top: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-hint {
  font-size: 14px;
  color: #666;
  margin-top: 5px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.payment-methods {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
}

.payment-method {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.payment-method.active {
  border-color: #f5347f;
  background-color: #fff5f8;
}

.payment-method-icon {
  font-size: 28px;
  margin-right: 15px;
}

.payment-method-details h4 {
  margin: 0 0 5px 0;
}

.payment-method-details p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.btn-withdraw {
  background-color: #f5347f;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
  margin-top: 10px;
}

.btn-withdraw:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.withdrawal-history {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.history-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.history-table th,
.history-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.history-table th {
  font-weight: 600;
  background-color: #f5f5f5;
}

.status-hoàn.thành {
  color: #52c41a;
}

.status-đang.xử.lý {
  color: #faad14;
}

.status-từ.chối {
  color: #ff4d4f;
}
</style>