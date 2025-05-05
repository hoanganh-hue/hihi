/**
 * Định nghĩa kiểu dữ liệu cho sản phẩm
 */

export interface ProductVariant {
  id: number | string;
  name: string;
  options: string[];
}

export interface ProductImage {
  id: number | string;
  url: string;
  alt?: string;
}

export interface ProductSpecification {
  key: string;
  value: string;
}

export interface Seller {
  id: number | string;
  name: string;
  rating: number;
  followers: number;
  responseRate: number;
  responseTime: string;
  joinedTime: string;
}

export interface Product {
  id: number | string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating?: number;
  reviewCount?: number;
  sold?: number;
  stock?: number;
  image: string;
  images?: ProductImage[];
  categoryId?: number | string;
  categoryName?: string;
  variations?: ProductVariant[];
  specifications?: ProductSpecification[];
  seller?: Seller;
  soldPercentage?: number; // Dùng cho flash sale
  isNew?: boolean;
  isFeatured?: boolean;
  isFlashSale?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface ProductFilter {
  search?: string;
  categoryId?: number | string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sort?: 'newest' | 'price-asc' | 'price-desc' | 'popular';
  page?: number;
  limit?: number;
}

export type CreateProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateProductInput = Partial<CreateProductInput>;