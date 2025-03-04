import { notFound } from "next/navigation";
import { productService } from "@/services/product.service";
import ProductDetailClient from "@/components/product-detail/ProductDetail";

import ToastProvider from "@/components/product-detail/ToastContainer"; // Adjust path as needed



interface ProductDetailProps {
  params: {
    slug: string;
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailProps) {
  try {
    const product = await productService.getProductBySlug(params.slug);

    if (!product) {
      return notFound();
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-950 to-neutral-900 pt-24 pb-12">
        {/* Client-side only Toast provider */}
        <ToastProvider />
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-800/30 to-neutral-900/30 backdrop-blur-xl border border-neutral-800/50" />
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 via-purple-500/20 to-blue-500/20 opacity-50" />
            <ProductDetailClient product={product} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    return notFound();
  }
}
