<template>
  <div class="min-h-screen bg-black text-white">
    <div class="container mx-auto px-6 py-8">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 class="text-3xl font-bold mb-4 md:mb-0">Thông báo</h1>
        <div class="flex items-center space-x-4">
          <a-select v-model:value="filterType" class="w-48 custom-select">
            <a-select-option value="all">Tất cả thông báo</a-select-option>
            <a-select-option value="order">Đơn hàng</a-select-option>
            <a-select-option value="review">Đánh giá & Bình luận</a-select-option>
            <a-select-option value="system">Hệ thống</a-select-option>
            <a-select-option value="promotion">Khuyến mãi</a-select-option>
          </a-select>
          <a-button
            type="primary"
            class="!rounded-button bg-gradient-to-r from-pink-500 to-purple-600 border-none text-white font-medium"
            @click="markAllAsRead"
            :disabled="!hasUnreadNotifications"
          >
            <check-outlined />
            Đánh dấu tất cả là đã đọc
          </a-button>
        </div>
      </div>

      <!-- Notifications List -->
      <div class="bg-[#121212] rounded-xl border border-[#333] overflow-hidden">
        <!-- Empty state -->
        <div v-if="filteredNotifications.length === 0" class="flex flex-col items-center justify-center py-16">
          <bell-outlined class="text-6xl text-gray-500 mb-4" />
          <p class="text-gray-400">Bạn không có thông báo nào</p>
        </div>

        <!-- Notifications -->
        <div v-else>
          <div v-for="(notification, index) in filteredNotifications" 
               :key="notification.id" 
               :class="[
                 'p-6 border-b border-[#333] transition-colors duration-200 hover:bg-[#1a1a1a] cursor-pointer',
                 notification.read ? 'opacity-70' : 'bg-[#1a1a1a]/30'
               ]"
               @click="handleNotificationClick(notification)">
            <div class="flex">
              <div class="mr-4">
                <div :class="[
                  'w-12 h-12 rounded-full flex items-center justify-center',
                  getIconBackgroundClass(notification.type)
                ]">
                  <component :is="getIconComponent(notification.type)" class="text-xl" />
                </div>
              </div>
              <div class="flex-grow">
                <div class="flex justify-between items-start mb-1">
                  <h3 class="font-medium" :class="{'font-bold': !notification.read}">{{ notification.title }}</h3>
                  <div class="flex items-center">
                    <span v-if="!notification.read" class="w-3 h-3 rounded-full bg-pink-500 mr-2"></span>
                    <span class="text-sm text-gray-400">{{ formatTime(notification.timestamp) }}</span>
                  </div>
                </div>
                <p class="text-gray-300 mb-2">{{ notification.content }}</p>
                
                <!-- Order notification -->
                <div v-if="notification.type === 'order' && notification.order" 
                     class="bg-[#222] rounded p-3 mt-2 border-l-4"
                     :class="getBorderClass(notification.order.status)">
                  <div class="flex justify-between mb-1">
                    <span class="text-sm font-medium">Đơn hàng: #{{ notification.order.id }}</span>
                    <a-tag :color="getStatusColor(notification.order.status)">
                      {{ getStatusText(notification.order.status) }}
                    </a-tag>
                  </div>
                  <div class="text-sm text-gray-400">{{ notification.order.customer }}</div>
                  <div class="flex justify-between items-center mt-2">
                    <span class="font-medium">{{ formatCurrency(notification.order.total) }}</span>
                    <a-button type="link" size="small" class="text-pink-500 p-0" @click.stop="viewOrder(notification.order.id)">
                      Xem chi tiết
                    </a-button>
                  </div>
                </div>
                
                <!-- Review notification -->
                <div v-if="notification.type === 'review' && notification.review" 
                     class="bg-[#222] rounded p-3 mt-2">
                  <div class="flex justify-between mb-1">
                    <span class="text-sm font-medium">{{ notification.review.productName }}</span>
                    <div class="flex">
                      <star-filled v-for="i in notification.review.rating" :key="i" class="text-yellow-400 text-xs mr-0.5" />
                    </div>
                  </div>
                  <div class="text-sm text-gray-400 mb-2">{{ notification.review.comment }}</div>
                  <div class="flex justify-between items-center mt-2">
                    <span class="text-xs text-gray-500">Bởi: {{ notification.review.customer }}</span>
                    <div class="space-x-2">
                      <a-button type="link" size="small" class="text-pink-500 p-0" @click.stop="viewReview(notification.review.id)">
                        Xem chi tiết
                      </a-button>
                      <a-button type="link" size="small" class="text-green-500 p-0" @click.stop="replyToReview(notification.review.id)">
                        Trả lời
                      </a-button>
                    </div>
                  </div>
                </div>
                
                <!-- System notification with action -->
                <div v-if="notification.action" class="mt-3">
                  <a-button
                    type="primary"
                    size="small"
                    class="bg-gradient-to-r from-pink-500 to-purple-600 border-none"
                    @click.stop="handleAction(notification)"
                  >
                    {{ notification.action.text }}
                  </a-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Load More -->
      <div v-if="hasMoreNotifications" class="text-center mt-6">
        <a-button @click="loadMoreNotifications" :loading="isLoading">
          Tải thêm thông báo
        </a-button>
      </div>
    </div>

    <!-- Notification Settings Modal -->
    <a-modal
      v-model:visible="settingsModalVisible"
      title="Cài đặt thông báo"
      :footer="null"
      class="custom-modal"
    >
      <div>
        <p class="mb-4">Chọn loại thông báo bạn muốn nhận:</p>
        
        <a-form layout="vertical">
          <a-form-item>
            <a-checkbox v-model:checked="notificationSettings.orders">
              Thông báo đơn hàng
            </a-checkbox>
            <div class="text-xs text-gray-400 ml-6">Thông báo khi có đơn hàng mới hoặc cập nhật trạng thái đơn hàng</div>
          </a-form-item>
          
          <a-form-item>
            <a-checkbox v-model:checked="notificationSettings.reviews">
              Đánh giá và bình luận
            </a-checkbox>
            <div class="text-xs text-gray-400 ml-6">Thông báo khi có đánh giá mới hoặc bình luận về sản phẩm</div>
          </a-form-item>
          
          <a-form-item>
            <a-checkbox v-model:checked="notificationSettings.system">
              Thông báo hệ thống
            </a-checkbox>
            <div class="text-xs text-gray-400 ml-6">Cập nhật hệ thống, bảo trì và thay đổi chính sách</div>
          </a-form-item>
          
          <a-form-item>
            <a-checkbox v-model:checked="notificationSettings.promotions">
              Khuyến mãi và sự kiện
            </a-checkbox>
            <div class="text-xs text-gray-400 ml-6">Thông báo về chương trình khuyến mãi và sự kiện đặc biệt</div>
          </a-form-item>
          
          <div class="mt-4 pt-4 border-t border-[#333]">
            <p class="mb-2">Phương thức nhận thông báo:</p>
            
            <a-form-item>
              <a-checkbox v-model:checked="notificationSettings.inApp">
                Thông báo trong ứng dụng
              </a-checkbox>
            </a-form-item>
            
            <a-form-item>
              <a-checkbox v-model:checked="notificationSettings.email">
                Email
              </a-checkbox>
              <div class="text-xs text-gray-400 ml-6">nguyenvana@example.com</div>
            </a-form-item>
            
            <a-form-item>
              <a-checkbox v-model:checked="notificationSettings.sms">
                SMS
              </a-checkbox>
              <div class="text-xs text-gray-400 ml-6">0987654321</div>
            </a-form-item>
          </div>
        </a-form>
        
        <div class="flex justify-end mt-6 gap-2">
          <a-button @click="settingsModalVisible = false">Hủy</a-button>
          <a-button 
            type="primary"
            class="bg-gradient-to-r from-pink-500 to-purple-600 border-none"
            @click="saveNotificationSettings"
          >
            Lưu cài đặt
          </a-button>
        </div>
      </div>
    </a-modal>

    <!-- Reply to Review Modal -->
    <a-modal
      v-model:visible="replyModalVisible"
      title="Trả lời đánh giá"
      :footer="null"
      class="custom-modal"
    >
      <div v-if="selectedReview">
        <div class="bg-[#1a1a1a] p-4 rounded mb-4">
          <div class="flex justify-between mb-1">
            <span class="font-medium">{{ selectedReview.customer }}</span>
            <div class="flex">
              <star-filled v-for="i in selectedReview.rating" :key="i" class="text-yellow-400 text-xs mr-0.5" />
            </div>
          </div>
          <p class="text-gray-300 text-sm">{{ selectedReview.comment }}</p>
          <div class="text-xs text-gray-500 mt-1">{{ formatDate(selectedReview.date) }}</div>
        </div>
        
        <a-form layout="vertical">
          <a-form-item label="Trả lời của bạn">
            <a-textarea 
              v-model:value="replyText" 
              :rows="4" 
              placeholder="Nhập nội dung trả lời... (Trả lời lịch sự và cảm ơn khách hàng)" 
            />
          </a-form-item>
        </a-form>
        
        <div class="flex justify-end mt-4 gap-2">
          <a-button @click="replyModalVisible = false">Hủy</a-button>
          <a-button 
            type="primary"
            class="bg-gradient-to-r from-pink-500 to-purple-600 border-none"
            @click="submitReply"
            :disabled="!replyText.trim()"
          >
            Gửi phản hồi
          </a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { 
  BellOutlined, 
  CheckOutlined,
  ShoppingOutlined,
  StarOutlined,
  StarFilled,
  NotificationOutlined,
  GiftOutlined,
  SettingOutlined,
  MessageOutlined
} from '@ant-design/icons-vue';

