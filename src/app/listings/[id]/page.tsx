"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { listingsApi } from "@/services/listingService";
import { listingImagesApi } from "@/services/listingImagesService";
import type { ApiListing, ApiListingImage } from "@/types";
import { CARE_TYPE_LABELS, CARE_TYPE_COLORS } from "@/types";

interface ListingDetail {
  id: string;
  title: string;
  address: string;
  careTypes: Array<{ label: string; color: "teal" | "purple" | "blue" | "orange" }>;
  price: number;
  maxPrice: number;
  rating: number;
  reviewCount: number;
  bedsAvailable: number;
  capacity: number;
  staffRatio: string;
  phone: string;
  email: string;
  website: string;
  licenseNumber: string;
  established: string;
  images: string[];
  description: string;
  descriptionExtra?: string;
  careServices: string[];
  amenities: string[];
  activities: string[];
  diningOptions: string[];
  safetyFeatures: string[];
  certifications: string[];
  insuranceAccepted: string[];
}

const mockListings: Record<string, ListingDetail> = {
  "1": {
    id: "1",
    title: "Oakwood Adult Family Home",
    address: "123 Oak Street, Kirkland, WA 98033",
    careTypes: [
      { label: "Adult Family Home", color: "orange" },
      { label: "Assisted Living", color: "teal" },
    ],
    price: 3800,
    maxPrice: 4500,
    rating: 4.9,
    reviewCount: 34,
    bedsAvailable: 1,
    capacity: 6,
    staffRatio: "1:3",
    phone: "(425) 555-0100",
    email: "info@oakwoodafh.com",
    website: "www.oakwoodafh.com",
    licenseNumber: "AFH-123456",
    established: "2010",
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
      "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80",
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
    ],
    description:
      "Oakwood Adult Family Home provides personalized care in a warm, residential setting. Our intimate home environment offers individualized attention and a family-like atmosphere for residents.",
    careServices: ["Medication management", "Personal care assistance", "24-hour supervision", "Meal preparation"],
    amenities: ["Private rooms", "Shared common areas", "Outdoor patio", "WiFi", "Housekeeping", "Laundry service"],
    activities: ["Daily activities", "Social gatherings", "Outdoor walks", "Games and puzzles"],
    diningOptions: ["Three meals daily", "Snacks available", "Special dietary accommodations"],
    safetyFeatures: ["Emergency call system", "Fire safety", "Wheelchair accessible", "Secure entrance", "24-hour supervision"],
    certifications: ["State licensed", "Medicaid certified"],
    insuranceAccepted: ["Medicaid", "Private insurance", "Long-term care insurance"],
  },
  "2": {
    id: "2",
    title: "Evergreen Memory Care",
    address: "456 Pine Street, Seattle, WA 98101",
    careTypes: [{ label: "Memory Care", color: "purple" }],
    price: 6500,
    maxPrice: 9500,
    rating: 4.8,
    reviewCount: 89,
    bedsAvailable: 2,
    capacity: 48,
    staffRatio: "1:5",
    phone: "(206) 555-0202",
    email: "info@evergreenmemorycare.com",
    website: "www.evergreenmemorycare.com",
    licenseNumber: "MC-1234567",
    established: "2012",
    images: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
      "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80",
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
    ],
    description:
      "Evergreen Memory Care specializes in providing compassionate care for individuals living with Alzheimer's and dementia. Our purpose-built community features secure neighborhoods, easy-to-navigate layouts, and calming environments designed to reduce anxiety and promote well-being.",
    descriptionExtra:
      "Our specialized staff receives ongoing training in evidence-based approaches to memory care, ensuring residents receive the highest quality of support.",
    careServices: ["Medication management", "Memory care", "24-hour nursing", "Vital monitoring"],
    amenities: ["Private rooms", "Beauty salon", "Restaurant-style dining", "Laundry service", "Outdoor spaces", "WiFi", "Housekeeping"],
    activities: ["Music therapy", "Gentle exercise", "Sensory activities", "Reminiscence therapy"],
    diningOptions: ["Three meals daily", "Finger food options", "Special dietary accommodations"],
    safetyFeatures: ["Emergency call system", "Fire safety", "Wheelchair accessible", "Wandering prevention", "Secure entrance", "Fall prevention", "24-hour security"],
    certifications: ["State licensed", "Medicare certified", "Medicaid certified"],
    insuranceAccepted: ["Medicare", "Medicaid", "Private insurance", "Long-term care insurance"],
  },
  "3": {
    id: "3",
    title: "Sunrise Senior Living at Bellevue",
    address: "123 Bellevue Way NE, Bellevue, WA 98004",
    careTypes: [
      { label: "Assisted Living", color: "teal" },
      { label: "Memory Care", color: "purple" },
    ],
    price: 4500,
    maxPrice: 8500,
    rating: 4.7,
    reviewCount: 127,
    bedsAvailable: 4,
    capacity: 85,
    staffRatio: "1:8",
    phone: "(425) 555-0101",
    email: "bellevue@sunriseseniorliving.com",
    website: "www.sunriseseniorliving.com",
    licenseNumber: "AL-0892341",
    established: "2005",
    images: [
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
    ],
    description:
      "Sunrise Senior Living at Bellevue provides compassionate, personalized care in a beautiful Pacific Northwest setting. Our community offers a warm, homelike environment where residents enjoy individualized care plans, engaging activities, and delicious chef-prepared meals. With a dedicated team available 24/7, families can have peace of mind knowing their loved ones are safe and cared for.",
    descriptionExtra:
      "Our memory care neighborhood, Reminiscence, provides specialized care for those living with Alzheimer's and other forms of dementia, with specially trained team members and purposeful programming.",
    careServices: ["Medication management", "Physical therapy", "24-hour nursing", "Memory care", "Vital monitoring"],
    amenities: ["Private rooms", "Pet friendly", "Outdoor spaces", "Fitness center", "Beauty salon", "Library", "Chapel", "Transportation", "WiFi", "Restaurant-style dining", "Housekeeping", "Laundry service"],
    activities: ["Arts & crafts", "Music therapy", "Exercise classes", "Social events", "Gardening", "Movie nights", "Outings"],
    diningOptions: ["Three chef-prepared meals daily", "Special dietary accommodations", "All-day dining room", "Snacks and beverages"],
    safetyFeatures: ["Emergency call system", "Secure entrance", "Fire safety", "Fall prevention", "Wheelchair accessible", "24-hour security"],
    certifications: ["State licensed", "Medicare certified", "Joint Commission accredited"],
    insuranceAccepted: ["Medicare", "Private insurance", "Long-term care insurance"],
  },
  "4": {
    id: "4",
    title: "Cascade Independent Living",
    address: "789 Cascade Drive, Redmond, WA 98052",
    careTypes: [{ label: "Independent Living", color: "blue" }],
    price: 2800,
    maxPrice: 4200,
    rating: 4.5,
    reviewCount: 78,
    bedsAvailable: 12,
    capacity: 120,
    staffRatio: "1:15",
    phone: "(425) 555-0102",
    email: "info@cascadeindependent.com",
    website: "www.cascadeindependent.com",
    licenseNumber: "IL-4567890",
    established: "2008",
    images: [
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
      "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80",
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80",
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
    ],
    description:
      "Cascade Independent Living provides an active, maintenance-free lifestyle for seniors. Enjoy spacious apartments, resort-style amenities, and a vibrant social community while maintaining your independence.",
    careServices: ["Emergency response system", "Wellness programs", "Health screenings", "Medication reminders"],
    amenities: ["Private apartments", "Fitness center", "Swimming pool", "Restaurant-style dining", "Library", "Game room", "Outdoor spaces", "WiFi", "Housekeeping", "Transportation"],
    activities: ["Fitness classes", "Arts and crafts", "Book club", "Social events", "Day trips"],
    diningOptions: ["Three meals daily", "Snacks available", "Special dietary accommodations"],
    safetyFeatures: ["Emergency call system", "Fire safety", "Wheelchair accessible", "Secure entrance", "24-hour security"],
    certifications: ["State licensed"],
    insuranceAccepted: ["Private insurance", "Long-term care insurance"],
  },
};

