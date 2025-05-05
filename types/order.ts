/**
 * Định nghĩa kiểu dữ liệu cho đơn hàng
 */

import { CartItem } from './cart';

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  postalCode?: string;
  isDefault?: boolean;
}

export interface PaymentMethod {
  type: 'cod' | 'bank_transfer' | 'card' | 'e_wallet';
  details?: string;
}

export interface OrderItem extends Omit<CartItem, 'isSelected'> {
  orderId: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalItems: number;
  totalPrice: number;
  totalOriginalPrice?: number;
  totalDiscount?: number;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  shippingFee: number;
  status: OrderStatus;
  statusHistory?: {
    status: OrderStatus;
    timestamp: Date | string;
    note?: string;
  }[];
  trackingNumber?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  note?: string;
  estimatedDelivery?: Date | string;
}

export interface CreateOrderInput {
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  note?: string;
}

export interface UpdateOrderInput {
  status?: OrderStatus;
  trackingNumber?: string;
  note?: string;
  estimatedDelivery?: Date | string;
}