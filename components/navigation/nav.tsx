"use client";

import * as React from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { LogIn, Menu, Search, ShoppingBag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Algolia from "../products/algolia";
import Logo from "@/components/navigation/logo";
import CartDrawer from "../cart/cart-drawer";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { MobileNav } from "./mobile-nav";

const collections = [
  {
    title: "New Arrivals",
    href: "/collections/new-arrivals",
    description: "Discover our latest jewelry pieces and exclusive designs",
  },
  {
    title: "Bestsellers",
    href: "/collections/bestsellers",
    description: "Shop our most popular and iconic collections",
  },
  {
    title: "Limited Edition",
    href: "/collections/limited-edition",
    description: "Explore our exclusive limited edition pieces",
  },
];

const categories = [
  {
    title: "Rings",
    href: "list?page=&tag=rings",
  },
  {
    title: "Necklaces",
    href: "list?page=&tag=necklaces",
  },
  {
    title: "Bracelets",
    href: "list?page=&tag=bracelets",
  },
  {
    title: "Earrings",
    href: "list?page=&tag=earrings",
  },
  {
    title: "Charms & Amulets",
    href: "/list?page=&tag=pendants",
  },
];

export default function Nav({ session }: { session: any }) {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  return (
    <header className="border-b">
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center gap-4 w-1/3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden p-2">
                <Menu className="h-10 w-10 stroke-[1.5]" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-full">
              <MobileNav />
            </SheetContent>
          </Sheet>

          <MainNav />
        </div>

        <div className="w-1/3 flex justify-center">
          <Link href="/">
            <Logo />
          </Link>
        </div>

        <div className="flex items-center gap-4 w-1/3 justify-end">
          <Button
            variant="ghost"
            size="icon"
            className="p-2"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="h-12 w-12" />
          </Button>

          <Link
            href="/auth/login"
            className="hidden md:flex p-2 bg-white text-slate-800 opacity-86 items-center gap-2"
          >
            <User className="h-7 w-7" />
          </Link>

          <div>
            <CartDrawer />
          </div>
        </div>
      </div>

      {isSearchOpen && (
        <div className="border-t">
          <div className="container py-4">
            <Algolia />
          </div>
        </div>
      )}
    </header>
  );
}

function MainNav() {
  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="h-10 px-4">
            NEW IN
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4">
              {collections.map((collection) => (
                <li key={collection.title}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={collection.href}
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">
                        {collection.title}
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {collection.description}
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="h-10 px-4">
            WOMEN'S
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4">
              {categories.map((category) => (
                <li key={category.title}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={category.href}
                      className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      {category.title}
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="h-10 px-4">
            MEN'S
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4">
              {categories.map((category) => (
                <li key={category.title}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={category.href}
                      className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      {category.title}
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/gifts" legacyBehavior passHref>
            <NavigationMenuLink className="h-10 px-4 py-2">
              GIFTS
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
