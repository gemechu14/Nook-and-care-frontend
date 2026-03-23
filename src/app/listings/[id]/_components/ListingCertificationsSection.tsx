import type { ListingDetail } from "../_types";

interface ListingCertificationsSectionProps {
  listing: ListingDetail;
}

export function ListingCertificationsSection({
  listing,
}: ListingCertificationsSectionProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-6">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
        <h2 className="text-base sm:text-lg font-semibold text-slate-900">
          Certifications & Licenses
        </h2>
      </div>
      <div className="flex flex-wrap gap-2 mb-3">
        {listing.certifications.map((cert, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-50 text-teal-700 border border-teal-200 rounded-full text-sm font-medium"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            {cert}
          </span>
        ))}
      </div>
      <p className="text-sm text-slate-600">
        License #:{" "}
        <span className="font-medium text-slate-800">{listing.licenseNumber}</span>
      </p>
    </div>
  );
}
