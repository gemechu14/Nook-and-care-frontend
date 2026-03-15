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
import { Badge } from "@/components/admin/shared/Badge";
import { Loader } from "@/components/admin/shared/Loader";
import { DashboardOverview } from "@/components/provider/DashboardOverview";
import { ListingsSection } from "@/components/provider/sections/ListingsSection";
import { ToursSection } from "@/components/provider/sections/ToursSection";
import { SubscriptionsSection } from "@/components/provider/sections/SubscriptionsSection";
import { NewListingModal } from "@/components/provider/modals/NewListingModal";
import { ImageManagerModal } from "@/components/provider/modals/ImageManagerModal";
import { PendingVerificationPanel } from "@/components/provider/PendingVerificationPanel";
import { RejectedPanel } from "@/components/provider/RejectedPanel";

export default function ProviderDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeNav = (searchParams.get("nav") || "dashboard") as "dashboard" | "listings" | "tours" | "subscriptions";
  const { user, loading } = useAuth();

  const [provider, setProvider] = useState<ApiProvider | null>(null);
  const [listings, setListings] = useState<ApiListing[]>([]);
  const [tours, setTours] = useState<ApiTour[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [showNewListing, setShowNewListing] = useState(false);
  const [imageManagerListing, setImageManagerListing] = useState<ApiListing | null>(null);

  const loadData = useCallback(async () => {
    if (!user) return;
    setPageLoading(true);
    try {
      const [provList, listingData, toursData] = await Promise.allSettled([
        providersApi.list({ limit: 100 }),
        listingsApi.list(),
        toursApi.list(),
      ]);
      
      let userProvider: ApiProvider | null = null;
      if (provList.status === "fulfilled") {
        userProvider = provList.value.find((p) => p.user_id === user.id) || null;
        if (userProvider) setProvider(userProvider);
      }
      
      if (listingData.status === "fulfilled") {
        if (userProvider) {
          setListings(listingData.value.filter((l) => l.provider_id === userProvider!.id));
        } else {
          setListings([]);
        }
      }
      
      if (toursData.status === "fulfilled" && userProvider) {
        const providerListingIds = listingData.status === "fulfilled" 
          ? listingData.value.filter((l) => l.provider_id === userProvider!.id).map((l) => l.id)
          : [];
        setTours(toursData.value.filter((t) => providerListingIds.includes(t.listing_id)));
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
      value: listings.length,
      icon: (
        <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      label: "Active Listings",
      value: activeListing,
      icon: (
        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Pending Review",
      value: pendingListings,
      icon: (
        <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Account Status",
      value: provider.verification_status,
      icon: (
        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {showNewListing && (
        <NewListingModal
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
          tours={tours}
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
          tours={tours} 
          loading={pageLoading}
          onRefresh={loadData}
        />
      )}

      {activeNav === "subscriptions" && (
        <SubscriptionsSection />
      )}
    </div>
  );
}
