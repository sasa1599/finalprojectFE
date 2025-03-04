// discountService.ts
import { Discount } from "@/types/discount-types";

export const fetchDiscounts = async (
  page: number,
  limit: number
): Promise<{
  success: boolean;
  data: Discount[];
  pagination: {
    totalPages: number;
    page: number;
    limit: number;
    total: number;
  };
}> => {
  try {
    const queryParams = new URLSearchParams({
      unassigned: "true",
      page: String(page),
      limit: String(limit),
    });

    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL_BE
      }/discount?${queryParams.toString()}`
    );
    return await response.json();
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An error occurred"
    );
  }
};
