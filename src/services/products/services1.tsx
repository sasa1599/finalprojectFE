import { productService } from "@/components/hooks/useProductAdmin";
import { Product, ProductFormData } from "@/types/product-types";
import React, { useState } from "react";

const Services1 = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
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

  const FetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

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
      await FetchProducts();
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
      await FetchProducts();
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
      await FetchProducts();
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

  return {
    // State & Setter
    loading, setLoading,
    isSidebarOpen, setIsSidebarOpen,
    isProfileDropdownOpen, setIsProfileDropdownOpen,
    products, setProducts,
    showAddModal, setShowAddModal,
    showEditModal, setShowEditModal,
    showImageUploadModal, setShowImageUploadModal,
    selectedProduct, setSelectedProduct,
    selectedFiles, setSelectedFiles,
    formData, setFormData,
  
    // Functions
    FetchProducts,
    handleSubmit,
    handleImageUpload,
    handleUpdate,
    handleDelete,
    resetForm,
  };  
};

export default Services1;
