// components/ui/OrderNotFound.tsx
import React from "react";
import Link from "next/link";

export function OrderNotFound(): React.ReactElement {
  return (
    <div className="container mx-auto p-4">
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
        <h2 className="text-lg font-medium text-yellow-800 mb-2">
          Order Not Found
        </h2>
        <p className="text-yellow-700">
          We couldn&apos;t find the order you&apos;re looking for.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block text-blue-600 hover:underline"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