// State
const notifications = ref([]);
const filterType = ref('all');
const isLoading = ref(false);
const page = ref(1);
const hasMoreNotifications = ref(true);

// Modals
const settingsModalVisible = ref(false);
const replyModalVisible = ref(false);
const selectedReview = ref(null);
const replyText = ref('');

// Notification settings
const notificationSettings = ref({
  orders: true,
  reviews: true,
  system: true,
  promotions: false,
  inApp: true,
  email: true,
  sms: false
});

// Mock notifications data
const mockNotifications = [
  {
    id: 1,
    type: 'order',
    title: 'Đơn hàng mới',
    content: 'Bạn có đơn hàng mới cần xác nhận.',
    timestamp: new Date(2023, 5, 15, 9, 30),
    read: false,
    order: {
      id: 'TT-20230615-001',
      status: 'pending',
      customer: 'Nguyễn Văn A',
      total: 28990000
    }
  },
  {
    id: 2,
    type: 'review',
    title: 'Đánh giá mới cho sản phẩm',
    content: 'Khách hàng vừa thêm đánh giá cho sản phẩm của bạn.',
    timestamp: new Date(2023, 5, 14, 17, 45),
    read: false,
    review: {
      id: 'R001',
      productName: 'iPhone 14 Pro Max 256GB',
      rating: 4,
      comment: 'Sản phẩm rất tốt, giao hàng nhanh. Chỉ tiếc là pin không được lâu như mong đợi.',
      customer: 'Trần Thị B',
      date: new Date(2023, 5, 14)
    }
  },
  {
    id: 3,
    type: 'system',
    title: 'Cập nhật chính sách vận chuyển',
    content: 'TikTok Shop đã cập nhật chính sách vận chuyển mới, có hiệu lực từ 20/06/2023.',
    timestamp: new Date(2023, 5, 13, 10, 15),
    read: true,
    action: {
      text: 'Xem chi tiết',
      url: '/policies/shipping'
    }
  },
  {
    id: 4,
    type: 'promotion',
    title: 'Sự kiện Flash Sale sắp tới',
    content: 'Đăng ký tham gia sự kiện Flash Sale tháng 6 để tăng doanh số bán hàng.',
    timestamp: new Date(2023, 5, 12, 14, 0),
    read: true,
    action: {
      text: 'Đăng ký ngay',
      url: '/promotions/flash-sale'
    }
  },
  {
    id: 5,
    type: 'order',
    title: 'Đơn hàng đã được giao',
    content: 'Đơn hàng #TT-20230610-015 đã được giao thành công.',
    timestamp: new Date(2023, 5, 10, 15, 20),
    read: true,
    order: {
      id: 'TT-20230610-015',
      status: 'completed',
      customer: 'Lê Văn C',
      total: 12500000
    }
  },
  {
    id: 6,
    type: 'system',
    title: 'Bảo trì hệ thống',
    content: 'Hệ thống sẽ được bảo trì vào ngày 18/06/2023 từ 02:00 - 04:00 sáng.',
    timestamp: new Date(2023, 5, 9, 8, 0),
    read: true
  },
  {
    id: 7,
    type: 'review',
    title: 'Phản hồi đánh giá',
    content: 'Khách hàng Phạm Thị D đã phản hồi bình luận của bạn.',
    timestamp: new Date(2023, 5, 8, 19, 15),
    read: true,
    review: {
      id: 'R002',
      productName: 'Samsung Galaxy S22 Ultra',
      rating: 5,
      comment: 'Cảm ơn shop đã tư vấn rất nhiệt tình. Sản phẩm tuyệt vời!',
      customer: 'Phạm Thị D',
      date: new Date(2023, 5, 8)
    }
  },
  {
    id: 8,
    type: 'order',
    title: 'Yêu cầu hủy đơn hàng',
    content: 'Khách hàng yêu cầu hủy đơn hàng #TT-20230607-042.',
    timestamp: new Date(2023, 5, 7, 20, 30),
    read: true,
    order: {
      id: 'TT-20230607-042',
      status: 'cancelled',
      customer: 'Hoàng Văn E',
      total: 8990000
    }
  },
  {
    id: 9,
    type: 'promotion',
    title: 'Ưu đãi cho người bán mới',
    content: 'Nhận ưu đãi phí hoa hồng 0% cho 50 đơn hàng đầu tiên.',
    timestamp: new Date(2023, 5, 5, 9, 0),
    read: true
  },
  {
    id: 10,
    type: 'system',
    title: 'Xác thực tài khoản',
    content: 'Vui lòng hoàn thành xác thực danh tính để mở khóa tất cả tính năng của người bán.',
    timestamp: new Date(2023, 5, 1, 12, 45),
    read: false,
    action: {
      text: 'Xác thực ngay',
      url: '/account/verification'
    }
  }
];

