/**
 * Định nghĩa kiểu dữ liệu cho tiếp thị liên kết
 */

import { Product } from './product';

export interface AffiliateLink {
  id: string;
  userId: string;
  productId: string;
  product?: Product;
  code: string;
  url: string;
  commission: number; // Phần trăm hoa hồng
  clicks: number;
  conversions: number;
  earnings: number;
  createdAt: Date | string;
  updatedAt?: Date | string;
  isActive: boolean;
}

export interface AffiliateStats {
  totalClicks: number;
  totalConversions: number;
  totalEarnings: number;
  conversionRate: number; // Tỉ lệ chuyển đổi (conversions / clicks)
  periodStart: Date | string;
  periodEnd: Date | string;
  dailyStats?: {
    date: Date | string;
    clicks: number;
    conversions: number;
    earnings: number;
  }[];
}

export interface AffiliateCommission {
  id: string;
  userId: string;
  orderId: string;
  productId: string;
  amount: number;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  createdAt: Date | string;
  paidAt?: Date | string;
}

export interface AffiliateWithdrawal {
  id: string;
  userId: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  bankInfo: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  };
  createdAt: Date | string;
  completedAt?: Date | string;
  note?: string;
}