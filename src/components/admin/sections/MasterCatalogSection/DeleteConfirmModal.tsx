"use client";

import type { CatalogItem } from "./_lib/types";

interface DeleteConfirmModalProps {
  item: CatalogItem | null;
  deleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmModal({
  item,
  deleting,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  if (!item) return null;

  const itemName = "name" in item ? String(item.name) : "this item";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={deleting ? undefined : onCancel}
      role="dialog"
      aria-modal
      aria-labelledby="delete-modal-title"
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-slate-100 px-6 pb-4 pt-6">
          <h2 id="delete-modal-title" className="text-lg font-bold text-slate-900">
            Delete catalog item?
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            This will remove{" "}
            <span className="font-semibold text-slate-900">{itemName}</span> from the master catalog.
            Existing listings may still reference historical selections depending on backend rules.
          </p>
        </div>
        <div className="flex gap-3 p-6">
          <button
            type="button"
            onClick={deleting ? undefined : onCancel}
            className="flex-1 rounded-xl border border-slate-300 py-2.5 font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 rounded-xl bg-red-600 py-2.5 font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
