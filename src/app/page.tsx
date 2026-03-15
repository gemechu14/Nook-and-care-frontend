import Link from "next/link";
import Image from "next/image";
import ListingCard from "@/components/ui/ListingCard";
import HomeSearchForm from "@/components/ui/HomeSearchForm";

// ─── Data ────────────────────────────────────────────────────────────────────

const careTypes = [
  {
    id: "assisted-living",
    label: "Assisted Living",
    description: "Daily support with meals, medication, and personal care while maintaining independence.",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    id: "memory-care",
    label: "Memory Care",
    description: "Specialized care for those with Alzheimer's, dementia, or other memory conditions.",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    id: "independent-living",
    label: "Independent Living",
    description: "Active lifestyle communities with amenities, social activities, and minimal assistance.",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: "adult-family-home",
    label: "Adult Family Home",
    description: "Intimate, home-like settings with personalized care in a residential neighborhood.",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    id: "skilled-nursing",
    label: "Skilled Nursing",
    description: "24/7 medical care for complex health needs with licensed nursing staff.",
    iconBg: "bg-red-100",
    iconColor: "text-red-500",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
];

const featuredListings = [
  {
    id: "1",
    title: "Oakwood Adult Family Home",
    location: "Kirkland, WA",
    careTypes: [
      { label: "Adult Family Home", color: "orange" as const },
      { label: "Assisted Living", color: "teal" as const },
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
    careTypes: [{ label: "Memory Care", color: "purple" as const }],
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
      { label: "Assisted Living", color: "teal" as const },
      { label: "Memory Care", color: "purple" as const },
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
    title: "Cascade Independent Living",
    location: "Redmond, WA",
    careTypes: [{ label: "Independent Living", color: "blue" as const }],
    price: 2800,
    rating: 4.5,
    reviewCount: 78,
    bedsAvailable: 12,
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
    verified: true,
  },
];

const howToSteps = [
  {
    step: 1,
    title: "Assess Care Needs",
    description: "Take our free assessment to understand what level of care your loved one needs. We'll help you identify medical, daily living, and social requirements.",
    icon: (
      <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    step: 2,
    title: "Search & Compare",
    description: "Browse communities that match your criteria. Filter by location, care level, amenities, and budget. Save favorites and compare side-by-side.",
    icon: (
      <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    step: 3,
    title: "Schedule Tours",
    description: "Visit your top choices in person or virtually. Our tour checklist helps you ask the right questions and evaluate each community.",
    icon: (
      <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    step: 4,
    title: "Make Your Decision",
    description: "We're here to support you through the entire process. Once you've found the right fit, we can help with transition planning.",
    icon: (
      <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const trustBadges = [
  {
    icon: (
      <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Licensed & Verified",
    description: "All communities are licensed by state agencies and verified by our team",
  },
  {
    icon: (
      <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    title: "Quality Standards",
    description: "We only feature communities that meet our quality and safety standards",
  },
  {
    icon: (
      <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "Real Reviews",
    description: "Authentic reviews from families who've been through this journey",
  },
  {
    icon: (
      <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    title: "No Cost to You",
    description: "Our service is completely free for families seeking care",
  },
];

const accountFeatures = [
  {
    icon: (
      <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    title: "Save Your Favorites",
    description: "Keep track of communities you're interested in",
  },
  {
    icon: (
      <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: "Schedule Tours",
    description: "Book and manage facility visits",
  },
  {
    icon: (
      <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: "Message Facilities",
    description: "Communicate directly with care providers",
  },
  {
    icon: (
      <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Secure & Private",
    description: "Your information is protected",
  },
];

const providerFeatures = [
  {
    iconBg: "bg-blue-50",
    icon: (
      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "Reach More Families",
    description: "Get your facility in front of thousands of families actively searching for care",
  },
  {
    iconBg: "bg-green-50",
    icon: (
      <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: "Manage Inquiries",
    description: "Handle tour requests, messages, and leads all in one dashboard",
  },
  {
    iconBg: "bg-amber-50",
    icon: (
      <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    title: "Showcase Your Care",
    description: "Highlight your amenities, services, and what makes your community special",
  },
];

const resources = [
  {
    icon: (
      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: "Care Level Guide",
    description: "Understand the differences between assisted living, memory care, and other options",
    href: "/resources/care-guide",
  },
  {
    icon: (
      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    title: "Cost Calculator",
    description: "Estimate monthly costs and explore payment options including Medicare & Medicaid",
    href: "/resources/cost-calculator",
  },
  {
    icon: (
      <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    title: "Tour Checklist",
    description: "Download our comprehensive checklist of questions to ask during facility tours",
    href: "/resources/tour-checklist",
  },
  {
    icon: (
      <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "FAQ",
    description: "Common questions about senior care, answered by our experts",
    href: "/faq",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="flex flex-col">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative h-[80vh] max-h-[8200px] min-h-[580px] flex items-center overflow-hidden bg-slate-700">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=1800&q=80"
            alt="Caregiver with senior"
            fill
            className="object-cover object-center opacity-90"
            priority
          />
          {/* Gradient overlay — dark left, fade right */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-800/50 to-transparent" />
        </div>

        <div className="relative z-10 px-[144px] pt-16 pb-10 w-full h-full flex flex-col justify-start">
          <div className="w-3/4">
            {/* Urgent banner - left aligned */}
            <div className="flex justify-start mb-6 mt-8">
              <div className="inline-flex items-center gap-4 bg-yellow-50 px-6 py-3 rounded-xl text-sm font-medium shadow-sm">
              <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-amber-800">Need urgent placement? Call <strong className="font-semibold">1-800-555-0123</strong></span>
              </div>
            </div>

            {/* Headline - left aligned */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 text-left">
              Find the right care for your
              <br />
              <span className="text-teal-400">loved one</span>
            </h1>

            <p className="text-base sm:text-lg text-white mb-8 leading-relaxed text-left max-w-lg">
              We understand this is a big decision. Let us help you find a safe, caring
              community where your family member can thrive.
            </p>

            {/* Search Form - left aligned */}
            <div className="mb-6 max-w-[38rem]">
              <HomeSearchForm />
            </div>

            {/* Stats - left aligned */}
            <div className="flex flex-wrap items-center justify-start gap-4 sm:gap-6">
              {[
                "2,500+ verified communities",
                "50,000+ family reviews",
                "Free & confidential",
              ].map((stat) => (
                <div key={stat} className="flex items-center gap-2 text-white text-sm">
                  <span className="w-2 h-2 rounded-full bg-teal-400 shrink-0" />
                  {stat}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Care Types ───────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              What type of care are you looking for?
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Each person has unique needs. Understanding the right level of care is the first step
              in finding the perfect community.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {careTypes.map((care) => (
              <Link
                key={care.id}
                href={`/search?care=${care.id}`}
                className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md hover:border-teal-200 transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl ${care.iconBg} ${care.iconColor} flex items-center justify-center mb-4`}>
                  {care.icon}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{care.label}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">{care.description}</p>
                <span className="text-teal-600 text-sm font-medium group-hover:underline">
                  Explore →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Communities ─────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
                Featured Communities
              </h2>
              <p className="text-slate-500">Highly-rated communities trusted by families like yours</p>
            </div>
            <Link
              href="/search"
              className="hidden sm:flex items-center gap-2 border border-teal-600 text-teal-600 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-teal-50 transition-colors"
            >
              View all communities →
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {featuredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>

          <div className="sm:hidden mt-6 text-center">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 border border-teal-600 text-teal-600 px-6 py-3 rounded-lg font-medium hover:bg-teal-50 transition-colors"
            >
              View all communities →
            </Link>
          </div>
        </div>
      </section>

      {/* ── How to Choose ────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              How to Choose the Right Community
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Finding care for a loved one can feel overwhelming. Follow these steps to make
              the process easier and more informed.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {howToSteps.map((step) => (
              <div key={step.step} className="relative bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                {/* Step number */}
                <div className="absolute -top-4 left-5 w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {step.step}
                </div>
                <div className="mt-2 mb-4">{step.icon}</div>
                <h3 className="font-semibold text-slate-900 text-lg mb-2">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 bg-teal-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-teal-700 transition-colors text-lg"
            >
              Start Care Assessment →
            </Link>
            <p className="text-slate-400 text-sm mt-3">
              Free · Takes about 5 minutes · Get personalized recommendations
            </p>
          </div>
        </div>
      </section>

      {/* ── Trust Badges ─────────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trustBadges.map((badge) => (
              <div key={badge.title} className="flex items-start gap-4">
                <div className="shrink-0 mt-1">{badge.icon}</div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-1">{badge.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Create Account ───────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-teal-50/40">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden grid md:grid-cols-2">
            {/* Left panel */}
            <div className="p-8 lg:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Create Your Free Account</h2>
              </div>
              <p className="text-slate-500 mb-8">
                Sign in to access personalized features and make your search easier
              </p>

              <ul className="space-y-5 mb-8">
                {accountFeatures.map((feature) => (
                  <li key={feature.title} className="flex items-start gap-3">
                    <div className="shrink-0 mt-0.5">{feature.icon}</div>
                    <div>
                      <p className="font-medium text-slate-800">{feature.title}</p>
                      <p className="text-slate-500 text-sm">{feature.description}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className="block w-full bg-teal-600 text-white text-center py-3.5 rounded-xl font-semibold hover:bg-teal-700 transition-colors"
              >
                Sign In or Create Account
              </Link>
              <p className="text-center text-slate-400 text-sm mt-3">
                Free forever. No credit card required.
              </p>
            </div>

            {/* Right panel — image */}
            <div className="relative hidden md:block">
              <Image
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80"
                alt="Caregiver and senior"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-teal-900/30" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <p className="text-xl font-bold">Join 50,000+ families</p>
                <p className="text-teal-200 text-sm">Finding the right care for their loved ones</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── For Facility Owners ──────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 border border-teal-200 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            For Facility Owners
          </span>

          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-14 max-w-2xl mx-auto">
            Connect with families searching for quality care
          </h2>

          <div className="grid sm:grid-cols-3 gap-6 mb-12">
            {providerFeatures.map((feature) => (
              <div key={feature.title} className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                <div className={`w-14 h-14 rounded-xl ${feature.iconBg} flex items-center justify-center mx-auto mb-5`}>
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-slate-900 text-lg mb-2">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          <Link
            href="/providers/register"
            className="inline-flex items-center gap-2 bg-teal-600 text-white px-10 py-4 rounded-xl font-semibold hover:bg-teal-700 transition-colors text-lg"
          >
            List Your Facility →
          </Link>
          <p className="text-slate-400 text-sm mt-3">
            Contact us at{" "}
            <a href="mailto:partners@nook.care" className="text-teal-600 hover:underline">
              partners@nook.care
            </a>{" "}
            or call 1-800-555-0199
          </p>
        </div>
      </section>

      {/* ── Resources ────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left */}
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                Resources to Help You Decide
              </h2>
              <p className="text-slate-500 mb-8 text-lg">
                Making this decision is easier when you have the right information. We&apos;ve created
                guides, tools, and resources to support you.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {resources.map((resource) => (
                  <Link
                    key={resource.title}
                    href={resource.href}
                    className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-teal-200 transition-all flex gap-4"
                  >
                    <div className="shrink-0 mt-0.5">{resource.icon}</div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-1">{resource.title}</h4>
                      <p className="text-slate-500 text-sm leading-relaxed">{resource.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Right — Urgent Assistance */}
            <div className="bg-teal-700 rounded-2xl p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <p className="text-teal-200 text-sm">Need help now?</p>
              </div>
              <h3 className="text-2xl font-bold mb-4">Urgent Placement Assistance</h3>
              <p className="text-teal-100 leading-relaxed mb-6">
                If you&apos;re facing an urgent situation—hospital discharge, sudden care needs, or
                safety concerns—our team is here to help you find placement quickly.
              </p>

              <a
                href="tel:18005550123"
                className="flex items-center justify-center gap-2 bg-white text-teal-700 w-full py-3.5 rounded-xl font-semibold hover:bg-teal-50 transition-colors mb-4"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call 1-800-555-0123
              </a>
              <p className="text-center text-teal-200 text-sm mb-8">
                Available 24/7 · Free & Confidential
              </p>

              <div>
                <p className="font-semibold mb-3">Financial Assistance</p>
                <div className="flex flex-wrap gap-2">
                  {["Medicare", "Medicaid", "VA Benefits", "Long-term Care Insurance"].map((tag) => (
                    <span
                      key={tag}
                      className="bg-teal-600 text-teal-100 text-sm px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
