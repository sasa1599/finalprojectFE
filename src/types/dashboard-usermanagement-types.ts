export type UserRole = "customer" | "store_admin";

export interface User {
  user_id: number;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role: UserRole;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserFormData {
  email: string;
  password: string;
  role: UserRole;
  username: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}
