import React, { useState, useEffect } from "react";

interface UserFormData {
  email: string;
  password: string;
  role: "customer" | "store_admin";
  username: string;
  firstName: string;
  lastName: string;
  phone: string;
}

const INITIAL_FORM_STATE: UserFormData = {
  email: "", password: "", role: "customer", username: "",
  firstName: "", lastName: "", phone: "",
};

const fieldConfig = [
  { name: "email", label: "Email", type: "email", placeholder: "example@gmail.com" },
  { name: "username", label: "Username", type: "text", placeholder: "Store Admin Name" },
  { name: "password", label: "Password", type: "password", placeholder: "••••••••" },
  { name: "firstName", label: "First Name", type: "text", placeholder: "Store First Name" },
  { name: "lastName", label: "Last Name", type: "text", placeholder: "Store Last Name" },
  { name: "phone", label: "Phone Number", type: "tel", placeholder: "Store Phone Number" },
];

const UserForm = ({
  closeModal,
  refreshUsers,
}: {
  closeModal: () => void;
  refreshUsers: () => void;
}) => {
  const [formData, setFormData] = useState<UserFormData>(INITIAL_FORM_STATE);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    let isValid = true;

    // Validate all fields are filled
    Object.entries(formData).forEach(([key, value]) => {
      if (!value && key !== "role") {
        errors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
        isValid = false;
      }
    });

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
      isValid = false;
    }

    // Password validation
    if (formData.password && formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Only validate on change if user has already attempted to submit once
  useEffect(() => {
    if (attemptedSubmit) {
      validateForm();
    }
  }, [formData, attemptedSubmit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAttemptedSubmit(true);
    
    const isValid = validateForm();
    if (!isValid) return;
    
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL_BE}/super-admin/createusers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to create user");
      refreshUsers();
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const renderField = (field: typeof fieldConfig[0]) => (
    <div key={field.name} className={field.name === "firstName" || field.name === "lastName" ? "sm:col-span-1" : ""}>
      <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {field.label} <span className="text-red-500">*</span>
      </label>
      <input
        id={field.name}
        name={field.name}
        type={field.type}
        required
        placeholder={field.placeholder}
        value={formData[field.name as keyof UserFormData]}
        onChange={handleInputChange}
        className={`w-full border ${
          attemptedSubmit && formErrors[field.name] 
            ? "border-red-500" 
            : "border-gray-300 dark:border-gray-600"
        } rounded-lg px-4 py-2.5 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700`}
      />
      {attemptedSubmit && formErrors[field.name] && (
        <p className="mt-1 text-sm text-red-600">{formErrors[field.name]}</p>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md sm:max-w-lg">
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Create New User</h2>
            <button type="button" onClick={closeModal} className="text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-200 text-red-700 p-4 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fieldConfig.slice(0, 3).map(renderField)}
              
              <div className="sm:col-span-2">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  id="role"
                  name="role"
                  required
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5"
                >
                  <option value="customer">Customer</option>
                  <option value="store_admin">Store Admin</option>
                </select>
              </div>
              
              {fieldConfig.slice(3).map(renderField)}
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 border border-gray-300 text-white rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-70"
            >
              {isLoading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;