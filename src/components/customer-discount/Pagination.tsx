// Pagination.tsx
import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  // Generate pagination items with ellipsis
  const generateItems = () => {
    const items = [];

    // Always show first page
    items.push({ type: "page" as const, page: 1 });

    // Add ellipsis if needed
    if (currentPage > 3) {
      items.push({ type: "ellipsis" as const });
    }

    // Add pages around current page
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (i === 1 || i === totalPages) continue; // Skip first and last pages
      items.push({ type: "page" as const, page: i });
    }

    // Add ellipsis if needed
    if (currentPage < totalPages - 2) {
      items.push({ type: "ellipsis" as const });
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      items.push({ type: "page" as const, page: totalPages });
    }

    return items;
  };

  return (
    <div className="flex justify-center items-center space-x-2 mt-8 mb-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-md ${
          currentPage === 1
            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
            : "bg-purple-700 text-white hover:bg-purple-600"
        }`}
      >
        Previous
      </button>

      <div className="flex space-x-1">
        {generateItems().map((item, index) => (
          <React.Fragment key={index}>
            {item.type === "ellipsis" ? (
              <span className="w-8 h-8 flex items-center justify-center text-gray-400">
                ...
              </span>
            ) : (
              <button
                onClick={() => onPageChange(item.page)}
                className={`w-8 h-8 flex items-center justify-center rounded-md ${
                  currentPage === item.page
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : "bg-gray-800 text-gray-200 hover:bg-gray-700"
                }`}
              >
                {item.page}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded-md ${
          currentPage === totalPages
            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
            : "bg-purple-700 text-white hover:bg-purple-600"
        }`}
      >
        Next
      </button>
    </div>
  );
};
