"use client";

import { useState, useEffect } from "react";
import { storeService } from "@/services/store-admin.service";
import { StoreData } from "@/types/store-types";
import StoreList from "@/components/store-management/StoreList";
import AddStoreModal from "@/components/store-management/AddStoreModal";
import { UserManagementService } from "@/services/user-management.service";
import { User } from "@/types/user-types";
import DeleteStoreModal from "@/components/store-management/DeleteStoreModal";

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function StoreDashboard() {
  const [stores, setStores] = useState<StoreData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<StoreData>({
    store_name: "",
    address: "",
    subdistrict: "",
    city: "",
    province: "",
    postcode: "",
  });
  const [storeAdmins, setStoreAdmins] = useState<User[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [storeToDelete, setStoreToDelete] = useState<number | null>(null);

  // Add pagination state
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const handleSuccess = () => {
    fetchStores();
  };

  useEffect(() => {
    fetchStores();
    fetchUsers();
  }, []);

  const fetchStores = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const response = await storeService.getStores({ page, limit });

      // Set stores from the data property
      setStores(response.data);

      // Set pagination information
      setPagination(response.pagination);
    } catch (error) {
      console.error("Error fetching stores:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await UserManagementService.getAllStoreAdmin();
      setStoreAdmins(data);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  const confirmDeleteStore = (storeId: number) => {
    setStoreToDelete(storeId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteStore = async () => {
    if (storeToDelete !== null) {
      try {
        await storeService.deleteStore(storeToDelete);
        await fetchStores();
      } catch (error) {
        console.error("Error deleting store:", error);
      } finally {
        setIsDeleteModalOpen(false);
        setStoreToDelete(null);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      store_name: "",
      address: "",
      subdistrict: "",
      city: "",
      province: "",
      postcode: "",
      description: "",
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  // Handle page navigation
  const handlePageChange = (newPage: number) => {
    fetchStores(newPage, pagination.limit);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Store Management
            </h1>
            <p className="text-gray-600">
              {pagination.total > 0
                ? `Showing ${stores.length} of ${pagination.total} stores`
                : "No stores found"}
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 sm:mt-0 w-full sm:w-auto flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New Store
          </button>
        </div>
      </header>

      {/* Store list */}
      <StoreList
        stores={stores}
        onDeleteStore={confirmDeleteStore}
        handleSuccess={handleSuccess}
        users={storeAdmins}
      />

      {/* Pagination controls */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={!pagination.hasPrevPage}
              className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-gray-600">
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!pagination.hasNextPage}
              className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddStoreModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
        users={storeAdmins}
      />

      <DeleteStoreModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteStore}
      />
    </>
  );
}
