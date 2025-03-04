import React from "react";
import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  error: {
    message: string;
  };
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error }) => (
  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
    <div className="flex">
      <div className="flex-shrink-0">
        <AlertTriangle className="h-5 w-5 text-red-500" />
      </div>
      <div className="ml-3">
        <p className="text-sm text-red-700">
          Error loading inventory data: {error.message}
        </p>
      </div>
    </div>
  </div>
);
