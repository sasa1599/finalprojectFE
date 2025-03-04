// User related interfaces
export interface User {
  user_id: number;
  email: string;
  username: string;
  phone: string;
  first_name: string;
  last_name: string;
  date_ob: string | null;
  avatar: string;
  google_id: string | null;
  role: "store_admin" | "customer" | "super_admin";
  verified: boolean;
  created_at: string;
  updated_at: string;
}

// API Response interfaces
export interface RegisterResponse {
  token: string;
  email: string;
  user: User;
}

export interface TokenCheckResponse {
  status: string;
  message: string;
}

export interface ResetPassResponse {
  token: string;
  email: string;
}

export interface VerifyResponse {
  status: string;
  message: string;
  token: string;
  role: "customer" | "store_admin" | "super_admin";
}

export interface LoginResponse {
  status: string;
  msg: string;
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  statusCode?: number;
}

// Form Values interfaces
export interface RegisterFormCustomerValues {
  email: string;
}

export interface ResetPassValues {
  email: string;
}

export interface LoginFormCustomerValues {
  email: string;
  password: string;
}

export interface VerifyAndSetPassValues {
  username: string;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  confirmPassword: string;
  referralCode: "";
}

export interface VerifyResetPassValues {
  oldPassword: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormStoreValues {
  email: string;
  password: string;
}

export interface LoginFormSuperValues {
  email: string;
  password: string;
}

// Props interfaces
export interface RegisterFormCustomerProps {
  onSubmit: (values: RegisterFormCustomerValues) => Promise<void>;
  handleGoogleRegister: () => void;
}

export interface ResetPassProps {
  onSubmit: (values: ResetPassValues) => Promise<void>;
}

export interface LoginFormStoreProps {
  onSubmit: (values: LoginFormStoreValues) => Promise<void>;
}

export interface LoginFormCustomerProps {
  onSubmit: (values: LoginFormCustomerValues) => Promise<void>;
  handleGoogleLogin: () => void;
}

// Create a common password type to be used in both scenarios
export interface PasswordFields {
  password: string;
  confirmPassword: string;
}

// Create separate props interfaces for each use case
export interface VerifyAndSetPassProps {
  onSubmit: (values: VerifyAndSetPassValues) => Promise<void>;
  formType?: "register";
}

export interface VerifyResetPassProps {
  onSubmit: (values: VerifyResetPassValues) => Promise<void>;
  formType: "reset";
}

// Create a union type that will work for both components
export type VerifyPassProps = VerifyAndSetPassProps | VerifyResetPassProps;

export interface LoginFormSuperProps {
  onSubmit: (values: LoginFormSuperValues) => Promise<void>;
}
