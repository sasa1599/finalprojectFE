import { Package, ChevronLeft, ChevronRight } from "lucide-react";
import { PaginationParams } from "@/types/reports-superadmin-types";
import { InventoryTable } from "@/components/super-reports/InventoryTable";
import { Pagination } from "@/components/super-reports/Pagination";

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
}

interface InventoryItem {
  inventory_id: number;
  product: {
    id: number;
    name: string;
    category: string;
    price: number;
  };
  store: {
    id: number;
    name: string;
  };
  current_quantity: number;
  total_quantity: number;
  stockValue: number;
  lowStock: boolean;
}

interface InventoryDetailsProps {
  inventory: InventoryItem[];
  paginationInfo: PaginationInfo | null;
  paginationValues: PaginationParams;
  handlePageSizeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
}

export const InventoryDetails: React.FC<InventoryDetailsProps> = ({
  inventory,
  paginationInfo,
  paginationValues,
  handlePageSizeChange,
  goToPage,
  nextPage,
  prevPage,
}) => {
  // Generate array of page numbers for pagination
  const getPageNumbers = () => {
    if (!paginationInfo) return [];

    const { page, totalPages } = paginationInfo;
    const pageNumbers = [];

    // Logic to show current page, 2 pages before and after when available
    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(totalPages, page + 2);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="flex items-center gap-2 text-xl font-bold">
          <Package className="h-5 w-5" />
          Detailed Inventory
        </h2>

        {/* Page size selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="pageSize" className="text-sm text-gray-600">
            Items per page:
          </label>
          <select
            id="pageSize"
            value={paginationValues.limit}
            onChange={handlePageSizeChange}
            className="border rounded-md px-2 py-1 text-sm"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>

      <InventoryTable inventory={inventory} />

      {/* Pagination controls */}
      {paginationInfo && paginationInfo.totalPages > 1 && (
        <Pagination
          paginationInfo={paginationInfo}
          goToPage={goToPage}
          nextPage={nextPage}
          prevPage={prevPage}
          getPageNumbers={getPageNumbers}
        />
      )}
    </>
  );
};
