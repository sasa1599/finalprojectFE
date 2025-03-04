"use client";

import { useState, useEffect, useRef } from "react";
import { Category } from "@/types/category-types";
import { categoryService } from "@/services/category-admin.service";
import { toast } from "react-toastify";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";

interface FilterCategoriesProps {
  onCategoryChange: (categoryId?: number) => void;
  selectedCategory?: number;
}

export function FilterCategories({
  onCategoryChange,
  selectedCategory,
}: FilterCategoriesProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCategories();

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const fetchedCategories = await categoryService.getAllCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCategorySelect = (categoryId?: number) => {
    console.log("Selected category:", categoryId);
    onCategoryChange(categoryId);
    setIsDropdownOpen(false);
    setSearchTerm("");
  };

  const filteredCategories = categories.filter((category) =>
    category.category_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSelectedCategoryName = () => {
    if (!selectedCategory) return "All Categories";
    const category = categories.find((c) => c.category_id === selectedCategory);
    return category ? category.category_name : "All Categories";
  };

  return (
    <div className="relative w-full max-w-xs z-30" ref={dropdownRef}>
      {/* Filter Label */}
      <div className="flex items-center mb-2 text-sm font-medium text-neutral-400">
        <Filter size={16} className="mr-1" />
        <span>Filter by Category</span>
      </div>

      {/* Dropdown Trigger */}
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-between w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg cursor-pointer hover:bg-neutral-750 transition-colors"
        type="button"
      >
        <span className={selectedCategory ? "text-white" : "text-neutral-400"}>
          {getSelectedCategoryName()}
        </span>
        {isDropdownOpen ? (
          <ChevronUp size={18} className="text-neutral-400" />
        ) : (
          <ChevronDown size={18} className="text-neutral-400" />
        )}
      </button>

      {/* Dropdown Panel with fixed positioning */}
      {isDropdownOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg">
          {/* Search Box */}
          <div className="p-2 border-b border-neutral-700">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-neutral-700 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-neutral-400"
              onClick={(e) => e.stopPropagation()} // Prevent closing dropdown when clicking in search
            />
          </div>

          {/* Categories List */}
          <div className="max-h-60 overflow-y-auto py-1">
            {/* All Categories Option */}
            <button
              onClick={() => handleCategorySelect(undefined)}
              type="button"
              className={`w-full text-left px-4 py-3 text-sm cursor-pointer ${
                !selectedCategory
                  ? "bg-purple-900/30 text-purple-400 font-medium"
                  : "hover:bg-neutral-700 text-neutral-300"
              }`}
            >
              All Categories
            </button>

            {/* Loading Indicator */}
            {loading && (
              <div className="flex justify-center items-center p-4">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
              </div>
            )}

            {/* Category Options */}
            {!loading && filteredCategories.length > 0
              ? filteredCategories.map((category) => (
                  <button
                    key={category.category_id}
                    onClick={() => handleCategorySelect(category.category_id)}
                    type="button"
                    className={`w-full text-left px-4 py-3 text-sm cursor-pointer ${
                      selectedCategory === category.category_id
                        ? "bg-purple-900/30 text-purple-400 font-medium"
                        : "hover:bg-neutral-700 text-neutral-300"
                    }`}
                  >
                    {category.category_name}
                  </button>
                ))
              : !loading && (
                  <div className="px-4 py-3 text-sm text-neutral-400 text-center italic">
                    No categories found
                  </div>
                )}
          </div>
        </div>
      )}
    </div>
  );
}