// Load initial notifications
onMounted(() => {
  loadNotifications();
});

// Load notifications
const loadNotifications = () => {
  notifications.value = mockNotifications;
};

// Load more notifications
const loadMoreNotifications = () => {
  isLoading.value = true;
  
  // Simulate API call
  setTimeout(() => {
    // In a real app, this would be replaced with an API call
    // For demo purposes, we just disable the load more button
    hasMoreNotifications.value = false;
    isLoading.value = false;
    message.info('Đã tải tất cả thông báo');
  }, 1000);
};

// Filtered notifications based on type
const filteredNotifications = computed(() => {
  if (filterType.value === 'all') {
    return notifications.value;
  }
  return notifications.value.filter(notification => notification.type === filterType.value);
});

// Check if there are any unread notifications
const hasUnreadNotifications = computed(() => {
  return notifications.value.some(notification => !notification.read);
});

// Format timestamp to relative time
const formatTime = (timestamp) => {
  const now = new Date();
  const diff = Math.floor((now - timestamp) / 1000); // seconds
  
  if (diff < 60) {
    return 'Vừa xong';
  } else if (diff < 3600) {
    return `${Math.floor(diff / 60)} phút trước`;
  } else if (diff < 86400) {
    return `${Math.floor(diff / 3600)} giờ trước`;
  } else if (diff < 604800) {
    return `${Math.floor(diff / 86400)} ngày trước`;
  } else {
    return timestamp.toLocaleDateString('vi-VN');
  }
};

