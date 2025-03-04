"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Instagram, Twitter, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-16 pb-8">
      <div className="max-w-[1440px] mx-auto px-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Logo and Description */}
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Image
                src="/hp.png"
                alt="TechElite Logo"
                width={30}
                height={30}
                className="object-contain"
              />
              <span className="text-xl font-bold">TechElite</span>
            </Link>
            <p className="text-gray-400 text-sm">
              Your premium tech destination.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/brands"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Brands
                </Link>
              </li>
              <li>
                <Link
                  href="/deals"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Deals
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/shipping"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/order-status"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Order Status
                </Link>
              </li>
              <li>
                <Link
                  href="/payment"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Payment Options
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <Link
                href="https://instagram.com"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram size={24} />
              </Link>
              <Link
                href="https://twitter.com"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter size={24} />
              </Link>
              <Link
                href="https://facebook.com"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook size={24} />
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
          © 2025 TechElite. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
