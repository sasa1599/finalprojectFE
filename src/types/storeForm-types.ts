// types/store-types.ts
export type StoreDataKey = keyof StoreData;

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

export interface FormErrors {
  store_name: string;
  address: string;
  subdistrict: string;
  city: string;
  province: string;
  postcode: string;
}

// Create a type that allows indexing FormErrors with StoreData keys
export type FormErrorsWithIndex = FormErrors & {
  [K in StoreDataKey]?: string;
};
