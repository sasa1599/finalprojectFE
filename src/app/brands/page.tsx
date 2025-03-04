// Brands.tsx
import Link from "next/link";

interface Brand {
  id: number;
  name: string;
  videoId: string;
  description: string;
  slug: string;
  productCount: number;
}

const brands: Brand[] = [
  {
    id: 1,
    name: "Samsung",
    videoId: "oh9EkB-L2N8", // Updated Samsung video ID
    description: "Leading innovator in mobile technology and foldable devices",
    slug: "samsung",
    productCount: 24,
  },
  {
    id: 2,
    name: "Apple",
    videoId: "IHTT_7AjoU8",
    description: "Premium smartphones with cutting-edge features and design",
    slug: "apple",
    productCount: 18,
  },
  {
    id: 3,
    name: "Xiaomi",
    videoId: "kyGDngkTCXQ",
    description: "High-value smartphones with impressive specifications",
    slug: "xiaomi",
    productCount: 32,
  },
  {
    id: 4,
    name: "Google",
    videoId: "sXrasaDZxw0",
    description: "Pure Android experience with exceptional camera capabilities",
    slug: "google",
    productCount: 8,
  },
  {
    id: 5,
    name: "OnePlus",
    videoId: "DlWUp4ebTO4",
    description: "Performance-focused devices with clean software experience",
    slug: "oneplus",
    productCount: 12,
  },
  {
    id: 6,
    name: "Blackberry",
    videoId: "gPKOghKUJaM",
    description: "Unique design philosophy with innovative features",
    slug: "nothing",
    productCount: 4,
  },
  {
    id: 7,
    name: "OPPO",
    videoId: "hsyeka--swU",
    description: "Camera-centric smartphones with fast charging technology",
    slug: "oppo",
    productCount: 28,
  },
  {
    id: 8,
    name: "Vivo",
    videoId: "FsCATZ31Mrg",
    description: "Camera innovation and sleek design aesthetics",
    slug: "vivo",
    productCount: 26,
  },
];

export default function Brands() {
  return (
    <div className="min-h-screen bg-neutral-950 py-12">
      <div className="container mx-auto px-4 mt-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-100 to-neutral-400 mb-4">
            Featured Phone Collections
          </h1>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Explore our curated collection of premium mobile phones through
            their official product videos.
          </p>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${brand.slug}`}
              className="group relative rounded-xl overflow-hidden"
            >
              {/* Glass background with gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-neutral-800/30 to-neutral-900/30 backdrop-blur-xl rounded-xl border border-neutral-800/50 transition-all duration-500 group-hover:backdrop-blur-2xl" />

              {/* Animated gradient border */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-rose-500/20 via-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Content container */}
              <div className="relative p-6">
                {/* Video Container */}
                <div className="relative aspect-video mb-4 rounded-lg overflow-hidden bg-neutral-900">
                  <div className="absolute inset-0 z-10" />{" "}
                  {/* Transparent overlay to prevent interaction */}
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${brand.videoId}?autoplay=1&mute=1&loop=1&playlist=${brand.videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&enablejsapi=1`}
                    title={`${brand.name} product video`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full rounded-lg pointer-events-none" // Added pointer-events-none
                  />
                </div>

                {/* Brand details */}
                <div className="space-y-2">
                  <h3 className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-neutral-100 to-neutral-400">
                    {brand.name}
                  </h3>

                  <p className="text-sm text-neutral-400 line-clamp-2 min-h-[40px]">
                    {brand.description}
                  </p>

                  {/* Product count */}
                  <div className="text-sm text-neutral-500">
                    {brand.productCount} Products
                  </div>

                  {/* View More Button */}
                  <div className="pt-4">
                    <div className="relative group/btn inline-flex">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500 rounded-lg blur opacity-60 group-hover/btn:opacity-100 transition duration-300" />
                      <div className="relative flex items-center gap-2 px-4 py-2 bg-neutral-900 rounded-lg leading-none">
                        <span className="text-sm text-neutral-300">
                          View Collection
                        </span>
                        <svg
                          className="w-4 h-4 stroke-neutral-300 transform transition-transform duration-300 group-hover/btn:translate-x-0.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9 5l7 7-7 7"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
