import { ref } from 'vue'
import { iphoneData } from '../data/iphoneData'

/**
 * Hook lấy dữ liệu sản phẩm tĩnh từ thư mục public/images theo từng danh mục
 */
export function useStaticProducts() {
  // Dữ liệu sản phẩm tĩnh mẫu cho danh mục điện thoại
  const dienThoaiProducts = ref([
    {
      id: 'iphone-14-plus',
      name: 'iPhone 14 Plus',
      price: 24990000,
      image: '/images/dien-thoai/images/iphone/iphone-14-plus.jpg',
      images: JSON.stringify([
        '/images/dien-thoai/images/iphone/iphone-14-plus.jpg',
        '/images/dien-thoai/images/iphone/iphone-14-pro-max.jpg'
      ]),
      rating: 4.5,
      stock: 50
    },
    {
      id: 'iphone-14-pro-max',
      name: 'iPhone 14 Pro Max',
      price: 31990000,
      image: '/images/dien-thoai/images/iphone/iphone-14-pro-max.jpg',
      images: JSON.stringify([
        '/images/dien-thoai/images/iphone/iphone-14-pro-max.jpg',
        '/images/dien-thoai/images/iphone/iphone-14-plus.jpg'
      ]),
      rating: 4.7,
      stock: 30
    },
    {
      id: 'iphone-15',
      name: 'iPhone 15',
      price: 27990000,
      image: '/images/dien-thoai/images/iphone/iphone-15.jpg',
      images: JSON.stringify([
        '/images/dien-thoai/images/iphone/iphone-15.jpg',
        '/images/dien-thoai/images/iphone/iphone-15-pro.jpg'
      ]),
      rating: 4.6,
      stock: 40
    },
    {
      id: 'iphone-15-pro',
      name: 'iPhone 15 Pro',
      price: 34990000,
      image: '/images/dien-thoai/images/iphone/iphone-15-pro.jpg',
      images: JSON.stringify([
        '/images/dien-thoai/images/iphone/iphone-15-pro.jpg',
        '/images/dien-thoai/images/iphone/iphone-15.jpg'
      ]),
      rating: 4.8,
      stock: 20
    }
    // Thêm sản phẩm khác tương tự
  ])

  // Dữ liệu sản phẩm tĩnh mẫu cho danh mục đồ chơi mẹ bé
  const doChoiMeBeProducts = ref([
    {
      id: 'architectx-building-designer',
      name: 'ArchitectX Building Designer',
      price: 1200000,
      image: '/images/do_choi-me_be/images/architectx-building-designer.jpg',
      images: JSON.stringify([
        '/images/do_choi-me_be/images/architectx-building-designer.jpg'
      ]),
      rating: 4.3,
      stock: 25
    },
    {
      id: 'artgenius-creative-studio',
      name: 'ArtGenius Creative Studio',
      price: 1500000,
      image: '/images/do_choi-me_be/images/artgenius-creative-studio.jpg',
      images: JSON.stringify([
        '/images/do_choi-me_be/images/artgenius-creative-studio.jpg'
      ]),
      rating: 4.5,
      stock: 30
    },
    {
      id: 'biogarden-smart-ecosystem',
      name: 'BioGarden Smart Ecosystem',
      price: 1800000,
      image: '/images/do_choi-me_be/images/biogarden-smart-ecosystem.jpg',
      images: JSON.stringify([
        '/images/do_choi-me_be/images/biogarden-smart-ecosystem.jpg'
      ]),
      rating: 4.7,
      stock: 20
    }
    // Thêm sản phẩm khác tương tự
  ])

  // Dữ liệu sản phẩm tĩnh mẫu cho danh mục đồng hồ
  const dongHoProducts = ref([
    {
      id: 'a-lange-sohne-zeitwerk-celestial-symphony',
      name: 'A. Lange & Söhne Zeitwerk Celestial Symphony',
      price: 500000000,
      image: '/images/dong-ho/images/a-lange-sohne-zeitwerk-celestial-symphony.jpg',
      images: JSON.stringify([
        '/images/dong-ho/images/a-lange-sohne-zeitwerk-celestial-symphony.jpg'
      ]),
      rating: 4.9,
      stock: 5
    },
    {
      id: 'audemars-piguet-royal-oak-concept-black-hole',
      name: 'Audemars Piguet Royal Oak Concept Black Hole',
      price: 450000000,
      image: '/images/dong-ho/images/audemars-piguet-royal-oak-concept-black-hole.jpg',
      images: JSON.stringify([
        '/images/dong-ho/images/audemars-piguet-royal-oak-concept-black-hole.jpg'
      ]),
      rating: 4.8,
      stock: 7
    },
    {
      id: 'blancpain-fifty-fathoms-ocean-guardian',
      name: 'Blancpain Fifty Fathoms Ocean Guardian',
      price: 400000000,
      image: '/images/dong-ho/images/blancpain-fifty-fathoms-ocean-guardian.jpg',
      images: JSON.stringify([
        '/images/dong-ho/images/blancpain-fifty-fathoms-ocean-guardian.jpg'
      ]),
      rating: 4.7,
      stock: 10
    }
    // Thêm sản phẩm khác tương tự
  ])

  // Dữ liệu sản phẩm tĩnh mẫu cho danh mục dụng cụ thể thao
  const dungCuTheThaoProducts = ref([
    {
      id: 'assault-air-bike-pro-ma-so-8',
      name: 'Assault Air Bike Pro',
      price: 25000000,
      image: '/images/dung-cu-the-thao/images/assault-air-bike-pro-ma-so-8.jpg',
      images: JSON.stringify([
        '/images/dung-cu-the-thao/images/assault-air-bike-pro-ma-so-8.jpg'
      ]),
      rating: 4.6,
      stock: 15
    },
    {
      id: 'bowflex-revolution-x-ma-so-9',
      name: 'Bowflex Revolution X',
      price: 30000000,
      image: '/images/dung-cu-the-thao/images/bowflex-revolution-x-ma-so-9.jpg',
      images: JSON.stringify([
        '/images/dung-cu-the-thao/images/bowflex-revolution-x-ma-so-9.jpg'
      ]),
      rating: 4.7,
      stock: 10
    },
    {
      id: 'clmbr-connected-02',
      name: 'CLMBR Connected 02',
      price: 28000000,
      image: '/images/dung-cu-the-thao/images/clmbr-connected-02.jpg',
      images: JSON.stringify([
        '/images/dung-cu-the-thao/images/clmbr-connected-02.jpg'
      ]),
      rating: 4.5,
      stock: 12
    }
    // Thêm sản phẩm khác tương tự
  ])

  // Dữ liệu sản phẩm tĩnh mẫu cho danh mục giày dép
  const giayDepProducts = ref([
    {
      id: '361-flame-neo',
      name: '361° Flame Neo',
      price: 1500000,
      image: '/images/giay-dep/images/361-flame-neo.jpg',
      images: JSON.stringify([
        '/images/giay-dep/images/361-flame-neo.jpg'
      ]),
      rating: 4.4,
      stock: 20
    },
    {
      id: 'adidas-4dfwd-quantum',
      name: 'Adidas 4DFWD Quantum',
      price: 2500000,
      image: '/images/giay-dep/images/adidas-4dfwd-quantum.jpg',
      images: JSON.stringify([
        '/images/giay-dep/images/adidas-4dfwd-quantum.jpg'
      ]),
      rating: 4.6,
      stock: 15
    },
    {
      id: 'alexander-mcqueen-tread-slick-combat-boot',
      name: 'Alexander McQueen Tread Slick Combat Boot',
      price: 3500000,
      image: '/images/giay-dep/images/alexander-mcqueen-tread-slick-combat-boot.jpg',
      images: JSON.stringify([
        '/images/giay-dep/images/alexander-mcqueen-tread-slick-combat-boot.jpg'
      ]),
      rating: 4.7,
      stock: 10
    }
  ])

  // Kết hợp dữ liệu mô tả chi tiết từ iphoneData
  function mergeProductDetails(products, details) {
    return products.map(product => {
      const detail = details.find(d => d.id === product.id)
      if (detail) {
        return {
          ...product,
          description: detail.specs,
          priceRange: detail.priceRange,
          price: detail.priceRange, // Thay thế price bằng priceRange để hiển thị USD
          availability: detail.availability,
          year: detail.year,
          color: detail.color,
          model: detail.model
        }
      }
      return product
    })
  }

  // Hàm lấy sản phẩm theo danh mục
  function getProductsByCategory(categoryId) {
    if (categoryId === 'dien-thoai') {
      return mergeProductDetails(dienThoaiProducts.value, iphoneData)
    }
    if (categoryId === 'do_choi-me_be') {
      return doChoiMeBeProducts.value
    }
    if (categoryId === 'dong-ho') {
      return dongHoProducts.value
    }
    if (categoryId === 'dung-cu-the-thao') {
      return dungCuTheThaoProducts.value
    }
    // Có thể mở rộng cho các danh mục khác
    return []
  }

  return {
    getProductsByCategory
  }
}
