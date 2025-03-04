import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface DeleteStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteStoreModal({ isOpen, onClose, onConfirm }: DeleteStoreModalProps) {
  const [animateIn, setAnimateIn] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      // Trigger animation after modal is shown
      setTimeout(() => setAnimateIn(true), 10);
    } else {
      setAnimateIn(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with dark overlay */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          animateIn ? "opacity-50" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <div 
        className={`relative w-full max-w-md rounded-lg bg-white shadow-xl transition-all duration-300 ${
          animateIn ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-900">Confirm Deletion</h2>
          <button 
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <p className="text-gray-700">
            Are you sure you want to delete this store? This action cannot be undone.
          </p>
        </div>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end space-y-2 space-y-reverse sm:space-y-0 sm:space-x-2 p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}