"use client";

import { useState, useMemo } from "react";
import ListingCard from "@/components/ListingCard";
import type { Listing } from "@/types";

// Mock listings data
const mockListings: Listing[] = [
  {
    id: "1",
    title: "Oakwood Adult Family Home",
    location: "Kirkland, WA",
    careTypes: [
      { label: "Adult Family Home", color: "orange" },
      { label: "Assisted Living", color: "teal" },
    ],
    price: 3800,
    rating: 4.9,
    reviewCount: 34,
    bedsAvailable: 1,
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
    verified: true,
  },
  {
    id: "2",
    title: "Evergreen Memory Care",
    location: "Seattle, WA",
    careTypes: [{ label: "Memory Care", color: "purple" }],
    price: 6500,
    rating: 4.8,
    reviewCount: 89,
    bedsAvailable: 2,
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
    verified: true,
  },
  {
    id: "3",
    title: "Sunrise Senior Living at Bellevue",
    location: "Bellevue, WA",
    careTypes: [
      { label: "Assisted Living", color: "teal" },
      { label: "Memory Care", color: "purple" },
    ],
    price: 4500,
    rating: 4.7,
    reviewCount: 127,
    bedsAvailable: 4,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80",
    verified: true,
  },
  {
    id: "4",
    title: "Harbor View Assisted Living",
    location: "Edmonds, WA",
    careTypes: [{ label: "Assisted Living", color: "teal" }],
    price: 5200,
    rating: 4.6,
    reviewCount: 56,
    bedsAvailable: 6,
    image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80",
    verified: true,
  },
  {
    id: "5",
    title: "Cascade Independent Living",
    location: "Redmond, WA",
    careTypes: [{ label: "Independent Living", color: "blue" }],
    price: 2800,
    rating: 4.5,
    reviewCount: 78,
    bedsAvailable: 12,
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
    verified: true,
  },
  {
    id: "6",
    title: "Pacific Skilled Nursing & Rehabilitation",
    location: "Tacoma, WA",
    careTypes: [{ label: "Skilled Nursing", color: "orange" }],
    price: 7200,
    rating: 4.4,
    reviewCount: 92,
    bedsAvailable: 8,
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
    verified: true,
  },
];

interface FilterState {
  careLevel: string[];
  minBudget: number;
  maxBudget: number;
  amenities: string[];
  certifications: string[];
  insurance: string[];
  availability: string[];
}

const careLevels = [
  "Assisted Living",
  "Memory Care",
  "Independent Living",
  "Adult Family Home",
  "Skilled Nursing",
];

const amenities = [
  "Private rooms",
  "Pet friendly",
  "Outdoor spaces",
  "Fitness center",
  "Beauty salon",
  "Library",
  "Chapel",
  "Transportation",
  "WiFi",
  "Restaurant-style dining",
  "Housekeeping",
  "Laundry service",
];

const certifications = [
  "State licensed",
  "Medicare certified",
  "Medicaid certified",
  "VA approved",
  "Joint Commission accredited",
];

const insuranceOptions = [
  "Medicare",
  "Medicaid",
  "Private insurance",
  "Long-term care insurance",
  "VA benefits",
];

const availabilityOptions = [
  "Has beds available",
  "24-hour care available",
];

