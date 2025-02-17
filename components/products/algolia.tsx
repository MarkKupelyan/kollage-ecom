"use client";

import { InstantSearchNext } from "react-instantsearch-nextjs";
import { SearchBox, Hits } from "react-instantsearch";
import { searchClient } from "@/lib/algolia-client";
import Link from "next/link";
import Image from "next/image";
import { Card } from "../ui/card";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Hit({ hit }: any) {
  if (!hit || !hit.id || !hit.title || !hit.price) {
    return null;
  }

  const images = Array.isArray(hit.variantImages)
    ? hit.variantImages
    : [hit.variantImages];

  return (
    <div key={hit.id} className="p-4 hover:bg-secondary">
      <Link href={`/products/${hit.productID}?variantId=${hit.id}`}>
        <div className="flex w-full items-center gap-4">
          {images.length > 0 && (
            <Image src={images[0]} alt={hit.title} width={60} height={60} />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm truncate">{hit.title}</p>
            <p className="text-xs text-gray-500">{hit.price} €</p>
            <p className="text-xs text-gray-400">
              {hit.material} - {hit.color}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function Algolia() {
  const [active, setActive] = useState(false);
  const MCard = useMemo(() => motion(Card), []);

  return (
    <InstantSearchNext
      future={{
        preserveSharedStateOnUnmount: true,
      }}
      indexName="productVariants"
      searchClient={searchClient}
    >
      <div className="relative">
        <SearchBox
          placeholder="Search"
          onFocus={() => setActive(true)}
          onBlur={() => {
            setTimeout(() => {
              setActive(false);
            }, 100);
          }}
          classNames={{
            input:
              "h-full w-full rounded-md border border-input bg-background px-3 py-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            submitIcon: "hidden",
            form: "relative",
            resetIcon: "hidden",
          }}
        />
        <AnimatePresence>
          {active && (
            <MCard
              animate={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.8 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute w-full z-50 max-h-[80vh] overflow-y-auto"
            >
              <Hits hitComponent={Hit} className="rounded-md" />
            </MCard>
          )}
        </AnimatePresence>
      </div>
    </InstantSearchNext>
  );
}
