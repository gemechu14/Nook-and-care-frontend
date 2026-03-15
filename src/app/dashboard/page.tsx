"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/authStore";
import { toursApi } from "@/services/toursService";
import { favoritesApi } from "@/services/favoritesService";
import { providersApi } from "@/features/providers/services";
import type { ApiTour, ApiFavorite } from "@/types";

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

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-700",
    APPROVED: "bg-blue-100 text-blue-700",
    SCHEDULED: "bg-purple-100 text-purple-700",
    COMPLETED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cfg[status] ?? "bg-slate-100 text-slate-600"}`}>{status}</span>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, refreshUser } = useAuth();
  const [tours, setTours] = useState<ApiTour[]>([]);
  const [favorites, setFavorites] = useState<ApiFavorite[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [hasProvider, setHasProvider] = useState(false);
  const [checkingProvider, setCheckingProvider] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) { router.push("/login"); return; }
    (async () => {
      const [t, f, providers] = await Promise.allSettled([
        toursApi.list({ limit: 10 }),
        favoritesApi.list(),
        providersApi.list({ limit: 100 }),
      ]);
      if (t.status === "fulfilled") setTours(t.value);
      if (f.status === "fulfilled") setFavorites(f.value);
      if (providers.status === "fulfilled") {
        const userProvider = providers.value.find((p) => p.user_id === user.id);
        setHasProvider(!!userProvider);
      }
      setCheckingProvider(false);
      setPageLoading(false);
    })();
  }, [user, loading, router]);

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
      await refreshUser();
      router.push("/providers/register?welcome=1");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to register as provider. Please try again.");
    }
  };

  if (loading || pageLoading) return (
    <div className="min-h-screen bg-slate-50 pt-16 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const isFamily = user?.role === "FAMILY" || user?.role === "SENIOR";

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      {showProviderModal && (
        <ProviderVerifyModal
          onCancel={() => setShowProviderModal(false)}
          onConfirm={handleBecomeProvider}
        />
      )}

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user?.full_name?.split(" ")[0]}!</h1>
          <p className="text-slate-500 text-sm mt-1">Here&apos;s a summary of your activity on Nook and Care.</p>
        </div>

        {/* Become a Provider Banner — only for FAMILY/SENIOR without provider */}
        {isFamily && !hasProvider && !checkingProvider && (
          <div className="mb-6 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl p-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-lg">Have a senior care facility?</p>
                <p className="text-teal-100 text-sm mt-0.5">List your facility and reach families looking for care.</p>
              </div>
            </div>
            <button onClick={() => setShowProviderModal(true)}
              className="bg-white text-teal-600 px-6 py-3 rounded-lg font-semibold hover:bg-teal-50 transition-colors shrink-0">
              I&apos;m a Provider
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Saved Communities", value: favorites.length, icon: "❤️", href: "/search" },
            { label: "Tours Booked", value: tours.length, icon: "📅", href: "#tours" },
            { label: "Pending Tours", value: tours.filter((t) => t.status === "PENDING" || t.status === "APPROVED").length, icon: "⏳", href: "#tours" },
          ].map(({ label, value, icon, href }) => (
            <Link key={label} href={href}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow">
              <p className="text-2xl mb-2">{icon}</p>
              <p className="text-2xl font-bold text-slate-900">{value}</p>
              <p className="text-sm text-slate-500 mt-0.5">{label}</p>
            </Link>
          ))}
        </div>

        {/* Tours */}
        <div id="tours" className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-6">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Your Tour Requests</h2>
            <Link href="/search" className="text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors">Browse communities →</Link>
          </div>
          {tours.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 mb-3">No tours booked yet</p>
              <Link href="/search" className="text-teal-600 hover:text-teal-700 text-sm font-medium transition-colors">Find a community to tour →</Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {tours.map((t) => (
                <div key={t.id} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{t.tour_type.replace("_", " ")} Tour</p>
                    <p className="text-xs text-slate-400 mt-0.5">{new Date(t.scheduled_at).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={t.status} />
                    {(t.status === "PENDING" || t.status === "APPROVED") && (
                      <button
                        onClick={async () => {
                          await toursApi.cancel(t.id).catch(() => {});
                          setTours((p) => p.map((x) => x.id === t.id ? { ...x, status: "CANCELLED" } : x));
                        }}
                        className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Link href="/search"
            className="bg-teal-600 text-white rounded-2xl p-5 hover:bg-teal-700 transition-colors flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold">Search Communities</p>
              <p className="text-sm text-teal-100">Find verified senior care facilities</p>
            </div>
          </Link>
          <Link href="/profile"
            className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-slate-900">Edit Profile</p>
              <p className="text-sm text-slate-500">Update your contact information</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
