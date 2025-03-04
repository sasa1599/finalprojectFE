// components/navbar-comp/ActionButtons.tsx
import { motion } from "framer-motion";
import { Search, ShoppingCart } from "lucide-react";

interface ActionButtonsProps {
  toggleSearch: (isOpen: boolean) => void;
  toggleCart: (isOpen: boolean) => void;
}

export const ActionButtons = ({
  toggleSearch,
  toggleCart,
}: ActionButtonsProps) => {
  return (
    <div className="flex items-center gap-4">
      <motion.button
        whileHover={{
          scale: 1.1,
          rotate: [0, -5, 5, 0],
          color: "#3b82f6",
          transition: { duration: 0.3 },
        }}
        onClick={() => toggleSearch(true)}
        className="relative group p-2 rounded-lg"
        aria-label="Open search"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-rose-500/0 to-blue-500/0 group-hover:from-rose-500/10 group-hover:to-blue-500/10 rounded-lg transition-all duration-300" />
        <Search className="relative w-5 h-5 text-neutral-400 group-hover:text-neutral-200 transition-colors" />
      </motion.button>

      <motion.button
        whileHover={{
          scale: 1.1,
          rotate: [0, -5, 5, 0],
          color: "#f43f5e",
          transition: { duration: 0.3 },
        }}
        onClick={() => toggleCart(true)}
        className="relative group p-2 rounded-lg"
        aria-label="Open cart"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-rose-500/0 to-blue-500/0 group-hover:from-rose-500/10 group-hover:to-blue-500/10 rounded-lg transition-all duration-300" />
        <ShoppingCart className="relative w-5 h-5 text-neutral-400 group-hover:text-neutral-200 transition-colors" />
      </motion.button>
    </div>
  );
};
