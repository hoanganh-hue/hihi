<template>
  <div class="category-detail">
    <!-- Banner đặc trưng của danh mục -->
    <div class="rounded-xl overflow-hidden mb-8">
      <img :src="categoryBanner" :alt="categoryData.name" class="w-full h-48 md:h-64 object-cover" />
      
      <!-- Overlay với tiêu đề danh mục -->
      <div class="relative">
        <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
        <div class="absolute bottom-0 left-0 p-4 md:p-6">
          <h1 class="text-2xl md:text-3xl font-bold text-white">{{ categoryData.name }}</h1>
          <p class="text-gray-200 mt-2">{{ categoryData.description }}</p>
        </div>
      </div>
    </div>

    <!-- Đặc trưng của danh mục -->
    <div class="mb-8" v-if="categoryData.features && categoryData.features.length > 0">
      <h2 class="text-xl font-semibold mb-4">Đặc điểm nổi bật</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="(feature, index) in categoryData.features" :key="index" 
          class="bg-[#1a1a1a] p-4 rounded-lg border border-[#333] flex items-start">
          <component :is="feature.icon" class="text-pink-500 mr-3 text-xl mt-1" />
          <div>
            <h3 class="font-medium">{{ feature.title }}</h3>
            <p class="text-gray-400 text-sm">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Thương hiệu nổi bật -->
    <div class="mb-8" v-if="categoryData.brands && categoryData.brands.length > 0">
      <h2 class="text-xl font-semibold mb-4">Thương hiệu nổi bật</h2>
      <div class="flex flex-wrap gap-4">
        <div v-for="(brand, index) in categoryData.brands" :key="index"
          class="bg-[#1a1a1a] py-2 px-4 rounded-lg border border-[#333] hover:border-pink-500 transition-colors duration-300 cursor-pointer">
          <span>{{ brand }}</span>
        </div>
      </div>
    </div>
    
    <!-- Danh mục phụ -->
    <div class="mb-8" v-if="categoryData.subcategories && categoryData.subcategories.length > 0">
      <h2 class="text-xl font-semibold mb-4">Danh mục phụ</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div v-for="(subcategory, index) in categoryData.subcategories" :key="index"
          class="bg-[#1a1a1a] rounded-lg border border-[#333] overflow-hidden group hover:border-pink-500 transition-all duration-300 cursor-pointer"
          @click="$emit('select-subcategory', subcategory.id)">
          <div class="h-32 bg-[#222] flex items-center justify-center">
            <img v-if="subcategory.image" :src="subcategory.image" :alt="subcategory.name" class="h-24 w-auto object-contain" />
            <component v-else :is="subcategory.icon || 'TagOutlined'" class="text-4xl text-gray-400" />
          </div>
          <div class="p-3 text-center">
            <h3 class="font-medium group-hover:text-pink-500 transition-colors duration-300">{{ subcategory.name }}</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import {
  MobileOutlined,
  GiftOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  SkinOutlined,
  CreditCardOutlined,
  LaptopOutlined,
  GoldOutlined,
  ShoppingOutlined,
  TagOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  StarOutlined,
  ToolOutlined,
  HeartOutlined,
  FireOutlined,
  DollarOutlined
} from '@ant-design/icons-vue';

