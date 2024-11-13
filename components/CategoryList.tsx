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

const visibleSlides = 3; // Number of images to show at once
const CategoryList = () => {
  const [curSlide, setCurSlide] = useState(0);
  const [isSliding, setIsSliding] = useState(true); // State to control sliding
  const sliderRef = useRef<HTMLDivElement>(null);

  // Intersection Observer to detect visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsSliding(true); // Start sliding when in viewport
        } else {
          setIsSliding(false); // Stop sliding when out of viewport
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the slider is visible
    );

    if (sliderRef.current) {
      observer.observe(sliderRef.current);
    }

    return () => {
      if (sliderRef.current) {
        observer.unobserve(sliderRef.current);
      }
    };
  }, []);

  // Auto-slide effect
  useEffect(() => {
    const autoSlide = setInterval(() => {
      if (isSliding) {
        nextSlide();
      }
    }, 2000); // Slide every 3 seconds

    return () => clearInterval(autoSlide); // Clean up on unmount
  }, [curSlide, isSliding]);

  // Circularly update the slide index
  const nextSlide = () => {
    if (curSlide < images.length - 1) {
      setCurSlide((prev) => prev + 1); // Increment slide index
    } else {
      setCurSlide(0); // Reset to first slide
    }
  };

  const prevSlide = () => {
    setCurSlide((prev) => (prev - 1 + images.length) % images.length); // Decrement slide index
  };

  return (
    <div className="slider relative overflow-hidden" ref={sliderRef}>
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${(curSlide * 100) / visibleSlides}%)`,
        }}
      >
        {/* Duplicate images infinitely by mapping the images array twice */}
        {[...images, ...images].map((src, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-1/3 px-2" // Adjust width to show 3 images
          >
            <Link href={`/list?cat=test`}>
              <div className="relative w-full h-80 rounded-lg shadow-lg overflow-hidden">
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="33vw"
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
            onClick={() => setCurSlide(index)}
          />
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full shadow-lg"
        onClick={prevSlide}
      >
        ◀
      </button>
      <button
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full shadow-lg"
        onClick={nextSlide}
      >
        ▶
      </button>
    </div>
  );
};

export default CategoryList;
