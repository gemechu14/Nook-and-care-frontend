"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useOptionalAuth } from "@/store/authStore";
import { providersApi } from "@/features/providers/services";

const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
  "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
  "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
  "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire",
  "New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio",
  "Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota",
  "Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia",
  "Wisconsin","Wyoming",
];

type VerifyMethod = "EMAIL" | "TEXT" | "PHONE";

function ProviderVerifyModal({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: (businessName: string, businessType: string, state: string) => void;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [state, setState] = useState("");
  const [facilityName, setFacilityName] = useState("");
  const [businessType, setBusinessType] = useState("Assisted Living");
  const [verifyMethod, setVerifyMethod] = useState<VerifyMethod>("EMAIL");
  const [contactValue, setContactValue] = useState("");

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) { setStep(2); return; }
    onConfirm(facilityName, businessType, state);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Verify Ownership</h2>
          <button onClick={onCancel} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleContinue} className="p-6 space-y-5">
          {step === 1 ? (
            <>
              <p className="text-sm text-slate-600 leading-relaxed">
                Select your state and enter your facility name and we&apos;ll send you a text message or email via the method on file with your state&apos;s licensing system.
              </p>
              <p className="text-sm text-slate-600">
                Once you&apos;re verified, you can create and manage listings for your facilities!
              </p>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">State Where You&apos;re Licensed</label>
                <select value={state} onChange={(e) => setState(e.target.value)} required
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white text-slate-700">
                  <option value="">Select a state…</option>
                  {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Your Facility&apos;s Name</label>
                <input type="text" value={facilityName} onChange={(e) => setFacilityName(e.target.value)} required
                  placeholder="e.g. Sunrise Senior Living"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white text-slate-700 placeholder-slate-400" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Facility Type</label>
                <select value={businessType} onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white text-slate-700">
                  <option>Assisted Living</option>
                  <option>Memory Care</option>
                  <option>Independent Living</option>
                  <option>Adult Family Home</option>
                  <option>Skilled Nursing Facility</option>
                  <option>Continuing Care Retirement Community</option>
                  <option>Other</option>
                </select>
              </div>

              {state && facilityName && (
                <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-sm text-teal-800">
                  ✅ Great! We found your license. Please select which method of verification you prefer.
                </div>
              )}
            </>
          ) : (
            <>
              <p className="text-sm text-slate-600">Choose how you&apos;d like to verify ownership of <strong>{facilityName}</strong> in {state}.</p>

              <div>
                <div className="flex border-b border-slate-200 gap-0">
                  {(["EMAIL", "TEXT", "PHONE"] as VerifyMethod[]).map((m) => {
                    const icons = {
                      EMAIL: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
                      TEXT: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
                      PHONE: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
                    };
                    const labels = { EMAIL: "Email", TEXT: "Text Message", PHONE: "Phone Call" };
                    return (
                      <button key={m} type="button" onClick={() => setVerifyMethod(m)}
                        className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                          verifyMethod === m ? "border-blue-500 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"
                        }`}>
                        {icons[m]}
                        {labels[m]}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1">
                  {verifyMethod === "EMAIL" ? "Your License's Email Address" : verifyMethod === "TEXT" ? "Your License's Phone Number" : "Your License's Phone Number"}
                </label>
                <p className="text-xs text-slate-500 mb-2">
                  {verifyMethod === "EMAIL" ? "Please enter the email on file that looks like m***********l@g***l.com" : "Please enter the phone number on file with your state's licensing system"}
                </p>
                <input type={verifyMethod === "EMAIL" ? "email" : "tel"} value={contactValue} onChange={(e) => setContactValue(e.target.value)} required
                  placeholder={verifyMethod === "EMAIL" ? "your@email.com" : "+1 (555) 000-0000"}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white text-slate-700 placeholder-slate-400" />
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                By continuing, our team will contact you to complete verification. You&apos;ll be able to create listings once verified.
              </p>
            </>
          )}

          <div className="flex items-center justify-between pt-2">
            {step === 2 && (
              <button type="button" onClick={() => setStep(1)}
                className="text-sm text-slate-500 hover:text-slate-700 font-medium">
                ← Back
              </button>
            )}
            <button type="submit"
              className={`${step === 1 ? "w-full" : "ml-auto"} bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-700 transition-colors`}>
              {step === 1 ? "Continue" : "Submit for Verification"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useOptionalAuth();
  const user = auth?.user;
  const loading = auth?.loading ?? false;
  const [isScrolled, setIsScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [hasProvider, setHasProvider] = useState(false);
  const [checkingProvider, setCheckingProvider] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  const isSearchPage = pathname === "/search";
  const isListingPage = pathname?.startsWith("/listings/");
  const isAssessmentPage = pathname === "/assessment";
  const isHowItWorksPage = pathname === "/how-it-works";
  const isResourcesPage = pathname === "/resources";
  const isHomePage = pathname === "/";
  const isLoginPage = pathname === "/login";
  const isRegisterPage = pathname === "/register";
  const isForgotPasswordPage = pathname === "/forgot-password";
  const isDashboardPage = pathname === "/dashboard";
  const isProviderDashboardPage = pathname?.startsWith("/providers/dashboard") || pathname?.startsWith("/providers/listings");
  const isAdminPage = pathname === "/admin";
  const isProfilePage = pathname === "/profile";
  
  // Hide header on auth pages
  const hideHeader = isLoginPage || isRegisterPage || isForgotPasswordPage;
  
  // For non-home pages, always use white header
  // For home page, use white header when scrolled
  // Dashboard pages always use white header
  const isWhiteHeader = isSearchPage || isListingPage || isAssessmentPage || isHowItWorksPage || isResourcesPage || isDashboardPage || isProviderDashboardPage || isAdminPage || isProfilePage || (isHomePage && isScrolled);
  
  useEffect(() => {
    if (!isHomePage) return;
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 100);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  // Check if FAMILY user already has a provider account
  useEffect(() => {
    if (user && (user.role === "FAMILY" || user.role === "SENIOR")) {
      setCheckingProvider(true);
      providersApi.list({ limit: 100 })
        .then((providers) => {
          const userProvider = providers.find((p) => p.user_id === user.id);
          setHasProvider(!!userProvider);
        })
        .catch(() => {
          // If API fails, assume no provider (show button)
          setHasProvider(false);
        })
        .finally(() => setCheckingProvider(false));
    } else {
      // Reset when user changes
      setHasProvider(false);
      setCheckingProvider(false);
    }
  }, [user]);

  // Close user menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);
  
  const headerClasses = isWhiteHeader
    ? "fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 transition-all duration-300"
    : "fixed top-0 left-0 right-0 z-50 bg-transparent transition-all duration-300";
  
  const textColor = isWhiteHeader ? "text-slate-900" : "text-white";
  const hoverColor = isWhiteHeader ? "hover:text-teal-600" : "hover:text-teal-400";
  const iconColor = isWhiteHeader ? "text-slate-600" : "text-slate-300";
  const iconHoverColor = isWhiteHeader ? "hover:text-slate-900" : "hover:text-white";
  const signInButtonClasses = isWhiteHeader
    ? "border border-slate-300 bg-white text-slate-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
    : "border border-slate-500 bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-600 transition-colors";

  const handleLogout = async () => {
    if (auth?.logout) {
      await auth.logout();
      router.push("/");
    }
  };

  const handleBecomeProvider = async (businessName: string, businessType: string, state: string) => {
    if (!user) return;
    setShowProviderModal(false);
    try {
      await providersApi.create({
        user_id: user.id,
        business_name: businessName,
        business_type: businessType,
        address: "", // Will be filled in provider registration
        city: state,
        country: "USA",
      });
      await auth?.refreshUser();
      router.push("/providers/register?welcome=1");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to register as provider. Please try again.");
    }
  };

  // Don't render header on auth pages
  if (hideHeader) return null;

  // Role-based navigation
  const role = user?.role;
  const navItems: { label: string; href: string }[] = [];
  const isFamily = role === "FAMILY" || role === "SENIOR";

  if (!user) {
    // Guest - show all public nav
    navItems.push(
      { label: "Find Care", href: "/search" },
      { label: "How it Works", href: "/how-it-works" },
      { label: "Resources", href: "/resources" },
      { label: "Assessment", href: "/assessment" },
    );
  } else if (role === "ADMIN") {
    // Admin - custom nav
    navItems.push({ label: "Admin Dashboard", href: "/admin" });
  } else if (role === "PROVIDER") {
    // Provider - Find Care + List Your Facility
    navItems.push(
      { label: "Find Care", href: "/search" },
      { label: "List Your Facility", href: "/providers/dashboard?addListing=true" },
    );
  } else {
    // FAMILY / SENIOR - only Find Care
    navItems.push({ label: "Find Care", href: "/search" });
  }

  const initials = user?.full_name
    ? user.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <>
      {showProviderModal && (
        <ProviderVerifyModal
          onCancel={() => setShowProviderModal(false)}
          onConfirm={handleBecomeProvider}
        />
      )}

    <header className={headerClasses}>
        <nav className="px-6 lg:px-[144px] h-16 flex items-center justify-between">
        {/* Logo */}
          <Link href={role === "ADMIN" ? "/admin" : role === "PROVIDER" ? "/providers/dashboard" : "/"} className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </div>
          <span className={`text-xl font-bold ${textColor}`}>Nook</span>
            {role === "ADMIN" && (
              <span className="ml-1 text-xs font-semibold bg-purple-600 text-white px-2 py-0.5 rounded-full">Admin</span>
            )}
        </Link>

        {/* Center Nav */}
        <div className="hidden md:flex items-center gap-8">
            {navItems.map(({ label, href }) => (
              <Link key={href} href={href} className={`${textColor} font-medium ${hoverColor} transition-colors`}>
                {label}
          </Link>
            ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
            {/* Language / Text / Phone — hide for admin */}
            {role !== "ADMIN" && (
              <>
          <button className={`hidden lg:flex items-center gap-1 ${iconColor} ${iconHoverColor} transition-colors text-sm`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <span>US</span>
          </button>
                <button className={`hidden lg:block ${iconColor} ${iconHoverColor} transition-colors text-sm font-bold`}>T</button>
                <a href="tel:18005550123"
                  className={`hidden lg:flex items-center gap-2 ${iconColor} ${iconHoverColor} transition-colors text-sm font-medium`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>1-800-555-0123</span>
          </a>
              </>
            )}

         
            {/* Auth Section */}
            {!loading && (
              <>
                {user ? (
                  <div className="relative" ref={userMenuRef}>
                    <button onClick={() => setUserMenuOpen((o) => !o)}
                      className="flex items-center gap-2 focus:outline-none" aria-label="User menu">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold select-none ${
                        role === "ADMIN" ? "bg-purple-600" : role === "PROVIDER" ? "bg-blue-600" : "bg-teal-600"
                      }`}>
                        {initials}
                      </div>
                      <svg className={`w-4 h-4 ${iconColor} transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50">
                        <div className="px-4 py-3 border-b border-slate-100">
                          <p className="text-sm font-semibold text-slate-900 truncate">{user.full_name}</p>
                          <p className="text-xs text-slate-500 truncate">{user.email}</p>
                          <span className={`inline-block mt-1 text-xs rounded-full px-2 py-0.5 font-medium ${
                            role === "ADMIN" ? "bg-purple-100 text-purple-700" :
                            role === "PROVIDER" ? "bg-blue-100 text-blue-700" :
                            "bg-teal-100 text-teal-700"
                          }`}>
                            {role === "ADMIN" ? "Administrator" : role === "PROVIDER" ? "Provider" : role === "SENIOR" ? "Senior" : "Family Member"}
                          </span>
                        </div>
                        <Link href={role === "ADMIN" ? "/admin" : role === "PROVIDER" ? "/providers/dashboard" : "/dashboard"}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          onClick={() => setUserMenuOpen(false)}>
                          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
                          </svg>
                          Dashboard
                        </Link>
                        <Link href="/profile"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          onClick={() => setUserMenuOpen(false)}>
                          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Profile
                        </Link>
                        {/* Hide logout for admin users - they have it in the sidebar */}
                        {role !== "ADMIN" && (
                          <div className="border-t border-slate-100 mt-1">
                            <button onClick={handleLogout}
                              className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                              </svg>
                              Sign out
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
          <Link href="/login" className={signInButtonClasses}>
            Sign In
          </Link>
                )}
              </>
            )}

            {/* I'm a Provider button for FAMILY/SENIOR users - after avatar (rightmost) */}
            {!loading && user && isFamily && !hasProvider && (
              <button 
                onClick={() => setShowProviderModal(true)}
                className={`flex items-center gap-2 ${isWhiteHeader 
                  ? "bg-white border border-slate-300 text-slate-900 hover:bg-slate-50" 
                  : "bg-white/95 backdrop-blur-sm border border-white/30 text-slate-900 hover:bg-white"
                } px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm`}
              >
                <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <svg className="w-3.5 h-3.5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
                <span>I&apos;m a Provider</span>
              </button>
            )}

          {/* Mobile menu */}
          <button className={`md:hidden ${textColor}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>
    </header>
    </>
  );
}