const props = defineProps({
  slug: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['select-subcategory']);

// Dữ liệu chi tiết cho từng danh mục
const categoryDetailsMap = ref({
  'dien-thoai': {
    name: 'Điện thoại',
    description: 'Khám phá các dòng điện thoại thông minh mới nhất với công nghệ hiện đại',
    image: '/images/dien-thoai/category-image.png',
    features: [
      { title: 'Công nghệ tiên tiến', description: 'Chip xử lý mới nhất, AI tích hợp', icon: ThunderboltOutlined },
      { title: 'Camera chất lượng cao', description: 'Chụp ảnh sắc nét trong mọi điều kiện', icon: StarOutlined },
      { title: 'Pin dung lượng lớn', description: 'Sử dụng cả ngày không lo hết pin', icon: RocketOutlined }
    ],
    brands: ['Samsung', 'Apple', 'Xiaomi', 'Oppo', 'Vivo', 'Realme', 'Nokia', 'OnePlus'],
    subcategories: [
      { id: 'dt-cao-cap', name: 'Điện thoại cao cấp', icon: MobileOutlined },
      { id: 'dt-tam-trung', name: 'Điện thoại tầm trung', icon: MobileOutlined },
      { id: 'dt-gia-re', name: 'Điện thoại giá rẻ', icon: MobileOutlined },
      { id: 'dt-gaming', name: 'Điện thoại gaming', icon: MobileOutlined }
    ]
  },
  'do-choi-me-be': {
    name: 'Đồ chơi - Mẹ & Bé',
    description: 'Sản phẩm an toàn và chất lượng cho bé yêu của bạn',
    image: '/images/do_choi-me_be/category-image.png',
    features: [
      { title: 'Chất liệu an toàn', description: 'Không chứa BPA, chất liệu thân thiện với trẻ em', icon: SafetyCertificateOutlined },
      { title: 'Phát triển kỹ năng', description: 'Kích thích sự phát triển trí tuệ và vận động', icon: RocketOutlined },
      { title: 'Đa dạng lứa tuổi', description: 'Phù hợp cho nhiều giai đoạn phát triển', icon: HeartOutlined }
    ],
    brands: ['Fisher-Price', 'Lego', 'Chicco', 'Pigeon', 'Baby Einstein', 'Huggies', 'Pampers'],
    subcategories: [
      { id: 'do-choi-0-3', name: 'Đồ chơi 0-3 tuổi', icon: GiftOutlined },
      { id: 'do-choi-3-6', name: 'Đồ chơi 3-6 tuổi', icon: GiftOutlined },
      { id: 'ta-sua', name: 'Tã & Sữa', icon: GiftOutlined },
      { id: 'quan-ao-be', name: 'Quần áo trẻ em', icon: GiftOutlined }
    ]
  },
  'dong-ho': {
    name: 'Đồng hồ',
    description: 'Bộ sưu tập đồng hồ cao cấp và thời trang cho mọi dịp',
    image: '/images/dong-ho/category-image.png',
    features: [
      { title: 'Thiết kế sang trọng', description: 'Mẫu mã đa dạng từ cổ điển đến hiện đại', icon: StarOutlined },
      { title: 'Chất liệu cao cấp', description: 'Thép không gỉ, kính sapphire chống xước', icon: SafetyCertificateOutlined },
      { title: 'Chống nước', description: 'An toàn trong mọi điều kiện thời tiết', icon: ThunderboltOutlined }
    ],
    brands: ['Rolex', 'Omega', 'Seiko', 'Citizen', 'Casio', 'Fossil', 'Apple', 'Garmin'],
    subcategories: [
      { id: 'dong-ho-cao-cap', name: 'Đồng hồ cao cấp', icon: ClockCircleOutlined },
      { id: 'dong-ho-thoi-trang', name: 'Đồng hồ thời trang', icon: ClockCircleOutlined },
      { id: 'dong-ho-thong-minh', name: 'Đồng hồ thông minh', icon: ClockCircleOutlined },
      { id: 'phu-kien-dong-ho', name: 'Phụ kiện đồng hồ', icon: ClockCircleOutlined }
    ]
  },
  'dung-cu-the-thao': {
    name: 'Dụng cụ thể thao',
    description: 'Thiết bị và phụ kiện cho mọi môn thể thao yêu thích',
    image: '/images/dung-cu-the-thao/category-image.png',
    features: [
      { title: 'Chất lượng cao', description: 'Vật liệu bền bỉ, chịu lực tốt', icon: SafetyCertificateOutlined },
      { title: 'Đa dạng môn thể thao', description: 'Từ thể thao trong nhà đến ngoài trời', icon: FireOutlined },
      { title: 'Công nghệ hiện đại', description: 'Ứng dụng khoa học kỹ thuật tiên tiến', icon: ThunderboltOutlined }
    ],
    brands: ['Nike', 'Adidas', 'Puma', 'Under Armour', 'Wilson', 'Yonex', 'Speedo', 'The North Face'],
    subcategories: [
      { id: 'tap-gym', name: 'Tập Gym & Fitness', icon: TrophyOutlined },
      { id: 'bong-da', name: 'Bóng đá', icon: TrophyOutlined },
      { id: 'chay-bo', name: 'Chạy bộ', icon: TrophyOutlined },
      { id: 'the-thao-nuoc', name: 'Thể thao dưới nước', icon: TrophyOutlined }
    ]
  },
  'giay-dep': {
    name: 'Giày dép',
    description: 'Giày dép thời trang và tiện lợi cho mọi hoạt động',
    image: '/images/giay-dep/category-image.png',
    features: [
      { title: 'Đa dạng phong cách', description: 'Từ casual đến formal, thể thao đến dự tiệc', icon: StarOutlined },
      { title: 'Êm ái, thoải mái', description: 'Thiết kế tập trung vào trải nghiệm người dùng', icon: HeartOutlined },
      { title: 'Bền bỉ, chắc chắn', description: 'Chất liệu cao cấp, đường may tỉ mỉ', icon: SafetyCertificateOutlined }
    ],
    brands: ['Nike', 'Adidas', 'Converse', 'Vans', 'New Balance', 'Puma', 'Reebok', 'Clarks'],
    subcategories: [
      { id: 'giay-nam', name: 'Giày nam', icon: ShoppingOutlined },
      { id: 'giay-nu', name: 'Giày nữ', icon: ShoppingOutlined },
      { id: 'giay-tre-em', name: 'Giày trẻ em', icon: ShoppingOutlined },
      { id: 'giay-the-thao', name: 'Giày thể thao', icon: ShoppingOutlined }
    ]
  },
  'quan-ao': {
    name: 'Quần áo',
    description: 'Thời trang đa dạng cho mọi lứa tuổi và phong cách',
    image: '/images/quan-ao/category-image.png',
    features: [
      { title: 'Hợp thời trang', description: 'Cập nhật xu hướng mới nhất', icon: StarOutlined },
      { title: 'Chất liệu thoáng mát', description: 'Cotton, lụa, len cao cấp', icon: SafetyCertificateOutlined },
      { title: 'Đa dạng size', description: 'Phù hợp với nhiều vóc dáng', icon: SkinOutlined }
    ],
    brands: ['Zara', 'H&M', 'Uniqlo', 'Gucci', 'Louis Vuitton', 'Dior', 'Levi\'s', 'Canifa'],
    subcategories: [
      { id: 'thoi-trang-nam', name: 'Thời trang nam', icon: SkinOutlined },
      { id: 'thoi-trang-nu', name: 'Thời trang nữ', icon: SkinOutlined },
      { id: 'thoi-trang-tre-em', name: 'Thời trang trẻ em', icon: SkinOutlined },
      { id: 'phu-kien-thoi-trang', name: 'Phụ kiện thời trang', icon: SkinOutlined }
    ]
  },
  'the-nap-dich-vu-so': {
    name: 'Thẻ nạp - Dịch vụ số',
    description: 'Nạp tiền game, mua thẻ cào và các dịch vụ số khác',
    image: '/images/the-nap_ki-thuat-so/category-image.png',
    features: [
      { title: 'Thanh toán nhanh chóng', description: 'Nhận mã ngay sau khi thanh toán', icon: ThunderboltOutlined },
      { title: 'Bảo mật cao', description: 'Mã hóa thông tin giao dịch', icon: SafetyCertificateOutlined },
      { title: 'Ưu đãi hấp dẫn', description: 'Giảm giá và khuyến mãi thường xuyên', icon: DollarOutlined }
    ],
    brands: ['Garena', 'Steam', 'Google Play', 'App Store', 'Viettel', 'Mobifone', 'Vinaphone', 'Netflix'],
    subcategories: [
      { id: 'the-game', name: 'Thẻ game', icon: CreditCardOutlined },
      { id: 'the-dien-thoai', name: 'Thẻ điện thoại', icon: CreditCardOutlined },
      { id: 'the-data', name: 'Thẻ data', icon: CreditCardOutlined },
      { id: 'goi-cuoc', name: 'Gói cước dịch vụ', icon: CreditCardOutlined }
    ]
  },
  'thiet-bi-dien-tu': {
    name: 'Thiết bị điện tử',
    description: 'Sản phẩm công nghệ hiện đại cho cuộc sống thông minh',
    image: '/images/thiet-bi-dien-tu/category-image.png',
    features: [
      { title: 'Hiệu năng mạnh mẽ', description: 'Xử lý nhanh, đa nhiệm tốt', icon: ThunderboltOutlined },
      { title: 'Thiết kế tinh tế', description: 'Sang trọng, gọn nhẹ, tiện lợi', icon: StarOutlined },
      { title: 'Kết nối đa dạng', description: 'Bluetooth, WiFi, NFC, 5G', icon: RocketOutlined }
    ],
    brands: ['Apple', 'Samsung', 'Sony', 'Dell', 'HP', 'Asus', 'LG', 'Xiaomi'],
    subcategories: [
      { id: 'laptop', name: 'Laptop & Máy tính', icon: LaptopOutlined },
      { id: 'am-thanh', name: 'Âm thanh', icon: LaptopOutlined },
      { id: 'camera', name: 'Máy ảnh - Quay phim', icon: LaptopOutlined },
      { id: 'phu-kien', name: 'Phụ kiện điện tử', icon: LaptopOutlined }
    ]
  },
  'trang-suc': {
    name: 'Trang sức',
    description: 'Trang sức tinh tế, sang trọng cho mọi dịp đặc biệt',
    image: '/images/trang-suc/category-image.png',
    features: [
      { title: 'Chất liệu cao cấp', description: 'Vàng, bạc, kim cương, đá quý', icon: SafetyCertificateOutlined },
      { title: 'Thiết kế tinh xảo', description: 'Tỉ mỉ trong từng chi tiết', icon: StarOutlined },
      { title: 'Phù hợp nhiều dịp', description: 'Từ thường ngày đến dạ tiệc', icon: HeartOutlined }
    ],
    brands: ['Pandora', 'Swarovski', 'Cartier', 'Tiffany & Co.', 'Doji', 'PNJ', 'SJC', 'Bvlgari'],
    subcategories: [
      { id: 'nhan', name: 'Nhẫn', icon: GoldOutlined },
      { id: 'day-chuyen', name: 'Dây chuyền', icon: GoldOutlined },
      { id: 'bong-tai', name: 'Bông tai', icon: GoldOutlined },
      { id: 'lac-tay', name: 'Lắc tay & Vòng tay', icon: GoldOutlined }
    ]
  },
  'tui-xach': {
    name: 'Túi xách',
    description: 'Túi xách thời trang, tiện lợi cho mọi hoạt động',
    image: '/images/tui-xach/category-image.png',
    features: [
      { title: 'Thiết kế sang trọng', description: 'Phong cách hiện đại, trẻ trung', icon: StarOutlined },
      { title: 'Dung tích lớn', description: 'Chứa được nhiều đồ dùng cá nhân', icon: ShoppingOutlined },
      { title: 'Đa dạng màu sắc', description: 'Phù hợp với nhiều phong cách thời trang', icon: HeartOutlined }
    ],
    brands: ['Louis Vuitton', 'Gucci', 'Chanel', 'Prada', 'Coach', 'Michael Kors', 'Hermes', 'Charles & Keith'],
    subcategories: [
      { id: 'tui-xach-nu', name: 'Túi xách nữ', icon: ShoppingOutlined },
      { id: 'tui-xach-nam', name: 'Túi xách nam', icon: ShoppingOutlined },
      { id: 'balo', name: 'Balo', icon: ShoppingOutlined },
      { id: 'vi', name: 'Ví', icon: ShoppingOutlined }
    ]
  }
});

// Lấy thông tin danh mục dựa vào slug
const categoryData = computed(() => {
  return categoryDetailsMap.value[props.slug] || {
    name: 'Danh mục sản phẩm',
    description: 'Khám phá sản phẩm đa dạng trong danh mục này',
    features: [],
    brands: [],
    subcategories: []
  }
});

// Banner cho danh mục
const categoryBanner = computed(() => {
  if (categoryData.value.image) {
    return categoryData.value.image;
  }
  return `/images/${props.slug}/category-image.png`;
});
</script>

<style scoped>
.category-detail {
  margin-bottom: 2rem;
}
</style>