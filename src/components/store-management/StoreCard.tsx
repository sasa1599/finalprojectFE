import { PencilIcon, Trash2 } from "lucide-react";
import { StoreData } from "@/types/store-types";
import { useState } from "react";
import EditStoreModal from "./EditStoreModal";
import { User } from "@/types/user-types";

interface StoreCardProps {
  store: StoreData;
  onDelete: (storeId: number) => void;
  handleSuccess: () => void;
  users: User[];
}

export default function StoreCard({
  store,
  onDelete,
  handleSuccess,
  users,
}: StoreCardProps) {
  const [modal, setModal] = useState<boolean>(false);
  const handleDelete = () => {
    onDelete(store.store_id!);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {store.store_name}
          </h2>
          <p className="text-sm text-gray-600 mb-1">{store.address}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setModal(true);
            }}
            className="text-green-600 hover:text-green-700 p-1"
            title="Edit Store"
          >
            <PencilIcon className="w-5 h-5" />
          </button>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700 p-1"
            title="Delete store"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
      <EditStoreModal
        isOpen={modal}
        onClose={() => setModal(false)}
        dataStore={store}
        onSuccess={handleSuccess}
        users={users}
      />
    </div>
  );
}
