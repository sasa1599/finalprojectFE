import { Filter } from "lucide-react";
import { InventoryReportFilters } from "@/types/reports-superadmin-types";

interface FilterFormProps {
  filterValues: InventoryReportFilters;
  handleFilterChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export const FilterForm: React.FC<FilterFormProps> = ({
  filterValues,
  handleFilterChange,
  handleSubmit,
}) => {
  return (
    <div className="bg-white shadow-sm rounded-lg p-6 mb-8 border">
      <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
        <Filter className="h-5 w-5" />
        Filters
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <div>
          <label
            htmlFor="storeId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Store ID
          </label>
          <input
            type="number"
            id="storeId"
            name="storeId"
            value={filterValues.storeId || ""}
            onChange={handleFilterChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="Filter by store ID"
          />
        </div>

        <div>
          <label
            htmlFor="productId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Product ID
          </label>
          <input
            type="number"
            id="productId"
            name="productId"
            value={filterValues.productId || ""}
            onChange={handleFilterChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="Filter by product ID"
          />
        </div>

        <div>
          <label
            htmlFor="threshold"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Low Stock Threshold
          </label>
          <input
            type="number"
            id="threshold"
            name="threshold"
            value={filterValues.threshold || ""}
            onChange={handleFilterChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="Threshold value"
          />
        </div>

        <div className="flex items-end mb-4">
          <div className="flex items-center h-10">
            <input
              type="checkbox"
              id="lowStock"
              name="lowStock"
              checked={filterValues.lowStock || false}
              onChange={handleFilterChange}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <label
              htmlFor="lowStock"
              className="ml-2 block text-sm text-gray-700"
            >
              Show Low Stock Only
            </label>
          </div>
        </div>

        <div className="md:col-span-2 lg:col-span-4 flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  );
};
