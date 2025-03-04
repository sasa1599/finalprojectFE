import { Store } from "lucide-react";

interface StoreSummary {
  store_id: number;
  store_name: string;
  location: string;
  totalItems: number;
  totalValue: number;
  itemCount: number;
}

interface StoresSummaryTableProps {
  storesSummary: StoreSummary[];
}

export const StoresSummaryTable: React.FC<StoresSummaryTableProps> = ({
  storesSummary,
}) => {
  return (
    <>
      <h2 className="flex items-center gap-2 text-xl font-bold mb-4">
        <Store className="h-5 w-5" />
        Store Summary
      </h2>
      <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-8 border">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Store
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Location
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total Items
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total Value
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Item Count
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {storesSummary.map((store) => (
                <tr key={store.store_id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {store.store_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: {store.store_id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {store.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {store.totalItems.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Rp {store.totalValue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {store.itemCount} products
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
