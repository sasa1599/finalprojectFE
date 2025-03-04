export interface ValuesSetPassAccGoogle {
  password: string;
  confirmPassword: string;
}

export interface FormSetPassAccGoogle {
onsubmit: (values: {
  password: string;
  confirmPassword: string;
}) => void;
}