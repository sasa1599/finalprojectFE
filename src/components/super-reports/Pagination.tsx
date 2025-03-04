import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
}

interface PaginationProps {
  paginationInfo: PaginationInfo;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  getPageNumbers: () => number[];
}

export const Pagination: React.FC<PaginationProps> = ({
  paginationInfo,
  goToPage,
  nextPage,
  prevPage,
  getPageNumbers,
}) => {
  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg shadow-sm mb-8">
      {/* Desktop pagination */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">
              {(paginationInfo.page - 1) * paginationInfo.limit + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(
                paginationInfo.page * paginationInfo.limit,
                paginationInfo.total
              )}
            </span>{" "}
            of <span className="font-medium">{paginationInfo.total}</span>{" "}
            results
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              onClick={prevPage}
              disabled={!paginationInfo.hasPrevPage}
              className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ${
                paginationInfo.hasPrevPage
                  ? "hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>

            {/* First page link */}
            {getPageNumbers()[0] > 1 && (
              <>
                <button
                  onClick={() => goToPage(1)}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  1
                </button>
                {getPageNumbers()[0] > 2 && (
                  <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700">
                    ...
                  </span>
                )}
              </>
            )}

            {/* Page number buttons */}
            {getPageNumbers().map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => goToPage(pageNumber)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                  pageNumber === paginationInfo.page
                    ? "bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    : "text-gray-900 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                }`}
              >
                {pageNumber}
              </button>
            ))}

            {/* Last page link */}
            {getPageNumbers()[getPageNumbers().length - 1] <
              paginationInfo.totalPages && (
              <>
                {getPageNumbers()[getPageNumbers().length - 1] <
                  paginationInfo.totalPages - 1 && (
                  <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700">
                    ...
                  </span>
                )}
                <button
                  onClick={() => goToPage(paginationInfo.totalPages)}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  {paginationInfo.totalPages}
                </button>
              </>
            )}

            <button
              onClick={nextPage}
              disabled={!paginationInfo.hasNextPage}
              className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ${
                paginationInfo.hasNextPage
                  ? "hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>

      {/* Mobile pagination */}
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={prevPage}
          disabled={!paginationInfo.hasPrevPage}
          className={`relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${
            paginationInfo.hasPrevPage
              ? "text-gray-700 hover:bg-gray-50"
              : "text-gray-300 cursor-not-allowed"
          }`}
        >
          Previous
        </button>
        <div className="text-sm text-gray-700">
          Page {paginationInfo.page} of {paginationInfo.totalPages}
        </div>
        <button
          onClick={nextPage}
          disabled={!paginationInfo.hasNextPage}
          className={`relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${
            paginationInfo.hasNextPage
              ? "text-gray-700 hover:bg-gray-50"
              : "text-gray-300 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};