type SortOption = "highest-rated" | "price-low-high" | "price-high-low" | "most-available";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    careLevel: [],
    minBudget: 0,
    maxBudget: 15000,
    amenities: [],
    certifications: [],
    insurance: [],
    availability: [],
  });
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    careLevel: true,
    budget: true,
    amenities: false,
    certifications: false,
    insurance: false,
    availability: false,
  });
  const [sortBy, setSortBy] = useState<SortOption>("highest-rated");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleFilter = (category: keyof FilterState, value: string) => {
    setFilters((prev) => {
      const current = prev[category] as string[];
      if (current.includes(value)) {
        return {
          ...prev,
          [category]: current.filter((item) => item !== value),
        };
      } else {
        return {
          ...prev,
          [category]: [...current, value],
        };
      }
    });
  };

  const updateBudget = (min: number, max: number) => {
    setFilters((prev) => ({
      ...prev,
      minBudget: min,
      maxBudget: max,
    }));
  };

  const resetFilters = () => {
    setFilters({
      careLevel: [],
      minBudget: 0,
      maxBudget: 15000,
      amenities: [],
      certifications: [],
      insurance: [],
      availability: [],
    });
  };

  const getActiveFilters = () => {
    const active: Array<{ category: string; label: string; value: string }> = [];
    
    filters.careLevel.forEach((item) => {
      active.push({ category: "careLevel", label: item, value: item });
    });
    
    if (filters.minBudget > 0 || filters.maxBudget < 15000) {
      const minLabel = filters.minBudget === 0 ? "$0" : `$${filters.minBudget.toLocaleString()}`;
      const maxLabel = filters.maxBudget === 15000 ? "$15,000+" : `$${filters.maxBudget.toLocaleString()}`;
      active.push({
        category: "budget",
        label: `${minLabel} - ${maxLabel}`,
        value: "budget",
      });
    }
    
    filters.amenities.forEach((item) => {
      active.push({ category: "amenities", label: item, value: item });
    });
    
    filters.certifications.forEach((item) => {
      active.push({ category: "certifications", label: item, value: item });
    });
    
    filters.insurance.forEach((item) => {
      active.push({ category: "insurance", label: item, value: item });
    });
    
    filters.availability.forEach((item) => {
      active.push({ category: "availability", label: item, value: item });
    });
    
    return active;
  };

  const removeFilter = (category: string, value: string) => {
    if (category === "budget") {
      updateBudget(0, 15000);
    } else {
      toggleFilter(category as keyof FilterState, value);
    }
  };

  const filteredAndSortedListings = useMemo(() => {
    let filtered = [...mockListings];

    // Apply filters
    if (filters.careLevel.length > 0) {
      filtered = filtered.filter((listing) =>
        listing.careTypes.some((ct) => filters.careLevel.includes(ct.label))
      );
    }

    if (filters.minBudget > 0 || filters.maxBudget < 15000) {
      filtered = filtered.filter(
        (listing) => listing.price >= filters.minBudget && listing.price <= filters.maxBudget
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "highest-rated":
          return b.rating - a.rating;
        case "price-low-high":
          return a.price - b.price;
        case "price-high-low":
          return b.price - a.price;
        case "most-available":
          return b.bedsAvailable - a.bedsAvailable;
        default:
          return 0;
      }
    });

    return sorted;
  }, [filters, sortBy]);

  const activeFilters = getActiveFilters();

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Search Bar Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-[144px] py-6">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by city, state, or ZIP code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {activeFilters.map((filter, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 border border-teal-200 px-3 py-1.5 rounded-full text-sm font-medium"
                >
                  {filter.label}
                  <button
                    onClick={() => removeFilter(filter.category, filter.value)}
                    className="hover:text-teal-900 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
              <button
                onClick={resetFilters}
                className="text-slate-600 hover:text-slate-900 text-sm font-medium underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-[144px] py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className="w-80 shrink-0">
            <div className="bg-white border border-slate-200 rounded-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900">Filters</h2>
                {activeFilters.length > 0 && (
                  <button
                    onClick={resetFilters}
                    className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                  >
                    Reset Filters
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {/* Care Level */}
                <div>
                  <button
                    onClick={() => toggleSection("careLevel")}
                    className="w-full flex items-center justify-between text-left font-semibold text-slate-900 mb-3"
                  >
                    <span>Care Level</span>
                    <svg
                      className={`w-5 h-5 transition-transform ${expandedSections.careLevel ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedSections.careLevel && (
                    <div className="space-y-2">
                      {careLevels.map((level) => (
                        <label key={level} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.careLevel.includes(level)}
                            onChange={() => toggleFilter("careLevel", level)}
                            className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                          />
                          <span className="text-sm text-slate-700">{level}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Monthly Budget */}
                <div>
                  <button
                    onClick={() => toggleSection("budget")}
                    className="w-full flex items-center justify-between text-left font-semibold text-slate-900 mb-3"
                  >
                    <span>Monthly Budget</span>
                    <svg
                      className={`w-5 h-5 transition-transform ${expandedSections.budget ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedSections.budget && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
                        <span>${filters.minBudget.toLocaleString()}</span>
                        <span>${filters.maxBudget === 15000 ? "15,000+" : filters.maxBudget.toLocaleString()}</span>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-slate-500 mb-1 block">Min: ${filters.minBudget.toLocaleString()}</label>
                          <input
                            type="range"
                            min="0"
                            max={filters.maxBudget}
                            step="500"
                            value={filters.minBudget}
                            onChange={(e) => updateBudget(Number(e.target.value), filters.maxBudget)}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-500 mb-1 block">Max: ${filters.maxBudget === 15000 ? "15,000+" : filters.maxBudget.toLocaleString()}</label>
                          <input
                            type="range"
                            min={filters.minBudget}
                            max="15000"
                            step="500"
                            value={filters.maxBudget}
                            onChange={(e) => updateBudget(filters.minBudget, Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Amenities */}
                <div>
                  <button
                    onClick={() => toggleSection("amenities")}
                    className="w-full flex items-center justify-between text-left font-semibold text-slate-900 mb-3"
                  >
                    <span>Amenities</span>
                    <svg
                      className={`w-5 h-5 transition-transform ${expandedSections.amenities ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedSections.amenities && (
                    <div className="space-y-2">
                      {amenities.map((amenity) => (
                        <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.amenities.includes(amenity)}
                            onChange={() => toggleFilter("amenities", amenity)}
                            className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                          />
                          <span className="text-sm text-slate-700">{amenity}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Certifications */}
                <div>
                  <button
                    onClick={() => toggleSection("certifications")}
                    className="w-full flex items-center justify-between text-left font-semibold text-slate-900 mb-3"
                  >
                    <span>Certifications</span>
                    <svg
                      className={`w-5 h-5 transition-transform ${expandedSections.certifications ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedSections.certifications && (
                    <div className="space-y-2">
                      {certifications.map((cert) => (
                        <label key={cert} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.certifications.includes(cert)}
                            onChange={() => toggleFilter("certifications", cert)}
                            className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                          />
                          <span className="text-sm text-slate-700">{cert}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Insurance Accepted */}
                <div>
                  <button
                    onClick={() => toggleSection("insurance")}
                    className="w-full flex items-center justify-between text-left font-semibold text-slate-900 mb-3"
                  >
                    <span>Insurance Accepted</span>
                    <svg
                      className={`w-5 h-5 transition-transform ${expandedSections.insurance ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedSections.insurance && (
                    <div className="space-y-2">
                      {insuranceOptions.map((insurance) => (
                        <label key={insurance} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.insurance.includes(insurance)}
                            onChange={() => toggleFilter("insurance", insurance)}
                            className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                          />
                          <span className="text-sm text-slate-700">{insurance}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Availability */}
                <div>
                  <button
                    onClick={() => toggleSection("availability")}
                    className="w-full flex items-center justify-between text-left font-semibold text-slate-900 mb-3"
                  >
                    <span>Availability</span>
                    <svg
                      className={`w-5 h-5 transition-transform ${expandedSections.availability ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedSections.availability && (
                    <div className="space-y-2">
                      {availabilityOptions.map((option) => (
                        <label key={option} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.availability.includes(option)}
                            onChange={() => toggleFilter("availability", option)}
                            className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                          />
                          <span className="text-sm text-slate-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Reset Filters Button */}
                <div className="pt-4 border-t border-slate-200">
                  <button
                    onClick={resetFilters}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Listings Area */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-slate-600">
                {filteredAndSortedListings.length} {filteredAndSortedListings.length === 1 ? "community" : "communities"} found
              </p>
              <div className="flex items-center gap-4">
                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                >
                  <option value="highest-rated">Highest Rated</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="most-available">Most Available</option>
                </select>

                {/* View Toggle */}
                <div className="flex items-center gap-1 border border-slate-300 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded ${viewMode === "grid" ? "bg-teal-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded ${viewMode === "list" ? "bg-teal-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Listings Grid */}
            <div className={viewMode === "grid" ? "grid grid-cols-2 gap-6" : "space-y-6"}>
              {filteredAndSortedListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
