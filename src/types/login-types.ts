// types/login-types.ts

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<void>;
}
