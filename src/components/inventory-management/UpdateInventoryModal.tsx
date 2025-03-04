"use client"

import { Inventory, UpdateInventoryRequest } from "@/types/inventory-types";
import { useState, useEffect } from "react";
import Modal from "@/components/inventory-management/ModalInventory";

interface UpdateInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory?: Inventory;
  onSubmit: (invId: number, data: UpdateInventoryRequest) => Promise<void>;
}

export default function UpdateInventoryModal({
  isOpen,
  onClose,
  inventory,
  onSubmit,
}: UpdateInventoryModalProps) {
  const [formData, setFormData] = useState<UpdateInventoryRequest>({
    qty: 0,
    operation: 'add',
  });

  useEffect(() => {
    if (inventory) {
      setFormData({
        qty: 0,
        operation: 'add',
      });
    }
  }, [inventory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inventory) return;
    
    try {
      await onSubmit(inventory.inv_id, formData);
      onClose();
    } catch (error) {
      console.error('Error updating inventory:', error);
    }
  };

  if (!inventory) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Update Inventory: ${inventory.product.name}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-200">
            Operation
          </label>
          <select
            value={formData.operation}
            onChange={(e) => setFormData({ ...formData, operation: e.target.value as 'add' | 'subtract' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="add">Add</option>
            <option value="subtract">Subtract</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-200">
            Quantity
          </label>
          <input
            type="number"
            value={formData.qty}
            onChange={(e) => setFormData({ ...formData, qty: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
            min={0}
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
            Update
          </button>
        </div>
      </form>
    </Modal>
  );
}