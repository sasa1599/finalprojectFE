import { useState } from "react";
import Image from "next/image";

interface ProductImageSliderProps {
  images: { url: string }[];
}

export function ProductImageSlider({ images }: ProductImageSliderProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full h-48 overflow-hidden group">
      <Image
        src={images[currentImageIndex].url}
        alt={`Product image ${currentImageIndex + 1}`}
        fill
        className="object-cover transition-opacity duration-300"
        priority
      />
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 
            bg-black/50 text-white p-2 rounded-full 
            opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {"<"}
          </button>
          <button
            onClick={handleNextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 
            bg-black/50 text-white p-2 rounded-full 
            opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {">"}
          </button>
        </>
      )}
      {images.length > 1 && (
        <div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 
        flex space-x-2"
        >
          {images.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentImageIndex ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