// Format date
const formatDate = (date) => {
  return date.toLocaleDateString('vi-VN');
};

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount);
};

// Get icon component based on notification type
const getIconComponent = (type) => {
  switch (type) {
    case 'order':
      return ShoppingOutlined;
    case 'review':
      return StarOutlined;
    case 'promotion':
      return GiftOutlined;
    case 'system':
    default:
      return NotificationOutlined;
  }
};

// Get icon background class based on notification type
const getIconBackgroundClass = (type) => {
  switch (type) {
    case 'order':
      return 'bg-blue-500/20 text-blue-500';
    case 'review':
      return 'bg-yellow-500/20 text-yellow-500';
    case 'promotion':
      return 'bg-green-500/20 text-green-500';
    case 'system':
    default:
      return 'bg-pink-500/20 text-pink-500';
  }
};

// Get border class based on order status
const getBorderClass = (status) => {
  switch (status) {
    case 'pending':
      return 'border-yellow-500';
    case 'processing':
    case 'confirmed':
      return 'border-blue-500';
    case 'shipping':
      return 'border-cyan-500';
    case 'completed':
      return 'border-green-500';
    case 'cancelled':
      return 'border-gray-500';
    case 'refund':
      return 'border-red-500';
    default:
      return 'border-gray-500';
  }
};

