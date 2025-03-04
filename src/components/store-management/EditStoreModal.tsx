import { Store } from "lucide-react";
import { useStoreForm } from "@/helper/use-store-form";
import { storeService } from "@/components/hooks/useStoreAdmin";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import EditStoreForm from "./EditStoreForm";
import { StoreData } from "@/types/store-types";
import { User } from "@/types/user-types";

interface EditStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  dataStore: StoreData;
  users: User[];
}

export default function EditStoreModal({
  isOpen,
  onClose,
  onSuccess,
  dataStore,
  users,
}: EditStoreModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { formData, errors, handleChange, validateForm, setFormData } =
    useStoreForm();
  const [firstData, setFirstData] = useState(false);

  const showNotification = (type: "success" | "error", message: string) => {
    Swal.fire({
      icon: type,
      title: type === "success" ? "Success!" : "Oops...",
      text: message,
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await storeService.editStore(
        {
          ...formData,
          latitude: formData.latitude ?? 0, // Pastikan angka
          longitude: formData.longitude ?? 0, // Pastikan angka
        },
        dataStore.store_id ?? 0
      );
      showNotification("success", "Store edited successfully");
      onSuccess();
      onClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to edit store";
      showNotification("error", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isOpen && !firstData) {
      setFormData({
        ...dataStore,
        latitude: dataStore.latitude ?? 0, // Default ke 0 jika undefined
        longitude: dataStore.longitude ?? 0, // Default ke 0 jika undefined
      });
      setFirstData(true);
    }
  }, [isOpen, firstData, setFormData, dataStore]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="bg-blue-600 text-white p-6 flex items-center rounded-t-lg">
          <Store className="h-8 w-8 mr-4" />
          <h2 className="text-2xl font-bold">Edit Store</h2>
          <button
            onClick={() => {
              setFirstData(false);
              onClose();
            }}
            className="ml-auto text-white hover:text-gray-200 focus:outline-none"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          <EditStoreForm
            formData={formData}
            dataStore={dataStore}
            errors={errors}
            handleChange={handleChange}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            users={users}
          />
        </div>
      </div>
    </div>
  );
}
