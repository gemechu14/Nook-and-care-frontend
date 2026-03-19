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
  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100";
  const labelClass = "mb-1.5 block text-xs font-semibold tracking-wide text-slate-600";
  const sectionClass = "space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm";

  const updateNumber = (
    key: "price" | "capacity" | "available_beds",
    value: string,
  ): Partial<UpdateListingRequest> => {
    const n = Number(value);
    if (key === "available_beds") {
      return {
        available_beds: value === "" || Number.isNaN(n) ? undefined : n,
      };
    }
    if (key === "price") return { price: n || undefined };
    return { capacity: n || undefined };
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {detailsSuccess && (
        <div
          role="status"
          aria-live="polite"
          className="fixed right-4 top-4 z-50 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800 shadow-lg"
        >
          Changes saved successfully.
        </div>
      )}

      <section className={sectionClass}>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Basic Information</h2>
          <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-semibold text-teal-700">
            Core
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="sm:col-span-2 lg:col-span-3">
            <label className={labelClass}>Title</label>
            <input
              value={detailsForm.title ?? ""}
              onChange={(e) => onChange({ title: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Care Type</label>
            <select
              value={detailsForm.care_type ?? ""}
              onChange={(e) => onChange({ care_type: e.target.value as ApiCareType })}
              className={inputClass}
            >
              {careTypes.map((type) => (
                <option key={type} value={type}>
                  {CARE_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Price ($/month)</label>
            <input
              type="number"
              value={detailsForm.price ?? ""}
              onChange={(e) => onChange(updateNumber("price", e.target.value))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Capacity</label>
            <input
              type="number"
              value={detailsForm.capacity ?? ""}
              onChange={(e) => onChange(updateNumber("capacity", e.target.value))}
              className={inputClass}
            />
          </div>
          <div className="lg:col-span-3">
            <label className={labelClass}>Description</label>
            <textarea
              rows={3}
              value={detailsForm.description ?? ""}
              onChange={(e) => onChange({ description: e.target.value })}
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Location & Contact</h2>
          <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-700">
            Public
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="sm:col-span-2 lg:col-span-3">
            <label className={labelClass}>Address</label>
            <input
              value={detailsForm.address ?? ""}
              onChange={(e) => onChange({ address: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Postal Code</label>
            <input
              value={detailsForm.postal_code ?? ""}
              onChange={(e) => onChange({ postal_code: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input
              value={detailsForm.phone ?? ""}
              onChange={(e) => onChange({ phone: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              value={detailsForm.email ?? ""}
              onChange={(e) => onChange({ email: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>City</label>
            <input
              value={detailsForm.city ?? ""}
              onChange={(e) => onChange({ city: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>State</label>
            <input
              value={detailsForm.state ?? ""}
              onChange={(e) => onChange({ state: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Operations</h2>
          <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-semibold text-violet-700">
            Internal
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className={labelClass}>License Number</label>
            <input
              value={detailsForm.license_number ?? ""}
              onChange={(e) => onChange({ license_number: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Available Beds</label>
            <input
              type="number"
              min={0}
              value={detailsForm.available_beds ?? ""}
              onChange={(e) => onChange(updateNumber("available_beds", e.target.value))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Staff Ratio</label>
            <input
              value={detailsForm.staff_ratio ?? ""}
              onChange={(e) => onChange({ staff_ratio: e.target.value })}
              placeholder="e.g. 1:4"
              className={inputClass}
            />
          </div>
          <label className="sm:col-span-2 lg:col-span-3 flex cursor-pointer items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100">
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

      <div className="sticky bottom-0 z-10 flex justify-end rounded-xl border border-slate-200 bg-white/95 p-3 shadow-sm backdrop-blur">
        <button
          type="submit"
          disabled={detailsSaving}
          className="rounded-xl bg-teal-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-teal-700 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
        >
          {detailsSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
