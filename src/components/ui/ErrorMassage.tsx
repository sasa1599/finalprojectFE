// components/ui/ErrorMessage.tsx
import React from "react";
import Link from "next/link";

interface ErrorMessageProps {
  error: string;
}

export function ErrorMessage({ error }: ErrorMessageProps): React.ReactElement {
  return (
    <div className="container mx-auto p-4">
      <div className="bg-red-50 border border-red-200 p-4 rounded-md">
        <h2 className="text-lg font-medium text-red-800 mb-2">Error</h2>
        <p className="text-red-700">{error}</p>
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
