import type { ListingDetail } from "../_types";

interface ListingAboutSectionProps {
  listing: ListingDetail;
}

export function ListingAboutSection({ listing }: ListingAboutSectionProps) {
  return (
    <div className="mb-6 sm:mb-8">
      <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-3 sm:mb-4">
        About This Community
      </h2>
      <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-3 sm:mb-4">
        {listing.description}
      </p>
      {listing.descriptionExtra && (
        <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
          {listing.descriptionExtra}
        </p>
      )}
    </div>
  );
}
