"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { productService } from "@/services/product.service";
import debounce from "lodash/debounce";
import { NavbarProps, ModalState, Product } from "@/types/product-types";
import { SearchModal } from "@/components/navbar-comp/SearchModal";
import { CartModal } from "@/components/navbar-comp/CartModal";
import { generateSlug } from "../utils/slugUtils";
import { motion, AnimatePresence } from "framer-motion";
import { NavLogo } from "./navbar-comp/NavbarLogo";
import { NavLinks } from "./navbar-comp/NavbarLink";
import { ActionButtons } from "./navbar-comp/ActionButton";
import { Menu, X } from "lucide-react"; // Icon untuk mobile menu

export default function Navbar({ className }: NavbarProps) {
  const [modalState, setModalState] = useState<ModalState>({
    isSearchOpen: false,
    isCartOpen: false,
  });
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State untuk mobile menu
  const modalRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  // Fungsi pencarian
  const handleSearch = useCallback(async (term: string) => {
    if (term.length < 1) {
      setSearchResults([]);
      return;
    }
    setIsLoading(true);
    try {
      const response = await productService.getProducts();
      const filtered = response.products
        .filter((product: Product) => {
          const name = product.name.toLowerCase();
          const searchTerm = term.toLowerCase();
          if (name.includes(searchTerm)) {
            const index = name.indexOf(searchTerm);
            product.slug = generateSlug(product.name);
            product.highlightedName = (
              <>
                {name.slice(0, index)}
                <span className="bg-yellow-200 text-black">
                  {name.slice(index, index + searchTerm.length)}
                </span>
                {name.slice(index + searchTerm.length)}
              </>
            );
            return true;
          }
          return false;
        })
        .slice(0, 5);
      setSearchResults(filtered);
    } catch (error) {
      console.error("Error searching products:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      handleSearch(term);
    }, 300),
    []
  );

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const toggleSearch = (isOpen: boolean) => {
    setModalState((prev) => ({ ...prev, isSearchOpen: isOpen }));
  };

  const toggleCart = (isOpen: boolean) =>
    setModalState((prev) => ({ ...prev, isCartOpen: isOpen }));

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsNavbarVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        setIsNavbarVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setModalState((prev) => ({
          ...prev,
          isSearchOpen: false,
          isCartOpen: false,
        }));
        setIsMenuOpen(false); // Tutup menu saat klik di luar
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <>
      <AnimatePresence>
        {isNavbarVisible && (
          <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className={`fixed top-0 left-0 right-0 z-50 bg-neutral-900/80 backdrop-blur-md ${
              className ?? ""
            }`}
            style={{ overflow: "visible" }} // Tambahkan ini
          >
            <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16 relative">
              {/* Logo */}
              <NavLogo />

              {/* Mobile Menu Toggle */}
              <button
                className="lg:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 text-white" />
                ) : (
                  <Menu className="w-6 h-6 text-white" />
                )}
              </button>

              {/* Navbar Links (Desktop) */}
              <div className="hidden lg:flex">
                <NavLinks />
              </div>

              {/* Action Buttons */}
              <ActionButtons
                toggleSearch={toggleSearch}
                toggleCart={toggleCart}
              />
            </div>

            {/* Mobile Menu (Vertikal) */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="fixed top-16 left-0 w-full h-screen bg-neutral-900/95 backdrop-blur-lg 
              flex !flex-col items-center gap-6 p-6 lg:hidden"
                >
                  <NavLinks className="flex !flex-col items-center gap-6 w-full" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Modals */}
      <div ref={modalRef}>
        <SearchModal
          isOpen={modalState.isSearchOpen}
          onClose={() => toggleSearch(false)}
          onSearch={handleSearchInput}
          isLoading={isLoading}
          searchResults={searchResults}
        />
        <CartModal
          isOpen={modalState.isCartOpen}
          onClose={() => toggleCart(false)}
        />
      </div>
    </>
  );
}
