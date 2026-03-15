"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const isSearchPage = pathname === "/search";
  const isListingPage = pathname?.startsWith("/listings/");
  const isAssessmentPage = pathname === "/assessment";
  const isWhiteHeader = isSearchPage || isListingPage || isAssessmentPage;
  
  const headerClasses = isWhiteHeader
    ? "fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200"
    : "fixed top-0 left-0 right-0 z-50 bg-transparent";
  
  const textColor = isWhiteHeader ? "text-slate-900" : "text-white";
  const hoverColor = isWhiteHeader ? "hover:text-teal-600" : "hover:text-teal-400";
  const iconColor = isWhiteHeader ? "text-slate-600" : "text-slate-300";
  const iconHoverColor = isWhiteHeader ? "hover:text-slate-900" : "hover:text-white";
  const signInButtonClasses = isWhiteHeader
    ? "border border-slate-300 bg-white text-slate-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
    : "border border-slate-500 bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-600 transition-colors";

  return (
    <header className={headerClasses}>
      <nav className="px-[144px] h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </div>
          <span className={`text-xl font-bold ${textColor}`}>Nook</span>
        </Link>

        {/* Center Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/search" className={`${textColor} font-medium ${hoverColor} transition-colors`}>
            Find Care
          </Link>
          <Link href="/assessment" className={`${textColor} font-medium ${hoverColor} transition-colors`}>
            Assessment
          </Link>
          <Link href="/providers/register" className={`flex items-center gap-1 ${textColor} font-medium ${hoverColor} transition-colors`}>
            <span className="text-lg leading-none">+</span>
            <span>List Your Facility</span>
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Language */}
          <button className={`hidden lg:flex items-center gap-1 ${iconColor} ${iconHoverColor} transition-colors text-sm`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <span>US</span>
          </button>

          {/* Text size */}
          <button className={`hidden lg:block ${iconColor} ${iconHoverColor} transition-colors text-sm font-bold`}>
            T
          </button>

          {/* Phone */}
          <a
            href="tel:18005550123"
            className={`hidden lg:flex items-center gap-2 ${iconColor} ${iconHoverColor} transition-colors text-sm font-medium`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>1-800-555-0123</span>
          </a>

          {/* Sign In */}
          <Link href="/login" className={signInButtonClasses}>
            Sign In
          </Link>

          {/* Mobile menu */}
          <button className={`md:hidden ${textColor}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
}
