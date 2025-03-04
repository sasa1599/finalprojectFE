// ProductCardSkeleton.tsx
const ProductCardSkeleton = () => {
    return (
      <div className="relative rounded-xl overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-b from-neutral-800/30 to-neutral-900/30 backdrop-blur-xl rounded-xl border border-neutral-800/50" />
  
        <div className="relative p-4">

          <div className="relative h-48 mb-4 rounded-lg overflow-hidden bg-neutral-800/50 animate-pulse" />
  
  
          <div className="space-y-3">
 
            <div className="h-6 bg-neutral-800/50 rounded animate-pulse w-3/4" />
  
            <div className="space-y-2">
              <div className="h-4 bg-neutral-800/50 rounded animate-pulse" />
              <div className="h-4 bg-neutral-800/50 rounded animate-pulse w-2/3" />
            </div>

            <div className="h-7 bg-neutral-800/50 rounded animate-pulse w-1/3 mb-4" />
  
            <div className="flex gap-3">
              <div className="h-10 bg-neutral-800/50 rounded animate-pulse flex-1" />
              <div className="h-10 bg-neutral-800/50 rounded animate-pulse flex-1" />
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default ProductCardSkeleton;