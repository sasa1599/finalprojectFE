import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product-types";
import { generateSlug } from "@/utils/slugUtils";
import { formatRupiah } from "@/helper/currencyRp";
import { ArrowUpRight } from "lucide-react";

interface SearchResultProps {
  product: Product;
  onClose: () => void;
}

export const SearchResult = ({ product, onClose }: SearchResultProps) => {
  return (
    <Link
      href={`/products/${generateSlug(product.name)}`}
      onClick={onClose}
      className="group relative block"
    >
      <div className="relative p-4 transition-colors hover:bg-neutral-800/50">
        <div className="flex items-center gap-4">
          {/* Product image */}
          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
            {/* Image overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 group-hover:opacity-0 transition-opacity duration-300" />

            {/* Image */}
            <Image
              src={product.ProductImage?.[0]?.url || "/product-placeholder.jpg"}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>

          {/* Product details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-medium text-neutral-200 truncate group-hover:text-white transition-colors">
                {product.name}
              </h3>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 via-purple-500/20 to-blue-500/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <ArrowUpRight className="relative w-4 h-4 text-neutral-500 transform group-hover:text-neutral-300 group-hover:rotate-12 transition-all duration-300" />
              </div>
            </div>

            <div className="mt-1.5 flex items-center gap-3">
              <span className="inline-flex px-2 py-0.5 text-xs rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700/50">
                {product.category.category_name}
              </span>
              <span className="text-sm bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-purple-400 to-blue-400 font-medium">
                {formatRupiah(product.price)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
