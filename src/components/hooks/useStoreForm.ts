import { useState } from "react";
import { StoreData, FormErrorsWithIndex } from "@/types/store-types";

function useStoreForm() {
  const [formData, setFormData] = useState<StoreData>({
    store_name: "",
    address: "",
    subdistrict: "",
    city: "",
    province: "",
    postcode: "",
    user_id: undefined,
  });

  const [errors, setErrors] = useState<FormErrorsWithIndex>({
    store_name: "",
    address: "",
    subdistrict: "",
    city: "",
    province: "",
    postcode: "",
    user_id: "",
  });

  const validateForm = () => {
    const newErrors: FormErrorsWithIndex = {
      store_name: "",
      address: "",
      subdistrict: "",
      city: "",
      province: "",
      postcode: "",
      user_id: "",
    };

    if (!formData.store_name) {
      newErrors.store_name = "Store name is required";
    }
    if (!formData.address) {
      newErrors.address = "Address is required";
    }
    if (!formData.city) {
      newErrors.city = "City is required";
    }
    if (!formData.province) {
      newErrors.province = "Province is required";
    }
    if (!formData.postcode) {
      newErrors.postcode = "Postcode is required";
    }
    if (!formData.user_id) {
      newErrors.user_id = "Store admin is required";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "user_id" ? (value ? parseInt(value) : undefined) : value,
    }));

    if (errors[name as keyof FormErrorsWithIndex]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return { formData, errors, handleChange, validateForm, setFormData };
}

export default useStoreForm;
