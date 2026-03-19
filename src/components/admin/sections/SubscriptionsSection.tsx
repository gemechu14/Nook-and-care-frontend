export function SubscriptionsSection() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Subscription Management</h2>
        <p className="text-sm text-slate-500">Track plans, billing and renewals across the platform</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .672-3 1.5S10.343 11 12 11s3 .672 3 1.5S13.657 14 12 14m0-6V6m0 8v2m9-4a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-slate-900">Subscriptions module   </h3>
        {/* <p className="mt-2 text-sm text-slate-500">
          This section is prepared for your subscription APIs. Once endpoints are available, we can add live plan and payment tables here.
        </p> */}
      </div>
    </div>
  );
}
