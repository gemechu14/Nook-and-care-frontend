"use client";

import type { FormEvent } from "react";
import type { CatalogKey, CatalogFormState } from "./_lib/types";
import {
  AMENITY_CATEGORIES,
  ACTIVITY_CATEGORIES,
  SAFETY_CATEGORIES,
  HOUSE_RULE_CATEGORIES,
} from "./_lib/constants";
import { singularAddLabel } from "./_lib/catalogUtils";

interface CatalogModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  catalogKey: CatalogKey;
  form: CatalogFormState;
  onFormChange: (form: CatalogFormState) => void;
  error: string | null;
  saving: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}

export function CatalogModal({
  isOpen,
  mode,
  catalogKey,
  form,
  onFormChange,
  error,
  saving,
  onSubmit,
  onClose,
}: CatalogModalProps) {
  if (!isOpen) return null;

  const label = singularAddLabel(catalogKey);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={saving ? undefined : onClose}
      role="dialog"
      aria-modal
      aria-labelledby="catalog-modal-title"
    >
      <div
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 pb-4 pt-6">
          <div>
            <h2 id="catalog-modal-title" className="text-lg font-bold text-slate-900">
              {mode === "create" ? "Create" : "Edit"} {label}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Changes apply platform-wide for new/edited listings.
            </p>
          </div>
          <button
            type="button"
            onClick={saving ? undefined : onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100"
            aria-label="Close"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 p-6">
          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            {catalogKey === "languages" ? (
              <>
                <FormField
                  label="Code *"
                  value={form.code}
                  onChange={(v) => onFormChange({ ...form, code: v })}
                  placeholder="en"
                />
                <FormField
                  label="Name *"
                  value={form.name}
                  onChange={(v) => onFormChange({ ...form, name: v })}
                  placeholder="English"
                />
              </>
            ) : (
              <div className="sm:col-span-2">
                <FormField
                  label="Name *"
                  value={form.name}
                  onChange={(v) => onFormChange({ ...form, name: v })}
                  placeholder="e.g. Wi-Fi"
                />
              </div>
            )}

            {catalogKey === "amenities" && (
              <>
                <SelectField
                  label="Category *"
                  value={form.category}
                  onChange={(v) => onFormChange({ ...form, category: v })}
                  options={AMENITY_CATEGORIES}
                />
                <FormField
                  label="Icon key"
                  value={form.icon}
                  onChange={(v) => onFormChange({ ...form, icon: v })}
                  placeholder="wifi"
                />
              </>
            )}

            {catalogKey === "activities" && (
              <>
                <SelectField
                  label="Category *"
                  value={form.category}
                  onChange={(v) => onFormChange({ ...form, category: v })}
                  options={ACTIVITY_CATEGORIES}
                />
                <TextareaField
                  label="Description"
                  value={form.description}
                  onChange={(v) => onFormChange({ ...form, description: v })}
                  rows={3}
                  className="sm:col-span-2"
                />
              </>
            )}

            {catalogKey === "safetyFeatures" && (
              <>
                <SelectField
                  label="Category *"
                  value={form.category}
                  onChange={(v) => onFormChange({ ...form, category: v })}
                  options={SAFETY_CATEGORIES}
                />
                <TextareaField
                  label="Description"
                  value={form.description}
                  onChange={(v) => onFormChange({ ...form, description: v })}
                  rows={3}
                  className="sm:col-span-2"
                />
              </>
            )}

            {catalogKey === "houseRules" && (
              <>
                <SelectField
                  label="Category *"
                  value={form.category}
                  onChange={(v) => onFormChange({ ...form, category: v })}
                  options={HOUSE_RULE_CATEGORIES}
                />
                <TextareaField
                  label="Description"
                  value={form.description}
                  onChange={(v) => onFormChange({ ...form, description: v })}
                  rows={3}
                  className="sm:col-span-2"
                />
              </>
            )}

            {catalogKey === "equipment" && (
              <>
                <FormField
                  label="Category *"
                  value={form.category}
                  onChange={(v) => onFormChange({ ...form, category: v })}
                  placeholder="MOBILITY"
                />
                <TextareaField
                  label="Description"
                  value={form.description}
                  onChange={(v) => onFormChange({ ...form, description: v })}
                  rows={3}
                  className="sm:col-span-2"
                />
              </>
            )}

            {["certifications", "diningOptions", "insuranceOptions", "treatmentServices"].includes(
              catalogKey
            ) && (
              <TextareaField
                label="Description"
                value={form.description}
                onChange={(v) => onFormChange({ ...form, description: v })}
                rows={4}
                className="sm:col-span-2"
              />
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={saving ? undefined : onClose}
              className="flex-1 rounded-xl border border-slate-300 py-2.5 font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-xl bg-teal-600 py-2.5 font-semibold text-white transition-colors hover:bg-teal-700 disabled:opacity-60"
            >
              {saving ? "Saving..." : mode === "create" ? "Create" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextareaField({
  label,
  value,
  onChange,
  rows,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows: number;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full resize-none rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
      />
    </div>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
