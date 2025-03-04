
import React from "react";
import { StoreDataKey } from "@/types/store-types";

interface InputFieldProps {
  name: StoreDataKey;
  label: string;
  Icon: React.ElementType;
  value: string | number | undefined;
  error?: string;
  type?: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputField: React.FC<InputFieldProps> = ({
  name,
  label,
  Icon,
  value,
  error,
  type = "text",
  placeholder,
  onChange,
}) => (
  <div>
    <label
      htmlFor={String(name)}
      className="text-gray-700 font-medium mb-2 inline-flex items-center"
    >
      <Icon className="h-5 w-5 mr-2 text-gray-500" />
      {label}
    </label>
    <input
      type={type}
      id={String(name)}
      name={String(name)}
      value={value ?? ""}
      onChange={onChange}
      placeholder={placeholder || `Enter ${label.toLowerCase()}`}
      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
        error
          ? "border-red-500 focus:ring-red-300"
          : "border-gray-300 focus:ring-blue-300"
      }`}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);
