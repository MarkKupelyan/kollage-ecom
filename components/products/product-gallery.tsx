"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0);

  return (
    <div className="relative w-full">
      {/* Main Image */}
      <div className="aspect-square w-full relative overflow-hidden rounded-lg">
        <Image
          src={images[currentImage]}
          alt="Product image"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              currentImage === index
                ? "bg-black"
                : "bg-gray-300 hover:bg-gray-400"
            )}
            aria-label={`View image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
