"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, Search, ShoppingCart, User } from "lucide-react";
import { UserButton } from "../navigation/user-button";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Logo from "@/components/navigation/logo";

const collections = [
  {
    title: "New Arrivals",
    href: "/collections/new-arrivals",
  },
  {
    title: "Bestsellers",
    href: "/collections/bestsellers",
  },
  {
    title: "Limited Edition",
    href: "/collections/limited-edition",
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
    title: "Watches",
    href: "/list?page=&tag=pendants",
  },
];

export function MobileNav({ session }: { session: any }) {
  const [open, setOpen] = React.useState(false);

  const handleLinkClick = (href: string) => {
    setOpen(false);

    setTimeout(() => {
      window.location.href = href;
    }, 300);
  };

  return (
    <div className="flex flex-col h-[100dvh] pt-6 px-6">
      <div className="flex justify-center mb-6">
        <Logo />
      </div>
      <div className="flex flex-col gap-4 overflow-y-auto pb-6">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="new-in">
            <AccordionTrigger className="text-sm">NEW IN</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col space-y-2">
                {collections.map((collection) => (
                  <button
                    key={collection.title}
                    onClick={() => handleLinkClick(collection.href)}
                    className="text-left text-sm text-muted-foreground hover:text-foreground"
                  >
                    {collection.title}
                  </button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="womens">
            <AccordionTrigger className="text-sm">
              WOMEN&apos;S
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.title}
                    onClick={() => handleLinkClick(category.href)}
                    className="text-left text-sm text-muted-foreground hover:text-foreground"
                  >
                    {category.title}
                  </button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="mens">
            <AccordionTrigger className="text-sm">MEN&apos;S</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.title}
                    onClick={() => handleLinkClick(category.href)}
                    className="text-left text-sm text-muted-foreground hover:text-foreground"
                  >
                    {category.title}
                  </button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="space-y-4">
          <Link
            href="/gifts"
            onClick={() => handleLinkClick("/gifts")}
            className="block text-sm font-medium"
          >
            GIFTS
          </Link>
          <div className="flex lg:hidden items-center gap-2">
            {session?.user ? (
              <UserButton user={session.user} />
            ) : (
              <Link
                href="/auth/login"
                onClick={() => handleLinkClick("/auth/login")}
                className="flex items-center gap-2 text-sm font-medium"
              >
                <User className="h-5 w-5" />
                <span>LOGIN</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
