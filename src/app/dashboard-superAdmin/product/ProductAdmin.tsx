"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";

import Modal from "@/components/product-management/Modal";
import ProductForm from "@/components/product-management/ProductForm";
import ImageUploadForm from "@/components/product-management/ImageUploadForm";
import { Pagination } from "@/components/product-list/Pagination";

import { Product, ProductFormData } from "@/types/product-types";
import { productService } from "@/services/product.service";
import { formatRupiah } from "@/helper/currencyRp";

export default function ProductAdmin() {
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showImageUploadModal, setShowImageUploadModal] =
    useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    category_id: "",
    store_id: "",
    initial_quantity: "",
  });

  // Effects
  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  // Data fetching
  const fetchProducts = async (page: number) => {
    setLoading(true);
    try {
      const response = await productService.getProducts(page);
      setProducts(response.products);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Form handlers
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newProduct = await productService.createProduct(formData);
      setSelectedProduct(newProduct);
      setShowAddModal(false);
      setShowImageUploadModal(true);
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedProduct || selectedFiles.length === 0) return;

    setLoading(true);
    try {
      await productService.uploadProductImages(
        selectedProduct.product_id,
        selectedFiles
      );
      await fetchProducts(currentPage);
      setShowImageUploadModal(false);
      resetForm();
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!selectedProduct) throw new Error("No product selected");
      await productService.updateProduct(selectedProduct.product_id, formData);
      await fetchProducts(currentPage);
      setShowEditModal(false);
      resetForm();
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await productService.deleteProduct(productId);
      await fetchProducts(currentPage);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category_id: "",
      store_id: "",
      initial_quantity: "",
    });
    setSelectedProduct(null);
    setSelectedFiles([]);
  };

  // UI components
  const renderProductCard = (product: Product) => (
    <div
      key={product.product_id}
      className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
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
        <h3 className="text-lg font-semibold mb-2 text-gray-800">
          {product.name}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Category</span>
            <span className="text-sm font-medium">
              {product.category.category_name}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Price</span>
            <span className="text-sm font-medium text-blue-600">
              {formatRupiah(product.price)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Store</span>
            <span className="text-sm font-medium">
              {product.store.store_name}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
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
            className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Pencil className="w-4 h-4" /> Edit
          </button>
          <button
            onClick={() => handleDelete(product.product_id)}
            className="flex items-center gap-1 px-3 py-1.5 bg-red-50 border border-red-200 text-red-600 rounded-md hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Products Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your store&apos;s product catalog
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Content */}
      {loading && !products.length ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-sm">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-blue-500"></div>
            <p className="mt-4 text-gray-500">Loading products...</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              All Products
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Showing {products.length} products
            </p>
          </div>

          <div className="p-6">
            {products.length === 0 ? (
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
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </div>
                <p className="text-lg font-medium text-gray-700 mb-2">
                  No products found
                </p>
                <p className="text-gray-500 text-center mt-2 max-w-md">
                  Click the &quot;Add Product&quot; button to create your first
                  product.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(renderProductCard)}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center py-4 border-t border-gray-200">
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      )}

      {/* Modals */}
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

      <Modal
        isOpen={showImageUploadModal}
        onClose={() => {
          setShowImageUploadModal(false);
          resetForm();
          fetchProducts(currentPage);
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
    </>
  );
}
