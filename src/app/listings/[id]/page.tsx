"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "@/store/authStore";
import { useListingDetail } from "./_hooks/useListingDetail";
import type { DetailTabId } from "./_types";
import { ListingAboutSection } from "./_components/ListingAboutSection";
import { ListingBreadcrumbs } from "./_components/ListingBreadcrumbs";
import { ListingCertificationsSection } from "./_components/ListingCertificationsSection";
import { ListingContactSection } from "./_components/ListingContactSection";
import { ListingDetailSidebar } from "./_components/ListingDetailSidebar";
import { ListingDetailTabs } from "./_components/ListingDetailTabs";
import { ListingGallery } from "./_components/ListingGallery";
import { ListingIdentitySection } from "./_components/ListingIdentitySection";
import { ListingKeyDetailsSection } from "./_components/ListingKeyDetailsSection";
import { PhotoViewerModal } from "./_components/PhotoViewerModal";
import { RequestInfoModal } from "./_components/RequestInfoModal";
import { ScheduleTourModal } from "./_components/ScheduleTourModal";

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { listing, isMockListing, pageLoading, pageError } =
    useListingDetail(id);

  const [activeTab, setActiveTab] = useState<DetailTabId>("services");
  const [scheduleTourOpen, setScheduleTourOpen] = useState(false);
  const [requestInfoOpen, setRequestInfoOpen] = useState(false);
  const [photoViewerOpen, setPhotoViewerOpen] = useState(false);
  const [photoViewerIndex, setPhotoViewerIndex] = useState(0);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (scheduleTourOpen) setScheduleTourOpen(false);
      if (requestInfoOpen) setRequestInfoOpen(false);
      if (photoViewerOpen) setPhotoViewerOpen(false);
    };

    if (scheduleTourOpen || requestInfoOpen || photoViewerOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [scheduleTourOpen, requestInfoOpen, photoViewerOpen]);

  const openPhotoViewer = (startIndex: number) => {
    setPhotoViewerIndex(
      Number.isFinite(startIndex) ? Math.max(0, startIndex) : 0
    );
    setPhotoViewerOpen(true);
  };

  const handleScheduleTour = () => {
    setScheduleTourOpen(true);
    setRequestInfoOpen(false);
  };

  const handleRequestInfo = () => {
    setRequestInfoOpen(true);
    setScheduleTourOpen(false);
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-white pt-16 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-white pt-16 flex flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-xl font-semibold text-slate-700">
          Community not found
        </p>
        <p className="text-slate-500">{pageError}</p>
        <Link
          href="/search"
          className="text-teal-600 hover:text-teal-700 font-medium transition-colors"
        >
          Browse all communities
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-16">
      <ListingBreadcrumbs listing={listing} />

      <div className="px-4 sm:px-6 md:px-8 lg:px-[144px] py-4 sm:py-6 md:py-8">
        <ListingGallery
          listing={listing}
          onViewAllPhotos={() => openPhotoViewer(0)}
        />

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          <div className="w-full lg:flex-[3] lg:min-w-0">
            <ListingIdentitySection listing={listing} />
            <ListingContactSection listing={listing} />
            <ListingCertificationsSection listing={listing} />
            <ListingKeyDetailsSection listing={listing} />
            <ListingAboutSection listing={listing} />
            <ListingDetailTabs
              listing={listing}
              isMockListing={isMockListing}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          <ListingDetailSidebar
            listing={listing}
            listingId={listing.id}
            isAuthenticated={Boolean(user)}
            onScheduleTour={handleScheduleTour}
            onRequestInfo={handleRequestInfo}
          />
        </div>
      </div>

      <ScheduleTourModal
        isOpen={scheduleTourOpen}
        listingId={listing.id}
        onClose={() => setScheduleTourOpen(false)}
      />
      <RequestInfoModal
        isOpen={requestInfoOpen}
        onClose={() => setRequestInfoOpen(false)}
      />
      {photoViewerOpen && (
        <PhotoViewerModal
          listing={listing}
          index={photoViewerIndex}
          onClose={() => setPhotoViewerOpen(false)}
          onIndexChange={setPhotoViewerIndex}
        />
      )}
    </div>
  );
}
