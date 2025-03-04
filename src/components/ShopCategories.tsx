"use client";

import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { categoryService } from "@/services/category-admin.service";
import { Category, PaginatedResponse } from "@/types/category-types";
import Image from "next/image";

export default function ShopCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 8,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories(pagination.currentPage);
  }, []);

  const fetchCategories = async (page: number = 1) => {
    try {
      setIsLoading(true);
      const response = await categoryService.getCategories(page);
      setCategories(response.data);
      setPagination(response.pagination);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch categories"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    fetchCategories(page);
  };

  if (isLoading) {
    return (
      <section className="bg-gradient-to-b from-neutral-950 to-neutral-900 py-20">
        <div className="max-w-[1440px] mx-auto px-20 text-center">
          <div className="text-2xl">
            <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-neutral-100 to-neutral-400 animate-pulse">
              Loading Categories...
            </span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-gradient-to-b from-neutral-950 to-neutral-900 py-20">
        <div className="max-w-[1440px] mx-auto px-20 text-center">
          <div className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-pink-500">
            {error}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-b from-neutral-950 to-neutral-900 py-20 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20">
        <h2 className="text-3xl sm:text-4xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-neutral-100 to-neutral-400">
          Shop by Category
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <Link
              key={category.category_id}
              href={`/category/${category.category_name.toLowerCase()}`}
              className="group relative rounded-xl overflow-hidden aspect-square animate-fadeIn"
            >
              {/* Glass background with gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-neutral-800/30 to-neutral-900/30 backdrop-blur-xl rounded-xl border border-neutral-800/50 transition-all duration-500 group-hover:backdrop-blur-2xl" />

              {/* Animated gradient border */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-rose-500/20 via-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Content container */}
              <div className="relative h-full p-8 flex flex-col items-center justify-center">
                <div className="relative w-2/3 aspect-square mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 via-purple-500/10 to-blue-500/10 rounded-full animate-pulse" />
                  <Image
                    src={category.category_thumbnail || "/placeholder.jpg"}
                    alt={`${category.category_name} thumbnail`}
                    fill
                    className="object-contain rounded-full transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                  />
                </div>

                <span className="text-xl font-medium text-center bg-clip-text text-transparent bg-gradient-to-r from-neutral-100 to-neutral-400 group-hover:from-rose-400 group-hover:via-purple-400 group-hover:to-blue-400 transition-all duration-300">
                  {category.category_name}
                </span>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <button className="relative group/btn">
                    {/* Animated border */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500 rounded-lg blur opacity-60 group-hover/btn:opacity-100 transition duration-300 animate-pulse"></div>

                    {/* Button background */}
                    <div className="relative flex items-center gap-2 px-6 py-2 bg-neutral-900 rounded-lg leading-none">
                      <span className="text-sm bg-clip-text text-transparent bg-gradient-to-r from-rose-100 via-purple-100 to-blue-100 font-medium">
                        Explore Now
                      </span>

                      {/* Arrow icon */}
                      <svg
                        className="w-4 h-4 stroke-neutral-100 transform translate-x-0 group-hover/btn:translate-x-0.5 transition-transform"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.5 12h15m0 0l-6-6m6 6l-6 6"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center mt-12 bg-clip-text text-transparent bg-gradient-to-r from-neutral-400 to-neutral-600">
            No categories available
          </div>
        )}

        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center mt-12 space-x-2">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className={`px-4 py-2 rounded-lg ${
                pagination.currentPage === 1
                  ? "bg-neutral-800 text-neutral-500"
                  : "bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
              } transition-colors`}
            >
              Previous
            </button>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-lg ${
                    pagination.currentPage === page
                      ? "bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500 text-white"
                      : "bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
                  } transition-colors`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className={`px-4 py-2 rounded-lg ${
                pagination.currentPage === pagination.totalPages
                  ? "bg-neutral-800 text-neutral-500"
                  : "bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
              } transition-colors`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
