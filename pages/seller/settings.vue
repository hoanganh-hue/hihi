<template>
  <div class="seller-settings-container">
    <h1>Cài đặt cửa hàng</h1>
    
    <div class="settings-section">
      <h2>Thông tin cửa hàng</h2>
      <form @submit.prevent="saveShopInfo" class="settings-form">
        <div class="form-group">
          <label for="shopName">Tên cửa hàng</label>
          <input type="text" id="shopName" v-model="shopInfo.name" />
        </div>
        
        <div class="form-group">
          <label for="shopDescription">Mô tả cửa hàng</label>
          <textarea id="shopDescription" v-model="shopInfo.description" rows="4"></textarea>
        </div>
        
        <div class="form-group">
          <label for="shopLogo">Logo cửa hàng</label>
          <div class="logo-upload">
            <input type="file" id="shopLogo" @change="handleLogoUpload" />
            <div v-if="shopInfo.logo" class="logo-preview">
              <img :src="shopInfo.logo" alt="Logo cửa hàng" />
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label for="shopPhone">Số điện thoại liên hệ</label>
          <input type="tel" id="shopPhone" v-model="shopInfo.phone" />
        </div>
        
        <div class="form-group">
          <label for="shopEmail">Email liên hệ</label>
          <input type="email" id="shopEmail" v-model="shopInfo.email" />
        </div>
        
        <button type="submit" class="save-btn">Lưu thay đổi</button>
      </form>
    </div>
    
    <div class="settings-section">
      <h2>Cài đặt thanh toán</h2>
      <form @submit.prevent="savePaymentSettings" class="settings-form">
        <div class="form-group">
          <label for="bankName">Tên ngân hàng</label>
          <input type="text" id="bankName" v-model="paymentSettings.bankName" />
        </div>
        
        <div class="form-group">
          <label for="accountNumber">Số tài khoản</label>
          <input type="text" id="accountNumber" v-model="paymentSettings.accountNumber" />
        </div>
        
        <div class="form-group">
          <label for="accountName">Tên chủ tài khoản</label>
          <input type="text" id="accountName" v-model="paymentSettings.accountName" />
        </div>
        
        <button type="submit" class="save-btn">Lưu thay đổi</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SellerSettings',
  data() {
    return {
      shopInfo: {
        name: 'Shop TikTok của tôi',
        description: 'Chuyên cung cấp các sản phẩm chất lượng cao',
        logo: null,
        phone: '0987654321',
        email: 'myshop@example.com'
      },
      paymentSettings: {
        bankName: 'Vietcombank',
        accountNumber: '1234567890',
        accountName: 'Nguyen Van A'
      }
    };
  },
  methods: {
    saveShopInfo() {
      console.log('Lưu thông tin cửa hàng:', this.shopInfo);
      // Thực hiện API call để lưu thông tin
      alert('Đã lưu thông tin cửa hàng!');
    },
    savePaymentSettings() {
      console.log('Lưu cài đặt thanh toán:', this.paymentSettings);
      // Thực hiện API call để lưu thông tin
      alert('Đã lưu cài đặt thanh toán!');
    },
    handleLogoUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.shopInfo.logo = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    }
  },
  mounted() {
    console.log('Seller Settings component mounted');
    // Gọi API để lấy dữ liệu cửa hàng
  }
};
</script>

<style scoped>
.seller-settings-container {
  padding: 20px;
}

.settings-section {
  margin-bottom: 40px;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.settings-form {
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

input, textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.logo-upload {
  margin-top: 10px;
}

.logo-preview {
  margin-top: 10px;
  width: 120px;
  height: 120px;
  border: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.logo-preview img {
  max-width: 100%;
  max-height: 100%;
}

.save-btn {
  background-color: #f5347f;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
}

.save-btn:hover {
  background-color: #e01e66;
}
</style>