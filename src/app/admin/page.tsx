"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/authStore";
import { listingsApi } from "@/services/listingService";
import { providersApi } from "@/features/providers/services";
import { toursApi } from "@/services/toursService";
import { reportsApi } from "@/services/reportsService";
import type { ApiListing, ApiProvider, ApiTour, ApiReport } from "@/types";
import { CARE_TYPE_LABELS } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Stats {
  totalListings: number;
  pendingProviders: number;
  totalTours: number;
  totalReports: number;
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  )},
  { id: "providers", label: "Providers", icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  )},
  { id: "listings", label: "Listings", icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  )},
  { id: "tours", label: "Tours", icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )},
  { id: "reports", label: "Reports", icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  )},
] as const;

type NavId = typeof NAV[number]["id"];

// ─── Sparkline chart component ────────────────────────────────────────────────

function Sparkline({ data, color = "#0d9488" }: { data: number[]; color?: string }) {
  if (data.length === 0) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const range = max - min || 1;
  const W = 300; const H = 80; const PAD = 8;
  const pts = data.map((v, i) => [
    PAD + (i / (data.length - 1)) * (W - 2 * PAD),
    H - PAD - ((v - min) / range) * (H - 2 * PAD),
  ]);
  const path = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
  const area = `${path} L ${pts[pts.length - 1][0]} ${H} L ${pts[0][0]} ${H} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-20">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#areaGrad)" />
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill={color} />
      ))}
    </svg>
  );
}

// ─── Monthly bar chart ────────────────────────────────────────────────────────

const MONTHS = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];

function BarChart({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex items-end gap-2 h-48">
      {values.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full rounded-t-sm bg-teal-500 transition-all" style={{ height: `${(v / max) * 160}px` }} />
          <span className="text-xs text-slate-400">{MONTHS[i]}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function Badge({ status }: { status: string }) {
  const cfg: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-700",
    PENDING: "bg-amber-100 text-amber-700",
    INACTIVE: "bg-slate-100 text-slate-600",
    VERIFIED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
    APPROVED: "bg-blue-100 text-blue-700",
    COMPLETED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
    SCHEDULED: "bg-purple-100 text-purple-700",
    RESOLVED: "bg-green-100 text-green-700",
    REVIEWED: "bg-blue-100 text-blue-700",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cfg[status] ?? "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
}

// ─── Section components ────────────────────────────────────────────────────────

function ProvidersSection({ providers, onVerify, onReject, loading }: {
  providers: ApiProvider[]; onVerify: (id: string) => void; onReject: (id: string) => void; loading: boolean;
}) {
  if (loading) return <Loader />;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Provider Management</h2>
          <p className="text-sm text-slate-500">Review and verify provider applications</p>
        </div>
        <Badge status={`${providers.filter(p => p.verification_status === "PENDING").length} Pending`} />
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left px-5 py-3 text-slate-500 font-medium">Business</th>
              <th className="text-left px-4 py-3 text-slate-500 font-medium">Type</th>
              <th className="text-left px-4 py-3 text-slate-500 font-medium">City</th>
              <th className="text-center px-4 py-3 text-slate-500 font-medium">Status</th>
              <th className="text-right px-5 py-3 text-slate-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((p) => (
              <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="px-5 py-4">
                  <p className="font-medium text-slate-900">{p.business_name}</p>
                  <p className="text-xs text-slate-400">ID: {p.id.slice(0, 8)}…</p>
                </td>
                <td className="px-4 py-4 text-slate-600">{p.business_type}</td>
                <td className="px-4 py-4 text-slate-600">{p.city}</td>
                <td className="px-4 py-4 text-center"><Badge status={p.verification_status} /></td>
                <td className="px-5 py-4">
                  {p.verification_status === "PENDING" && (
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => onVerify(p.id)}
                        className="text-xs font-medium px-3 py-1.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                        Verify
                      </button>
                      <button onClick={() => onReject(p.id)}
                        className="text-xs font-medium px-3 py-1.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {providers.length === 0 && (
              <tr><td colSpan={5} className="text-center py-10 text-slate-400">No providers found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ListingsSection({ listings, onActivate, loading }: {
  listings: ApiListing[]; onActivate: (id: string) => void; loading: boolean;
}) {
  if (loading) return <Loader />;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Listing Management</h2>
          <p className="text-sm text-slate-500">Review and approve listing submissions</p>
        </div>
        <Badge status={`${listings.filter(l => l.status === "PENDING").length} Pending`} />
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left px-5 py-3 text-slate-500 font-medium">Listing</th>
              <th className="text-left px-4 py-3 text-slate-500 font-medium">Care Type</th>
              <th className="text-left px-4 py-3 text-slate-500 font-medium">Location</th>
              <th className="text-right px-4 py-3 text-slate-500 font-medium">Price</th>
              <th className="text-center px-4 py-3 text-slate-500 font-medium">Status</th>
              <th className="text-right px-5 py-3 text-slate-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((l) => (
              <tr key={l.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="px-5 py-4">
                  <p className="font-medium text-slate-900 truncate max-w-[160px]">{l.title}</p>
                  <p className="text-xs text-slate-400">{l.id.slice(0, 8)}…</p>
                </td>
                <td className="px-4 py-4 text-slate-600 whitespace-nowrap">{CARE_TYPE_LABELS[l.care_type]}</td>
                <td className="px-4 py-4 text-slate-600 whitespace-nowrap">{[l.city, l.state].filter(Boolean).join(", ") || "—"}</td>
                <td className="px-4 py-4 text-right text-slate-700 font-medium whitespace-nowrap">{l.price ? `$${l.price.toLocaleString()}` : "—"}</td>
                <td className="px-4 py-4 text-center"><Badge status={l.status} /></td>
                <td className="px-5 py-4 text-right">
                  {l.status === "PENDING" && (
                    <button onClick={() => onActivate(l.id)}
                      className="text-xs font-medium px-3 py-1.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                      Approve
                    </button>
                  )}
                  {l.status === "ACTIVE" && (
                    <Link href={`/listings/${l.id}`} className="text-xs font-medium px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg hover:border-teal-300 hover:text-teal-600 transition-colors">
                      View
                    </Link>
                  )}
                </td>
              </tr>
            ))}
            {listings.length === 0 && (
              <tr><td colSpan={6} className="text-center py-10 text-slate-400">No listings found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ToursSection({ tours, loading }: { tours: ApiTour[]; loading: boolean }) {
  if (loading) return <Loader />;
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Tour Requests</h2>
        <p className="text-sm text-slate-500">All tour bookings on the platform</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left px-5 py-3 text-slate-500 font-medium">Tour ID</th>
              <th className="text-left px-4 py-3 text-slate-500 font-medium">Type</th>
              <th className="text-left px-4 py-3 text-slate-500 font-medium">Scheduled</th>
              <th className="text-center px-4 py-3 text-slate-500 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {tours.map((t) => (
              <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="px-5 py-4 text-slate-600 font-mono text-xs">{t.id.slice(0, 12)}…</td>
                <td className="px-4 py-4 text-slate-600">{t.tour_type.replace("_", " ")}</td>
                <td className="px-4 py-4 text-slate-600">{new Date(t.scheduled_at).toLocaleDateString()}</td>
                <td className="px-4 py-4 text-center"><Badge status={t.status} /></td>
              </tr>
            ))}
            {tours.length === 0 && (
              <tr><td colSpan={4} className="text-center py-10 text-slate-400">No tours found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReportsSection({ reports, loading }: { reports: ApiReport[]; loading: boolean }) {
  if (loading) return <Loader />;
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Reports</h2>
        <p className="text-sm text-slate-500">Flagged content reported by users</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left px-5 py-3 text-slate-500 font-medium">Type</th>
              <th className="text-left px-4 py-3 text-slate-500 font-medium">Description</th>
              <th className="text-left px-4 py-3 text-slate-500 font-medium">Date</th>
              <th className="text-center px-4 py-3 text-slate-500 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="px-5 py-4">
                  <span className="text-xs font-semibold bg-red-50 text-red-700 px-2 py-1 rounded-full">{r.report_type.replace(/_/g, " ")}</span>
                </td>
                <td className="px-4 py-4 text-slate-600 truncate max-w-[240px]">{r.description}</td>
                <td className="px-4 py-4 text-slate-500 whitespace-nowrap">{new Date(r.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-4 text-center"><Badge status={r.status} /></td>
              </tr>
            ))}
            {reports.length === 0 && (
              <tr><td colSpan={4} className="text-center py-10 text-slate-400">No reports found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Loader() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// ─── Main Admin Dashboard ─────────────────────────────────────────────────────

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading, logout, refreshUser } = useAuth();
  const [activeNav, setActiveNav] = useState<NavId>("dashboard");
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const avatarMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(event.target as Node)) {
        setAvatarMenuOpen(false);
      }
    };
    if (avatarMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [avatarMenuOpen]);

  const [stats, setStats] = useState<Stats>({ totalListings: 0, pendingProviders: 0, totalTours: 0, totalReports: 0 });
  const [listings, setListings] = useState<ApiListing[]>([]);
  const [providers, setProviders] = useState<ApiProvider[]>([]);
  const [tours, setTours] = useState<ApiTour[]>([]);
  const [reports, setReports] = useState<ApiReport[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const loadAll = useCallback(async () => {
    setDataLoading(true);
    const results = await Promise.allSettled([
      listingsApi.list({ limit: 100 }),
      providersApi.list({ limit: 100 }),
      toursApi.list({ limit: 100 }),
      reportsApi.list({ limit: 100 }),
    ]);
    const ls = results[0].status === "fulfilled" ? results[0].value : [];
    const ps = results[1].status === "fulfilled" ? results[1].value : [];
    const ts = results[2].status === "fulfilled" ? results[2].value : [];
    const rs = results[3].status === "fulfilled" ? results[3].value : [];
    setListings(ls);
    setProviders(ps);
    setTours(ts);
    setReports(rs);
    setStats({
      totalListings: ls.length,
      pendingProviders: ps.filter((p) => p.verification_status === "PENDING").length,
      totalTours: ts.length,
      totalReports: rs.length,
    });
    setDataLoading(false);
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!user) { router.push("/login"); return; }
    if (user.role !== "ADMIN") { router.push("/"); return; }
    loadAll();
  }, [user, loading, router, loadAll]);

  const handleVerify = async (id: string) => {
    try { await providersApi.verify(id); setProviders((p) => p.map((x) => x.id === id ? { ...x, verification_status: "VERIFIED" } : x)); stats.pendingProviders && setStats((s) => ({ ...s, pendingProviders: s.pendingProviders - 1 })); } catch { /* ignore */ }
  };
  const handleReject = async (id: string) => {
    try { await providersApi.reject(id); setProviders((p) => p.map((x) => x.id === id ? { ...x, verification_status: "REJECTED" } : x)); stats.pendingProviders && setStats((s) => ({ ...s, pendingProviders: s.pendingProviders - 1 })); } catch { /* ignore */ }
  };
  const handleActivate = async (id: string) => {
    try { const updated = await listingsApi.activate(id); setListings((p) => p.map((l) => l.id === id ? updated : l)); } catch { /* ignore */ }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  // Build monthly chart data from listing created_at (last 6 months)
  const chartData = (() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const month = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      return listings.filter((l) => {
        const d = new Date(l.created_at);
        return d.getMonth() === month.getMonth() && d.getFullYear() === month.getFullYear();
      }).length;
    });
  })();

  // Top providers by listing count
  const topProviders = providers
    .map((p) => ({ ...p, count: listings.filter((l) => l.provider_id === p.id).length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const maxCount = Math.max(...topProviders.map((p) => p.count), 1);

  // Pending listings
  const pendingListings = listings.filter((l) => l.status === "PENDING").slice(0, 5);

  // Recent tours
  const recentTours = tours.slice(0, 4);

  const STAT_CARDS = [
    { label: "Total Listings", value: stats.totalListings, trend: "+12%", trendUp: true, icon: (
      <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )},
    { label: "Pending Providers", value: stats.pendingProviders, trend: "-3%", trendUp: false, icon: (
      <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
      </svg>
    )},
    { label: "Total Tours", value: stats.totalTours, trend: "+8%", trendUp: true, icon: (
      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )},
    { label: "Open Reports", value: stats.totalReports, trend: "+2 this week", trendUp: false, icon: (
      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    )},
  ];

  return (
    <div className="flex min-h-screen bg-[#f0f2f5]">
      {/* ─── Sidebar ─── */}
      <aside className="w-56 shrink-0 bg-[#1a2035] text-white flex flex-col fixed inset-y-0 z-30">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center font-bold text-sm">N</div>
          <span className="font-bold text-base">Nook Admin</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-widest px-3 mb-3">Menu</p>
          <ul className="space-y-0.5">
            {NAV.map(({ id, label, icon }) => (
              <li key={id}>
                <button
                  onClick={() => setActiveNav(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeNav === id
                      ? "bg-teal-500/20 text-teal-400"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {icon} {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User */}
        <div ref={avatarMenuRef} className="px-4 py-4 border-t border-white/10 relative">
          <button
            onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
            className="w-full flex items-center gap-2.5 hover:bg-white/5 rounded-lg p-2 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-teal-500/30 flex items-center justify-center text-xs font-bold text-teal-400">
              {user?.full_name?.[0] ?? "A"}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-white truncate">{user?.full_name ?? "Admin"}</p>
              <p className="text-xs text-white/40 truncate">{user?.email}</p>
            </div>
            <svg className={`w-4 h-4 text-white/40 transition-transform ${avatarMenuOpen ? "rotate-180" : ""}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown menu */}
          {avatarMenuOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50">
              <button
                onClick={async () => {
                  await refreshUser();
                  await loadAll();
                  setAvatarMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
              <button
                onClick={() => {
                  setAvatarMenuOpen(false);
                  // Settings action - you can add navigation to settings page here
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </button>
              <div className="border-t border-slate-100 mt-1">
                <button
                  onClick={async () => {
                    await logout();
                    router.push("/login");
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ─── Main content ─── */}
      <div className="flex-1 ml-56">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="font-semibold text-slate-900">Nook and Care Platform</span>
          </div>
        </header>

        <main className="p-6">
          {/* Dashboard overview */}
          {activeNav === "dashboard" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-sm text-slate-500 mt-0.5">{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
              </div>

              {/* Stats cards */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {STAT_CARDS.map(({ label, value, trend, trendUp, icon }) => (
                  <div key={label} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">{icon}</div>
                      <span className={`text-xs font-semibold ${trendUp ? "text-green-600" : "text-red-500"}`}>
                        {trendUp ? "↑" : "↓"} {trend}
                      </span>
                    </div>
                    <p className="text-3xl font-bold text-slate-900">{value}</p>
                    <p className="text-sm text-slate-500 mt-1">{label}</p>
                  </div>
                ))}
              </div>

              {/* Chart + Top providers */}
              <div className="grid lg:grid-cols-3 gap-4">
                {/* Monthly listings chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900">Monthly Listings Created</h3>
                    <span className="text-xs text-slate-400">Last 6 months</span>
                  </div>
                  {dataLoading ? (
                    <div className="h-48 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (
                    <BarChart values={chartData} />
                  )}
                </div>

                {/* Top providers */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <h3 className="font-semibold text-slate-900 mb-4">Top Providers by Listings</h3>
                  <div className="space-y-3">
                    {topProviders.map((p, i) => (
                      <div key={p.id}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-slate-600 truncate max-w-[130px]">
                            <span className="text-slate-400 mr-1">#{i + 1}</span> {p.business_name}
                          </span>
                          <span className="text-xs font-semibold text-slate-700">{p.count} listings</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(p.count / maxCount) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                    {topProviders.length === 0 && <p className="text-sm text-slate-400 text-center py-4">No data</p>}
                  </div>
                </div>
              </div>

              {/* Pending listings + Recent tours */}
              <div className="grid lg:grid-cols-2 gap-4">
                {/* Pending listings */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-semibold text-slate-900">Pending Approvals</span>
                    </div>
                    <button onClick={() => setActiveNav("listings")} className="text-xs text-teal-600 hover:text-teal-700 font-medium transition-colors">View All →</button>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {dataLoading ? <div className="py-8 flex justify-center"><div className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" /></div>
                      : pendingListings.length === 0 ? <p className="text-center py-8 text-sm text-slate-400">No pending listings</p>
                      : pendingListings.map((l) => (
                        <div key={l.id} className="flex items-center justify-between px-5 py-3">
                          <div>
                            <p className="text-sm font-medium text-slate-900 truncate max-w-[160px]">{l.title}</p>
                            <p className="text-xs text-slate-400">{CARE_TYPE_LABELS[l.care_type]} · {[l.city, l.state].filter(Boolean).join(", ")}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge status="PENDING" />
                            <button onClick={() => handleActivate(l.id)}
                              className="text-xs font-medium px-2.5 py-1 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                              Approve
                            </button>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>

                {/* Recent tours */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-semibold text-slate-900">Recent Tours</span>
                    </div>
                    <button onClick={() => setActiveNav("tours")} className="text-xs text-teal-600 hover:text-teal-700 font-medium transition-colors">View All →</button>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {dataLoading ? <div className="py-8 flex justify-center"><div className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" /></div>
                      : recentTours.length === 0 ? <p className="text-center py-8 text-sm text-slate-400">No tours yet</p>
                      : recentTours.map((t) => (
                        <div key={t.id} className="flex items-center justify-between px-5 py-3">
                          <div>
                            <p className="text-sm font-medium text-slate-900">{t.tour_type.replace("_", " ")}</p>
                            <p className="text-xs text-slate-400">{new Date(t.scheduled_at).toLocaleDateString()}</p>
                          </div>
                          <Badge status={t.status} />
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeNav === "providers" && (
            <ProvidersSection providers={providers} onVerify={handleVerify} onReject={handleReject} loading={dataLoading} />
          )}
          {activeNav === "listings" && (
            <ListingsSection listings={listings} onActivate={handleActivate} loading={dataLoading} />
          )}
          {activeNav === "tours" && <ToursSection tours={tours} loading={dataLoading} />}
          {activeNav === "reports" && <ReportsSection reports={reports} loading={dataLoading} />}
        </main>
      </div>
    </div>
  );
}

