"use client"

import { CreateInventoryRequest } from "@/types/inventory-types";
import { useState } from "react";
import Modal from "@/components/inventory-management/ModalInventory";

interface CreateInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateInventoryRequest) => Promise<void>;
}

export default function CreateInventoryModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateInventoryModalProps) {
  const [formData, setFormData] = useState<CreateInventoryRequest>({
    store_id: 0,
    product_id: 0,
    qty: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      onClose();
      setFormData({ store_id: 0, product_id: 0, qty: 0 });
    } catch (error) {
      console.error('Error creating inventory:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Inventory">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-200">
            Store ID
          </label>
          <input
            type="number"
            value={formData.store_id}
            onChange={(e) =>
              setFormData({ ...formData, store_id: parseInt(e.target.value) })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-200">
            Product ID
          </label>
          <input
            type="number"
            value={formData.product_id}
            onChange={(e) =>
              setFormData({ ...formData, product_id: parseInt(e.target.value) })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-200">
            Quantity
          </label>
          <input
            type="number"
            value={formData.qty}
            onChange={(e) =>
              setFormData({ ...formData, qty: parseInt(e.target.value) })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Create
          </button>
        </div>
      </form>
    </Modal>
  );
}
