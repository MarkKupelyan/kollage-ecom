"use client";
import { useState } from "react";
import Link from "next/link";
import { LogIn, Menu, X } from "lucide-react"; // Using icons for hamburger and close
import CartDrawer from "../cart/cart-drawer";
import Algolia from "../products/algolia";
import CategoryLinks from "./CategoryLinks";
import { UserButton } from "./user-button";
import { Button } from "../ui/button";
import { auth } from "@/server/auth";
import Logo from "@/components/navigation/logo";

export default async function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const session = await auth();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 py-4 px-6 md:hidden">
      <nav className="flex items-center justify-between">
        {/* Left side: Hamburger menu */}
        <button
          aria-label="Toggle menu"
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-700 focus:outline-none"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo in the center for branding */}
        <Link href="/" aria-label="Kollage logo" className="flex-1 text-center">
          <Logo />
        </Link>

        {/* Right side: Login and Cart Drawer */}
        <div className="flex items-center gap-3">
          {/* Smaller Search Component */}
          <div className="w-36">
            <Algolia />
          </div>

          <CartDrawer />

          {!session ? (
            <Button asChild>
              <Link className="flex items-center gap-1" href="/auth/login">
                <LogIn size={16} />
              </Link>
            </Button>
          ) : (
            <UserButton expires={session?.expires} user={session?.user} />
          )}
        </div>
      </nav>

      {/* Dropdown menu for links, visible when isOpen is true */}
      {isOpen && (
        <div className="bg-white shadow-md mt-4 p-4 space-y-2">
          <CategoryLinks />
        </div>
      )}
    </header>
  );
}
