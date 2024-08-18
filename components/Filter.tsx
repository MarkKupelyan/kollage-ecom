"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function Filter() {
  const router = useRouter();
  const params = useSearchParams();
  const tag = params.get("tag");

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isMaterialOpen, setIsMaterialOpen] = useState(false);
  const [isColorOpen, setIsColorOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false); // State to control filter panel visibility on mobile

  const filterPanelRef = useRef<HTMLDivElement>(null);

  const setFilter = (tag: string) => {
    const urlParams = new URLSearchParams(window.location.search);
    if (tag) {
      urlParams.set("tag", tag);
    } else {
      urlParams.delete("tag");
    }
    router.push(`?${urlParams.toString()}`);

    // Close all dropdowns after selecting a filter
    setIsCategoryOpen(false);
    setIsMaterialOpen(false);
    setIsColorOpen(false);
    setIsPriceOpen(false);
  };

  const resetFilters = () => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.delete("tag");
    router.push(`${window.location.pathname}?${urlParams.toString()}`);
  };

  const toggleCategory = () => setIsCategoryOpen(!isCategoryOpen);
  const toggleMaterial = () => setIsMaterialOpen(!isMaterialOpen);
  const toggleColor = () => setIsColorOpen(!isColorOpen);
  const togglePrice = () => setIsPriceOpen(!isPriceOpen);
  const toggleFilterPanel = () => setIsFilterOpen(!isFilterOpen);

  // Close filter panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterPanelRef.current &&
        !filterPanelRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    };

    if (isFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterOpen]);

  return (
    <>
      {/* Button to open the filter on mobile */}
      <button
        onClick={toggleFilterPanel}
        className="block md:hidden px-10 py-2 bg-zinc-500 text-white rounded-md  top-25 right-4 z-50"
      >
        Filters
      </button>

      {/* Mobile Filter panel */}
      <div
        ref={filterPanelRef}
        className={`fixed top-0 right-0 h-full w-full max-w-xs bg-white shadow-lg z-50 transition-transform transform ${
          isFilterOpen ? "translate-x-0" : "translate-x-full"
        } md:static md:translate-x-0 md:w-auto md:hidden`}
      >
        {/* Close button for mobile */}
        <button
          onClick={toggleFilterPanel}
          className="block md:hidden absolute top-4 right-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="h-6 w-6 text-gray-700"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="flex flex-col p-4 h-full">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>

          <div className="flex-grow space-y-4">
            {/* Filter Option: Categories */}
            <div className="relative">
              <button
                onClick={toggleCategory}
                className="w-full text-left px-4 py-2 text-gray-700 bg-gray-100 rounded-md"
              >
                Categories {isCategoryOpen ? "▲" : "▼"}
              </button>
              {isCategoryOpen && (
                <div className="mt-2 bg-white border rounded-md shadow-lg z-50">
                  <ul className="p-4">
                    <li
                      onClick={() => setFilter("rings")}
                      className="py-2 cursor-pointer hover:bg-gray-100"
                    >
                      Rings
                    </li>
                    <li
                      onClick={() => setFilter("necklaces")}
                      className="py-2 cursor-pointer hover:bg-gray-100"
                    >
                      Necklaces
                    </li>
                    <li
                      onClick={() => setFilter("earrings")}
                      className="py-2 cursor-pointer hover:bg-gray-100"
                    >
                      Earrings
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Filter Option: Material */}
            <div className="relative">
              <button
                onClick={toggleMaterial}
                className="w-full text-left px-4 py-2 text-gray-700 bg-gray-100 rounded-md"
              >
                Material {isMaterialOpen ? "▲" : "▼"}
              </button>
              {isMaterialOpen && (
                <div className="mt-2 bg-white border rounded-md shadow-lg z-50">
                  <ul className="p-4">
                    <li
                      onClick={() => setFilter("gold")}
                      className="py-2 cursor-pointer hover:bg-gray-100"
                    >
                      Gold
                    </li>
                    <li
                      onClick={() => setFilter("silver")}
                      className="py-2 cursor-pointer hover:bg-gray-100"
                    >
                      Silver
                    </li>
                    <li
                      onClick={() => setFilter("platinum")}
                      className="py-2 cursor-pointer hover:bg-gray-100"
                    >
                      Platinum
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Filter Option: Color */}
            <div className="relative">
              <button
                onClick={toggleColor}
                className="w-full text-left px-4 py-2 text-gray-700 bg-gray-100 rounded-md"
              >
                Color {isColorOpen ? "▲" : "▼"}
              </button>
              {isColorOpen && (
                <div className="mt-2 bg-white border rounded-md shadow-lg z-50">
                  <ul className="p-4">
                    <li
                      onClick={() => setFilter("white")}
                      className="py-2 cursor-pointer hover:bg-gray-100"
                    >
                      White
                    </li>
                    <li
                      onClick={() => setFilter("yellow")}
                      className="py-2 cursor-pointer hover:bg-gray-100"
                    >
                      Yellow
                    </li>
                    <li
                      onClick={() => setFilter("green")}
                      className="py-2 cursor-pointer hover:bg-gray-100"
                    >
                      Green
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Reset All Button */}
          <button
            onClick={resetFilters}
            className="w-full py-2 bg-white text-black rounded-md mt-4 border border-black"
          >
            Reset All
          </button>
        </div>
      </div>

      {/* Desktop Filter panel */}
      <div className="hidden md:flex justify-between items-center space-x-4 px-4 py-4 border-b">
        {/* Filter Option: Categories */}
        <div className="relative">
          <button onClick={toggleCategory} className="px-4 py-2 text-gray-700">
            Categories {isCategoryOpen ? "▲" : "▼"}
          </button>
          {isCategoryOpen && (
            <div className="absolute left-0 mt-2 w-48 bg-white border shadow-lg z-50">
              <ul className="p-4">
                <li
                  onClick={() => setFilter("rings")}
                  className="py-2 cursor-pointer hover:bg-gray-100"
                >
                  Rings
                </li>
                <li
                  onClick={() => setFilter("necklaces")}
                  className="py-2 cursor-pointer hover:bg-gray-100"
                >
                  Necklaces
                </li>
                <li
                  onClick={() => setFilter("earrings")}
                  className="py-2 cursor-pointer hover:bg-gray-100"
                >
                  Earrings
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Filter Option: Material */}
        <div className="relative">
          <button onClick={toggleMaterial} className="px-4 py-2 text-gray-700">
            Material {isMaterialOpen ? "▲" : "▼"}
          </button>
          {isMaterialOpen && (
            <div className="absolute left-0 mt-2 w-48 bg-white border shadow-lg z-50">
              <ul className="p-4">
                <li
                  onClick={() => setFilter("gold")}
                  className="py-2 cursor-pointer hover:bg-gray-100"
                >
                  Gold
                </li>
                <li
                  onClick={() => setFilter("silver")}
                  className="py-2 cursor-pointer hover:bg-gray-100"
                >
                  Silver
                </li>
                <li
                  onClick={() => setFilter("platinum")}
                  className="py-2 cursor-pointer hover:bg-gray-100"
                >
                  Platinum
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Filter Option: Color */}
        <div className="relative">
          <button onClick={toggleColor} className="px-4 py-2 text-gray-700">
            Color {isColorOpen ? "▲" : "▼"}
          </button>
          {isColorOpen && (
            <div className="absolute left-0 mt-2 w-48 bg-white border shadow-lg z-50">
              <ul className="p-4">
                <li
                  onClick={() => setFilter("white")}
                  className="py-2 cursor-pointer hover:bg-gray-100"
                >
                  White
                </li>
                <li
                  onClick={() => setFilter("yellow")}
                  className="py-2 cursor-pointer hover:bg-gray-100"
                >
                  Yellow
                </li>
                <li
                  onClick={() => setFilter("green")}
                  className="py-2 cursor-pointer hover:bg-gray-100"
                >
                  Green
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Filter Option: Price Range */}
        <div className="relative">
          <button onClick={togglePrice} className="px-4 py-2 text-gray-700">
            Price Range {isPriceOpen ? "▲" : "▼"}
          </button>
          {isPriceOpen && (
            <div className="absolute left-0 mt-2 w-48 bg-white border shadow-lg z-50">
              <ul className="p-4">
                <li
                  onClick={() => setFilter("0-50")}
                  className="py-2 cursor-pointer hover:bg-gray-100"
                >
                  $0 - $50
                </li>
                <li
                  onClick={() => setFilter("50-100")}
                  className="py-2 cursor-pointer hover:bg-gray-100"
                >
                  $50 - $100
                </li>
                <li
                  onClick={() => setFilter("100-200")}
                  className="py-2 cursor-pointer hover:bg-gray-100"
                >
                  $100 - $200
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
