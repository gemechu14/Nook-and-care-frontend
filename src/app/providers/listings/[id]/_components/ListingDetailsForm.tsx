"use client";

import type { ApiCareType, UpdateListingRequest } from "@/types";
import { CARE_TYPE_LABELS } from "@/types";

interface ListingDetailsFormProps {
  careTypes: ApiCareType[];
  detailsForm: Partial<UpdateListingRequest>;
  detailsSaving: boolean;
  detailsSuccess: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onChange: (update: Partial<UpdateListingRequest>) => void;
}

export function ListingDetailsForm({
  careTypes,
  detailsForm,
  detailsSaving,
  detailsSuccess,
  onSubmit,
  onChange,
}: ListingDetailsFormProps) {
  const updateNumber = (
    key: "price" | "capacity",
    value: string,
  ): Partial<UpdateListingRequest> => ({
    [key]: Number(value) || undefined,
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {detailsSuccess && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-xs font-medium text-green-700">
          Changes saved successfully.
        </div>
      )}

      <section className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
        <h2 className="text-sm font-semibold text-slate-900">Basic Information</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-slate-600">Title</label>
            <input
              value={detailsForm.title ?? ""}
              onChange={(e) => onChange({ title: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">Care Type</label>
            <select
              value={detailsForm.care_type ?? ""}
              onChange={(e) => onChange({ care_type: e.target.value as ApiCareType })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
            >
              {careTypes.map((type) => (
                <option key={type} value={type}>
                  {CARE_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              Price ($/month)
            </label>
            <input
              type="number"
              value={detailsForm.price ?? ""}
              onChange={(e) => onChange(updateNumber("price", e.target.value))}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-slate-600">Description</label>
            <textarea
              rows={4}
              value={detailsForm.description ?? ""}
              onChange={(e) => onChange({ description: e.target.value })}
              className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
        <h2 className="text-sm font-semibold text-slate-900">Location & Contact</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">City</label>
            <input
              value={detailsForm.city ?? ""}
              onChange={(e) => onChange({ city: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">State</label>
            <input
              value={detailsForm.state ?? ""}
              onChange={(e) => onChange({ state: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-slate-600">Address</label>
            <input
              value={detailsForm.address ?? ""}
              onChange={(e) => onChange({ address: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">Phone</label>
            <input
              value={detailsForm.phone ?? ""}
              onChange={(e) => onChange({ phone: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">Email</label>
            <input
              type="email"
              value={detailsForm.email ?? ""}
              onChange={(e) => onChange({ email: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
        <h2 className="text-sm font-semibold text-slate-900">Operations</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">Capacity</label>
            <input
              type="number"
              value={detailsForm.capacity ?? ""}
              onChange={(e) => onChange(updateNumber("capacity", e.target.value))}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              License Number
            </label>
            <input
              value={detailsForm.license_number ?? ""}
              onChange={(e) => onChange({ license_number: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <label className="sm:col-span-2 flex cursor-pointer items-center gap-2.5 rounded-lg border border-slate-200 bg-white p-3 text-xs font-medium text-slate-700">
            <input
              type="checkbox"
              checked={Boolean(detailsForm.has_24_hour_care)}
              onChange={(e) => onChange({ has_24_hour_care: e.target.checked })}
              className="h-4 w-4 rounded accent-teal-600"
            />
            24-hour care available
          </label>
        </div>
      </section>

      <div className="flex justify-end border-t border-slate-200 pt-4">
        <button
          type="submit"
          disabled={detailsSaving}
          className="rounded-lg bg-teal-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {detailsSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
