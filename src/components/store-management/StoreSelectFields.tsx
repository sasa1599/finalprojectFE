import React from "react";
import { StoreDataKey } from "@/types/store-types";

interface Option {
  value: string | number;
  label: string;
}

interface SelectFieldProps {
  name: StoreDataKey;
  label: string;
  Icon: React.ElementType;
  value: string | number | undefined;
  error?: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
}

export const SelectField: React.FC<SelectFieldProps> = ({
  name,
  label,
  Icon,
  value,
  error,
  placeholder,
  onChange,
  options,
}) => (
  <div>
    <label
      htmlFor={String(name)}
      className="text-gray-700 font-medium mb-2 inline-flex items-center"
    >
      <Icon className="h-5 w-5 mr-2 text-gray-500" />
      {label}
    </label>
    <select
      id={String(name)}
      name={String(name)}
      value={value ?? ""}
      onChange={onChange}
      className={`w-full px-4 py-2 border text-black rounded-md focus:outline-none focus:ring-2 ${
        error
          ? "border-red-500 focus:ring-red-300"
          : "border-gray-300 focus:ring-blue-300"
      }`}
    >
      <option value="">Choose {label}</option>
      {options?.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);
