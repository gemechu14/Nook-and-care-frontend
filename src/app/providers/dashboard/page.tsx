"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/store/authStore";
import { listingsApi } from "@/services/listingService";
import { providersApi } from "@/features/providers/services";
import { toursApi } from "@/services/toursService";
import { listingImagesApi } from "@/services/listingImagesService";
import type { ApiListing, ApiProvider, ApiTour, ApiListingImage } from "@/types";
import { Loader } from "@/components/admin/shared/Loader";
import { DashboardOverview } from "@/components/provider/DashboardOverview";
import { ListingsSection } from "@/components/provider/sections/ListingsSection";
import { ToursSection } from "@/components/provider/sections/ToursSection";
import { SubscriptionsSection } from "@/components/provider/sections/SubscriptionsSection";
import { NewListingModal } from "@/components/provider/modals/NewListingModal";
import { ImageManagerModal } from "@/components/provider/modals/ImageManagerModal";
import { PendingVerificationPanel } from "@/components/provider/PendingVerificationPanel";
import { RejectedPanel } from "@/components/provider/RejectedPanel";
import { dashboardApi, type DashboardSummary } from "@/services/dashboardService";

export default function ProviderDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeNav = (searchParams.get("nav") || "dashboard") as "dashboard" | "listings" | "tours" | "subscriptions";
  const { user, loading } = useAuth();

  const [provider, setProvider] = useState<ApiProvider | null>(null);
  const [listings, setListings] = useState<ApiListing[]>([]);
  const [recentTours, setRecentTours] = useState<ApiTour[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [showNewListing, setShowNewListing] = useState(false);
  const [imageManagerListing, setImageManagerListing] = useState<ApiListing | null>(null);

  const loadData = useCallback(async () => {
    if (!user) return;
    setPageLoading(true);
    try {
      const [provList, listingData, summaryData] = await Promise.allSettled([
        providersApi.list({ limit: 100 }),
        listingsApi.list({ include_all_statuses: true }),
        dashboardApi.summary(),
      ]);
      
      let userProvider: ApiProvider | null = null;
      if (provList.status === "fulfilled") {
        userProvider = provList.value.find((p) => p.user_id === user.id) || null;
        if (userProvider) setProvider(userProvider);
      }
      
      if (listingData.status === "fulfilled") {
        if (userProvider) {
          const providerListings = listingData.value.filter((l) => l.provider_id === userProvider.id);
          setListings(providerListings);

          // Load a small recent slice of tours for this provider for dashboard
          const providerListingIds = providerListings.map((l) => l.id);
          const size = 50;
          const maxPages = 10;
          const collected: ApiTour[] = [];
          for (let page = 1; page <= maxPages && collected.length < 7; page++) {
            const batch = await toursApi.list({ page, size });
            collected.push(
              ...batch.filter((t) => providerListingIds.includes(t.listing_id))
            );
            if (batch.length < size) break;
          }
          setRecentTours(collected.slice(0, 7));
        } else {
          setListings([]);
          setRecentTours([]);
        }
      }

      if (summaryData.status === "fulfilled") {
        setSummary(summaryData.value);
      }
    } finally {
      setPageLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (loading) return;
    if (!user) { 
      router.push("/login"); 
      return; 
    }
    if (user.role !== "PROVIDER") { 
      router.push("/"); 
      return; 
    }
    loadData();
    
    const params = new URLSearchParams(window.location.search);
    if (params.get("addListing") === "true") {
      setShowNewListing(true);
      router.replace("/providers/dashboard", { scroll: false });
    }
  }, [user, loading, router, loadData]);

  if (loading || pageLoading) {
    return <Loader />;
  }

  if (!provider) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 max-w-md w-full text-center">
          <div className="w-14 h-14 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Complete Your Provider Profile</h2>
          <p className="text-slate-500 text-sm mb-6">You need to set up your business profile before you can manage listings.</p>
          <Link 
            href="/providers/register" 
            className="block w-full bg-teal-600 text-white py-3 rounded-xl font-semibold hover:bg-teal-700 transition-colors text-center"
          >
            Set Up Provider Profile
          </Link>
        </div>
      </div>
    );
  }

  if (provider.verification_status === "PENDING") {
    return <PendingVerificationPanel provider={provider} />;
  }

  if (provider.verification_status === "REJECTED") {
    return <RejectedPanel provider={provider} onReapply={() => router.push("/providers/register")} />;
  }

  const activeListing = listings.filter((l) => l.status === "ACTIVE").length;
  const pendingListings = listings.filter((l) => l.status === "PENDING").length;

  const STAT_CARDS = [
    {
      label: "Total Listings",
      value: summary?.total_listings ?? listings.length,
      icon: (
        <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      label: "Active Listings",
      value: summary?.active_listings ?? activeListing,
      icon: (
        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Pending Review",
      value: summary?.pending_listings ?? pendingListings,
      icon: (
        <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Total Tours",
      value: summary?.total_tours ?? 0,
      icon: (
        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {showNewListing && provider && (
        <NewListingModal
          providerId={provider.id}
          onClose={() => setShowNewListing(false)}
          onCreated={(l) => { 
            setListings((p) => [l, ...p]); 
            setShowNewListing(false); 
          }}
        />
      )}
      {imageManagerListing && (
        <ImageManagerModal 
          listing={imageManagerListing} 
          onClose={() => setImageManagerListing(null)} 
        />
      )}

      {activeNav === "dashboard" && (
        <DashboardOverview
          stats={STAT_CARDS}
          listings={listings}
          tours={recentTours}
          provider={provider}
          loading={pageLoading}
        />
      )}

      {activeNav === "listings" && (
        <ListingsSection
          listings={listings}
          loading={pageLoading}
          onImageManage={setImageManagerListing}
          onAddListing={() => setShowNewListing(true)}
        />
      )}

      {activeNav === "tours" && (
        <ToursSection 
          providerId={provider.id}
        />
      )}

      {activeNav === "subscriptions" && (
        <SubscriptionsSection />
      )}
    </div>
  );
}
