import React, { useState } from "react";
import { Plus, RefreshCw, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import UserCard from "./UserCard";
import UserForm from "./UserForm";
import useFetchUsers from "../../services/fetch-users.service";

export default function UserManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { 
    users, 
    error, 
    isFetching, 
    pagination, 
    fetchUsers, 
    goToPage, 
    changePageSize, 
    deleteUser 
  } = useFetchUsers();

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      goToPage(newPage);
    }
  };

  const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    changePageSize(Number(event.target.value));
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const totalPages = pagination.totalPages;
    const currentPage = pagination.page;
    
    // Always show first page, last page, current page, and at most 1 page before and after current
    const pagesToShow = new Set([1, totalPages, currentPage, currentPage - 1, currentPage + 1]);
    
    // Convert to array and filter out invalid pages
    const pagesArray = Array.from(pagesToShow).filter(
      page => page >= 1 && page <= totalPages
    ).sort((a, b) => a - b);
    
    // Add page numbers with ellipsis where needed
    for (let i = 0; i < pagesArray.length; i++) {
      if (i > 0 && pagesArray[i] - pagesArray[i - 1] > 1) {
        pageNumbers.push('...');
      }
      pageNumbers.push(pagesArray[i]);
    }
    
    return pageNumbers;
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => fetchUsers(pagination.page, pagination.limit)}
            disabled={isFetching}
            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
            title="Refresh Users"
          >
            <RefreshCw
              className={`${isFetching ? "animate-spin" : ""}`}
              size={20}
            />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            <Plus className="mr-2" size={20} />
            Create User
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-800 p-3 rounded-lg mb-4 flex items-center">
          <AlertTriangle className="mr-2" size={20} />
          <span>{error}</span>
        </div>
      )}
      {/* User List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {isFetching ? (
          <div className="col-span-full flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : Array.isArray(users) && users.length > 0 ? (
          users.map((user) => (
            <UserCard key={user.user_id} user={user} onDelete={deleteUser} />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-lg text-gray-500">No users found</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {!isFetching && pagination.totalPages > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center border-t pt-4">
          <div className="mb-4 sm:mb-0">
            <span className="text-sm text-gray-700">
              Showing <span className="font-medium">{users.length}</span> of{" "}
              <span className="font-medium">{pagination.total}</span> users
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <label htmlFor="perPage" className="mr-2 text-sm">
                Per page:
              </label>
              <select
                id="perPage"
                value={pagination.limit}
                onChange={handleLimitChange}
                className="border rounded p-1 text-sm"
                disabled={isFetching}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={!pagination.hasPrevPage || isFetching}
                className="p-1 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>

              {getPageNumbers().map((page, index) => (
                page === '...' ? (
                  <span key={`ellipsis-${index}`} className="px-2">...</span>
                ) : (
                  <button
                    key={`page-${page}`}
                    onClick={() => handlePageChange(Number(page))}
                    disabled={isFetching}
                    className={`w-8 h-8 rounded-md ${
                      pagination.page === Number(page)
                        ? 'bg-blue-500 text-white'
                        : 'border hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                )
              ))}

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!pagination.hasNextPage || isFetching}
                className="p-1 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Form Modal */}
      {isModalOpen && (
        <UserForm
          closeModal={() => setIsModalOpen(false)}
          refreshUsers={() => fetchUsers(pagination.page, pagination.limit)}
        />
      )}
    </div>
  );
}