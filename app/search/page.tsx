"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import ListingCard from "@/components/ListingCard";

// Mock data - replace with API call
const mockListings = [
  {
    id: "1",
    title: "Sunset Senior Living",
    location: "Los Angeles, CA",
    careType: "Assisted Living",
    roomType: "Private",
    price: 3500,
    rating: 4.5,
    image: "/placeholder-listing.jpg",
    amenities: ["WiFi", "Pool", "Gym", "24/7 Care"],
  },
  {
    id: "2",
    title: "Harmony Gardens",
    location: "San Diego, CA",
    careType: "Memory Care",
    roomType: "Semi-Private",
    price: 4200,
    rating: 4.8,
    image: "/placeholder-listing.jpg",
    amenities: ["WiFi", "Garden", "Activities"],
  },
  {
    id: "3",
    title: "Golden Years Residence",
    location: "San Francisco, CA",
    careType: "Independent Living",
    roomType: "Private",
    price: 3800,
    rating: 4.7,
    image: "/placeholder-listing.jpg",
    amenities: ["WiFi", "Pool", "Library", "Transportation"],
  },
];

export default function SearchPage() {
  const [listings] = useState(mockListings);
  const [filters, setFilters] = useState({
    location: "",
    careType: "",
    minPrice: "",
    maxPrice: "",
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Search Senior Housing</h1>
          <SearchBar />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Filters</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <input
                    type="text"
                    placeholder="City, State"
                    className="w-full px-3 py-2 border rounded-md"
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Care Type</label>
                  <select
                    className="w-full px-3 py-2 border rounded-md"
                    value={filters.careType}
                    onChange={(e) => setFilters({ ...filters, careType: e.target.value })}
                  >
                    <option value="">All Types</option>
                    <option value="independent">Independent Living</option>
                    <option value="assisted">Assisted Living</option>
                    <option value="memory">Memory Care</option>
                    <option value="nursing">Nursing Home</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Price Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-full px-3 py-2 border rounded-md"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-full px-3 py-2 border rounded-md"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Listings Grid */}
          <div className="lg:col-span-3">
            <div className="mb-4">
              <p className="text-gray-600">
                Found {listings.length} facilities
              </p>
            </div>
            <div className="grid gap-6">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

