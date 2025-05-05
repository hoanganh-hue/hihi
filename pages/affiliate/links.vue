<template>
  <div class="affiliate-links-container">
    <h1>Quản lý liên kết tiếp thị</h1>
    
    <div class="create-link-section">
      <h2>Tạo liên kết mới</h2>
      <div class="link-generator">
        <div class="form-group">
          <label for="productSelect">Chọn sản phẩm</label>
          <select id="productSelect" v-model="selectedProduct" class="form-control">
            <option value="">-- Chọn sản phẩm --</option>
            <option v-for="product in products" :key="product.id" :value="product.id">
              {{ product.name }}
            </option>
          </select>
        </div>
        
        <div class="form-group" v-if="selectedProduct">
          <label>Hoa hồng dự kiến</label>
          <div class="commission-info">
            <span class="percentage">5%</span> của giá sản phẩm
          </div>
        </div>
        
        <button @click="generateLink" class="btn-generate" :disabled="!selectedProduct">
          Tạo liên kết
        </button>
      </div>
      
      <div class="generated-link" v-if="generatedLink">
        <h3>Liên kết của bạn</h3>
        <div class="link-display">
          <input type="text" readonly :value="generatedLink" class="link-input" ref="linkInput" />
          <button @click="copyLink" class="btn-copy">Sao chép</button>
        </div>
        <div class="link-info">
          <div class="qr-code-placeholder">
            <span>Mã QR</span>
          </div>
          <div class="social-share">
            <p>Chia sẻ qua:</p>
            <div class="social-buttons">
              <button class="social-btn facebook">Facebook</button>
              <button class="social-btn twitter">Twitter</button>
              <button class="social-btn zalo">Zalo</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="my-links-section">
      <h2>Liên kết của tôi</h2>
      <table class="links-table">
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Liên kết</th>
            <th>Ngày tạo</th>
            <th>Lượt nhấp</th>
            <th>Đơn hàng</th>
            <th>Hoa hồng</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="link in myLinks" :key="link.id">
            <td>{{ link.productName }}</td>
            <td class="link-cell">
              <span class="truncated-link">{{ link.url }}</span>
              <button class="btn-copy-small" @click="copyLinkFromTable(link.url)">Sao chép</button>
            </td>
            <td>{{ link.createdAt }}</td>
            <td>{{ link.clicks }}</td>
            <td>{{ link.orders }}</td>
            <td>{{ link.commission }}</td>
            <td>
              <button class="btn-delete" @click="deleteLink(link.id)">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AffiliateLinks',
  data() {
    return {
      selectedProduct: '',
      generatedLink: '',
      products: [
        { id: 1, name: 'Samsung Galaxy S21' },
        { id: 2, name: 'iPhone 13 Pro Max' },
        { id: 3, name: 'Xiaomi Redmi Note 11' },
        { id: 4, name: 'OPPO Reno7' },
        { id: 5, name: 'Vivo V23' }
      ],
      myLinks: [
        { id: 1, productName: 'Samsung Galaxy S21', url: 'https://tiktokshop.vn/p/123?ref=aff5678', createdAt: '01/05/2024', clicks: 85, orders: 7, commission: '855,000 ₫' },
        { id: 2, productName: 'iPhone 13 Pro Max', url: 'https://tiktokshop.vn/p/456?ref=aff5678', createdAt: '28/04/2024', clicks: 132, orders: 12, commission: '2,400,000 ₫' },
        { id: 3, productName: 'Xiaomi Redmi Note 11', url: 'https://tiktokshop.vn/p/789?ref=aff5678', createdAt: '25/04/2024', clicks: 63, orders: 6, commission: '320,000 ₫' }
      ]
    };
  },
  methods: {
    generateLink() {
      if (!this.selectedProduct) return;
      
      // Trong thực tế, bạn sẽ gọi API để tạo liên kết
      const baseUrl = 'https://tiktokshop.vn/p/';
      const affiliateCode = 'ref=aff5678'; // Thường sẽ là mã người dùng
      this.generatedLink = `${baseUrl}${this.selectedProduct}?${affiliateCode}`;
      
      // Giả lập việc tạo liên kết thành công
      console.log(`Đã tạo liên kết tiếp thị cho sản phẩm ID: ${this.selectedProduct}`);
    },
    copyLink() {
      const linkInput = this.$refs.linkInput;
      linkInput.select();
      document.execCommand('copy');
      alert('Đã sao chép liên kết vào clipboard!');
    },
    copyLinkFromTable(linkUrl) {
      const el = document.createElement('textarea');
      el.value = linkUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      alert('Đã sao chép liên kết vào clipboard!');
    },
    deleteLink(linkId) {
      if (confirm('Bạn có chắc chắn muốn xóa liên kết này không?')) {
        // Trong thực tế, bạn sẽ gọi API để xóa liên kết
        console.log(`Xóa liên kết ID: ${linkId}`);
        this.myLinks = this.myLinks.filter(link => link.id !== linkId);
      }
    }
  },
  mounted() {
    console.log('Affiliate Links component mounted');
    // Trong thực tế, bạn sẽ gọi API để lấy danh sách sản phẩm và liên kết
  }
};
</script>

<style scoped>
.affiliate-links-container {
  padding: 20px;
}

.create-link-section,
.my-links-section {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.link-generator {
  margin-top: 20px;
}

.form-group {
  margin-bottom: 20px;
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

.commission-info {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 4px;
  display: flex;
  align-items: center;
}

.percentage {
  font-size: 20px;
  font-weight: bold;
  color: #f5347f;
  margin-right: 10px;
}

.btn-generate {
  background-color: #f5347f;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
}

.btn-generate:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.generated-link {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.link-display {
  display: flex;
  margin-top: 15px;
}

.link-input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  font-size: 14px;
}

.btn-copy {
  background-color: #444;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}

.link-info {
  display: flex;
  margin-top: 20px;
  gap: 30px;
}

.qr-code-placeholder {
  width: 120px;
  height: 120px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #ccc;
}

.social-share {
  flex-grow: 1;
}

.social-buttons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.social-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: white;
}

.facebook {
  background-color: #1877F2;
}

.twitter {
  background-color: #1DA1F2;
}

.zalo {
  background-color: #0068FF;
}

.links-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.links-table th,
.links-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.links-table th {
  font-weight: 600;
  background-color: #f5f5f5;
}

.link-cell {
  display: flex;
  align-items: center;
}

.truncated-link {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 10px;
}

.btn-copy-small {
  background-color: #444;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
}

.btn-delete {
  background-color: #ff4d4f;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}
</style>