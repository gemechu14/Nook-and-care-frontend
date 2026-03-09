"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomeSearchForm() {
  const [location, setLocation] = useState("");
  const [careType, setCareType] = useState("");
  const [budget, setBudget] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (location) query.append("location", location);
    if (careType) query.append("care", careType);
    if (budget) query.append("budget", budget);
    router.push(`/search?${query.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-lg p-10 space-y-4 w-full"
    >
      {/* Location */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="City, State, or ZIP code"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
        />
      </div>

      {/* Type + Budget row */}
      <div className="grid grid-cols-2 gap-3">
        <select
          value={careType}
          onChange={(e) => setCareType(e.target.value)}
          className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white text-sm"
        >
          <option value="">Type of care needed</option>
          <option value="assisted-living">Assisted Living</option>
          <option value="memory-care">Memory Care</option>
          <option value="independent-living">Independent Living</option>
          <option value="adult-family-home">Adult Family Home</option>
          <option value="skilled-nursing">Skilled Nursing</option>
        </select>

        <select
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white text-sm"
        >
          <option value="">Monthly budget</option>
          <option value="1000-2000">$1,000 – $2,000</option>
          <option value="2000-3000">$2,000 – $3,000</option>
          <option value="3000-4000">$3,000 – $4,000</option>
          <option value="4000-5000">$4,000 – $5,000</option>
          <option value="5000+">$5,000+</option>
        </select>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white py-2.5 rounded-lg font-semibold hover:bg-teal-700 transition-colors text-base mt-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        Search Communities
      </button>
    </form>
  );
}

