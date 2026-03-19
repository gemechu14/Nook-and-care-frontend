"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface FeaturePanelProps<C extends { id: string; name: string }, R extends { id: string }> {
  title: string;
  catalogItems: C[];
  activeRecords: R[];
  getItemId: (record: R) => string;
  onAdd: (itemId: string) => Promise<void>;
  onAddBatch?: (itemIds: string[]) => Promise<void>;
  onRemove: (recordId: string) => Promise<void>;
  onRemoveBatch?: (itemIds: string[]) => Promise<void>;
  savingId: string | null;
}

export function FeaturePanel<C extends { id: string; name: string }, R extends { id: string }>({
  title,
  catalogItems,
  activeRecords,
  getItemId,
  onAdd,
  onAddBatch,
  onRemove,
  onRemoveBatch,
  savingId,
}: FeaturePanelProps<C, R>) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const singularTitle = useMemo(() => {
    if (title === "Amenities") return "Amenity";
    if (title === "Activities") return "Activity";
    if (title === "Languages") return "Language";
    if (title === "Certifications") return "Certification";
    if (title === "Dining Options") return "Dining Option";
    if (title === "Safety Features") return "Safety Feature";
    if (title === "Insurance Options") return "Insurance Option";
    if (title === "House Rules") return "House Rule";
    if (title === "Treatment Services") return "Service";
    return title;
  }, [title]);

  const activeItemIds = new Set(activeRecords.map(getItemId));
  const availableItems = catalogItems.filter((item) => !activeItemIds.has(item.id));
  const activeItems = activeRecords.map((record) => {
    const itemId = getItemId(record);
    const item = catalogItems.find((catalogItem) => catalogItem.id === itemId);
    return { record, itemId, name: item?.name ?? itemId };
  });

  const allSelected =
    selectedItems.size === availableItems.length && availableItems.length > 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setSelectedItems(new Set());
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedItems(new Set());
      return;
    }
    setSelectedItems(new Set(availableItems.map((item) => item.id)));
  };

  const handleToggleSelection = (itemId: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  };

  const handleSave = async () => {
    if (selectedItems.size === 0) {
      setShowDropdown(false);
      return;
    }

    setIsSaving(true);
    try {
      if (onAddBatch) {
        await onAddBatch(Array.from(selectedItems));
      } else {
        for (const itemId of selectedItems) {
          await onAdd(itemId);
        }
      }
      setSelectedItems(new Set());
      setShowDropdown(false);
    } catch (error) {
      console.error("Failed to add items:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (catalogItems.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-xs text-slate-400">
        No {title.toLowerCase()} in catalog yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        <span className="text-xs text-slate-500">{activeItems.length} selected</span>
      </div>

      {activeItems.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {activeItems.map(({ record, itemId, name }) => {
            const isRemoving = savingId === itemId;
            return (
              <div
                key={record.id}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700"
              >
                <span>{name}</span>
                <button
                  type="button"
                  onClick={async () => {
                    const targetItemId = getItemId(record);
                    if (onRemoveBatch) await onRemoveBatch([targetItemId]);
                    else await onRemove(record.id);
                  }}
                  disabled={isRemoving}
                  className="text-slate-400 transition-colors hover:text-slate-600 disabled:opacity-50"
                >
                  {isRemoving ? (
                    <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
                  ) : (
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-slate-500">No {title.toLowerCase()} added yet.</p>
      )}

      {availableItems.length > 0 && (
        <div ref={dropdownRef} className="relative inline-block">
          <button
            type="button"
            onClick={() => {
              setShowDropdown(!showDropdown);
              if (showDropdown) setSelectedItems(new Set());
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add {singularTitle}
          </button>

          {showDropdown && (
            <div className="absolute left-0 top-full z-50 mt-2 w-72 rounded-lg border border-slate-200 bg-white shadow-xl">
              <div className="p-2">
                <div className="mb-1 flex items-center justify-between border-b border-slate-100 px-3 py-2">
                  <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-700">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 cursor-pointer rounded accent-teal-600"
                    />
                    <span>Select all</span>
                  </label>
                  <span className="text-[11px] text-slate-400">{availableItems.length} available</span>
                </div>

                <div className="mb-2 max-h-72 overflow-y-auto pr-1">
                  {availableItems.map((item) => {
                    const selected = selectedItems.has(item.id);
                    return (
                      <label
                        key={item.id}
                        className="flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => handleToggleSelection(item.id)}
                          className="h-4 w-4 rounded accent-teal-600"
                        />
                        <span className="flex-1">{item.name}</span>
                      </label>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between gap-2 border-t border-slate-200 pt-2">
                  <span className="text-xs text-slate-500">
                    {selectedItems.size > 0 ? `${selectedItems.size} selected` : "Select items"}
                  </span>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={selectedItems.size === 0 || isSaving}
                    className="rounded-lg bg-teal-600 px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
