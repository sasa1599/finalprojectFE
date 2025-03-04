"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  const images = ["/home/ip16.png", "/home/s25.jpg", "/home/gpix.jpg"];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        setIsTransitioning(false);
      }, 500);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Images */}
      {images.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            currentImageIndex === index && !isTransitioning
              ? "opacity-100"
              : "opacity-0"
          }`}
        >
          <Image
            src={image}
            alt={`Background ${index + 1}`}
            fill
            priority={index === 0}
            className="object-cover object-center transform scale-105 transition-transform duration-[2000ms]"
            style={{
              transform: currentImageIndex === index ? 'scale(1)' : 'scale(1.05)'
            }}
          />
        </div>
      ))}

      {/* Gradient Overlay with animated noise texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-neutral-900/70 mix-blend-multiply" />
      
      {/* Animated grain overlay */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay animate-grain bg-[url('/grain.png')] bg-repeat" />

      {/* Content Container */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20">
        <div className="pt-24 md:pt-32 lg:pt-48">
          {/* Heading with gradient and animated underline */}
          <h1 className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-400 text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-bold leading-[1.1] mb-6 md:mb-8 lg:mb-10 animate-fade-in">
            Experience Premium
            <br />
            Tech Excellence
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500 transform origin-left animate-scale-in" />
          </h1>

          {/* Description with fade-in animation */}
          <p className="text-neutral-300 text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-8 md:mb-10 lg:mb-12 max-w-4xl opacity-0 animate-fade-in-up">
            Discover our curated collection of premium phones and innovative
            gadgets.
          </p>

          {/* CTA Button with modern design */}
          <Link href="/products" className="group relative inline-flex items-center">
            {/* Button background and effects */}
            <div className="relative px-8 py-4 bg-white rounded-lg overflow-hidden transition-transform duration-300 ease-out transform group-hover:translate-y-[-2px] group-hover:shadow-lg">
              {/* Gradient shine effect */}
              <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
              
              {/* Button content */}
              <div className="relative flex items-center">
                <span className="relative text-xl md:text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-neutral-950 to-neutral-800">
                  Shop Now
                </span>
                {/* Animated arrow */}
                <svg
                  className="w-6 h-6 ml-2 transform transition-transform duration-300 ease-out group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                    className="text-neutral-950"
                  />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
