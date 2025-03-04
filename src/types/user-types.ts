// types/user-types.ts

export interface User {
  user_id: number;
  email: string;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  role: "customer" | "store_admin" | "super_admin";
  phone: string | null;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiUserResponse {
  status: string;
  data: User[];
  pagination?: PaginationInfo;
}
