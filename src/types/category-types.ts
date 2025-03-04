// types/category-types.ts
export interface Category {
  category_id: number;  // Changed from 'id' to 'category_id'
  category_name: string;
  description: string;
  category_thumbnail?: string;
  Product?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface CategoryFormData {
  category_name: string;
  description: string;
  thumbnail: string
}
