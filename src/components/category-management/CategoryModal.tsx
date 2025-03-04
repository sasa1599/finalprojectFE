import { CategoryFormData } from "@/types/category-types";
import { useState, useRef } from "react";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: CategoryFormData;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onFileChange?: (file: File | null) => void;
}

export default function CategoryModal({
  isOpen,
  onClose,
  formData,
  onSubmit,
  onChange,
  onFileChange,
}: CategoryModalProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // Validate file size (max 3MB)
      if (file.size > 3 * 1024 * 1024) {
        alert("File size should not exceed 3MB");
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Clear the file input
        }
        return;
      }

      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        alert("Please upload a valid image (JPG, PNG, WebP)");
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Clear the file input
        }
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      // Call onFileChange prop with the file
      if (onFileChange) {
        onFileChange(file);
      }
    } else {
      // If no file is selected, reset the preview and call onFileChange with null
      setImagePreview(null);
      if (onFileChange) {
        onFileChange(null);
      }
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input
    }
    if (onFileChange) {
      onFileChange(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Category</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Category Name
            </label>
            <input
              type="text"
              name="category_name"
              value={formData.category_name}
              onChange={onChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={onChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Category Image
            </label>
            <input
              ref={fileInputRef}
              type="file"
              name="image"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {imagePreview && (
              <div className="mt-2 relative">
                <img
                  src={imagePreview}
                  alt="Category preview"
                  className="h-32 w-full object-contain rounded-md"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Recommended: Square image (JPG, PNG, WebP), max 3MB
            </p>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
