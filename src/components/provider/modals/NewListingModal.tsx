"use client";

import { useState } from "react";
import { listingsApi } from "@/services/listingService";
import type { ApiListing, CreateListingRequest } from "@/types";

const CARE_TYPES = [
  { value: "ASSISTED_LIVING", label: "Assisted Living" },
  { value: "MEMORY_CARE", label: "Memory Care" },
  { value: "INDEPENDENT_LIVING", label: "Independent Living" },
  { value: "ADULT_FAMILY_HOME", label: "Adult Family Home" },
  { value: "SKILLED_NURSING", label: "Skilled Nursing" },
] as const;

interface NewListingModalProps {
  onClose: () => void;
  onCreated: (listing: ApiListing) => void;
}

export function NewListingModal({ onClose, onCreated }: NewListingModalProps) {
  const [form, setForm] = useState<Partial<CreateListingRequest>>({ care_type: "ASSISTED_LIVING" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title?.trim()) { 
      setError("Title is required."); 
      return; 
    }
    setSaving(true);
    setError(null);
    try {
      const listing = await listingsApi.create(form as CreateListingRequest);
      onCreated(listing);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create listing.");
    } finally {
      setSaving(false);
    }
  };

  const f = (key: keyof CreateListingRequest) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Create New Listing</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Facility Title *</label>
              <input 
                required 
                value={form.title ?? ""} 
                onChange={f("title")} 
                placeholder="e.g. Sunrise Senior Living"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Care Type *</label>
              <select 
                value={form.care_type} 
                onChange={f("care_type")}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white"
              >
                {CARE_TYPES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Monthly Price ($)</label>
              <input 
                type="number" 
                value={form.price ?? ""} 
                onChange={f("price")} 
                placeholder="3500"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">City</label>
              <input 
                value={form.city ?? ""} 
                onChange={f("city")} 
                placeholder="Seattle"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">State</label>
              <input 
                value={form.state ?? ""} 
                onChange={f("state")} 
                placeholder="WA"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" 
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Address</label>
              <input 
                value={form.address ?? ""} 
                onChange={f("address")} 
                placeholder="123 Main St"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
              <input 
                value={form.phone ?? ""} 
                onChange={f("phone")} 
                placeholder="(425) 555-0100"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input 
                type="email" 
                value={form.email ?? ""} 
                onChange={f("email")} 
                placeholder="info@facility.com"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Capacity</label>
              <input 
                type="number" 
                value={form.capacity ?? ""} 
                onChange={f("capacity")} 
                placeholder="20"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">License Number</label>
              <input 
                value={form.license_number ?? ""} 
                onChange={f("license_number")} 
                placeholder="AL-0892341"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" 
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
              <textarea 
                value={form.description ?? ""} 
                onChange={f("description")} 
                rows={3} 
                placeholder="Describe your facility..."
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none resize-none" 
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 py-2.5 border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={saving}
              className="flex-1 py-2.5 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors disabled:opacity-60"
            >
              {saving ? "Creating…" : "Create Listing"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

