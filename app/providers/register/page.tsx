"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { providersApi } from "@/lib/api/providers";
import type { CreateProviderRequest } from "@/lib/api/providers";

export default function ProviderRegisterPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [form, setForm] = useState<CreateProviderRequest>({
    user_id: "", // Will be set from user.id
    business_name: "", business_type: "Senior Housing", tax_id: "",
    address: "", city: "", country: "USA",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
    if (!loading && user && user.role !== "PROVIDER") router.push("/");
    if (user) {
      setForm((prev) => ({ ...prev, user_id: user.id }));
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError(null);
    
    // Basic validation
    if (!form.business_name.trim()) {
      setError("Business name is required.");
      setSaving(false);
      return;
    }
    if (!form.address.trim()) {
      setError("Business address is required.");
      setSaving(false);
      return;
    }
    if (!form.city.trim()) {
      setError("City is required.");
      setSaving(false);
      return;
    }
    
    if (!user) {
      setError("You must be logged in to register as a provider.");
      setSaving(false);
      return;
    }
    
    try {
      console.log("📝 Submitting provider registration...");
      // Always use current user.id, don't rely on form state
      await providersApi.create({
        ...form,
        user_id: user.id,
      });
      console.log("✅ Provider registration successful");
      router.push("/providers/dashboard");
    } catch (err) {
      console.error("❌ Provider registration error:", err);
      let errorMessage = "Failed to register provider profile.";
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      } else if (err && typeof err === "object") {
        const errObj = err as any;
        // Handle FastAPI validation errors
        if (Array.isArray(errObj.detail)) {
          const validationErrors = errObj.detail.map((e: any) => 
            `${e.loc?.slice(1).join('.') || 'field'}: ${e.msg}`
          ).join('; ');
          errorMessage = `Validation error: ${validationErrors}`;
        } else {
          errorMessage = errObj.message || errObj.detail || errorMessage;
        }
      }
      
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const f = (key: keyof CreateProviderRequest) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [key]: e.target.value }));

  return (
    <div className="min-h-screen bg-slate-50 pt-16 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-50 mb-4">
            <svg className="w-7 h-7 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Register as Provider</h1>
          <p className="text-slate-500 text-sm mt-2">Complete your business profile to start listing facilities</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Business Name *</label>
              <input required value={form.business_name} onChange={f("business_name")} placeholder="Sunrise Senior Living LLC"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Business Type</label>
              <select value={form.business_type} onChange={f("business_type")}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none bg-white">
                {["Senior Housing", "Assisted Living", "Memory Care", "Independent Living", "Adult Family Home", "Skilled Nursing", "Other"].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Business Address *</label>
              <input required value={form.address} onChange={f("address")} placeholder="123 Business Ave"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">City *</label>
                <input required value={form.city} onChange={f("city")} placeholder="Seattle"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Country</label>
                <input value={form.country} onChange={f("country")} placeholder="USA"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Tax ID <span className="text-slate-400">(optional)</span></label>
              <input value={form.tax_id ?? ""} onChange={f("tax_id")} placeholder="12-3456789"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
              <p className="font-semibold mb-1">After submitting:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>Your application will be reviewed by our admin team</li>
                <li>Verification typically takes 1–2 business days</li>
                <li>Once verified, you can create and publish listings</li>
              </ul>
            </div>

            <button type="submit" disabled={saving}
              className="w-full bg-teal-600 text-white py-3 rounded-xl font-semibold hover:bg-teal-700 transition-colors disabled:opacity-60">
              {saving ? "Submitting…" : "Submit Application"}
            </button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-4">
            <Link href="/providers/dashboard" className="text-teal-600 hover:text-teal-700 font-medium transition-colors">← Back to dashboard</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

