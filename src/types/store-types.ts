// @/types/store-types.ts

export interface StoreData {
  store_id?: number;
  store_name: string;
  address: string;
  subdistrict: string;
  city: string;
  province: string;
  postcode: string;
  latitude?: number;
  longitude?: number;
  user_id?: number;
  description?: string;
}


export interface EditData {
  store_name: string;
  address: string;
  subdistrict: string;
  city: string;
  province: string;
  postcode: string;
  latitude: number;
  longitude: number;
  user_id?: number | null;
}

// Simplified Store interface for list display
export interface StoreDisplay {
  store_id: number;
  store_name: string;
  address: string;
  city: string;
}

// Type for store data keys
export type StoreDataKey = keyof StoreData;

// Base form errors interface
export interface FormErrors {
  store_name?: string;
  address?: string;
  subdistrict?: string;
  city?: string;
  province?: string;
  postcode?: string;
}

// Add interface for store admin fetch
export interface StoreAdmin {
  user_id: number;
  username: string;
}

// Extended form errors type with optional store data keys
export type FormErrorsWithIndex = FormErrors & {
  [K in StoreDataKey]?: string;
};

// User interface for store management
export interface User {
  user_id: number;
  username: string;
  email?: string;
  role?: string;
}
