// components/navbar-comp/NavLogo.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export const NavLogo = () => {
  return (
    <div className="flex items-center">
      <Link
        href="/"
        className="flex items-center gap-3 group"
        aria-label="Home"
      >
        <motion.div
          whileHover={{
            rotate: [0, -5, 5, 0],
            scale: 1.1,
            transition: { duration: 0.4 },
          }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 via-purple-500/20 to-blue-500/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Image
            src="/hp.png"
            alt="TechElite Logo"
            width={40}
            height={40}
            className="relative object-contain"
            priority
          />
        </motion.div>
        <motion.span
          whileHover={{
            background: "linear-gradient(to right, #f43f5e, #6366f1, #3b82f6)",
            backgroundClip: "text",
            color: "transparent",
            transition: { duration: 0.3 },
          }}
          className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-100 to-neutral-400"
        >
          TechLite
        </motion.span>
      </Link>
    </div>
  );
};
