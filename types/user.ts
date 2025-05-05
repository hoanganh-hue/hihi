/**
 * Định nghĩa kiểu dữ liệu cho người dùng
 */

export type UserRole = 'customer' | 'seller' | 'affiliate' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  type: 'personal' | 'seller'; // Loại tài khoản
  createdAt?: Date | string;
  updatedAt?: Date | string;
  role?: UserRole;
  isVerified?: boolean;
  addresses?: {
    id: string;
    fullName: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    ward: string;
    postalCode?: string;
    isDefault: boolean;
  }[];
}

export interface AuthCredentials {
  email: string;
  password: string;
  remember?: boolean;
  userType?: 'personal' | 'seller';
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  userType: 'personal' | 'seller';
  agreeToTerms: boolean;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string | File;
}