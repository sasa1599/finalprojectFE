
import { StoreData } from "@/types/store-types";
import StoreCard from "./StoreCard";
import { User } from "@/types/user-types";

interface StoreListProps {
  stores: StoreData[];
  users: User[];
  onDeleteStore: (storeId: number) => void;
  handleSuccess: () => void;
}

export default function StoreList({ stores, onDeleteStore, handleSuccess, users }: StoreListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {stores.map((store) => (
        <StoreCard
          key={store.store_id}
          store={store}
          onDelete={onDeleteStore}
          handleSuccess={handleSuccess}
          users={users}
        />
      ))}
    </div>
  );
}
