import type { ApiProvider } from "@/types";

interface RejectedPanelProps {
  provider: ApiProvider;
  onReapply: () => void;
}

export function RejectedPanel({ provider, onReapply }: RejectedPanelProps) {
  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white rounded-xl border border-red-200 shadow-sm p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Application Rejected</h2>
            <p className="text-sm text-slate-500">Your provider application was not approved</p>
          </div>
        </div>
        {provider.rejection_reason && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5 text-sm text-red-800">
            <p className="font-semibold mb-1">Reason:</p>
            <p>{provider.rejection_reason}</p>
          </div>
        )}
        <p className="text-sm text-slate-600 mb-5">Please review the reason above, make the necessary corrections to your business information, and reapply.</p>
        <button 
          onClick={onReapply}
          className="w-full bg-teal-600 text-white py-3 rounded-xl font-semibold hover:bg-teal-700 transition-colors"
        >
          Update Profile &amp; Reapply
        </button>
      </div>
    </div>
  );
}


