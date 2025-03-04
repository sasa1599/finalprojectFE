// components/ui/LoadingSpinner.tsx
import React from "react";

export function LoadingSpinner(): React.ReactElement {
  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}
