"use client";

import { useState, useRef, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { ChevronDown, ChevronUp, DollarSign } from "lucide-react";

interface FilterByPriceProps {
  onPriceChange: (priceRange: [number, number]) => void;
  minPrice?: number;
  maxPrice?: number;
  initialRange?: [number, number];
}

export function FilterByPrice({
  onPriceChange,
  minPrice = 0,
  maxPrice = 30000000,
  initialRange,
}: FilterByPriceProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>(
    initialRange || [minPrice, maxPrice]
  );
  const [isExpanded, setIsExpanded] = useState(true);

  const formatPrice = (value: number) => {
    return `Rp ${value.toLocaleString()}`;
  };

  const handleRangeChange = (value: number[]) => {
    const newRange: [number, number] = [value[0], value[1]];
    setPriceRange(newRange);
  };

  const handleApplyFilter = () => {
    onPriceChange(priceRange);
  };

  const handleReset = () => {
    const defaultRange: [number, number] = [minPrice, maxPrice];
    setPriceRange(defaultRange);
    onPriceChange(defaultRange);
  };

  return (
    <div className="relative w-full max-w-xs z-20">
      {/* Filter Label */}
      <div className="flex items-center mb-2 text-sm font-medium text-neutral-400">
        <DollarSign size={16} className="mr-1" />
        <span>Filter by Price</span>
      </div>

      {/* Main Container */}
      <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 w-full">
        <button
          className="flex justify-between items-center w-full text-left text-white font-medium"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span>Price Range</span>
          {isExpanded ? (
            <ChevronUp size={18} className="text-neutral-400" />
          ) : (
            <ChevronDown size={18} className="text-neutral-400" />
          )}
        </button>

        {isExpanded && (
          <div className="mt-4 space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-neutral-400">
                <span>Min: {formatPrice(priceRange[0])}</span>
                <span>Max: {formatPrice(priceRange[1])}</span>
              </div>

              <Slider
                min={minPrice}
                max={maxPrice}
                step={100000}
                value={priceRange}
                onValueChange={handleRangeChange}
                className="py-4"
              />
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={handleApplyFilter}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
              >
                Apply Filter
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-neutral-300 rounded-lg transition-colors text-sm"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
