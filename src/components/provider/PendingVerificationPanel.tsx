import type { ApiProvider } from "@/types";

interface PendingVerificationPanelProps {
  provider: ApiProvider | null;
}

export function PendingVerificationPanel({ provider }: PendingVerificationPanelProps) {
  const steps = [
    { label: "Account Created", done: true },
    { label: "Provider Profile Submitted", done: !!provider },
    { label: "Admin Verification", done: provider?.verification_status === "VERIFIED", inProgress: provider?.verification_status === "PENDING" },
    { label: "List Your Facilities", done: false, locked: provider?.verification_status !== "VERIFIED" },
  ];

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Verification Pending</h2>
            <p className="text-sm text-slate-500">Your application is being reviewed by our team</p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                step.done ? "bg-teal-600" :
                step.inProgress ? "bg-amber-500" :
                "bg-slate-200"
              }`}>
                {step.done ? (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : step.inProgress ? (
                  <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                ) : (
                  <div className={`w-2.5 h-2.5 rounded-full ${step.locked ? "bg-slate-400" : "bg-slate-400"}`} />
                )}
              </div>
              <span className={`text-sm font-medium ${
                step.done ? "text-teal-700" :
                step.inProgress ? "text-amber-700" :
                step.locked ? "text-slate-400" :
                "text-slate-600"
              }`}>
                {step.label}
                {step.inProgress && <span className="ml-2 text-xs bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-full">In Progress</span>}
                {step.locked && <span className="ml-2 text-xs">🔒</span>}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
          <p className="font-semibold mb-1">What happens next?</p>
          <ul className="space-y-1 text-blue-700 list-disc list-inside">
            <li>Our admin team reviews your business details</li>
            <li>Verification typically takes 1–2 business days</li>
            <li>You&apos;ll be notified once your account is verified</li>
            <li>After verification, you can create and publish listings</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

