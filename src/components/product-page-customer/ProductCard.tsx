// ProductCard.tsx
import Image from "next/image";
import { Product } from "@/types/product-types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative h-48">
        <Image
          src={product.ProductImage?.[0]?.url || "/product-placeholder.jpg"}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-xl font-bold">Rp.{product.price.toLocaleString()}</span>
          <div className="flex gap-2">
            <button className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">See More</button>
            <button className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
}