"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, Search, ShoppingCart } from "lucide-react";

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

export function MobileNav() {
  const [open, setOpen] = React.useState(false);

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
                  <Link
                    key={collection.title}
                    href={collection.href}
                    onClick={() => setOpen(false)}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {collection.title}
                  </Link>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="womens">
            <AccordionTrigger className="text-sm">WOMEN'S</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col space-y-2">
                {categories.map((category) => (
                  <Link
                    key={category.title}
                    href={category.href}
                    onClick={() => setOpen(false)}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {category.title}
                  </Link>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="mens">
            <AccordionTrigger className="text-sm">MEN'S</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col space-y-2">
                {categories.map((category) => (
                  <Link
                    key={category.title}
                    href={category.href}
                    onClick={() => setOpen(false)}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {category.title}
                  </Link>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="space-y-4">
          <Link
            href="/gifts"
            onClick={() => setOpen(false)}
            className="block text-sm font-medium"
          >
            GIFTS
          </Link>
          <Link
            href="/auth/login"
            onClick={() => setOpen(false)}
            className="block text-sm font-medium"
          >
            LOGIN
          </Link>
        </div>
      </div>
    </div>
  );
}
