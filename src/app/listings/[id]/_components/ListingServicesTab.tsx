"use client";

import type { ListingDetail } from "../_types";

const SECTION_ICON = (
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
);
const CARE_ICON = (
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
);
const CHECK_ICON = (
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
);
const LIGHTNING_ICON = (
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
);
const SHIELD_ICON = (
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
);

const SvgIcon = ({ children, className = "w-4 h-4 sm:w-5 sm:h-5 text-teal-600" }: { children: React.ReactNode; className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    {children}
  </svg>
);

function ItemList({ items, icon = CHECK_ICON }: { items: string[]; icon?: React.ReactNode }) {
  if (items.length === 0) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <SvgIcon className="w-4 h-4 text-teal-600 shrink-0">{icon}</SvgIcon>
          <span className="text-slate-700 text-sm">{item}</span>
        </div>
      ))}
    </div>
  );
}

interface ListingServicesTabProps {
  listing: ListingDetail;
}

export function ListingServicesTab({ listing }: ListingServicesTabProps) {
  const cardClass = "bg-white border border-slate-200 rounded-xl p-4 sm:p-5 md:p-6";
  const headerClass = "flex items-center gap-2 mb-3 sm:mb-4";
  const titleClass = "text-sm sm:text-base font-semibold text-slate-900";

  return (
    <div className="space-y-6">
      {/* Treatment Services */}
      {listing.treatmentServices.length > 0 && (
        <div className={cardClass}>
          <div className={headerClass}>
            <SvgIcon>{SECTION_ICON}</SvgIcon>
            <h3 className={titleClass}>Treatment Services</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {listing.treatmentServices.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <SvgIcon className="w-4 h-4 text-teal-600 shrink-0">{SECTION_ICON}</SvgIcon>
                <span className="text-slate-700 text-sm">
                  {s.name}
                  {s.price != null ? (
                    <span className="text-slate-500"> (${s.price.toLocaleString()})</span>
                  ) : (
                    <span className="text-slate-500"> (Price on request)</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Care Services */}
      <div className={cardClass}>
        <div className={headerClass}>
          <SvgIcon>{CARE_ICON}</SvgIcon>
          <h3 className={titleClass}>Care Services</h3>
        </div>
        <ItemList items={listing.careServices} icon={LIGHTNING_ICON} />
      </div>

      {/* Amenities */}
      <div className={cardClass}>
        <div className={headerClass}>
          <SvgIcon>{CARE_ICON}</SvgIcon>
          <h3 className={titleClass}>Amenities</h3>
        </div>
        <ItemList items={listing.amenities} />
      </div>

      {/* Activities */}
      <div className={cardClass}>
        <div className={headerClass}>
          <SvgIcon>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </SvgIcon>
          <h3 className={titleClass}>Activities & Programs</h3>
        </div>
        <ItemList
          items={listing.activities}
          icon={
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          }
        />
      </div>

      {/* Dining Options */}
      <div className={cardClass}>
        <div className={headerClass}>
          <SvgIcon>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </SvgIcon>
          <h3 className={titleClass}>Dining Options</h3>
        </div>
        <div className="space-y-2.5">
          {listing.diningOptions.map((d, i) => (
            <div key={i} className="flex items-center gap-2">
              <SvgIcon className="w-4 h-4 text-teal-600 shrink-0">{CHECK_ICON}</SvgIcon>
              <span className="text-slate-700 text-sm">{d}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Features */}
      <div className={cardClass}>
        <div className={headerClass}>
          <SvgIcon>{SECTION_ICON}</SvgIcon>
          <h3 className={titleClass}>Safety Features</h3>
        </div>
        <ItemList items={listing.safetyFeatures} icon={SHIELD_ICON} />
      </div>

      {/* Insurance */}
      <div className={cardClass}>
        <h3 className={`${titleClass} mb-3 sm:mb-4`}>Insurance & Payment Options</h3>
        <div className="flex flex-wrap gap-2">
          {listing.insuranceAccepted.map((ins, i) => (
            <span
              key={i}
              className="px-4 py-1.5 bg-slate-50 text-slate-700 border border-slate-200 rounded-full text-sm font-medium"
            >
              {ins}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
