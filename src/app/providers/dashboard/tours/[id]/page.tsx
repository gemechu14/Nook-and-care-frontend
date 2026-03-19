"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/store/authStore";
import { toursApi } from "@/services/toursService";
import type { ApiTour } from "@/types";
import { Badge } from "@/components/admin/shared/Badge";
import { Loader } from "@/components/admin/shared/Loader";

export default function ProviderTourDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { user, loading } = useAuth();

  const [tour, setTour] = useState<ApiTour | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<null | "approve" | "complete">(null);

  const load = useCallback(async () => {
    if (!id) return;
    setPageLoading(true);
    setError(null);
    try {
      const t = await toursApi.getById(id);
      setTour(t);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load tour");
    } finally {
      setPageLoading(false);
    }
  }, [id]);

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
    load();
  }, [user, loading, router, load]);

  const fullName = tour?.booked_by?.full_name || tour?.family_name || "—";
  const phone = tour?.booked_by?.phone || tour?.family_phone || "—";
  const email = tour?.booked_by?.email || tour?.family_email || "—";
  const tourDate = tour?.scheduled_at ? new Date(tour.scheduled_at).toLocaleString() : "TBD";

  const runAction = async (kind: "approve" | "complete") => {
    if (!tour) return;
    setActionLoading(kind);
    try {
      if (kind === "approve") await toursApi.approve(tour.id);
      if (kind === "complete") await toursApi.complete(tour.id);
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading || pageLoading) return <Loader />;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Link href="/providers/dashboard?nav=tours" className="hover:text-slate-900 transition-colors">
              Tours
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-medium truncate max-w-[240px]">Request</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Tour Request Details</h1>
          <p className="text-sm text-slate-500 mt-0.5">Review family details and manage the booking.</p>
        </div>

        {tour && (
          <div className="flex items-center gap-2 flex-wrap">
            {tour.status === "PENDING" && (
              <>
                <button
                  onClick={() => runAction("approve")}
                  disabled={actionLoading !== null}
                  className="px-4 py-2 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {actionLoading === "approve" ? "Approving..." : "Approve"}
                </button>
              </>
            )}
            {tour.status === "APPROVED" && (
              <button
                onClick={() => runAction("complete")}
                disabled={actionLoading !== null}
                className="px-4 py-2 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {actionLoading === "complete" ? "Updating..." : "Mark Complete"}
              </button>
            )}
          </div>
        )}
      </div>

      {error ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
          <p className="text-lg font-semibold text-slate-900 mb-1">Couldn’t load this request</p>
          <p className="text-sm text-slate-500 mb-4">{error}</p>
          <button
            onClick={load}
            className="inline-flex items-center justify-center px-4 py-2 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : !tour ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
          <p className="text-sm text-slate-500">No data</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Family card */}
          <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center gap-3">
              {/* <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-700 font-bold">
                {(fullName || "—").slice(0, 1).toUpperCase()}
              </div> */}
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900">Booked by</p>
                <p className="text-lg font-bold text-slate-900 truncate">{fullName}</p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs text-slate-500">Phone</p>
                <p className="text-sm font-medium text-slate-900">{phone}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs text-slate-500">Email</p>
                <p className="text-sm font-medium text-slate-900 break-all">{email}</p>
              </div>
            </div>
          </div>

          {/* Tour details */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">Booking Details</p>
                <p className="text-xs text-slate-500 mt-0.5">Tour type and time.</p>
              </div>
              <div className="hidden sm:block">
                <Badge status={tour.status} />
              </div>
            </div>

            <div className="p-5 grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs text-slate-500">Tour date</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">{tourDate}</p>
              </div>
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs text-slate-500">Tour type</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">
                  {tour.tour_type === "VIRTUAL" ? "Virtual" : "In person"}
                </p>
              </div>

              <div className="sm:col-span-2 rounded-xl border border-slate-200 p-4 bg-slate-50">
                <p className="text-xs text-slate-500">Notes</p>
                <p className="text-sm text-slate-800 mt-1 whitespace-pre-wrap">{tour.notes || "—"}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

