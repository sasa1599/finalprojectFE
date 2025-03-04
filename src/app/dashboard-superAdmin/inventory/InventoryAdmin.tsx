"use client";

import { useState, useEffect } from "react";
import {
  RefreshCw,
  ArrowUpDown,
  FileText,
  ChevronLeft,
  ChevronRight,
  Package,
} from "lucide-react";
import type {
  Inventory,
  UpdateInventoryRequest,
  PaginationMetadata,
} from "@/types/inventory-types";
import { InventoryService } from "@/services/useInventoryAdmin";
import { categoryService } from "@/services/category-admin.service";
import LogService from "@/services/log.service";
import { LogViewer } from "@/components/inventory-management/LogViewer";
import InventoryTable from "@/components/inventory-management/InventoryTable";
import UpdateInventoryModal from "@/components/inventory-management/UpdateInventoryModal";
import { toast } from "sonner";
import { LogDetails } from "@/types/log-types";

export default function Inventory() {
  const [inventoryData, setInventoryData] = useState<Inventory[]>([]);
  const [pagination, setPagination] = useState<PaginationMetadata>({
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isLogViewerOpen, setIsLogViewerOpen] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState<
    Inventory | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [previousInventoryData, setPreviousInventoryData] = useState<
    Inventory[]
  >([]);

  const createLog = (
    action: string,
    details: LogDetails,
    inventory?: Inventory
  ) => {
    if (action === "Update") {
      const logDescription = inventory
        ? `Updated ${inventory.product.name} at ${inventory.store.store_name}. 
          Quantity ${details.updates?.operation}: ${details.updates?.qty}`
        : JSON.stringify(details);

      LogService.createLog({
        action,
        description: logDescription,
        module: "Inventory Management",
        timestamp: new Date(),
      });
    } else {
      // For other action types (Add, Delete, Refresh, Error, Edit)
      LogService.createLog({
        action,
        description: JSON.stringify(details),
        module: "Inventory Management",
        timestamp: new Date(),
      });
    }
  };

  const fetchInventoryAndCategories = async (page = 1) => {
    try {
      setIsRefreshing(true);
      const [inventoryResponse, categoriesResponse] = await Promise.all([
        InventoryService.getInventory({ page }),
        categoryService.getCategories(),
      ]);

      const { data: newInventoryData, pagination: newPagination } =
        inventoryResponse;

      if (pagination.page === page) {
        const addedItems = newInventoryData.filter(
          (newItem) =>
            !previousInventoryData.some(
              (oldItem: Inventory) => oldItem.inv_id === newItem.inv_id
            )
        );

        const deletedItems = previousInventoryData.filter(
          (oldItem: Inventory) =>
            !newInventoryData.some(
              (newItem) => newItem.inv_id === oldItem.inv_id
            )
        );

        if (addedItems.length > 0) {
          createLog("Add", {
            items: addedItems.map((item: Inventory) => ({
              id: item.inv_id,
              name: item.product.name,
              store: item.store.store_name,
              quantity: item.qty,
            })),
            totalAddedItems: addedItems.length,
          });
        }

        if (deletedItems.length > 0) {
          createLog("Delete", {
            items: deletedItems.map((item: Inventory) => ({
              id: item.inv_id,
              name: item.product.name,
              store: item.store.store_name,
              quantity: item.qty,
            })),
            totalDeletedItems: deletedItems.length,
          });
        }
      }

      const categoriesData = categoriesResponse.data || [];

      setInventoryData(newInventoryData);
      setPagination(newPagination);
      setCategoriesCount(categoriesData.length);
      setPreviousInventoryData(newInventoryData);

      createLog("Refresh", {
        totalItems: newPagination.total,
        totalCategories: categoriesData.length,
        message: `Inventory refreshed`,
      });
    } catch (error) {
      console.error("Error fetching inventory or categories:", error);
      toast.error("Failed to fetch inventory or categories");
      createLog("Error", {
        message: "Failed to refresh inventory and categories",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInventoryAndCategories();
  }, []);

  const handleUpdateInventory = async (
    invId: number,
    formData: UpdateInventoryRequest
  ) => {
    try {
      await InventoryService.updateInventory(invId, formData);
      toast.success("Inventory updated successfully");
      const updatedInventory = inventoryData.find(
        (item) => item.inv_id === invId
      );

      // Create a properly formatted LogUpdates object from formData
      const logUpdates = {
        operation: formData.operation,
        qty: formData.qty,
      };

      createLog(
        "Update",
        {
          itemId: invId,
          updates: logUpdates,
        },
        updatedInventory
      );

      fetchInventoryAndCategories(pagination.page);
      setIsUpdateModalOpen(false);
    } catch (error) {
      console.error("Error updating inventory:", error);
      toast.error("Failed to update inventory");
      createLog("Update", {
        itemId: invId,
        message: "Failed to update inventory item",
      });
    }
  };

  const handleDeleteInventory = async (invId: number) => {
    if (!window.confirm("Are you sure you want to delete this inventory?"))
      return;

    try {
      const itemToDelete = inventoryData.find((item) => item.inv_id === invId);

      await InventoryService.deleteInventory(invId);
      toast.success("Inventory deleted successfully");
      if (itemToDelete) {
        createLog("Delete", {
          item: {
            id: itemToDelete.inv_id,
            name: itemToDelete.product.name,
            store: itemToDelete.store.store_name,
            quantity: itemToDelete.qty,
          },
        });
      }
      const nextPage =
        inventoryData.length === 1 && pagination.page > 1
          ? pagination.page - 1
          : pagination.page;

      fetchInventoryAndCategories(nextPage);
    } catch (error) {
      console.error("Error deleting inventory:", error);
      toast.error("Failed to delete inventory");
      createLog("Error", {
        itemId: invId,
        message: "Failed to delete inventory item",
      });
    }
  };

  const handleEdit = (inventory: Inventory) => {
    setSelectedInventory(inventory);
    setIsUpdateModalOpen(true);

    createLog("Edit", {
      itemId: inventory.inv_id,
      productName: inventory.product.name,
      storeName: inventory.store.store_name,
    });
  };

  const handleViewLogs = () => {
    setIsLogViewerOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    fetchInventoryAndCategories(newPage);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Inventory Management
            </h1>
            <p className="text-gray-500 mt-1">
              Manage and track your inventory items
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            <button
              onClick={handleViewLogs}
              className="flex items-center px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <FileText className="w-4 h-4 mr-2" />
              View Logs
            </button>
            <button
              onClick={() => fetchInventoryAndCategories(pagination.page)}
              disabled={isRefreshing}
              className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Items</p>
                <h3 className="text-2xl font-bold mt-1">{pagination.total}</h3>
              </div>
              <div className="p-2 bg-blue-50 rounded-full">
                <Package className="w-5 h-5 text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Last Updated
                </p>
                <h3 className="text-2xl font-bold mt-1">
                  {new Date().toLocaleDateString()}
                </h3>
              </div>
              <div className="p-2 bg-green-50 rounded-full">
                <RefreshCw className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Categories</p>
                <h3 className="text-2xl font-bold mt-1">{categoriesCount}</h3>
              </div>
              <div className="p-2 bg-purple-50 rounded-full">
                <ArrowUpDown className="w-5 h-5 text-purple-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Inventory Items
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {inventoryData.length > 0
                ? `Showing ${inventoryData.length} of ${pagination.total} items (Page ${pagination.page} of ${pagination.totalPages})`
                : "No items found"}
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <p className="mt-4 text-gray-500">Loading inventory...</p>
              </div>
            </div>
          ) : (
            <div>
              {inventoryData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 p-8">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    No inventory items found
                  </p>
                  <p className="text-gray-500 text-center max-w-md mb-6">
                    No inventory items available.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <InventoryTable
                    inventoryData={inventoryData}
                    onEdit={handleEdit}
                    onDelete={handleDeleteInventory}
                  />
                  <div className="flex justify-between items-center p-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      Showing {inventoryData.length} of {pagination.total} items
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={!pagination.hasPrevPage}
                        className="p-2 rounded-md border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="text-sm font-medium">
                        Page {pagination.page} of {pagination.totalPages}
                      </span>
                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={!pagination.hasNextPage}
                        className="p-2 rounded-md border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        aria-label="Next page"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {isUpdateModalOpen && (
        <UpdateInventoryModal
          isOpen={isUpdateModalOpen}
          onClose={() => {
            setIsUpdateModalOpen(false);
            setSelectedInventory(undefined);
          }}
          inventory={selectedInventory}
          onSubmit={handleUpdateInventory}
        />
      )}

      {isLogViewerOpen && (
        <LogViewer onClose={() => setIsLogViewerOpen(false)} />
      )}
    </>
  );
}
