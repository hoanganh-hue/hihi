/**
 * Định nghĩa kiểu dữ liệu cho danh mục
 */

export interface Subcategory {
  id: number | string;
  name: string;
  image?: string;
  productCount?: number;
}

export interface Category {
  id: number | string;
  name: string;
  description?: string;
  image?: string;
  icon?: string;
  productCount?: number;
  subcategories?: Subcategory[];
  parentId?: number | string;
  isActive?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export type CreateCategoryInput = Omit<Category, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateCategoryInput = Partial<CreateCategoryInput>;