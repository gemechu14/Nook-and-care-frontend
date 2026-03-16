"use client";

import { useState, useMemo, useEffect } from "react";
import ListingCard from "@/components/ui/ListingCard";
import { listingsApi } from "@/services/listingService";
import { BASE_URL } from "@/constants/config";
import type { ApiListing } from "@/types";

// Listings will be fetched from API

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
    maxBudget: 15000, // Keep for compatibility but we'll use minBudget only
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
  const [listings, setListings] = useState<ApiListing[]>([]);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [listingsError, setListingsError] = useState<string | null>(null);

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

  const updateMinBudget = (min: number) => {
    setFilters((prev) => ({
      ...prev,
      minBudget: min,
    }));
  };

  const resetFilters = () => {
    setFilters({
      careLevel: [],
      minBudget: 0, // Default to 0 (show all)
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
    
    if (filters.minBudget > 0) {
      const minLabel = filters.minBudget === 15000 ? "$15,000+" : `$${filters.minBudget.toLocaleString()}+`;
      active.push({
        category: "budget",
        label: minLabel,
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

  // Fetch listings from API - runs on mount and when filters/search change
  useEffect(() => {
    let isMounted = true;
    
    const fetchListings = async () => {
      try {
        setListingsLoading(true);
        setListingsError(null);
        
        // Build API filter params
        // Note: status is not a supported API parameter, so we filter client-side
        // When filters are at default (empty arrays, minBudget = 0), fetch ALL listings
        const apiFilters: {
          skip?: number;
          limit?: number;
          city?: string;
          care_type?: string;
          min_price?: number;
          max_price?: number;
        } = {
          limit: 100, // Get more listings for client-side filtering
        };
        
        // Only add filters if they have non-default values

        // Map care level filters to API care_type
        // When no care level is selected (default), fetch all listings
        if (filters.careLevel.length > 0) {
          // For now, use the first selected care type
          // In a real implementation, you might want to fetch all and filter client-side
          // or make multiple API calls
          const careTypeMap: Record<string, string> = {
            "Assisted Living": "ASSISTED_LIVING",
            "Memory Care": "MEMORY_CARE",
            "Independent Living": "INDEPENDENT_LIVING",
            "Adult Family Home": "ADULT_FAMILY_HOME",
            "Skilled Nursing": "SKILLED_NURSING",
          };
          const firstCareType = careTypeMap[filters.careLevel[0]];
          if (firstCareType) {
            apiFilters.care_type = firstCareType;
          }
        }
        // When careLevel is empty (default), don't add care_type filter - fetch all care types

        // Add price filter - use minBudget as minimum price threshold
        // Only add min_price filter if minBudget is greater than 0
        // When minBudget is 0, we want to show all listings regardless of price
        if (filters.minBudget > 0) {
          apiFilters.min_price = filters.minBudget;
        }
        // Don't add max_price filter - we want to show all listings above minBudget

        // Add city filter if search query looks like a location
        if (searchQuery.trim()) {
          // Simple heuristic: if it contains a comma or looks like a city/state
          const parts = searchQuery.split(",").map(s => s.trim());
          if (parts.length > 0) {
            apiFilters.city = parts[0];
          }
        }

        console.log("Fetching listings with filters:", apiFilters);
        const fetchedListings = await listingsApi.list(apiFilters);
        
        // Ensure we have an array (handle null/undefined responses)
        const listingsArray = Array.isArray(fetchedListings) ? fetchedListings : [];
        
        console.log("Raw listings from API:", listingsArray.length);
        
        // Get base URL without /api/v1
        const baseUrl = BASE_URL.replace("/api/v1", "");
        
        // Process listings to get primary image URL from images array
        // IMPORTANT: Do not filter by status here — show ALL listings by default
        const listingsWithImages = listingsArray.map((listing) => {
          // Use images array from listing response if available
          const images = listing.images || [];
          const primaryImage = images.find(img => img.is_primary) || images[0];
          
          let imageUrl = "/placeholder-listing.jpg";
          if (primaryImage?.image_url) {
            // Construct full URL by prepending base URL
            imageUrl = primaryImage.image_url.startsWith("http")
              ? primaryImage.image_url
              : `${baseUrl}${primaryImage.image_url}`;
          }
          
          return {
            ...listing,
            primaryImageUrl: imageUrl
          };
        });
        
        if (isMounted) {
          setListings(listingsWithImages);
        }
      } catch (error) {
        console.error("Failed to fetch listings:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("Error details:", errorMessage);
        if (isMounted) {
          setListingsError(`Failed to load listings: ${errorMessage}`);
          setListings([]); // Ensure listings is empty on error
        }
      } finally {
        if (isMounted) {
          setListingsLoading(false);
        }
      }
    };

    // Always fetch on mount and when filters/search change
    fetchListings();
    
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.careLevel, filters.minBudget, searchQuery]);

  const filteredAndSortedListings = useMemo(() => {
    let filtered = [...listings];

    // Apply client-side filters (for multiple care types, amenities, etc.)
    if (filters.careLevel.length > 0) {
      filtered = filtered.filter((listing) => {
        const listingCareType = listing.care_type;
        const careTypeMap: Record<string, string[]> = {
          "ASSISTED_LIVING": ["Assisted Living"],
          "MEMORY_CARE": ["Memory Care"],
          "INDEPENDENT_LIVING": ["Independent Living"],
          "ADULT_FAMILY_HOME": ["Adult Family Home"],
          "SKILLED_NURSING": ["Skilled Nursing"],
        };
        const listingCareTypeLabel = careTypeMap[listingCareType]?.[0] || "";
        return filters.careLevel.includes(listingCareTypeLabel);
      });
    }

    // Price filter - filter by minimum price threshold
    // When minBudget is 0, show all listings (no price filtering)
    if (filters.minBudget > 0) {
      filtered = filtered.filter(
        (listing) => {
          const price = listing.price ?? 0;
          // Include listings with null/0 price when minBudget > 0, or when price >= minBudget
          return price === 0 || price === null || price >= filters.minBudget;
        }
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "highest-rated":
          return (b.avg_rating ?? 0) - (a.avg_rating ?? 0);
        case "price-low-high":
          return (a.price ?? 0) - (b.price ?? 0);
        case "price-high-low":
          return (b.price ?? 0) - (a.price ?? 0);
        case "most-available":
          return (b.available_beds ?? 0) - (a.available_beds ?? 0);
        default:
          return 0;
      }
    });

    return sorted;
  }, [listings, filters, sortBy]);

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
                    <div className="space-y-3">
                      {/* Price Labels */}
                      <div className="flex items-center justify-between text-sm font-medium text-slate-900">
                        <span>$0</span>
                        <span>$15,000+</span>
                      </div>
                      
                      {/* Single Range Slider */}
                      <div>
                        <input
                          type="range"
                          min="0"
                          max="15000"
                          step="500"
                          value={filters.minBudget}
                          onChange={(e) => updateMinBudget(Number(e.target.value))}
                          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-teal-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-teal-600 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                        />
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
            {listingsLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : listingsError ? (
              <div className="text-center py-20">
                <p className="text-slate-600 mb-4">{listingsError}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="text-teal-600 hover:text-teal-700 font-medium"
                >
                  Try again
                </button>
              </div>
            ) : filteredAndSortedListings.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-slate-600 mb-2">
                  {activeFilters.length > 0 || searchQuery.trim() 
                    ? "No communities found matching your criteria."
                    : "No communities found."}
                </p>
                <p className="text-slate-500 text-sm">
                  {activeFilters.length > 0 || searchQuery.trim()
                    ? "Try adjusting your filters or search terms."
                    : "There are currently no active listings available."}
                </p>
                {(activeFilters.length > 0 || searchQuery.trim()) && (
                  <button
                    onClick={resetFilters}
                    className="mt-4 text-teal-600 hover:text-teal-700 font-medium"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <div className={viewMode === "grid" ? "grid grid-cols-2 gap-6" : "space-y-6"}>
                {filteredAndSortedListings.map((listing) => {
                  // Transform ApiListing to include image for ListingCard
                  const listingWithImage = {
                    ...listing,
                    image: (listing as any).primaryImageUrl || "/placeholder-listing.jpg"
                  };
                  return <ListingCard key={listing.id} listing={listingWithImage} />;
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
