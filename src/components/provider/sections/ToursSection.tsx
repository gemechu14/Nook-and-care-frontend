import { Badge } from "@/components/admin/shared/Badge";
import { Loader } from "@/components/admin/shared/Loader";
import type { ApiTour } from "@/types";
import { toursApi } from "@/services/toursService";

interface ToursSectionProps {
  tours: ApiTour[];
  loading: boolean;
  onRefresh: () => void;
}

export function ToursSection({ tours, loading, onRefresh }: ToursSectionProps) {
  if (loading) return <Loader />;

  const handleApprove = async (id: string) => {
    try {
      await toursApi.approve(id);
      onRefresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to approve tour");
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await toursApi.cancel(id);
      onRefresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to cancel tour");
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await toursApi.complete(id);
      onRefresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to complete tour");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Tour Requests</h2>
        <p className="text-sm text-slate-500">Manage tour bookings from families</p>
      </div>
      
      {tours.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-lg font-medium text-slate-900 mb-2">No tour requests yet</p>
          <p className="text-sm text-slate-500">Tour requests from families will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tours.map((tour) => (
            <div key={tour.id} className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <p className="font-medium text-slate-900">{tour.family_name || "Family Member"}</p>
                    <Badge status={tour.status} />
                  </div>
                  <p className="text-sm text-slate-600 mb-1">
                    Requested for: {tour.preferred_date ? new Date(tour.preferred_date).toLocaleDateString() : "TBD"}
                  </p>
                  {tour.family_email && (
                    <p className="text-sm text-slate-500">{tour.family_email}</p>
                  )}
                  {tour.family_phone && (
                    <p className="text-sm text-slate-500">{tour.family_phone}</p>
                  )}
                  {tour.notes && (
                    <p className="text-sm text-slate-600 mt-2 italic">&quot;{tour.notes}&quot;</p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {tour.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => handleApprove(tour.id)}
                        className="px-3 py-1.5 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleCancel(tour.id)}
                        className="px-3 py-1.5 bg-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {tour.status === "APPROVED" && (
                    <button
                      onClick={() => handleComplete(tour.id)}
                      className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}




