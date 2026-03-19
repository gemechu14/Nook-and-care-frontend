"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { providersApi } from "@/features/providers/services";
import { Badge } from "@/components/admin/shared/Badge";
import type { ApiProvider } from "@/types";

export default function AdminProviderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [provider, setProvider] = useState<ApiProvider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await providersApi.getById(id);
        if (!mounted) return;
        setProvider(data);
      } catch (e) {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : "Failed to load provider details.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    if (id) void load();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-sm text-slate-600">{error ?? "Provider not found."}</p>
        <Link href="/admin?nav=providers" className="mt-4 inline-block text-sm font-medium text-teal-600 hover:text-teal-700">
          Back to providers
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/admin?nav=providers"
        className="inline-flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-700"
      >
        <span aria-hidden>←</span> Back to Provider Management
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">Provider Profile</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">{provider.business_name}</h1>
          <p className="mt-1 text-sm text-slate-500">Review business profile and verification details</p>
        </div>
        <Badge status={provider.verification_status} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Business Details</h2>
          <div className="mt-4 space-y-3 text-sm">
            <InfoRow label="Business Type" value={provider.business_type} />
            <InfoRow label="Address" value={provider.address || "—"} />
            <InfoRow label="City" value={provider.city || "—"} />
            <InfoRow label="Country" value={provider.country || "—"} />
            <InfoRow label="Tax ID" value={provider.tax_id || "—"} />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Verification Timeline</h2>
          <div className="mt-4 space-y-3 text-sm">
            <InfoRow label="Status" value={provider.verification_status} />
            <InfoRow label="Created" value={new Date(provider.created_at).toLocaleString()} />
            <InfoRow label="Last Updated" value={new Date(provider.updated_at).toLocaleString()} />
            <InfoRow label="Rejection Reason" value={provider.rejection_reason || "—"} />
            <InfoRow label="Provider ID" value={provider.id} mono />
            <InfoRow label="User ID" value={provider.user_id} mono />
          </div>
        </section>
      </div>
    </div>
  );
}

function InfoRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-2.5">
      <span className="text-slate-500">{label}</span>
      <span className={`text-right text-slate-800 ${mono ? "font-mono text-xs" : "font-medium"}`}>{value}</span>
    </div>
  );
}
