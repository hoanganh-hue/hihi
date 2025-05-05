<template>
  <section class="py-16 bg-[#0a0a0a]">
    <div class="container mx-auto">
      <div class="flex justify-between items-center mb-10">
        <h2 class="text-2xl font-bold">Danh mục sản phẩm</h2>
        <router-link to="/category" class="text-pink-500 hover:text-pink-400 flex items-center">
          Xem tất cả
          <RightOutlined class="ml-1" />
        </router-link>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <div 
          v-for="(category, index) in categories" 
          :key="index"
        >
          <router-link 
            :to="`/category/${category.slug}`"
            class="block h-full"
          >
            <div class="h-full bg-gradient-to-br from-[#1a1a1a] to-[#111] rounded-xl overflow-hidden transition-transform duration-300 hover:scale-105 cursor-pointer border border-[#333] group">
              <div class="relative h-24 flex items-center justify-center bg-[#222] rounded-t-xl overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-b from-transparent to-[#111] opacity-70 z-10 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div class="w-16 h-16 rounded-full bg-[#333] flex items-center justify-center z-20">
                  <component :is="category.icon" class="text-2xl text-gray-200" />
                </div>
              </div>
              <div class="p-4 text-center">
                <h3 class="font-medium">{{ category.name }}</h3>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { 
  RightOutlined,
  MobileOutlined, 
  GiftOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  SkinOutlined,
  CreditCardOutlined,
  LaptopOutlined,
  GoldOutlined,
  ShoppingOutlined
} from '@ant-design/icons-vue';

// Danh mục sản phẩm với slug để điều hướng URL và icon phù hợp
const categories = ref([
  { 
    name: 'Điện thoại', 
    slug: 'dien-thoai',
    icon: MobileOutlined 
  },
  { 
    name: 'Đồ chơi - Mẹ & Bé', 
    slug: 'do-choi-me-va-be',
    icon: GiftOutlined 
  },
  { 
    name: 'Đồng hồ', 
    slug: 'dong-ho',
    icon: ClockCircleOutlined 
  },
  { 
    name: 'Dụng cụ thể thao', 
    slug: 'dung-cu-the-thao',
    icon: TrophyOutlined 
  },
  { 
    name: 'Giày dép', 
    slug: 'giay-dep',
    icon: ShoppingOutlined 
  },
  { 
    name: 'Quần áo', 
    slug: 'quan-ao',
    icon: SkinOutlined 
  },
  { 
    name: 'Thẻ nạp & Kỹ thuật số', 
    slug: 'the-nap-ki-thuat-so',
    icon: CreditCardOutlined 
  },
  { 
    name: 'Thiết bị điện tử', 
    slug: 'thiet-bi-dien-tu',
    icon: LaptopOutlined 
  },
  { 
    name: 'Trang sức', 
    slug: 'trang-suc',
    icon: GoldOutlined 
  },
  { 
    name: 'Túi xách', 
    slug: 'tui-xach',
    icon: ShoppingOutlined 
  },
]);
</script>