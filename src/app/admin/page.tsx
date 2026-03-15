"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { listingsApi } from "@/services/listingService";
import { providersApi } from "@/features/providers/services";
import { toursApi } from "@/services/toursService";
import { reportsApi } from "@/services/reportsService";
import type { ApiListing, ApiProvider, ApiTour, ApiReport } from "@/types";

import { DashboardOverview } from "@/components/admin/DashboardOverview";
import { ProvidersSection } from "@/components/admin/sections/ProvidersSection";
import { ListingsSection } from "@/components/admin/sections/ListingsSection";
import { ToursSection } from "@/components/admin/sections/ToursSection";
import { ReportsSection } from "@/components/admin/sections/ReportsSection";
import { Loader } from "@/components/admin/shared/Loader";

interface Stats {
  totalListings: number;
  pendingProviders: number;
  totalTours: number;
  totalReports: number;
}

export default function AdminDashboard() {
  const searchParams = useSearchParams();
  const activeNav = (searchParams.get("nav") || "dashboard") as "dashboard" | "providers" | "listings" | "tours" | "reports";

  const [stats, setStats] = useState<Stats>({
    totalListings: 0,
    pendingProviders: 0,
    totalTours: 0,
    totalReports: 0,
  });
  const [listings, setListings] = useState<ApiListing[]>([]);
  const [providers, setProviders] = useState<ApiProvider[]>([]);
  const [tours, setTours] = useState<ApiTour[]>([]);
  const [reports, setReports] = useState<ApiReport[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const loadAll = useCallback(async () => {
    setDataLoading(true);
    try {
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
    } catch (error) {
      console.error("Failed to load admin data:", error);
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleVerify = async (id: string) => {
    try {
      await providersApi.verify(id);
      setProviders((p) =>
        p.map((x) => (x.id === id ? { ...x, verification_status: "VERIFIED" } : x))
      );
      setStats((s) => ({
        ...s,
        pendingProviders: Math.max(0, s.pendingProviders - 1),
      }));
    } catch (error) {
      console.error("Failed to verify provider:", error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await providersApi.reject(id);
      setProviders((p) =>
        p.map((x) => (x.id === id ? { ...x, verification_status: "REJECTED" } : x))
      );
      setStats((s) => ({
        ...s,
        pendingProviders: Math.max(0, s.pendingProviders - 1),
      }));
    } catch (error) {
      console.error("Failed to reject provider:", error);
    }
  };

  const handleActivate = async (id: string) => {
    try {
      const updated = await listingsApi.activate(id);
      setListings((p) => p.map((l) => (l.id === id ? updated : l)));
    } catch (error) {
      console.error("Failed to activate listing:", error);
    }
  };

  const handleNavChange = (id: string) => {
    // Navigation is handled by the layout
  };

  const STAT_CARDS = [
    {
      label: "Total Listings",
      value: stats.totalListings,
      trend: "+12%",
      trendUp: true,
      icon: (
        <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      label: "Pending Providers",
      value: stats.pendingProviders,
      trend: "-3%",
      trendUp: false,
      icon: (
        <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
        </svg>
      ),
    },
    {
      label: "Total Tours",
      value: stats.totalTours,
      trend: "+8%",
      trendUp: true,
      icon: (
        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: "Open Reports",
      value: stats.totalReports,
      trend: "+2 this week",
      trendUp: false,
      icon: (
        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
  ];

  if (dataLoading && listings.length === 0) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      {activeNav === "dashboard" && (
        <DashboardOverview
          stats={STAT_CARDS}
          listings={listings}
          tours={tours}
          providers={providers}
          loading={dataLoading}
          onActivate={handleActivate}
          onNavChange={handleNavChange}
        />
      )}

      {activeNav === "providers" && (
        <ProvidersSection
          providers={providers}
          onVerify={handleVerify}
          onReject={handleReject}
          loading={dataLoading}
        />
      )}

      {activeNav === "listings" && (
        <ListingsSection
          listings={listings}
          onActivate={handleActivate}
          loading={dataLoading}
        />
      )}

      {activeNav === "tours" && (
        <ToursSection tours={tours} loading={dataLoading} />
      )}

      {activeNav === "reports" && (
        <ReportsSection reports={reports} loading={dataLoading} />
      )}
    </div>
  );
}
