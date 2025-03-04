"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import CategoryCard from "@/components/category-management/CategoryCard";
import CategoryModal from "@/components/category-management/CategoryModal";
import { categoryService } from "@/services/category-admin.service";
import { Category, CategoryFormData } from "@/types/category-types";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CategoriesAdmin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 8,
  });
  const [formData, setFormData] = useState<CategoryFormData>({
    category_name: "",
    description: "",
    thumbnail: "",
  });
  const [categoryImage, setCategoryImage] = useState<File | null>(null);

  useEffect(() => {
    fetchCategories(1);
  }, []);

  const fetchCategories = async (page: number = 1) => {
    try {
      setIsLoading(true);
      const response = await categoryService.getCategories(page);
      setCategories(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch categories"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    fetchCategories(page);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (file: File | null) => {
    setCategoryImage(file);
  };

  const resetForm = () => {
    setFormData({
      category_name: "",
      description: "",
      thumbnail: "",
    });
    setCategoryImage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData = new FormData();
      submitData.append("category_name", formData.category_name);
      submitData.append("description", formData.description);

      if (categoryImage) {
        submitData.append("thumbnail", categoryImage);
      }

      await categoryService.createCategory(submitData);

      toast.success("Category created successfully");
      setIsModalOpen(false);
      resetForm();
      fetchCategories(1);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "A Category Has Already Exist"
      );
    }
  };

  const handleEdit = (category: Category) => {
    console.log("Edit category:", category);
  };

  const handleDelete = async (id: number) => {
    try {
      await categoryService.deleteCategory(id);
      toast.success("Category deleted successfully");
      fetchCategories(pagination.currentPage);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete category"
      );
      setError(
        err instanceof Error ? err.message : "Failed to delete category"
      );
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="text-red-600 font-medium mb-4">Error: {error}</div>
        <button
          onClick={() => {
            setError(null);
            fetchCategories(1);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Phone Brand Categories
          </h1>
          <p className="text-gray-500 mt-1">
            Manage phone brand categories for your store
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Category
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-sm">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-blue-500"></div>
            <p className="mt-4 text-gray-500">Loading categories...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                All Categories
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Showing {categories.length} of {pagination.totalItems}{" "}
                categories
              </p>
            </div>

            <div className="p-6">
              {categories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <p className="text-lg font-medium text-gray-700">
                    No categories found
                  </p>
                  <p className="text-gray-500 text-center mt-2 max-w-md">
                    Click the &quot;Add Category&quot; button to create your
                    first category.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category) => (
                    <CategoryCard
                      key={category.category_id}
                      category={category}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center py-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className={`px-3 py-1 rounded-md ${
                      pagination.currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    Previous
                  </button>

                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-8 h-8 flex items-center justify-center rounded-md ${
                        pagination.currentPage === page
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className={`px-3 py-1 rounded-md ${
                      pagination.currentPage === pagination.totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        formData={formData}
        onSubmit={handleSubmit}
        onChange={handleInputChange}
        onFileChange={handleFileChange}
      />

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}
