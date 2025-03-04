import React from "react";
import FeaturedDiscountCarousel from "@/components/customer-discount/FeaturedDealCarousel";
import DiscountsList from "@/components/customer-discount/DiscountVoucher";
import DiscountProductsContainer from "@/components/customer-discount/DiscountProductContainer";
import { Bell, ArrowRight } from "lucide-react";

export default function DealsPage() {
  return (
    <main className="min-h-screen bg-gray-900 text-white pt-24 pb-8">
      {/* Larger Video Banner with Split Layout - Added more top padding */}
      <div className="container mx-auto px-4 mb-16 mt-8">
        <div className="bg-gradient-to-r from-gray-800/80 to-gray-800/50 rounded-xl overflow-hidden shadow-2xl border border-purple-900/30">
          <div className="flex flex-col md:flex-row">
            {/* Video Left Side - Made Larger */}
            <div className="w-full md:w-3/5 relative">
              <div className="relative pt-[75%] md:pt-0 md:h-[500px]">
                <video
                  className="absolute inset-0 w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  src="https://res.cloudinary.com/dak07ttxh/video/upload/v1740662146/Neon_Futuristic_Cyber_Monday_Sale_Video_Ad_wqvz5f.mp4"
                >
                  Your browser does not support the video tag.
                </video>

                {/* Subtle gradient overlay to enhance text visibility */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-900/30 hidden md:block"></div>
              </div>
            </div>

            {/* Text Right Side */}
            <div className="w-full md:w-2/5 p-8 md:p-12 flex flex-col justify-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
                Smart Savings Hub
              </h1>
              <p className="text-gray-300 text-lg md:text-xl mb-8 leading-relaxed">
                Discover personalized deals tailored just for you. Save smarter,
                shop better with our exclusive discounts and limited-time
                offers.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-white">Featured Deals</h2>
          <FeaturedDiscountCarousel />
        </section>

        <div className="mb-12 bg-gradient-to-r from-purple-900 to-indigo-900 rounded-lg p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <div className="p-3 bg-purple-500 rounded-full mr-5">
              <Bell className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-white">
                Coming Soon ! ! !
              </h3>
              <h3 className="font-bold text-xl text-white">
                Never Miss a Deal Features
              </h3>
              <p className="text-purple-200 mt-1">
                Get instant notifications about new discounts and flash sales.
              </p>
            </div>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-white">
            Claim Discount Voucher Now!
          </h2>
          <DiscountsList />
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-white">
            Highlighted Product Deals
          </h2>
          <DiscountProductsContainer />
        </section>
      </div>
    </main>
  );
}
