"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Menu, X, LogIn, Search } from "lucide-react";
import CartDrawer from "../cart/cart-drawer";
import { UserButton } from "./user-button";
import Logo from "@/components/navigation/logo";
import { Button } from "../ui/button";
import CategoryLinks from "./CategoryLinks";
import Algolia from "../products/algolia";

const MobileNav = ({ session }: { session: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 py-4 px-4">
      {/* Top Nav */}
      <nav className="flex items-center justify-between">
        {/* Hamburger Menu */}
        <button
          aria-label="Toggle menu"
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-700 focus:outline-none p-2 rounded-md hover:bg-gray-100"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo Centered */}
        <Link href="/" className="flex items-center size-24">
          <Logo />
        </Link>

        {/* Right Icons - Search, Cart, Login/User */}
        <div className="flex items-center space-x-2">
          {/* Larger Search Icon */}
          <button
            aria-label="Search"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="text-gray-700 focus:outline-none w-12 h-12 flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100 hover:text-black"
          >
            <Search size={24} />
          </button>

          {/* Cart Icon with hover effect */}
          <div className="w-12 h-12 flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100 hover:text-black">
            <CartDrawer />
          </div>

          {/* Sign-In Button */}
          {!session ? (
            <Button asChild>
              <Link
                href="/auth/login"
                className="flex items-center p-2 rounded-md bg-black text-white hover:bg-gray-800"
              >
                Sign In
              </Link>
            </Button>
          ) : (
            <UserButton expires={session?.expires} user={session?.user} />
          )}
        </div>
      </nav>

      {/* Mobile Search Bar - toggled by the Search Icon */}
      {isSearchOpen && (
        <div className="md:hidden mt-4">
          <Algolia />
        </div>
      )}

      {/* Full-Screen Overlay Menu */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40">
          <div
            ref={menuRef}
            className="absolute top-0 left-0 w-3/4 md:w-1/3 h-full bg-white shadow-md p-6 space-y-4"
          >
            {/* Logo and Close Button */}
            <div className="flex justify-between items-center mb-6">
              <Link href="/" className="flex items-center ml-5 size-28">
                <Logo />
              </Link>
              <button
                aria-label="Close menu"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:bg-gray-100 p-2 rounded-md"
              >
                <X size={24} />
              </button>
            </div>

            {/* Menu Links */}
            <CategoryLinks />
          </div>
        </div>
      )}
    </header>
  );
};

export default MobileNav;
