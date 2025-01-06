"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const images = [
  "/01.jpg",
  "/vlt.jpg",
  "/05.jpg",
  "/almaz.png",
  "/02.jpg",
  "/almaz.png",
];

const CategoryList = () => {
  const [curSlide, setCurSlide] = useState(0);
  const [isSliding, setIsSliding] = useState(false); // Avoid spamming transitions
  const sliderRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Number of images to show at once based on screen size
  const [visibleSlides, setVisibleSlides] = useState(3);

  // Handle auto-slide with visibility observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startAutoSlide();
        } else {
          stopAutoSlide();
        }
      },
      { threshold: 0.1 }
    );

    if (sliderRef.current) {
      observer.observe(sliderRef.current);
    }

    return () => {
      stopAutoSlide();
      if (sliderRef.current) {
        observer.unobserve(sliderRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleSlides(1);
      } else if (window.innerWidth < 1024) {
        setVisibleSlides(2);
      } else {
        setVisibleSlides(3);
      }
    };

    handleResize(); // Initial call to set the correct number of visible slides
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const startAutoSlide = () => {
    timerRef.current = setInterval(() => {
      nextSlide();
    }, 3000); // Auto-slide interval in milliseconds
  };

  const stopAutoSlide = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Ensure only one slide transition at a time
  const nextSlide = () => {
    if (!isSliding) {
      setIsSliding(true);
      setCurSlide((prev) => (prev + 1) % images.length);
    }
  };

  const prevSlide = () => {
    if (!isSliding) {
      setIsSliding(true);
      setCurSlide((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  // Reset sliding state after transition
  useEffect(() => {
    if (isSliding) {
      const timeout = setTimeout(() => {
        setIsSliding(false);
      }, 700); // Match transition duration
      return () => clearTimeout(timeout);
    }
  }, [isSliding]);

  return (
    <div className="slider relative overflow-hidden" ref={sliderRef}>
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${(curSlide * 100) / visibleSlides}%)`,
        }}
      >
        {/* Infinite scrolling effect */}
        {[...images, ...images].map((src, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 px-2" // Adjust width based on screen size
          >
            <Link href={`/list?cat=test`}>
              <div className="relative w-full h-64 rounded-lg shadow-lg overflow-hidden">
                <Image
                  src={src}
                  alt={`Slide ${index}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover rounded-lg"
                />
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Dot Navigation */}
      <div className="dots flex justify-center mt-4">
        {images.map((_, index) => (
          <button
            key={index}
            className={`dots__dot w-3 h-3 rounded-full mx-1 ${
              index === curSlide ? "bg-black" : "bg-gray-400"
            }`}
            onClick={() => {
              setCurSlide(index);
              stopAutoSlide(); // Pause auto-slide on manual navigation
            }}
          />
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full shadow-lg z-10"
        onClick={prevSlide}
      >
        ◀
      </button>
      <button
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full shadow-lg z-10"
        onClick={nextSlide}
      >
        ▶
      </button>
    </div>
  );
};

export default CategoryList;
