// paginationService.ts
import { useState } from "react";

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  limit: number;
}

export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const usePagination = (initialLimit: number = 8) => {
  const [state, setState] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    limit: initialLimit,
  });

  const setPage = (page: number) => {
    if (page >= 1 && page <= state.totalPages) {
      setState((prev) => ({ ...prev, currentPage: page }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const updateFromResponse = (paginationData: PaginationResponse) => {
    setState((prev) => ({
      ...prev,
      totalPages: paginationData.totalPages,
    }));
  };

  return {
    ...state,
    setPage,
    updateFromResponse,
  };
};
