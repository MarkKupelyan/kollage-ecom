// components/SortBy.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

interface SortByProps {
  setSortOrder: (order: "asc" | "desc") => void;
}

export default function SortBy({ setSortOrder }: SortByProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Tlačítko pro otevření dropdownu */}
      <button
        className="flex items-center gap-2 text-sm   tracking-[0.1em] font-normal px-6 py-5   border rounded-lg hover:bg-gray-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        SORT BY <ChevronDown className="h-4 w-4" />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute text-base right-0 py-4  w-48 bg-white border rounded-lg shadow-lg z-50">
          <button
            onClick={() => {
              setSortOrder("desc");
              setIsOpen(false);
            }}
            className="block w-full mb-2 px-4 py-2 text-left hover:bg-gray-50 rounded-t-lg"
          >
            Od nejvyšší ceny
          </button>
          <div className="border-t my-2"></div>
          <button
            onClick={() => {
              setSortOrder("asc");
              setIsOpen(false);
            }}
            className="block w-full px-4 py-2 text-left hover:bg-gray-50 rounded-b-lg"
          >
            Od nejnižší ceny
          </button>
        </div>
      )}
    </div>
  );
}
