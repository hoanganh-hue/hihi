<template>
  <div class="min-h-screen bg-black">
    <!-- Banner -->
    <div class="relative h-64 md:h-80 bg-gradient-to-r from-pink-600 to-purple-600 overflow-hidden">
      <div class="absolute inset-0 bg-black opacity-50"></div>
      <div class="container mx-auto px-4 h-full flex flex-col justify-center relative z-10">
        <h1 class="text-3xl md:text-4xl font-bold text-white mb-4">Liên hệ với chúng tôi</h1>
        <p class="text-white md:w-2/3 lg:w-1/2">Hãy cho chúng tôi biết bạn cần hỗ trợ điều gì. Đội ngũ của chúng tôi sẽ phản hồi trong thời gian sớm nhất.</p>
      </div>
    </div>

    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Thông tin liên hệ -->
        <div class="lg:col-span-1">
          <div class="bg-[#111] rounded-xl p-6 border border-[#333]">
            <h2 class="text-xl font-medium text-white mb-6">Thông tin liên hệ</h2>
            
            <div class="space-y-6">
              <div class="flex items-start">
                <div class="bg-pink-500 p-3 rounded-lg mr-4">
                  <environment-outlined class="text-xl text-white" />
                </div>
                <div>
                  <h3 class="text-white font-medium mb-1">Địa chỉ</h3>
                  <p class="text-gray-400">108 Nguyễn Du, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="bg-pink-500 p-3 rounded-lg mr-4">
                  <phone-outlined class="text-xl text-white" />
                </div>
                <div>
                  <h3 class="text-white font-medium mb-1">Điện thoại</h3>
                  <p class="text-gray-400">+84 (0) 28 3822 9900</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="bg-pink-500 p-3 rounded-lg mr-4">
                  <mail-outlined class="text-xl text-white" />
                </div>
                <div>
                  <h3 class="text-white font-medium mb-1">Email</h3>
                  <p class="text-gray-400">support@tiktokshop.vn</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="bg-pink-500 p-3 rounded-lg mr-4">
                  <clock-circle-outlined class="text-xl text-white" />
                </div>
                <div>
                  <h3 class="text-white font-medium mb-1">Giờ làm việc</h3>
                  <p class="text-gray-400">Thứ 2 - Thứ 6: 8:30 - 18:00</p>
                  <p class="text-gray-400">Thứ 7: 8:30 - 12:00</p>
                </div>
              </div>
            </div>
            
            <div class="mt-8">
              <h3 class="text-white font-medium mb-4">Kết nối với chúng tôi</h3>
              <div class="flex space-x-4">
                <a href="#" class="bg-[#222] hover:bg-pink-500 transition-colors duration-300 h-10 w-10 rounded-full flex items-center justify-center">
                  <facebook-outlined class="text-white text-lg" />
                </a>
                <a href="#" class="bg-[#222] hover:bg-pink-500 transition-colors duration-300 h-10 w-10 rounded-full flex items-center justify-center">
                  <instagram-outlined class="text-white text-lg" />
                </a>
                <a href="#" class="bg-[#222] hover:bg-pink-500 transition-colors duration-300 h-10 w-10 rounded-full flex items-center justify-center">
                  <twitter-outlined class="text-white text-lg" />
                </a>
                <a href="#" class="bg-[#222] hover:bg-pink-500 transition-colors duration-300 h-10 w-10 rounded-full flex items-center justify-center">
                  <youtube-outlined class="text-white text-lg" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Form liên hệ -->
        <div class="lg:col-span-2">
          <div class="bg-[#111] rounded-xl p-6 border border-[#333]">
            <h2 class="text-xl font-medium text-white mb-6">Gửi tin nhắn cho chúng tôi</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-gray-400 mb-2">Họ và tên</label>
                <a-input v-model:value="contactForm.name" placeholder="Nhập họ và tên" class="contact-input" />
              </div>
              <div>
                <label class="block text-gray-400 mb-2">Email</label>
                <a-input v-model:value="contactForm.email" placeholder="Nhập địa chỉ email" class="contact-input" />
              </div>
              <div>
                <label class="block text-gray-400 mb-2">Số điện thoại</label>
                <a-input v-model:value="contactForm.phone" placeholder="Nhập số điện thoại" class="contact-input" />
              </div>
              <div>
                <label class="block text-gray-400 mb-2">Chủ đề</label>
                <a-select v-model:value="contactForm.subject" class="w-full contact-select" :options="subjectOptions" />
              </div>
            </div>
            
            <div class="mb-6">
              <label class="block text-gray-400 mb-2">Nội dung</label>
              <a-textarea v-model:value="contactForm.message" placeholder="Nhập nội dung tin nhắn" class="contact-textarea" :rows="5" />
            </div>
            
            <a-button type="primary" @click="submitForm" class="bg-gradient-to-r from-pink-500 to-purple-600 border-none font-medium px-6 py-2 h-auto">
              Gửi tin nhắn
            </a-button>
          </div>
        </div>
      </div>
      
      <!-- Bản đồ -->
      <div class="mt-12">
        <div class="bg-[#111] rounded-xl p-6 border border-[#333]">
          <h2 class="text-xl font-medium text-white mb-6">Vị trí của chúng tôi</h2>
          <div class="h-[400px] bg-[#222] rounded-lg overflow-hidden">
            <!-- Placeholder for the map -->
            <div class="h-full flex items-center justify-center text-gray-400">
              <environment-outlined class="text-4xl mr-2" /> Bản đồ vị trí TikTok Shop
            </div>
          </div>
        </div>
      </div>
      
      <!-- FAQs -->
      <div class="mt-12">
        <div class="bg-[#111] rounded-xl p-6 border border-[#333]">
          <h2 class="text-xl font-medium text-white mb-6">Câu hỏi thường gặp</h2>
          
          <a-collapse
            v-model:activeKey="activeKey" 
            :bordered="false"
            class="faqs-collapse"
          >
            <a-collapse-panel v-for="faq in faqs" :key="faq.key" :header="faq.question">
              <p class="text-gray-400">{{ faq.answer }}</p>
            </a-collapse-panel>
          </a-collapse>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { 
  EnvironmentOutlined, 
  PhoneOutlined, 
  MailOutlined, 
  ClockCircleOutlined,
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  YoutubeOutlined
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

// Đối tượng form liên hệ
const contactForm = reactive({
  name: '',
  email: '',
  phone: '',
  subject: 'general',
  message: ''
});

// Danh sách chủ đề
const subjectOptions = [
  { value: 'general', label: 'Thông tin chung' },
  { value: 'support', label: 'Hỗ trợ kỹ thuật' },
  { value: 'billing', label: 'Thanh toán & Đơn hàng' },
  { value: 'partnership', label: 'Hợp tác kinh doanh' },
  { value: 'careers', label: 'Tuyển dụng' },
  { value: 'feedback', label: 'Góp ý & Phản hồi' }
];

// FAQs
const activeKey = ref(['1']);
const faqs = [
  {
    key: '1',
    question: 'Làm thế nào để đăng ký tài khoản TikTok Shop?',
    answer: 'Để đăng ký tài khoản TikTok Shop, bạn cần truy cập vào trang chủ và nhấp vào nút "Đăng ký". Sau đó, điền đầy đủ thông tin cá nhân và làm theo hướng dẫn để hoàn tất quá trình đăng ký.'
  },
  {
    key: '2',
    question: 'Làm thế nào để bắt đầu bán hàng trên TikTok Shop?',
    answer: 'Để bắt đầu bán hàng, bạn cần đăng ký tài khoản người bán, xác thực thông tin, thiết lập cửa hàng và đăng sản phẩm của bạn. Chúng tôi có các hướng dẫn chi tiết và đội ngũ hỗ trợ để giúp bạn trong quá trình này.'
  },
  {
    key: '3',
    question: 'TikTok Shop có hỗ trợ vận chuyển không?',
    answer: 'Có, TikTok Shop hợp tác với nhiều đơn vị vận chuyển uy tín để đảm bảo hàng hóa được giao đến tay khách hàng một cách nhanh chóng và an toàn. Người bán có thể lựa chọn đơn vị vận chuyển phù hợp với nhu cầu của mình.'
  },
  {
    key: '4',
    question: 'Làm thế nào để liên hệ với đội ngũ hỗ trợ?',
    answer: 'Bạn có thể liên hệ với đội ngũ hỗ trợ thông qua form liên hệ trên trang web, gọi điện đến số hotline hoặc gửi email đến địa chỉ hỗ trợ. Đội ngũ của chúng tôi sẽ phản hồi trong thời gian sớm nhất.'
  },
  {
    key: '5',
    question: 'Chính sách hoàn trả và hoàn tiền của TikTok Shop là gì?',
    answer: 'TikTok Shop có chính sách hoàn trả trong vòng 7 ngày kể từ khi nhận hàng nếu sản phẩm không đúng mô tả hoặc có lỗi. Quá trình hoàn tiền sẽ được xử lý trong vòng 3-5 ngày làm việc tùy thuộc vào phương thức thanh toán của bạn.'
  }
];

// Hàm xử lý gửi form
const submitForm = () => {
  // Validate form
  if (!contactForm.name) {
    message.error('Vui lòng nhập họ và tên');
    return;
  }
  
  if (!contactForm.email) {
    message.error('Vui lòng nhập địa chỉ email');
    return;
  }
  
  if (!contactForm.message) {
    message.error('Vui lòng nhập nội dung tin nhắn');
    return;
  }
  
  // Submit form
  message.success('Tin nhắn của bạn đã được gửi thành công!');
  
  // Reset form
  Object.keys(contactForm).forEach(key => {
    if (key !== 'subject') {
      contactForm[key] = '';
    } else {
      contactForm[key] = 'general';
    }
  });
};
</script>

<style scoped>
:deep(.ant-input), 
:deep(.ant-select), 
:deep(.ant-select-selector), 
:deep(.ant-textarea) {
  background-color: #222 !important;
  border-color: #333 !important;
  color: white !important;
}

:deep(.ant-select-dropdown) {
  background-color: #222 !important;
}

:deep(.ant-select-item) {
  color: #d9d9d9 !important;
}

:deep(.ant-select-item-option-selected) {
  background-color: #333 !important;
}

:deep(.ant-select-item-option-active:not(.ant-select-item-option-disabled)) {
  background-color: #444 !important;
}

:deep(.ant-input:focus), 
:deep(.ant-input-focused), 
:deep(.ant-select-focused .ant-select-selector), 
:deep(.ant-textarea:focus), 
:deep(.ant-textarea-focused) {
  border-color: #ec4899 !important;
  box-shadow: 0 0 0 2px rgba(236, 72, 153, 0.2) !important;
}

:deep(.ant-input::placeholder), 
:deep(.ant-textarea::placeholder) {
  color: #555 !important;
}

:deep(.ant-collapse) {
  background-color: transparent !important;
}

:deep(.ant-collapse-item) {
  border-bottom: 1px solid #333 !important;
}

:deep(.ant-collapse-header) {
  color: white !important;
  padding: 16px 0 !important;
}

:deep(.ant-collapse-content) {
  background-color: transparent !important;
  border-top: 1px solid #333 !important;
}

:deep(.ant-collapse-content-box) {
  padding: 16px 0 !important;
}
</style>