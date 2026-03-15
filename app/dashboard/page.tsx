"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toursApi } from "@/lib/api/tours";
import { favoritesApi } from "@/lib/api/favorites";
import type { ApiTour, ApiFavorite } from "@/types";

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
  const { user, loading } = useAuth();
  const [tours, setTours] = useState<ApiTour[]>([]);
  const [favorites, setFavorites] = useState<ApiFavorite[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) { router.push("/login"); return; }
    (async () => {
      const [t, f] = await Promise.allSettled([
        toursApi.list({ limit: 10 }),
        favoritesApi.list(),
      ]);
      if (t.status === "fulfilled") setTours(t.value);
      if (f.status === "fulfilled") setFavorites(f.value);
      setPageLoading(false);
    })();
  }, [user, loading, router]);

  if (loading || pageLoading) return (
    <div className="min-h-screen bg-slate-50 pt-16 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user?.full_name?.split(" ")[0]}!</h1>
          <p className="text-slate-500 text-sm mt-1">Here&apos;s a summary of your activity on Nook and Care.</p>
        </div>

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