const badgeColors: Record<string, string> = {
  teal: "bg-teal-50 text-teal-700 border-teal-200",
  purple: "bg-purple-50 text-purple-700 border-purple-200",
  blue: "bg-blue-50 text-blue-700 border-blue-200",
  orange: "bg-orange-50 text-orange-700 border-orange-200",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-5 h-5 ${star <= Math.round(rating) ? "text-amber-400" : "text-slate-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function CalendarPicker({ onSelect }: { onSelect: (date: Date) => void }) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const today = new Date();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateClick = (day: number) => {
    const selectedDate = new Date(currentYear, currentMonth, day);
    onSelect(selectedDate);
  };

  const isToday = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isPastDate = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    return date < today && !isToday(day);
  };

  return (
    <div className="w-full sm:w-64">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-1 hover:bg-slate-100 rounded transition-colors"
        >
          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="font-semibold text-slate-900">
          {monthNames[currentMonth]} {currentYear}
        </h3>
        <button
          onClick={handleNextMonth}
          className="p-1 hover:bg-slate-100 rounded transition-colors"
        >
          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-xs font-medium text-slate-500 text-center py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before month starts */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {/* Days of the month */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const disabled = isPastDate(day);
          const todayClass = isToday(day) ? "bg-teal-600 text-white font-semibold" : "";

          return (
            <button
              key={day}
              onClick={() => !disabled && handleDateClick(day)}
              disabled={disabled}
              className={`aspect-square text-sm rounded hover:bg-teal-50 transition-colors ${
                disabled
                  ? "text-slate-300 cursor-not-allowed"
                  : todayClass || "text-slate-700 hover:text-teal-600"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<"services" | "reviews" | "location">("services");
  const [scheduleTourOpen, setScheduleTourOpen] = useState(false);
  const [requestInfoOpen, setRequestInfoOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  // API state
  const [apiListing, setApiListing] = useState<ApiListing | null>(null);
  const [apiImages, setApiImages] = useState<ApiListingImage[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  // Form states for Schedule Tour - moved before early returns to fix hook order
  const [tourForm, setTourForm] = useState({
    date: "March 13th, 2026",
    time: "",
    name: "",
    email: "",
    phone: "",
    requests: "",
  });

  // Form states for Request Information - moved before early returns to fix hook order
  const [infoForm, setInfoForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // Calendar ref - moved before early returns to fix hook order
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) {
      setPageError("Invalid listing ID.");
      setPageLoading(false);
      return;
    }
    
    // Check if it's a mock ID (1-4) — use mock data; otherwise fetch from API
    if (mockListings[id]) {
      setPageLoading(false);
      return;
    }
    
    (async () => {
      try {
        const data = await listingsApi.getById(id);
        setApiListing(data);
        
        // If images are not included in the listing response, fetch them separately
        if (!data.images || data.images.length === 0) {
          try {
            const imgs = await listingImagesApi.getByListing(id);
            setApiImages(imgs);
          } catch {
            // Images fetch failed, but continue with listing data
            setApiImages([]);
          }
        } else {
          setApiImages([]);
        }
      } catch (err) {
        setPageError(err instanceof Error ? err.message : "Community not found.");
      } finally {
        setPageLoading(false);
      }
    })();
  }, [id]);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setCalendarOpen(false);
      }
    };

    if (calendarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [calendarOpen]);

  // Build a unified listing object from either API or mock data
  const rawMock = id ? mockListings[id] : null;
  const listing: ListingDetail | null = rawMock ?? (apiListing ? {
    id: apiListing.id,
    title: apiListing.title,
    address: [
      apiListing.address,
      apiListing.city,
      apiListing.state,
      apiListing.postal_code
    ].filter(Boolean).join(", "),
    careTypes: [{
      label: CARE_TYPE_LABELS[apiListing.care_type] ?? apiListing.care_type,
      color: CARE_TYPE_COLORS[apiListing.care_type] ?? "teal"
    }],
    price: apiListing.price ?? 0,
    maxPrice: (apiListing.price ?? 0) * 1.2,
    rating: apiListing.avg_rating ?? 0,
    reviewCount: apiListing.review_count,
    bedsAvailable: apiListing.available_beds ?? 0,
    capacity: apiListing.capacity ?? 0,
    staffRatio: apiListing.staff_ratio ?? "—",
    phone: apiListing.phone ?? "",
    email: apiListing.email ?? "",
    website: "",
    licenseNumber: apiListing.license_number ?? "",
    established: apiListing.established_year?.toString() ?? new Date(apiListing.created_at).getFullYear().toString(),
    // Images: Use images from listing response if available, otherwise fallback to separately fetched images
    // listingImagesApi.getImageUrl() handles base URL prepending for relative URLs
    images: (apiListing.images && apiListing.images.length > 0)
      ? apiListing.images
          .sort((a, b) => a.display_order - b.display_order)
          .map((img) => listingImagesApi.getImageUrl(img.image_url, img.id))
      : (apiImages.length > 0
          ? apiImages
              .sort((a, b) => a.display_order - b.display_order)
              .map((img) => listingImagesApi.getImageUrl(img.image_url, img.id))
          : ["https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80"]),
    description: apiListing.description ?? "",
    careServices: [
      ...(apiListing.has_24_hour_care ? ["24-hour care available"] : []),
      ...(apiListing.services?.filter(s => s.is_included).map(s => s.treatment_service.name) ?? [])
    ],
    amenities: apiListing.amenities?.map(a => a.amenity.name) ?? [],
    activities: apiListing.activities?.map(a => a.activity.name) ?? [],
    diningOptions: apiListing.dining_options?.map(d => d.dining_option.name) ?? [],
    safetyFeatures: apiListing.safety_features?.map(s => s.safety_feature.name) ?? [],
    certifications: apiListing.certifications?.map(c => c.certification.name) ?? [],
    insuranceAccepted: apiListing.insurance_options?.map(i => i.insurance_option.name) ?? [],
  } : null);

  if (pageLoading) return (
    <div className="min-h-screen bg-white pt-16 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!listing) return (
    <div className="min-h-screen bg-white pt-16 flex flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-xl font-semibold text-slate-700">Community not found</p>
      <p className="text-slate-500">{pageError}</p>
      <Link href="/search" className="text-teal-600 hover:text-teal-700 font-medium transition-colors">Browse all communities</Link>
    </div>
  );

  // Format date for display
  const formatDate = (date: Date): string => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const daySuffix = day === 1 || day === 21 || day === 31 ? "st" : day === 2 || day === 22 ? "nd" : day === 3 || day === 23 ? "rd" : "th";
    return `${month} ${day}${daySuffix}, ${year}`;
  };

  const handleDateSelect = (date: Date) => {
    setTourForm({ ...tourForm, date: formatDate(date) });
    setCalendarOpen(false);
  };

  return (
    <div className="min-h-screen bg-white pt-16">

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-4 sm:px-6 md:px-8 lg:px-[144px] py-3 sm:py-4">
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
            <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/search" className="hover:text-slate-900 transition-colors">Search</Link>
            <span>/</span>
            <span className="text-slate-900 font-medium truncate max-w-[150px] sm:max-w-xs">{listing.title}</span>
          </nav>
        </div>
      </div>

      <div className="px-4 sm:px-6 md:px-8 lg:px-[144px] py-4 sm:py-6 md:py-8">

        {/* ── Full-Width Image Gallery ────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-2 mb-6 sm:mb-8 rounded-xl overflow-hidden h-[300px] sm:h-[400px] md:h-[460px]">

          {/* Main large image */}
          <div className="relative overflow-hidden group rounded-t-xl md:rounded-l-xl md:rounded-tr-none">
            <Image
              src={listing.images[0]}
              alt={listing.title}
              fill
              // Use raw backend image URL instead of Next.js image optimizer
              unoptimized
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>

          {/* Right 2×2 grid */}
          <div className="grid grid-cols-2 grid-rows-2 gap-2 hidden md:grid">
            {/* Top-left */}
            <div className="relative overflow-hidden group">
              <Image
                src={listing.images[1] ?? listing.images[0]}
                alt={`${listing.title} photo 2`}
                fill
                unoptimized
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            {/* Top-right */}
            <div className="relative overflow-hidden group rounded-tr-xl">
              <Image
                src={listing.images[2] ?? listing.images[0]}
                alt={`${listing.title} photo 3`}
                fill
                unoptimized
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            {/* Bottom-left */}
            <div className="relative overflow-hidden group">
              <Image
                src={listing.images[3] ?? listing.images[0]}
                alt={`${listing.title} photo 4`}
                fill
                unoptimized
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            {/* Bottom-right: "All Photos" button */}
            <div className="relative overflow-hidden group rounded-br-xl bg-slate-800">
              {listing.images[4] && (
                <Image
                  src={listing.images[4]}
                  alt={`${listing.title} photo 5`}
                  fill
                  unoptimized
                  className="object-cover opacity-60 transition-transform duration-300 group-hover:scale-110"
                />
              )}
              <button className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                <span className="text-sm font-semibold">All Photos ({listing.images.length})</span>
              </button>
            </div>
          </div>
          
          {/* Mobile: Show "All Photos" button below main image */}
          <div className="md:hidden mt-2">
            <button className="w-full flex items-center justify-center gap-2 py-3 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-700 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              View All Photos ({listing.images.length})
            </button>
          </div>
        </div>

        {/* ── Two-Column Layout ──────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">

          {/* ── LEFT: Scrollable Content ── */}
          <div className="w-full lg:flex-[3] lg:min-w-0">

            {/* Care type badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              {listing.careTypes.map((type, i) => (
                <span
                  key={i}
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${badgeColors[type.color]}`}
                >
                  {type.color === "teal" && (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  )}
                  {type.color === "purple" && (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
                    </svg>
                  )}
                  {type.label}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">{listing.title}</h1>

            {/* Address */}
            <div className="flex items-center gap-1.5 text-slate-500 mb-3">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm">{listing.address}</span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <StarRating rating={listing.rating} />
              <span className="font-semibold text-slate-900">{listing.rating.toFixed(1)}</span>
              <span className="text-slate-500 text-sm">({listing.reviewCount} reviews)</span>
            </div>

            {/* Key stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 text-center">
                <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">Starting at</p>
                <p className="text-xl sm:text-2xl font-bold text-slate-900">${listing.price.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-0.5">per month</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 text-center">
                <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">Capacity</p>
                <p className="text-xl sm:text-2xl font-bold text-slate-900">{listing.capacity}</p>
                <p className="text-xs text-slate-500 mt-0.5">residents</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 text-center">
                <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">Available</p>
                <p className="text-xl sm:text-2xl font-bold text-teal-600">{listing.bedsAvailable}</p>
                <p className="text-xs text-slate-500 mt-0.5">beds</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 text-center">
                <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">Staff Ratio</p>
                <p className="text-xl sm:text-2xl font-bold text-slate-900">{listing.staffRatio}</p>
                <p className="text-xs text-slate-500 mt-0.5">nurse:resident</p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">Contact Information</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-slate-700">{listing.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-slate-700">{listing.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <span className="text-teal-600 font-medium">Visit Website</span>
                </div>
              </div>
            </div>

            {/* Certifications & Licenses */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-6">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <h2 className="text-base sm:text-lg font-semibold text-slate-900">Certifications & Licenses</h2>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {listing.certifications.map((cert, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-50 text-teal-700 border border-teal-200 rounded-full text-sm font-medium">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {cert}
                  </span>
                ))}
              </div>
              <p className="text-sm text-slate-600">
                License #: <span className="font-medium text-slate-800">{listing.licenseNumber}</span>
              </p>
            </div>

            {/* Key Details */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">Key Details</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-teal-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-slate-700">24-hour care available</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-teal-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-slate-700">Established {listing.established}</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-teal-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="text-slate-700">{listing.capacity} bed community</span>
                </div>
              </div>
            </div>

            {/* About This Community */}
            <div className="mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-3 sm:mb-4">About This Community</h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-3 sm:mb-4">{listing.description}</p>
              {listing.descriptionExtra && (
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">{listing.descriptionExtra}</p>
              )}
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200 mb-4 sm:mb-6 overflow-x-auto">
              <div className="flex gap-4 sm:gap-6 md:gap-8 min-w-max sm:min-w-0">
                {(["services", "reviews", "location"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 sm:pb-4 px-1 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                      activeTab === tab
                        ? "text-teal-600 border-b-2 border-teal-600"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {tab === "services" && "Services & Amenities"}
                    {tab === "reviews" && `Reviews (${listing.reviewCount})`}
                    {tab === "location" && "Location"}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab: Services & Amenities */}
            {activeTab === "services" && (
              <div className="space-y-6">

                {/* Care Services */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 md:p-6">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <h3 className="text-sm sm:text-base font-semibold text-slate-900">Care Services</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {listing.careServices.map((s, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-teal-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="text-slate-700 text-sm">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 md:p-6">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <h3 className="text-sm sm:text-base font-semibold text-slate-900">Amenities</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {listing.amenities.map((a, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-teal-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-slate-700 text-sm">{a}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Activities & Programs */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 md:p-6">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="text-sm sm:text-base font-semibold text-slate-900">Activities & Programs</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {listing.activities.map((a, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-teal-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-slate-700 text-sm">{a}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dining Options */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 md:p-6">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    <h3 className="text-sm sm:text-base font-semibold text-slate-900">Dining Options</h3>
                  </div>
                  <div className="space-y-2.5">
                    {listing.diningOptions.map((d, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-teal-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-slate-700 text-sm">{d}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Safety Features */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 md:p-6">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <h3 className="text-sm sm:text-base font-semibold text-slate-900">Safety Features</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {listing.safetyFeatures.map((f, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-teal-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span className="text-slate-700 text-sm">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Insurance & Payment Options */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 md:p-6">
                  <h3 className="text-sm sm:text-base font-semibold text-slate-900 mb-3 sm:mb-4">Insurance & Payment Options</h3>
                  <div className="flex flex-wrap gap-2">
                    {listing.insuranceAccepted.map((ins, i) => (
                      <span key={i} className="px-4 py-1.5 bg-slate-50 text-slate-700 border border-slate-200 rounded-full text-sm font-medium">
                        {ins}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Reviews */}
            {activeTab === "reviews" && (
              <div className="text-center py-16">
                <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-slate-500">No reviews yet. Be the first to review!</p>
              </div>
            )}

            {/* Tab: Location */}
            {activeTab === "location" && (
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="text-base font-semibold text-slate-900 mb-2">Location</h3>
                <p className="text-slate-600 text-sm mb-4">{listing.address}</p>
                <div className="h-64 bg-slate-100 rounded-lg flex items-center justify-center">
                  <p className="text-slate-400 text-sm">Map coming soon</p>
                </div>
              </div>
            )}

          </div>{/* END left */}

          {/* ── RIGHT: Sticky Sidebar ── */}
          <aside className="w-full lg:w-[416px] shrink-0 self-start lg:sticky lg:top-24">

            {/* Pricing Card - 30% Larger Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 md:p-10 lg:p-12 mb-4">
              <p className="text-xs sm:text-sm text-slate-500 text-center mb-1">Monthly pricing from</p>
              <p className="text-3xl sm:text-4xl font-bold text-slate-900 text-center">${listing.price.toLocaleString()}</p>
              <p className="text-xs sm:text-sm text-slate-500 text-center mb-4 sm:mb-6">up to ${listing.maxPrice.toLocaleString()}/mo</p>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setScheduleTourOpen(!scheduleTourOpen);
                    setRequestInfoOpen(false);
                  }}
                  className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Schedule Tour
                </button>
                <button
                  onClick={() => {
                    setRequestInfoOpen(!requestInfoOpen);
                    setScheduleTourOpen(false);
                  }}
                  className="w-full border border-teal-600 text-teal-600 py-3 rounded-lg font-semibold hover:bg-teal-50 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Request Information
                </button>
                <button className="w-full border border-slate-200 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {listing.phone}
                </button>
              </div>
            </div>

            {/* Action Buttons - Always Visible */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 mb-4">
              <div className="flex items-center justify-around">
                <button className="flex flex-col items-center gap-1.5 text-slate-500 hover:text-slate-900 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="text-xs font-medium">Save</span>
                </button>
                <button className="flex flex-col items-center gap-1.5 text-slate-500 hover:text-slate-900 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  <span className="text-xs font-medium">Print</span>
                </button>
                <button className="flex flex-col items-center gap-1.5 text-slate-500 hover:text-slate-900 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span className="text-xs font-medium">Share</span>
                </button>
              </div>
            </div>

            {/* Schedule Tour Form - Inline */}
            {scheduleTourOpen && (
              <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 md:p-6 mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6">Schedule a Tour</h2>

                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setScheduleTourOpen(false); }}>
                  {/* Preferred Date */}
                  <div className="relative" ref={calendarRef}>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Preferred Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setCalendarOpen(!calendarOpen)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer z-10"
                      >
                        <svg className="w-5 h-5 text-slate-400 hover:text-teal-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <input
                        type="text"
                        value={tourForm.date}
                        onChange={(e) => setTourForm({ ...tourForm, date: e.target.value })}
                        onClick={() => setCalendarOpen(!calendarOpen)}
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none cursor-pointer"
                        placeholder="Select date"
                        required
                        readOnly
                      />
                      
                      {/* Calendar Picker */}
                      {calendarOpen && (
                        <div className="absolute top-full left-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-xl z-50 p-4">
                          <CalendarPicker onSelect={handleDateSelect} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Preferred Time */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Preferred Time <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={tourForm.time}
                        onChange={(e) => setTourForm({ ...tourForm, time: e.target.value })}
                        className="w-full pl-4 pr-10 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none appearance-none bg-white"
                        required
                      >
                        <option value="">Select time</option>
                        <option value="9:00 AM">9:00 AM</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="12:00 PM">12:00 PM</option>
                        <option value="1:00 PM">1:00 PM</option>
                        <option value="2:00 PM">2:00 PM</option>
                        <option value="3:00 PM">3:00 PM</option>
                        <option value="4:00 PM">4:00 PM</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Your Name */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={tourForm.name}
                      onChange={(e) => setTourForm({ ...tourForm, name: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={tourForm.email}
                      onChange={(e) => setTourForm({ ...tourForm, email: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={tourForm.phone}
                      onChange={(e) => setTourForm({ ...tourForm, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                    />
                  </div>

                  {/* Questions or special requests */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Questions or special requests
                    </label>
                    <textarea
                      value={tourForm.requests}
                      onChange={(e) => setTourForm({ ...tourForm, requests: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none resize-none"
                      placeholder="Any special requests or questions?"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setScheduleTourOpen(false)}
                      className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                    >
                      Submit Request
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Request Information Form - Inline */}
            {requestInfoOpen && (
              <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 md:p-6 mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6">Request Information</h2>

                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setRequestInfoOpen(false); }}>
                  {/* Your Name */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={infoForm.name}
                      onChange={(e) => setInfoForm({ ...infoForm, name: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={infoForm.email}
                      onChange={(e) => setInfoForm({ ...infoForm, email: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={infoForm.phone}
                      onChange={(e) => setInfoForm({ ...infoForm, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                    />
                  </div>

                  {/* What would you like to know? */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      What would you like to know?
                    </label>
                    <textarea
                      value={infoForm.message}
                      onChange={(e) => setInfoForm({ ...infoForm, message: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none resize-none"
                      placeholder="Pricing, availability, care services, etc."
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setRequestInfoOpen(false)}
                      className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                    >
                      Send Request
                    </button>
                  </div>
                </form>
              </div>
            )}


          </aside>{/* END right */}

        </div>
      </div>

    </div>
  );
}
