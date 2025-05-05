/**
 * Định nghĩa kiểu dữ liệu cho giỏ hàng
 */

import { Product } from './product';

export interface CartItem {
  id: string;
  productId: number | string;
  quantity: number;
  price: number;
  name: string;
  image: string;
  variant?: {
    name: string;
    value: string;
  }[];
  maxQuantity?: number; // Số lượng tối đa có thể mua
  isSelected?: boolean;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  totalOriginalPrice?: number;
  totalDiscount?: number;
  userId?: string;
}

export type AddToCartInput = {
  productId: number | string;
  quantity: number;
  variant?: {
    name: string;
    value: string;
  }[];
}