// Get status color
const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'gold';
    case 'confirmed':
    case 'processing':
      return 'blue';
    case 'shipping':
      return 'processing';
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'default';
    case 'refund':
      return 'error';
    default:
      return 'default';
  }
};

// Get status text
const getStatusText = (status) => {
  switch (status) {
    case 'pending':
      return 'Chờ xác nhận';
    case 'confirmed':
      return 'Đã xác nhận';
    case 'processing':
      return 'Đang xử lý';
    case 'shipping':
      return 'Đang giao hàng';
    case 'completed':
      return 'Đã giao hàng';
    case 'cancelled':
      return 'Đã hủy';
    case 'refund':
      return 'Hoàn tiền';
    default:
      return status;
  }
};

// Handle notification click
const handleNotificationClick = (notification) => {
  // Mark as read if not already
  if (!notification.read) {
    notification.read = true;
  }
  
  // Handle different notification types
  switch (notification.type) {
    case 'order':
      if (notification.order) {
        viewOrder(notification.order.id);
      }
      break;
    case 'review':
      if (notification.review) {
        viewReview(notification.review.id);
      }
      break;
    case 'system':
    case 'promotion':
      if (notification.action && notification.action.url) {
        // Navigate to the action URL
        console.log('Navigate to:', notification.action.url);
      }
      break;
    default:
      break;
  }
};

// View order details
const viewOrder = (orderId) => {
  message.info(`Xem chi tiết đơn hàng #${orderId}`);
  // In a real app, this would navigate to order detail page
  // router.push(`/seller/orders/${orderId}`);
};

// View review details
const viewReview = (reviewId) => {
  message.info(`Xem chi tiết đánh giá #${reviewId}`);
  // In a real app, this would navigate to review detail page
  // router.push(`/seller/reviews/${reviewId}`);
};

// Reply to review
const replyToReview = (reviewId) => {
  // Find the review
  const notification = notifications.value.find(
    n => n.type === 'review' && n.review && n.review.id === reviewId
  );
  
  if (notification && notification.review) {
    selectedReview.value = notification.review;
    replyText.value = '';
    replyModalVisible.value = true;
  }
};

// Submit reply to review
const submitReply = () => {
  if (!selectedReview.value || !replyText.value.trim()) return;
  
  message.success('Phản hồi của bạn đã được gửi thành công');
  replyModalVisible.value = false;
  
  // In a real app, this would send the reply to the API
};

// Handle notification action
const handleAction = (notification) => {
  if (notification.action && notification.action.url) {
    console.log('Navigate to:', notification.action.url);
    // In a real app, this would navigate to the action URL
    // router.push(notification.action.url);
  }
};

// Mark all notifications as read
const markAllAsRead = () => {
  notifications.value.forEach(notification => {
    notification.read = true;
  });
  
  message.success('Đã đánh dấu tất cả thông báo là đã đọc');
};

// Open notification settings
const openNotificationSettings = () => {
  settingsModalVisible.value = true;
};

// Save notification settings
const saveNotificationSettings = () => {
  settingsModalVisible.value = false;
  message.success('Đã lưu cài đặt thông báo');
  
  // In a real app, this would update the settings on the server
};
</script>

<style scoped>
:deep(.ant-select-selector), 
:deep(.ant-input), 
:deep(.ant-textarea) {
  background-color: #222 !important;
  border-color: #333 !important;
  color: white !important;
}

:deep(.ant-select-selection-item) {
  color: white !important;
}

:deep(.ant-modal-content),
:deep(.ant-modal-header) {
  background-color: #121212 !important;
}

:deep(.ant-modal-title),
:deep(.ant-form-item-label > label) {
  color: white !important;
}

:deep(.ant-modal-close-x) {
  color: #d9d9d9 !important;
}

:deep(.ant-checkbox-wrapper) {
  color: #d9d9d9 !important;
}

:deep(.ant-checkbox-checked .ant-checkbox-inner) {
  background-color: #ec4899 !important;
  border-color: #ec4899 !important;
}

:deep(.ant-tag) {
  border: none;
}
</style>