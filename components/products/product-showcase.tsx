"use client";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { VariantsWithImagesTags } from "@/lib/infer-type";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function ProductShowcase({
  variants,
}: {
  variants: VariantsWithImagesTags[];
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [activeThumbnail, setActiveThumbnail] = useState([0]);
  const [thumbnailHeight, setThumbnailHeight] = useState<number>(0);
  const searchParams = useSearchParams();
  const selectedColor = searchParams.get("type") || variants[0].productType;
  const mainImageRef = useRef<HTMLDivElement>(null);

  const updatePreview = (index: number) => {
    api?.scrollTo(index);
  };

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on("slidesInView", (e) => {
      setActiveThumbnail(e.slidesInView());
    });
  }, [api]);

  useEffect(() => {
    const updateThumbnailHeight = () => {
      if (mainImageRef.current) {
        const height = mainImageRef.current.clientHeight;
        setThumbnailHeight(height);
      }
    };

    updateThumbnailHeight();
    window.addEventListener("resize", updateThumbnailHeight);

    return () => {
      window.removeEventListener("resize", updateThumbnailHeight);
    };
  }, []);

  return (
    <div className="flex flex-row gap-4">
      {/* Hlavní obrázek (Carousel) */}
      <div className="w-3/4" ref={mainImageRef}>
        <Carousel setApi={setApi} opts={{ loop: true }}>
          <CarouselContent>
            {variants.map(
              (variant) =>
                variant.productType === selectedColor &&
                variant.variantImages.map((img) => {
                  return (
                    <CarouselItem key={img.url}>
                      {img.url ? (
                        <Image
                          priority
                          className="rounded-md"
                          width={600}
                          height={600}
                          src={img.url}
                          alt={img.name}
                        />
                      ) : null}
                    </CarouselItem>
                  );
                })
            )}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Thumbnaily (malé náhledové obrázky) */}
      <div
        className="w-1/4 flex flex-col gap-4 overflow-y-auto scrollbar-hide"
        style={{ maxHeight: thumbnailHeight }}
      >
        {variants.map(
          (variant) =>
            variant.productType === selectedColor &&
            variant.variantImages.map((img, index) => {
              return (
                <div key={img.url} className="flex-shrink-0">
                  {img.url ? (
                    <Image
                      onClick={() => updatePreview(index)}
                      priority
                      className={cn(
                        index === activeThumbnail[0]
                          ? "opacity-100"
                          : "opacity-75",
                        "rounded-md transition-all duration-300 ease-in-out cursor-pointer hover:opacity-75"
                      )}
                      width={100}
                      height={thumbnailHeight / 4} // Rozdělení výšky pro 4 thumbnaily
                      src={img.url}
                      alt={img.name}
                      style={{ height: thumbnailHeight / 4.5, width: "70%" }} // Zajištění stejné výšky
                    />
                  ) : null}
                </div>
              );
            })
        )}
      </div>
    </div>
  );
}
