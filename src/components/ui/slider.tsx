// components/ui/slider.tsx
"use client";

import { useEffect, useRef, useState } from "react";

interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onValueChange: (value: [number, number]) => void;
  className?: string;
}

export function Slider({
  min,
  max,
  step = 1,
  value,
  onValueChange,
  className = "",
}: SliderProps) {
  const [activeThumb, setActiveThumb] = useState<"min" | "max" | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Calculate percentage for positioning
  const getPercentage = (value: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  const minThumbPosition = getPercentage(value[0]);
  const maxThumbPosition = getPercentage(value[1]);

  // Handle mouse events
  const handleMouseDown = (e: React.MouseEvent, thumb: "min" | "max") => {
    e.preventDefault();
    setActiveThumb(thumb);
  };

  const handleTrackClick = (e: React.MouseEvent) => {
    if (!trackRef.current) return;
    
    const rect = trackRef.current.getBoundingClientRect();
    const percentage = (e.clientX - rect.left) / rect.width;
    const newValue = min + percentage * (max - min);
    const roundedValue = Math.round(newValue / step) * step;
    
    // Determine which thumb to move based on proximity
    const distToMin = Math.abs(roundedValue - value[0]);
    const distToMax = Math.abs(roundedValue - value[1]);
    
    if (distToMin <= distToMax) {
      onValueChange([roundedValue, value[1]]);
    } else {
      onValueChange([value[0], roundedValue]);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!activeThumb || !trackRef.current) return;
      
      const rect = trackRef.current.getBoundingClientRect();
      const percentage = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
      const newValue = min + percentage * (max - min);
      const roundedValue = Math.round(newValue / step) * step;
      
      if (activeThumb === "min") {
        onValueChange([Math.min(roundedValue, value[1] - step), value[1]]);
      } else {
        onValueChange([value[0], Math.max(roundedValue, value[0] + step)]);
      }
    };

    const handleMouseUp = () => {
      setActiveThumb(null);
    };

    if (activeThumb) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [activeThumb, min, max, step, value, onValueChange]);

  return (
    <div className={`relative w-full h-2 ${className}`}>
      <div 
        ref={trackRef}
        className="absolute w-full h-2 bg-neutral-700 rounded-full cursor-pointer"
        onClick={handleTrackClick}
      >
        <div 
          className="absolute h-full bg-purple-600 rounded-full"
          style={{
            left: `${minThumbPosition}%`,
            right: `${100 - maxThumbPosition}%`
          }}
        />
        
        {/* Min thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full cursor-grab shadow-md hover:scale-110 transition-transform"
          style={{ left: `${minThumbPosition}%` }}
          onMouseDown={(e) => handleMouseDown(e, "min")}
        />
        
        {/* Max thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full cursor-grab shadow-md hover:scale-110 transition-transform"
          style={{ left: `${maxThumbPosition}%` }}
          onMouseDown={(e) => handleMouseDown(e, "max")}
        />
      </div>
    </div>
  );
}