"use client";

import React, { useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import Sidebar from "@/components/sidebarSuperAdmin";
import Modal from "@/components/product-management/Modal";
import ProductForm from "@/components/product-management/ProductForm";
import ImageUploadForm from "@/components/product-management/ImageUploadForm";
import { Product } from "@/types/product-types";
import { formatRupiah } from "@/helper/currencyRp";
import HeaderSuperAdmin from "@/components/headerSuperAdmin";
import Services1 from "@/services/products/services1";

export default function ProductAdmin() {
  const {
    loading,
    isSidebarOpen,
    setIsSidebarOpen,
    isProfileDropdownOpen,
    setIsProfileDropdownOpen,
    products,
    showAddModal,
    setShowAddModal,
    showEditModal,
    setShowEditModal,
    showImageUploadModal,
    setShowImageUploadModal,
    setSelectedProduct,
    selectedFiles,
    setSelectedFiles,
    formData,
    setFormData,
    FetchProducts,
    handleSubmit,
    handleImageUpload,
    handleUpdate,
    handleDelete,
    resetForm,
  } = Services1();

  useEffect(() => {
    FetchProducts();
  }, []);

  const renderProductCard = (product: Product) => (
    <div
      key={product.product_id}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
    >
      <div className="p-4">
        {product.ProductImage?.[0] && (
          <div className="relative w-full h-48 mb-4">
            <Image
              src={product.ProductImage[0].url}
              alt={product.name}
              fill
              className="object-cover rounded-md"
            />
          </div>
        )}
        <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
        <p className="font-bold mb-2">
          <span className="font-bold text-[16px]">Categories : </span>{" "}
          {product.category.category_name}
        </p>
        <p className="font-bold mb-2">
          <span className="font-bold text-[16px]">Price : </span>
          {formatRupiah(product.price)}
        </p>
        <p className="font-bold mb-2">
          <span className="font-bold text-[16px]">Store : </span>
          {product.store.store_name}
        </p>
        <div className="flex justify-between items-center">
          <button
            onClick={() => {
              setSelectedProduct(product);
              setFormData({
                name: product.name,
                description: product.description,
                price: product.price.toString(),
                category_id: product.category.category_id.toString(),
                store_id: product.store_id.toString(),
                initial_quantity: "",
              });
              setShowEditModal(true);
            }}
            className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Pencil className="w-4 h-4" /> Edit
          </button>
          <button
            onClick={() => handleDelete(product.product_id)}
            className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <div className={`${isSidebarOpen ? "" : ""}`}>
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <HeaderSuperAdmin
          isProfileDropdownOpen={isProfileDropdownOpen}
          setIsProfileDropdownOpen={setIsProfileDropdownOpen}
          // Removing the setIsSidebarOpen prop since it's not in the component's interface
        />
        <div className="p-4">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
            <h1 className="text-2xl font-bold">Products Management</h1>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>

          {loading && !products.length ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map(renderProductCard)}
            </div>
          )}

          {/* Add Product Modal */}
          <Modal
            isOpen={showAddModal}
            onClose={() => {
              setShowAddModal(false);
              resetForm();
            }}
            title="Add New Product"
          >
            <ProductForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              loading={loading}
              submitText="Create Product"
              loadingText="Creating..."
            />
          </Modal>

          {/* Edit Product Modal */}
          <Modal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              resetForm();
            }}
            title="Edit Product"
          >
            <ProductForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleUpdate}
              loading={loading}
              submitText="Update Product"
              loadingText="Updating..."
              isEdit
            />
          </Modal>

          {/* Image Upload Modal */}
          <Modal
            isOpen={showImageUploadModal}
            onClose={() => {
              setShowImageUploadModal(false);
              resetForm();
              FetchProducts();
            }}
            title="Upload Product Images"
          >
            <ImageUploadForm
              selectedFiles={selectedFiles}
              setSelectedFiles={setSelectedFiles}
              onSubmit={handleImageUpload}
              loading={loading}
            />
          </Modal>
        </div>
      </div>
    </div>
  );
}
