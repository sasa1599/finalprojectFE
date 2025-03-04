// Comprehensive type definitions for address-related types

export interface Address {
  address_id: number;
  address_name: string;
  address: string;
  subdistrict: string;
  city: string;
  city_id: string; // Note: keeping as string based on the error message
  province: string;
  province_id: string; // Note: keeping as string based on the error message
  postcode: string;
  latitude: number;
  longitude: number;
  user_id?: number;
  is_primary?: boolean;
}

export interface AddressFormData {
  address_name: string;
  address: string;
  subdistrict: string;
  city: string;
  city_id: number | string; // Allow both number and string
  province: string;
  province_id: number | string; // Allow both number and string
  postcode: number | string;
  latitude: number;
  longitude: number;
}

export interface Location {
  province: { value: number; label: string } | null;
  city: { value: number; label: string } | null;
  subdistrict: { value: number; label: string } | null;
}

// Utility function to convert Address to AddressFormData
export function convertAddressToFormData(address: Address): AddressFormData {
  return {
    address_name: address.address_name,
    address: address.address,
    subdistrict: address.subdistrict,
    city: address.city,
    city_id: address.city_id,
    province: address.province,
    province_id: address.province_id,
    postcode: address.postcode,
    latitude: address.latitude,
    longitude: address.longitude,
  };
}

// Utility function to convert AddressFormData to Address
export function convertFormDataToAddress(formData: AddressFormData): Address {
  return {
    ...formData,
    address_id: 0, // You might want to handle this differently
    city_id: String(formData.city_id),
    province_id: String(formData.province_id),
    postcode: String(formData.postcode),
    user_id: undefined,
    is_primary: undefined,
  };
}
