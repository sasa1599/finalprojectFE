import React, { useRef } from "react";
import { Search, X } from "lucide-react";
import { Product } from "@/types/product-types";
import { SearchResult } from "./SearchResult";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  searchResults: Product[];
}

export const SearchModal = ({
  isOpen,
  onClose,
  onSearch,
  isLoading,
  searchResults,
}: SearchModalProps) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-label="Search products"
      className={`fixed inset-0 z-[100] pt-20 pb-20 flex justify-center ${
        isOpen
          ? "animate-in fade-in slide-in-from-top duration-300"
          : "animate-out fade-out slide-out-to-top duration-200"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl mx-4">
        <div className="relative overflow-hidden rounded-2xl h-[80vh]">
          {/* Glass background with subtle gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-800/90 to-neutral-900/95 backdrop-blur-xl border border-neutral-800/50" />

          <div className="relative h-full flex flex-col">
            {/* Header Section */}
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative flex items-center gap-3">
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 via-purple-500/20 to-blue-500/20 blur-xl" />
                  <Search className="relative w-5 h-5 text-neutral-400" />
                  <span className="relative text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-neutral-200 to-neutral-400">
                    Search Products
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="ml-auto relative group/btn"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-500/0 to-blue-500/0 group-hover/btn:from-rose-500/10 group-hover/btn:to-blue-500/10 rounded-full blur transition-all duration-300" />
                  <X className="relative w-5 h-5 text-neutral-400 group-hover/btn:text-neutral-200 transition-colors" />
                </button>
              </div>

              {/* Search Input Section */}
              <div className="group relative flex items-center">
                {/* Input background with hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-800 to-neutral-800/80 rounded-xl transition-colors group-hover:from-neutral-800/90 group-hover:to-neutral-800/70" />

                {/* Focus gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 via-purple-500/20 to-blue-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />

                {/* Search icon and input */}
                <Search className="relative ml-4 w-5 h-5 text-neutral-500 group-focus-within:text-neutral-400 transition-colors" />
                <input
                  ref={searchInputRef}
                  type="text"
                  autoFocus
                  placeholder="Search products..."
                  className="relative w-full bg-transparent text-neutral-200 placeholder-neutral-500 px-4 py-4 focus:outline-none"
                  onChange={onSearch}
                />

                {/* Loading spinner */}
                {isLoading && (
                  <div className="relative mr-4">
                    <div className="w-5 h-5 rounded-full border-2 border-neutral-700 border-t-neutral-300 animate-spin" />
                  </div>
                )}
              </div>
            </div>

            {/* Search Results Section */}
            {searchResults.length > 0 && (
              <div className="flex-1 overflow-hidden mt-2">
                <div className="h-full overflow-y-auto divide-y divide-neutral-800/50">
                  {searchResults.map((product) => (
                    <SearchResult
                      key={product.product_id}
                      product={product}
                      onClose={onClose}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
