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
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
      <button
        onClick={toggleFilterPanel}
        className="block md:hidden px-10 py-2 bg-blue-600 text-white rounded-md shadow-lg transition duration-300 hover:bg-blue-700"
      >
        Filters
      </button>

      <div
        ref={filterPanelRef}
        className={`fixed top-0 right-0 h-full w-full max-w-xs bg-white shadow-lg z-50 transition-transform transform ${
          isFilterOpen ? "translate-x-0" : "translate-x-full"
        } md:static md:translate-x-0 md:w-auto md:hidden`}
      >
        <button
          onClick={toggleFilterPanel}
          className="block md:hidden absolute top-4 right-4 text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="flex flex-col p-4 h-full bg-gray-50">
          <h2 className="text-xl font-bold text-blue-600 mb-4">Filters</h2>

          <div className="flex-grow space-y-4">
            {/* Filter Option: Categories */}
            <div className="relative">
              <button
                onClick={toggleCategory}
                className="w-full text-left px-4 py-2 text-gray-800 bg-gray-200 rounded-md transition duration-200 hover:bg-gray-300"
              >
                Categories {isCategoryOpen ? "▲" : "▼"}
              </button>
              {isCategoryOpen && (
                <div className=" mt-2 bg-white border rounded-md shadow-lg z-50">
                  <ul className="p-4">
                    <li
                      onClick={() => setFilter("rings")}
                      className="py-2 cursor-pointer hover:bg-gray-100 transition duration-200"
                    >
                      Rings
                    </li>
                    <li
                      onClick={() => setFilter("necklaces")}
                      className="py-2 cursor-pointer hover:bg-gray-100 transition duration-200"
                    >
                      Necklaces
                    </li>
                    <li
                      onClick={() => setFilter("earrings")}
                      className="py-2 cursor-pointer hover:bg-gray-100 transition duration-200"
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
                className="w-full text-left px-4 py-2 text-gray-800 bg-gray-200 rounded-md transition duration-200 hover:bg-gray-300"
              >
                Material {isMaterialOpen ? "▲" : "▼"}
              </button>
              {isMaterialOpen && (
                <div className="mt-2 bg-white border rounded-md shadow-lg z-50">
                  <ul className="p-4">
                    <li
                      onClick={() => setFilter("gold")}
                      className="py-2 cursor-pointer hover:bg-gray-100 transition duration-200"
                    >
                      Gold
                    </li>
                    <li
                      onClick={() => setFilter("silver")}
                      className="py-2 cursor-pointer hover:bg-gray-100 transition duration-200"
                    >
                      Silver
                    </li>
                    <li
                      onClick={() => setFilter("platinum")}
                      className="py-2 cursor-pointer hover:bg-gray-100 transition duration-200"
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
                className="w-full text-left px-4 py-2 text-gray-800 bg-gray-200 rounded-md transition duration-200 hover:bg-gray-300"
              >
                Color {isColorOpen ? "▲" : "▼"}
              </button>
              {isColorOpen && (
                <div className="mt-2 bg-white border rounded-md shadow-lg z-50">
                  <ul className="p-4">
                    <li
                      onClick={() => setFilter("white")}
                      className="py-2 cursor-pointer hover:bg-gray-100 transition duration-200"
                    >
                      White
                    </li>
                    <li
                      onClick={() => setFilter("yellow")}
                      className="py-2 cursor-pointer hover:bg-gray-100 transition duration-200"
                    >
                      Yellow
                    </li>
                    <li
                      onClick={() => setFilter("green")}
                      className="py-2 cursor-pointer hover:bg-gray-100 transition duration-200"
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
            className="w-full py-2 bg-red-600 text-white rounded-md mt-4 border border-red-700 transition duration-300 hover:bg-red-700"
          >
            Reset All
          </button>
        </div>
      </div>

      {/* Desktop Filter panel */}
      <div className="hidden md:flex items-center gap-2 px-4 py-4 border-b">
        {/* Filter Option: Categories */}
        <div className="relative">
          <button
            onClick={toggleCategory}
            className="px-4 py-2 text-gray-800 bg-gray-200 rounded-md transition duration-200 hover:bg-gray-300"
          >
            Categories {isCategoryOpen ? "▲" : "▼"}
          </button>
          {isCategoryOpen && (
            <div className="absolute left-0 mt-2 w-48 bg-white border shadow-lg z-50">
              <ul className="p-4">
                <li
                  onClick={() => setFilter("rings")}
                  className="py-2 cursor-pointer hover:bg-gray-100 transition duration-200"
                >
                  Rings
                </li>
                <li
                  onClick={() => setFilter("necklaces")}
                  className="py-2 cursor-pointer hover:bg-gray-100 transition duration-200"
                >
                  Necklaces
                </li>
                <li
                  onClick={() => setFilter("ear rings")}
                  className="py-2 cursor-pointer hover:bg-gray-100 transition duration-200"
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
            className="px-4 py-2 text-gray-800 bg-gray-200 rounded-md transition duration-200 hover:bg-gray-300"
          >
            Material {isMaterialOpen ? "▲" : "▼"}
          </button>
          {isMaterialOpen && (
            <div className="absolute left-0 mt-2 w-48 bg-white border shadow-lg z-50">
              <ul className="p-4">
                <li
                  onClick={() => setFilter("gold")}
                  className="py-2 cursor-pointer hover:bg-gray-100 transition duration-200"
                >
                  Gold
                </li>
                <li
                  onClick={() => setFilter("silver")}
                  className="py-2 cursor-pointer hover:bg-gray-100 transition duration-200"
                >
                  Silver
                </li>
                <li
                  onClick={() => setFilter("platinum")}
                  className="py-2 cursor-pointer hover:bg-gray-100 transition duration-200"
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
            className="px-4 py-2 text-gray-800 bg-gray-200 rounded-md transition duration-200 hover:bg-gray-300"
          >
            Color {isColorOpen ? "▲" : "▼"}
          </button>
          {isColorOpen && (
            <div className="absolute left-0 mt-2 w-48 bg-white border shadow-lg z-50">
              <ul className="p-4">
                <li
                  onClick={() => setFilter("white")}
                  className="py-2 cursor-pointer hover:bg-gray-100 transition duration-200"
                >
                  White
                </li>
                <li
                  onClick={() => setFilter("yellow")}
                  className="py-2 cursor-pointer hover:bg-gray-100 transition duration-200"
                >
                  Yellow
                </li>
                <li
                  onClick={() => setFilter("green")}
                  className="py-2 cursor-pointer hover:bg-gray-100 transition duration-200"
                >
                  Green
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Filter Option: Price Range */}
        <div className="relative">
          <button
            onClick={togglePrice}
            className="px-4 py-2 text-gray-800 bg-gray-200 rounded-md transition duration-200 hover:bg-gray-300"
          >
            Price Range {isPriceOpen ? "▲" : "▼"}
          </button>
          {isPriceOpen && (
            <div className="absolute left-0 mt-2 w-48 bg-white border shadow-lg z-50">
              <ul className="p-4">
                <li
                  onClick={() => setFilter("0-50")}
                  className="py-2 cursor-pointer hover:bg-gray-100 transition duration-200"
                >
                  $0 - $50
                </li>
                <li
                  onClick={() => setFilter("50-100")}
                  className="py-2 cursor-pointer hover:bg-gray-100 transition duration-200"
                >
                  $50 - $100
                </li>
                <li
                  onClick={() => setFilter("100-200")}
                  className="py-2 cursor-pointer hover:bg-gray-100 transition duration-200"
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
