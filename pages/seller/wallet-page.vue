<template>
  <div class="min-h-screen bg-black text-white">
    <div class="container mx-auto px-6 py-8">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 class="text-3xl font-bold mb-4 md:mb-0">Ví & Doanh thu</h1>
        <div class="flex items-center space-x-4">
          <a-select v-model:value="timeRange" class="w-32 custom-select">
            <a-select-option value="7days">7 ngày</a-select-option>
            <a-select-option value="30days">30 ngày</a-select-option>
            <a-select-option value="90days">90 ngày</a-select-option>
            <a-select-option value="year">1 năm</a-select-option>
          </a-select>
          <a-button 
            class="!rounded-button border-[#333] text-white font-medium"
            @click="showTransactionHistory"
          >
            <history-outlined />
            Lịch sử giao dịch
          </a-button>
          <a-button 
            type="primary" 
            class="!rounded-button bg-gradient-to-r from-pink-500 to-purple-600 border-none text-white font-medium"
            @click="showWithdrawModal"
          >
            <wallet-outlined />
            Rút tiền
          </a-button>
        </div>
      </div>

      <!-- Balance Overview -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div class="lg:col-span-1 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-xl border border-[#333] hover:border-pink-500/30 transition-colors duration-300 p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-medium">Số dư ví</h2>
            <a-tooltip placement="top" title="Tổng số tiền có sẵn để rút">
              <question-circle-outlined class="text-gray-400" />
            </a-tooltip>
          </div>
          <div class="text-3xl font-bold mb-2">{{ formatCurrency(wallet.balance) }}</div>
          <div class="flex items-center justify-between mb-6">
            <span class="text-gray-400">Chờ giải ngân</span>
            <span class="font-medium">{{ formatCurrency(wallet.pending) }}</span>
          </div>
          <a-button 
            type="primary" 
            block
            class="bg-gradient-to-r from-pink-500 to-purple-600 border-none h-10"
            @click="showWithdrawModal"
          >
            Rút tiền
          </a-button>
        </div>

        <div class="lg:col-span-2">
          <div class="bg-[#121212] rounded-xl border border-[#333] p-6 h-full">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-lg font-medium">Tổng quan doanh thu</h2>
              <a-select v-model:value="revenueView" class="w-40 custom-select">
                <a-select-option value="day">Theo ngày</a-select-option>
                <a-select-option value="week">Theo tuần</a-select-option>
                <a-select-option value="month">Theo tháng</a-select-option>
              </a-select>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div class="bg-[#1a1a1a] rounded-lg p-4">
                <div class="text-gray-400 text-sm mb-1">Doanh thu</div>
                <div class="text-xl font-bold">{{ formatCurrency(revenueStats.total) }}</div>
                <div class="flex items-center mt-1">
                  <span :class="revenueStats.growth >= 0 ? 'text-green-500' : 'text-red-500'">
                    {{ revenueStats.growth >= 0 ? '+' : '' }}{{ revenueStats.growth }}%
                  </span>
                  <span class="text-gray-400 text-xs ml-1">so với kỳ trước</span>
                </div>
              </div>
              <div class="bg-[#1a1a1a] rounded-lg p-4">
                <div class="text-gray-400 text-sm mb-1">Đơn hàng</div>
                <div class="text-xl font-bold">{{ revenueStats.orders }}</div>
                <div class="flex items-center mt-1">
                  <span :class="revenueStats.orderGrowth >= 0 ? 'text-green-500' : 'text-red-500'">
                    {{ revenueStats.orderGrowth >= 0 ? '+' : '' }}{{ revenueStats.orderGrowth }}%
                  </span>
                  <span class="text-gray-400 text-xs ml-1">so với kỳ trước</span>
                </div>
              </div>
              <div class="bg-[#1a1a1a] rounded-lg p-4">
                <div class="text-gray-400 text-sm mb-1">Giá trị trung bình</div>
                <div class="text-xl font-bold">{{ formatCurrency(revenueStats.average) }}</div>
                <div class="flex items-center mt-1">
                  <span :class="revenueStats.averageGrowth >= 0 ? 'text-green-500' : 'text-red-500'">
                    {{ revenueStats.averageGrowth >= 0 ? '+' : '' }}{{ revenueStats.averageGrowth }}%
                  </span>
                  <span class="text-gray-400 text-xs ml-1">so với kỳ trước</span>
                </div>
              </div>
            </div>
            <div class="h-56">
              <!-- Revenue chart component would go here -->
              <div class="w-full h-full flex items-center justify-center text-gray-400">
                <area-chart-outlined class="text-4xl mr-2" />
                <span>Biểu đồ doanh thu theo thời gian</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Revenue Breakdown & Banking Info -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div class="lg:col-span-2 bg-[#121212] rounded-xl border border-[#333] p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-medium">Phân tích doanh thu</h2>
            <a-tooltip placement="top" title="Phân tích doanh thu theo các nguồn khác nhau">
              <question-circle-outlined class="text-gray-400" />
            </a-tooltip>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-base font-medium mb-4">Theo danh mục</h3>
              <div class="space-y-4">
                <div v-for="(category, index) in revenueByCategory" :key="index">
                  <div class="flex justify-between items-center mb-1">
                    <span class="truncate">{{ category.name }}</span>
                    <span class="font-medium">{{ formatCurrency(category.amount) }}</span>
                  </div>
                  <a-progress 
                    :percent="category.percentage" 
                    :stroke-color="category.color"
                    :show-info="false" 
                  />
                </div>
              </div>
            </div>
            <div>
              <h3 class="text-base font-medium mb-4">Theo kênh bán hàng</h3>
              <div class="h-64">
                <!-- Donut chart component would go here -->
                <div class="w-full h-full flex items-center justify-center text-gray-400">
                  <donut-chart-outlined class="text-4xl mr-2" />
                  <span>Biểu đồ doanh thu theo kênh</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1 bg-[#121212] rounded-xl border border-[#333] p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-medium">Thông tin ngân hàng</h2>
            <a-button type="text" class="text-pink-500 p-0" @click="showBankModal">
              <edit-outlined /> Thay đổi
            </a-button>
          </div>
          <div class="space-y-4">
            <div>
              <div class="text-gray-400 mb-1">Ngân hàng</div>
              <div class="font-medium">{{ bankInfo.bankName }}</div>
            </div>
            <div>
              <div class="text-gray-400 mb-1">Tên chủ tài khoản</div>
              <div class="font-medium">{{ bankInfo.accountName }}</div>
            </div>
            <div>
              <div class="text-gray-400 mb-1">Số tài khoản</div>
              <div class="font-medium">{{ maskAccountNumber(bankInfo.accountNumber) }}</div>
            </div>
            <div>
              <div class="text-gray-400 mb-1">Chi nhánh</div>
              <div class="font-medium">{{ bankInfo.branch }}</div>
            </div>
          </div>
          <div class="mt-6 pt-6 border-t border-[#333]">
            <div class="flex items-center justify-between mb-1">
              <span class="text-gray-400">Phí rút tiền:</span>
              <span>{{ withdrawFee }}%</span>
            </div>
            <div class="flex items-center justify-between mb-1">
              <span class="text-gray-400">Thời gian xử lý:</span>
              <span>1-3 ngày làm việc</span>
            </div>
            <a-button 
              type="link" 
              class="p-0 text-pink-500 hover:text-pink-400" 
              @click="showPolicyModal"
            >
              Xem chính sách rút tiền
            </a-button>
          </div>
        </div>
      </div>

      <!-- Recent transactions -->
      <div class="bg-[#121212] rounded-xl border border-[#333] p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-medium">Giao dịch gần đây</h2>
          <a-button type="link" class="p-0 text-pink-500" @click="showTransactionHistory">
            Xem tất cả
          </a-button>
        </div>
        <a-table
          :dataSource="recentTransactions"
          :columns="transactionColumns"
          :pagination="false"
          class="custom-table"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'type'">
              <div class="flex items-center">
                <div 
                  class="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                  :class="getTransactionTypeClass(record.type)"
                >
                  <component :is="getTransactionTypeIcon(record.type)" />
                </div>
                <div>
                  <div class="font-medium">{{ getTransactionTypeText(record.type) }}</div>
                  <div class="text-xs text-gray-400">{{ record.description }}</div>
                </div>
              </div>
            </template>
            <template v-if="column.key === 'amount'">
              <span 
                :class="record.type === 'deposit' ? 'text-green-500' : 'text-pink-500'"
              >
                {{ record.type === 'deposit' ? '+' : '-' }}{{ formatCurrency(record.amount) }}
              </span>
            </template>
            <template v-if="column.key === 'status'">
              <a-tag
                :color="getTransactionStatusColor(record.status)"
              >
                {{ getTransactionStatusText(record.status) }}
              </a-tag>
            </template>
          </template>
        </a-table>
      </div>
    </div>

    <!-- Transaction History Modal -->
    <a-modal
      v-model:visible="transactionModalVisible"
      title="Lịch sử giao dịch"
      width="800px"
      :footer="null"
      class="custom-modal"
    >
      <div class="flex justify-between items-center mb-4">
        <a-radio-group v-model:value="transactionFilter" button-style="solid">
          <a-radio-button value="all">Tất cả</a-radio-button>
          <a-radio-button value="deposit">Thu nhập</a-radio-button>
          <a-radio-button value="withdraw">Rút tiền</a-radio-button>
        </a-radio-group>
        <a-range-picker v-model:value="dateRange" class="custom-date-picker" />
      </div>
      <a-table
        :dataSource="filteredTransactions"
        :columns="transactionColumns"
        :pagination="{ pageSize: 10 }"
        class="custom-table"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'type'">
            <div class="flex items-center">
              <div 
                class="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                :class="getTransactionTypeClass(record.type)"
              >
                <component :is="getTransactionTypeIcon(record.type)" />
              </div>
              <div>
                <div class="font-medium">{{ getTransactionTypeText(record.type) }}</div>
                <div class="text-xs text-gray-400">{{ record.description }}</div>
              </div>
            </div>
          </template>
          <template v-if="column.key === 'amount'">
            <span 
              :class="record.type === 'deposit' ? 'text-green-500' : 'text-pink-500'"
            >
              {{ record.type === 'deposit' ? '+' : '-' }}{{ formatCurrency(record.amount) }}
            </span>
          </template>
          <template v-if="column.key === 'status'">
            <a-tag
              :color="getTransactionStatusColor(record.status)"
            >
              {{ getTransactionStatusText(record.status) }}
            </a-tag>
          </template>
        </template>
      </a-table>
    </a-modal>

    <!-- Withdraw Modal -->
    <a-modal
      v-model:visible="withdrawModalVisible"
      title="Rút tiền về tài khoản ngân hàng"
      :footer="null"
      class="custom-modal"
    >
      <a-form layout="vertical" :model="withdrawForm">
        <a-form-item label="Số dư ví">
          <div class="text-xl font-bold">{{ formatCurrency(wallet.balance) }}</div>
        </a-form-item>
        <a-form-item label="Số tiền rút">
          <a-input-number 
            v-model:value="withdrawForm.amount" 
            :min="50000" 
            :max="wallet.balance" 
            class="w-full" 
            :formatter="value => `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            :parser="value => value.replace(/₫\s?|(,*)/g, '')"
          />
        </a-form-item>
        <div class="mb-4">
          <div class="flex justify-between mb-1">
            <span class="text-gray-400">Phí giao dịch ({{ withdrawFee }}%)</span>
            <span>{{ formatCurrency(calculateFee(withdrawForm.amount)) }}</span>
          </div>
          <div class="flex justify-between font-medium">
            <span>Số tiền thực nhận</span>
            <span>{{ formatCurrency(withdrawForm.amount - calculateFee(withdrawForm.amount)) }}</span>
          </div>
        </div>
        <div class="bg-[#1a1a1a] p-4 rounded-lg mb-4">
          <div class="font-medium mb-2">Thông tin ngân hàng</div>
          <div class="flex justify-between mb-1">
            <span class="text-gray-400">Ngân hàng</span>
            <span>{{ bankInfo.bankName }}</span>
          </div>
          <div class="flex justify-between mb-1">
            <span class="text-gray-400">Tên tài khoản</span>
            <span>{{ bankInfo.accountName }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">Số tài khoản</span>
            <span>{{ maskAccountNumber(bankInfo.accountNumber) }}</span>
          </div>
        </div>
        <div class="flex justify-end gap-2 mt-6">
          <a-button @click="withdrawModalVisible = false">Hủy</a-button>
          <a-button 
            type="primary" 
            class="bg-gradient-to-r from-pink-500 to-purple-600 border-none"
            :disabled="!canWithdraw"
            @click="processWithdraw"
          >
            Xác nhận rút tiền
          </a-button>
        </div>
      </a-form>
    </a-modal>

    <!-- Banking Info Modal -->
    <a-modal
      v-model:visible="bankModalVisible"
      title="Thay đổi thông tin ngân hàng"
      :footer="null"
      class="custom-modal"
    >
      <a-form layout="vertical" :model="bankForm">
        <a-form-item label="Ngân hàng">
          <a-select 
            v-model:value="bankForm.bankName" 
            placeholder="Chọn ngân hàng"
            show-search
            :filter-option="filterOption"
          >
            <a-select-option v-for="bank in bankList" :key="bank.value" :value="bank.value">
              {{ bank.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="Tên chủ tài khoản">
          <a-input v-model:value="bankForm.accountName" placeholder="Nhập tên chủ tài khoản" />
        </a-form-item>
        <a-form-item label="Số tài khoản">
          <a-input v-model:value="bankForm.accountNumber" placeholder="Nhập số tài khoản" />
        </a-form-item>
        <a-form-item label="Chi nhánh">
          <a-input v-model:value="bankForm.branch" placeholder="Nhập chi nhánh ngân hàng (nếu có)" />
        </a-form-item>
        <div class="flex justify-end gap-2 mt-4">
          <a-button @click="bankModalVisible = false">Hủy</a-button>
          <a-button 
            type="primary" 
            class="bg-gradient-to-r from-pink-500 to-purple-600 border-none"
            @click="saveBankInfo"
          >
            Lưu thông tin
          </a-button>
        </div>
      </a-form>
    </a-modal>

    <!-- Policy Modal -->
    <a-modal
      v-model:visible="policyModalVisible"
      title="Chính sách rút tiền"
      :footer="null"
      class="custom-modal"
    >
      <div class="space-y-4">
        <div>
          <h3 class="font-medium mb-2">Thời gian xử lý rút tiền</h3>
          <p>Thời gian xử lý rút tiền là 1-3 ngày làm việc (không tính thứ 7, chủ nhật và các ngày lễ).</p>
        </div>
        <div>
          <h3 class="font-medium mb-2">Phí rút tiền</h3>
          <p>Phí giao dịch rút tiền là {{ withdrawFee }}% trên tổng số tiền rút. Phí này sẽ được trừ trực tiếp vào số tiền rút.</p>
        </div>
        <div>
          <h3 class="font-medium mb-2">Số tiền rút tối thiểu</h3>
          <p>Số tiền rút tối thiểu là 50.000₫ cho mỗi lần giao dịch.</p>
        </div>
        <div>
          <h3 class="font-medium mb-2">Giới hạn rút tiền</h3>
          <p>Giới hạn rút tiền tối đa là 100.000.000₫/ngày và 500.000.000₫/tháng. Nếu bạn cần rút nhiều hơn, vui lòng liên hệ bộ phận hỗ trợ.</p>
        </div>
        <div>
          <h3 class="font-medium mb-2">Thông tin tài khoản</h3>
          <p>Tên chủ tài khoản ngân hàng phải trùng với tên đăng ký tài khoản TikTok Shop. Chúng tôi không chịu trách nhiệm nếu bạn cung cấp thông tin tài khoản sai.</p>
        </div>
      </div>
      <div class="flex justify-end mt-6">
        <a-button 
          type="primary" 
          class="bg-gradient-to-r from-pink-500 to-purple-600 border-none"
          @click="policyModalVisible = false"
        >
          Đã hiểu
        </a-button>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { 
  AreaChartOutlined,
  WalletOutlined,
  HistoryOutlined,
  QuestionCircleOutlined,
  EditOutlined,
  PlusOutlined,
  MinusOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  PieChartOutlined
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

// State
const timeRange = ref('30days');
const revenueView = ref('day');
const transactionFilter = ref('all');
const dateRange = ref(null);

// Modals
const transactionModalVisible = ref(false);
const withdrawModalVisible = ref(false);
const bankModalVisible = ref(false);
const policyModalVisible = ref(false);

// Form data
const withdrawForm = ref({
  amount: 500000,
  note: ''
});

const bankForm = ref({
  bankName: '',
  accountName: '',
  accountNumber: '',
  branch: ''
});

// Mock data
const wallet = ref({
  balance: 15750000,
  pending: 2580000,
  total: 18330000
});

const withdrawFee = 0.5; // 0.5%

const revenueStats = ref({
  total: 23450000,
  growth: 12.5,
  orders: 143,
  orderGrowth: 8.2,
  average: 164000,
  averageGrowth: 3.7
});

const revenueByCategory = [
  { name: 'Điện thoại & Máy tính bảng', amount: 12500000, percentage: 53, color: '#FF2C55' },
  { name: 'Laptop & Máy tính', amount: 5600000, percentage: 24, color: '#36CFC9' },
  { name: 'Thiết bị thông minh', amount: 2800000, percentage: 12, color: '#722ED1' },
  { name: 'Phụ kiện', amount: 2550000, percentage: 11, color: '#F5A623' },
];

const transactionColumns = [
  {
    title: 'Loại giao dịch',
    key: 'type',
  },
  {
    title: 'Ngày',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Số tiền',
    key: 'amount',
  },
  {
    title: 'Trạng thái',
    key: 'status',
  }
];

const transactions = [
  {
    key: '1',
    type: 'deposit',
    description: 'Doanh thu từ đơn hàng #12345',
    date: '12/06/2023',
    amount: 1850000,
    status: 'completed'
  },
  {
    key: '2',
    type: 'withdraw',
    description: 'Rút về Vietcombank',
    date: '10/06/2023',
    amount: 5000000,
    status: 'completed'
  },
  {
    key: '3',
    type: 'deposit',
    description: 'Doanh thu từ đơn hàng #12342',
    date: '08/06/2023',
    amount: 750000,
    status: 'completed'
  },
  {
    key: '4',
    type: 'deposit',
    description: 'Doanh thu từ đơn hàng #12340',
    date: '05/06/2023',
    amount: 1950000,
    status: 'completed'
  },
  {
    key: '5',
    type: 'withdraw',
    description: 'Rút về Techcombank',
    date: '01/06/2023',
    amount: 3500000,
    status: 'completed'
  },
  {
    key: '6',
    type: 'deposit',
    description: 'Doanh thu từ đơn hàng #12335',
    date: '28/05/2023',
    amount: 2580000,
    status: 'pending'
  },
  {
    key: '7',
    type: 'withdraw',
    description: 'Rút về Vietcombank',
    date: '20/05/2023',
    amount: 2000000,
    status: 'failed'
  },
  {
    key: '8',
    type: 'deposit',
    description: 'Doanh thu từ đơn hàng #12330',
    date: '15/05/2023',
    amount: 3420000,
    status: 'completed'
  }
];

const bankInfo = ref({
  bankName: 'Vietcombank',
  accountName: 'NGUYEN VAN A',
  accountNumber: '1234567890123',
  branch: 'TP. Hồ Chí Minh'
});

const bankList = [
  { label: 'Vietcombank - Ngân hàng TMCP Ngoại thương', value: 'Vietcombank' },
  { label: 'Agribank - Ngân hàng Nông nghiệp và Phát triển Nông thôn', value: 'Agribank' },
  { label: 'BIDV - Ngân hàng Đầu tư và Phát triển Việt Nam', value: 'BIDV' },
  { label: 'Vietinbank - Ngân hàng TMCP Công thương', value: 'Vietinbank' },
  { label: 'Techcombank - Ngân hàng TMCP Kỹ thương', value: 'Techcombank' },
  { label: 'MB Bank - Ngân hàng Quân đội', value: 'MB Bank' },
  { label: 'ACB - Ngân hàng TMCP Á Châu', value: 'ACB' },
  { label: 'VPBank - Ngân hàng TMCP Việt Nam Thịnh Vượng', value: 'VPBank' },
  { label: 'TPBank - Ngân hàng TMCP Tiên Phong', value: 'TPBank' },
  { label: 'SHB - Ngân hàng TMCP Sài Gòn - Hà Nội', value: 'SHB' },
  { label: 'OCB - Ngân hàng TMCP Phương Đông', value: 'OCB' },
  { label: 'Sacombank - Ngân hàng TMCP Sài Gòn Thương Tín', value: 'Sacombank' },
  { label: 'HDBank - Ngân hàng TMCP Phát triển TP.HCM', value: 'HDBank' },
  { label: 'VIB - Ngân hàng TMCP Quốc tế Việt Nam', value: 'VIB' },
];

// Computed
const recentTransactions = computed(() => {
  return transactions.slice(0, 5);
});

const filteredTransactions = computed(() => {
  let result = [...transactions];
  
  if (transactionFilter.value !== 'all') {
    result = result.filter(transaction => transaction.type === transactionFilter.value);
  }
  
  if (dateRange.value) {
    // Filter by date range (simplified for mock data)
    // In real implementation, you would compare actual date objects
  }
  
  return result;
});

const canWithdraw = computed(() => {
  return withdrawForm.value.amount >= 50000 && withdrawForm.value.amount <= wallet.value.balance;
});

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount);
};

const calculateFee = (amount) => {
  return Math.round(amount * withdrawFee / 100);
};

const maskAccountNumber = (number) => {
  if (!number) return '';
  const len = number.length;
  if (len <= 8) return number;
  return number.substring(0, 4) + '*'.repeat(len - 8) + number.substring(len - 4);
};

const getTransactionTypeText = (type) => {
  switch (type) {
    case 'deposit': return 'Doanh thu';
    case 'withdraw': return 'Rút tiền';
    default: return type;
  }
};

const getTransactionTypeIcon = (type) => {
  switch (type) {
    case 'deposit': return PlusOutlined;
    case 'withdraw': return MinusOutlined;
    default: return DollarOutlined;
  }
};

const getTransactionTypeClass = (type) => {
  switch (type) {
    case 'deposit': return 'bg-green-500/20 text-green-500';
    case 'withdraw': return 'bg-pink-500/20 text-pink-500';
    default: return 'bg-blue-500/20 text-blue-500';
  }
};

const getTransactionStatusText = (status) => {
  switch (status) {
    case 'completed': return 'Hoàn thành';
    case 'pending': return 'Đang xử lý';
    case 'failed': return 'Thất bại';
    default: return status;
  }
};

const getTransactionStatusColor = (status) => {
  switch (status) {
    case 'completed': return 'green';
    case 'pending': return 'blue';
    case 'failed': return 'red';
    default: return 'default';
  }
};

const showTransactionHistory = () => {
  transactionModalVisible.value = true;
};

const showWithdrawModal = () => {
  withdrawForm.value.amount = 500000;
  withdrawModalVisible.value = true;
};

const showBankModal = () => {
  bankForm.value = { ...bankInfo.value };
  bankModalVisible.value = true;
};

const showPolicyModal = () => {
  policyModalVisible.value = true;
};

const processWithdraw = () => {
  // In real implementation, this would make an API call to process the withdrawal
  if (canWithdraw.value) {
    message.success('Yêu cầu rút tiền đã được gửi thành công');
    // Simulate withdrawal by reducing balance
    wallet.value.balance -= withdrawForm.value.amount;
    
    // Add transaction
    const newTransaction = {
      key: String(transactions.length + 1),
      type: 'withdraw',
      description: `Rút về ${bankInfo.value.bankName}`,
      date: new Date().toLocaleDateString('vi-VN'),
      amount: withdrawForm.value.amount,
      status: 'pending'
    };
    transactions.unshift(newTransaction);
    
    withdrawModalVisible.value = false;
  } else {
    message.error('Không thể thực hiện rút tiền. Vui lòng kiểm tra lại số tiền rút.');
  }
};

const saveBankInfo = () => {
  // Validate bank info
  if (!bankForm.value.bankName || !bankForm.value.accountName || !bankForm.value.accountNumber) {
    message.error('Vui lòng điền đầy đủ thông tin ngân hàng');
    return;
  }

  // Save bank info
  bankInfo.value = { ...bankForm.value };
  message.success('Thông tin ngân hàng đã được cập nhật');
  bankModalVisible.value = false;
};

const filterOption = (input, option) => {
  return option.children[0].toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

// Lifecycle hooks
onMounted(() => {
  // In real implementation, fetch wallet data, transactions, etc.
  console.log('Wallet page mounted');
});

// Donut chart data
const DonutChartOutlined = {
  functional: true,
  render(h) {
    return h(PieChartOutlined);
  }
};
</script>

<style scoped>
:deep(.ant-select-selector), 
:deep(.ant-input), 
:deep(.ant-input-number),
:deep(.ant-picker) {
  background-color: #222 !important;
  border-color: #333 !important;
  color: white !important;
}

:deep(.ant-select-selection-item) {
  color: white !important;
}

:deep(.ant-table) {
  background-color: transparent !important;
  color: white !important;
}

:deep(.ant-table-thead > tr > th) {
  background-color: #1a1a1a !important;
  color: #d9d9d9 !important;
  border-bottom: 1px solid #333 !important;
}

:deep(.ant-table-tbody > tr > td) {
  border-bottom: 1px solid #333 !important;
}

:deep(.ant-table-tbody > tr:hover > td) {
  background-color: #222 !important;
}

:deep(.ant-pagination-item),
:deep(.ant-pagination-prev .ant-pagination-item-link),
:deep(.ant-pagination-next .ant-pagination-item-link) {
  background-color: #222 !important;
  border-color: #333 !important;
}

:deep(.ant-pagination-item-active) {
  border-color: #ec4899 !important;
}

:deep(.ant-pagination-item a),
:deep(.ant-pagination-prev .ant-pagination-item-link),
:deep(.ant-pagination-next .ant-pagination-item-link) {
  color: #d9d9d9 !important;
}

:deep(.ant-pagination-item-active a) {
  color: #ec4899 !important;
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

:deep(.ant-progress-inner) {
  background-color: #333 !important;
}

:deep(.ant-tag) {
  border: none;
}

:deep(.ant-radio-button-wrapper) {
  background: #222;
  border-color: #333;
  color: #d9d9d9;
}

:deep(.ant-radio-button-wrapper:not(:first-child)::before) {
  background-color: #333;
}

:deep(.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)) {
  color: white;
  background: #ec4899;
  border-color: #ec4899;
}

:deep(.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)::before) {
  background-color: #ec4899;
}

:deep(.ant-input-number-handler-wrap) {
  background-color: #1a1a1a;
  border-color: #333;
}

:deep(.ant-input-number-handler) {
  border-color: #333;
}

:deep(.ant-input-number-handler-up-inner),
:deep(.ant-input-number-handler-down-inner) {
  color: #d9d9d9;
}
</style>