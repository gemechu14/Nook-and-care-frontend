import Link from "next/link";
import type { ListingDetail } from "../_types";

interface ListingBreadcrumbsProps {
  listing: ListingDetail;
}

export function ListingBreadcrumbs({ listing }: ListingBreadcrumbsProps) {
  return (
    <div className="bg-white border-b border-slate-200">
      <div className="px-4 sm:px-6 md:px-8 lg:px-[144px] py-3 sm:py-4">
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-900 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/search" className="hover:text-slate-900 transition-colors">
            Search
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-medium truncate max-w-[150px] sm:max-w-xs">
            {listing.title}
          </span>
        </nav>
      </div>
    </div>
  );
}
