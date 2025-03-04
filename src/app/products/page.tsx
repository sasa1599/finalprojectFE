"use client";
import { useEffect, useState, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Product } from "@/types/product-types";
import { productService } from "@/services/product.service";
import ProductCard from "@/components/product-list/ProductCard";
import { Pagination } from "@/components/product-list/Pagination";
import { FilterCategories } from "@/components/product-list/FilteByCategories";
import { FilterByPrice } from "@/components/product-list/FIlterByPrice";
import { useGeolocation } from "@/components/hooks/useGeolocation";
import { sortByDistance } from "@/utils/distanceCalc";
import { MapPin, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import EnhancedTechEliteBanner from "@/components/product-list/TechLiteBanner";

export default function ProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMobile, setIsMobile] = useState(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<(Product & { distance?: number })[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const [totalPages, setTotalPages] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(
    searchParams.get("categoryId")
      ? Number(searchParams.get("categoryId"))
      : undefined
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get("minPrice")) || 0,
    Number(searchParams.get("maxPrice")) || 30000000,
  ]);
  const { location, loading: locationLoading } = useGeolocation();
  const [useNearestSort, setUseNearestSort] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const fetchProducts = useCallback(
    async (
      page: number,
      categoryId?: number,
      minPrice?: number,
      maxPrice?: number
    ) => {
      setLoading(true);
      try {
        const data = await productService.getProducts(
          page,
          isMobile ? 6 : 8, // Fewer products per page on mobile
          categoryId,
          minPrice,
          maxPrice
        );

        setUseNearestSort(false);

        if (location) {
          const productsWithDistance = sortByDistance(
            data.products,
            location.latitude,
            location.longitude,
            (product) => ({
              lat: product.store.latitude,
              lon: product.store.longitude,
            })
          );
          setProducts(productsWithDistance);
          setUseNearestSort(true);
        } else {
          setProducts(data.products);
        }

        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to fetch products", {
          position: "bottom-right",
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    },
    [location, isMobile]
  );

  const updateURLParams = useCallback(
    (params: {
      page?: number;
      categoryId?: number;
      minPrice?: number;
      maxPrice?: number;
    }) => {
      const urlParams = new URLSearchParams(searchParams.toString());

      if (params.page !== undefined) {
        urlParams.set("page", params.page.toString());
      }

      if (params.categoryId !== undefined) {
        if (params.categoryId === 0) {
          urlParams.delete("categoryId");
        } else {
          urlParams.set("categoryId", params.categoryId.toString());
        }
      }

      if (params.minPrice !== undefined) {
        urlParams.set("minPrice", params.minPrice.toString());
      }

      if (params.maxPrice !== undefined) {
        urlParams.set("maxPrice", params.maxPrice.toString());
      }

      router.push(`/products?${urlParams.toString()}`);
    },
    [router, searchParams]
  );

  useEffect(() => {
    fetchProducts(currentPage, selectedCategory, priceRange[0], priceRange[1]);
  }, [currentPage, selectedCategory, priceRange, fetchProducts]);

  useEffect(() => {
    if (location && products.length > 0 && !loading) {
      const productsWithDistance = sortByDistance(
        products,
        location.latitude,
        location.longitude,
        (product) => ({
          lat: product.store.latitude,
          lon: product.store.longitude,
        })
      );

      setProducts(productsWithDistance);
      setUseNearestSort(true);
    }
  }, [location, products.length, loading]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    updateURLParams({ page: newPage });

    // Scroll to top on page change
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleCategoryChange = (categoryId?: number) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
    updateURLParams({
      page: 1,
      categoryId: categoryId || 0,
    });
  };

  const handlePriceChange = (newPriceRange: [number, number]) => {
    setPriceRange(newPriceRange);
    setCurrentPage(1);
    updateURLParams({
      page: 1,
      minPrice: newPriceRange[0],
      maxPrice: newPriceRange[1],
    });
  };

  const handleCartUpdate = () => {
    toast.success("Cart updated successfully", {
      position: "bottom-right",
      autoClose: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 to-neutral-900 pt-20">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <EnhancedTechEliteBanner />
        <div className="space-y-6 md:space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-100 to-neutral-400">
                Our Products
              </h2>
              <p className="text-neutral-500">
                Page {currentPage} of {totalPages}
              </p>
            </div>
            {useNearestSort ? (
              <div className="flex items-center text-sm text-emerald-500">
                <MapPin className="w-4 h-4 mr-1" />
                <span>Showing nearest stores first</span>
              </div>
            ) : locationLoading ? (
              <div className="flex items-center text-sm text-neutral-400">
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                <span>Finding nearby stores...</span>
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3">
              <FilterCategories
                onCategoryChange={handleCategoryChange}
                selectedCategory={selectedCategory}
              />
            </div>
            <div className="md:col-span-1">
              <FilterByPrice
                onPriceChange={handlePriceChange}
                minPrice={0}
                maxPrice={30000000}
                initialRange={priceRange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {loading
              ? Array.from({ length: isMobile ? 6 : 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse bg-neutral-800 rounded-lg p-4 h-64 md:h-72"
                  >
                    <div className="bg-neutral-700 h-32 md:h-40 rounded-lg mb-4"></div>
                    <div className="bg-neutral-700 h-6 w-3/4 rounded mb-2"></div>
                    <div className="bg-neutral-700 h-6 w-1/2 rounded"></div>
                  </div>
                ))
              : products.map((product) => (
                  <ProductCard
                    key={product.product_id}
                    product={product}
                    onCartUpdate={handleCartUpdate}
                    showDistance={useNearestSort}
                  />
                ))}
          </div>

          {totalPages > 1 && !loading && (
            <div className="mt-8 md:mt-12 flex justify-center">
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
