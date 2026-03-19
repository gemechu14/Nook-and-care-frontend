"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface FeaturePanelProps<C extends { id: string; name: string }, R extends { id: string }> {
  title: string;
  catalogItems: C[];
  activeRecords: R[];
  getItemId: (record: R) => string;
  getItemMetaLabel?: (record: R) => string | null;
  onAdd: (itemId: string) => Promise<void>;
  onAddBatch?: (itemIds: string[]) => Promise<void>;
  onAddBatchWithPrice?: (items: { itemId: string; price: number }[]) => Promise<void>;
  onRemove: (recordId: string) => Promise<void>;
  onRemoveBatch?: (itemIds: string[]) => Promise<void>;
  savingId: string | null;
  requirePriceOnAdd?: boolean;
}

export function FeaturePanel<C extends { id: string; name: string }, R extends { id: string }>({
  title,
  catalogItems,
  activeRecords,
  getItemId,
  getItemMetaLabel,
  onAdd,
  onAddBatch,
  onAddBatchWithPrice,
  onRemove,
  onRemoveBatch,
  savingId,
  requirePriceOnAdd = false,
}: FeaturePanelProps<C, R>) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [itemPrices, setItemPrices] = useState<Record<string, string>>({});
  const [validationError, setValidationError] = useState<string | null>(null);
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
    return {
      record,
      itemId,
      name: item?.name ?? itemId,
      metaLabel: getItemMetaLabel?.(record) ?? null,
    };
  });

  const allSelected =
    selectedItems.size === availableItems.length && availableItems.length > 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setSelectedItems(new Set());
        setItemPrices({});
        setValidationError(null);
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
      if (next.has(itemId)) {
        next.delete(itemId);
        setItemPrices((prevPrices) => {
          const copy = { ...prevPrices };
          delete copy[itemId];
          return copy;
        });
      } else {
        next.add(itemId);
      }
      return next;
    });
    if (validationError) setValidationError(null);
  };

  const handleSave = async () => {
    if (selectedItems.size === 0) {
      setShowDropdown(false);
      return;
    }

    setIsSaving(true);
    try {
      if (requirePriceOnAdd) {
        if (!onAddBatchWithPrice) {
          throw new Error("Price-based batch handler is required.");
        }

        const payload = Array.from(selectedItems).map((itemId) => {
          const parsed = Number(itemPrices[itemId]);
          return { itemId, price: parsed };
        });

        const hasInvalid = payload.some(
          (entry) => Number.isNaN(entry.price) || entry.price <= 0,
        );
        if (hasInvalid) {
          setValidationError("Please enter a valid price for each selected service.");
          setIsSaving(false);
          return;
        }

        await onAddBatchWithPrice(payload);
      } else if (onAddBatch) {
        await onAddBatch(Array.from(selectedItems));
      } else {
        for (const itemId of selectedItems) {
          await onAdd(itemId);
        }
      }
      setSelectedItems(new Set());
      setItemPrices({});
      setValidationError(null);
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
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
        <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-[11px] font-semibold text-teal-700">
          {activeItems.length} selected
        </span>
      </div>

      {activeItems.length > 0 ? (
        <div className="max-h-40 overflow-y-auto rounded-xl border border-slate-100 bg-slate-50/50 p-2">
          <div className="flex flex-wrap gap-1.5">
            {activeItems.map(({ record, itemId, name, metaLabel }) => {
              const isRemoving = savingId === itemId;
              return (
                <span
                  key={record.id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-sm"
                >
                  <span className="truncate max-w-[140px]">{name}</span>
                  {metaLabel ? (
                    <span className="shrink-0 rounded-full bg-teal-100 px-1.5 py-0.5 text-[10px] font-semibold text-teal-700">
                      {metaLabel}
                    </span>
                  ) : null}
                  <button
                    type="button"
                    onClick={async () => {
                      const targetItemId = getItemId(record);
                      if (onRemoveBatch) await onRemoveBatch([targetItemId]);
                      else await onRemove(record.id);
                    }}
                    disabled={isRemoving}
                    className="ml-0.5 shrink-0 rounded-full p-0.5 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700 disabled:opacity-50"
                    aria-label={`Remove ${name}`}
                  >
                    {isRemoving ? (
                      <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
                    ) : (
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-500">
          No {title.toLowerCase()} added yet.
        </p>
      )}

      {availableItems.length > 0 && (
        <div ref={dropdownRef} className="relative inline-block">
          <button
            type="button"
            onClick={() => {
              setShowDropdown(!showDropdown);
              if (showDropdown) {
                setSelectedItems(new Set());
                setItemPrices({});
                setValidationError(null);
              }
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700 transition-colors hover:bg-teal-100 hover:border-teal-300"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add {singularTitle}
          </button>

          {showDropdown && (
            <div className="absolute left-0 top-full z-50 mt-2 w-72 rounded-xl border border-slate-200 bg-white shadow-lg ring-1 ring-slate-900/5">
              <div className="p-2">
                <div className="mb-2 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                  <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      className="h-3.5 w-3.5 cursor-pointer rounded accent-teal-600"
                    />
                    <span>Select all</span>
                  </label>
                  <span className="rounded-full bg-slate-200/80 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                    {availableItems.length} available
                  </span>
                </div>

                <div className="mb-2 max-h-64 overflow-y-auto rounded-lg border border-slate-100">
                  {availableItems.map((item) => {
                    const selected = selectedItems.has(item.id);
                    return (
                      <div
                        key={item.id}
                        className={`border-b border-slate-50 px-3 py-2 last:border-b-0 ${selected ? "bg-teal-50/50" : "hover:bg-slate-50"}`}
                      >
                        <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-700">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => handleToggleSelection(item.id)}
                            className="h-3.5 w-3.5 rounded accent-teal-600"
                          />
                          <span className="flex-1 font-medium">{item.name}</span>
                        </label>
                        {requirePriceOnAdd && selected ? (
                          <div className="mt-2 pl-5">
                            <input
                              type="number"
                              min="0.01"
                              step="0.01"
                              value={itemPrices[item.id] ?? ""}
                              onChange={(event) =>
                                setItemPrices((prev) => ({
                                  ...prev,
                                  [item.id]: event.target.value,
                                }))
                              }
                              placeholder="Price ($)"
                              className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                            />
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
                {validationError ? (
                  <p className="mb-2 rounded-lg bg-red-50 px-2 py-1.5 text-xs text-red-600">{validationError}</p>
                ) : null}

                <div className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-2 py-2">
                  <span className="text-[11px] font-medium text-slate-500">
                    {selectedItems.size > 0 ? `${selectedItems.size} selected` : "Select items"}
                  </span>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={selectedItems.size === 0 || isSaving}
                    className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
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
