"use client";

import type { CatalogItem, CatalogKey, CatalogMeta } from "./_lib/types";
import { getItemDetailText } from "./_lib/catalogUtils";
import { PAGE_SIZES, type PageSize } from "./_lib/constants";

interface CatalogTableProps {
  rows: CatalogItem[];
  pageRows: CatalogItem[];
  meta: CatalogMeta;
  searchValue: string;
  onSearchChange: (value: string) => void;
  nameSortDir: "asc" | "desc";
  onSortToggle: () => void;
  pageSize: PageSize;
  onPageSizeChange: (size: PageSize) => void;
  tableSkip: number;
  onSkipChange: (skip: number) => void;
  rowActionsOpenId: string | null;
  onRowActionsToggle: (id: string | null) => void;
  onEdit: (item: CatalogItem) => void;
  onDelete: (item: CatalogItem) => void;
  onAddNew: () => void;
  onExportCsv: () => void;
  secondaryColLabel: string;
  addLabel: string;
}

export function CatalogTable({
  rows,
  pageRows,
  meta,
  searchValue,
  onSearchChange,
  nameSortDir,
  onSortToggle,
  pageSize,
  onPageSizeChange,
  tableSkip,
  onSkipChange,
  rowActionsOpenId,
  onRowActionsToggle,
  onEdit,
  onDelete,
  onAddNew,
  onExportCsv,
  secondaryColLabel,
  addLabel,
}: CatalogTableProps) {
  const hasPrev = tableSkip > 0;
  const hasNext = tableSkip + pageSize < rows.length;
  const start = tableSkip + 1;
  const end = Math.min(tableSkip + pageRows.length, rows.length);
  const total = rows.length;

  return (
    <>
      <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-6">
        <h3 className="text-base font-semibold text-slate-900">{meta.label}</h3>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
          <SearchInput
            value={searchValue}
            onChange={onSearchChange}
            label={`Search ${meta.label}`}
          />
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            <button
              type="button"
              onClick={onAddNew}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-teal-700 transition-colors hover:bg-teal-50"
            >
              <PlusIcon className="h-4 w-4" />
              Add New {addLabel}
            </button>
            <button
              type="button"
              onClick={onExportCsv}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
            >
              <ExportIcon className="h-4 w-4" />
              Export to CSV
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-4 py-3 text-left">
                <button
                  type="button"
                  onClick={onSortToggle}
                  className="inline-flex items-center gap-1 font-medium text-slate-600 hover:text-slate-900"
                >
                  Name
                  <span className="flex flex-col leading-none text-[10px] text-slate-400" aria-hidden>
                    <span>▲</span>
                    <span className="-mt-0.5">▼</span>
                  </span>
                </button>
              </th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">{secondaryColLabel}</th>
              <th className="hidden px-4 py-3 text-left font-medium text-slate-600 md:table-cell">
                Description
              </th>
              <th className="px-4 py-3 text-right font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-14 text-center text-slate-500">
                  {rows.length === 0
                    ? "No items match your search. Add one to get started."
                    : "No rows on this page."}
                </td>
              </tr>
            ) : (
              pageRows.map((it, idx) => (
                <TableRow
                  key={it.id}
                  item={it}
                  meta={meta}
                  index={idx}
                  isActionsOpen={rowActionsOpenId === it.id}
                  onActionsToggle={() => onRowActionsToggle(rowActionsOpenId === it.id ? null : it.id)}
                  onEdit={() => onEdit(it)}
                  onDelete={() => onDelete(it)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50/50 px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
          <label className="flex items-center gap-2">
            <span className="text-slate-500">Rows per page</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value) as PageSize)}
              className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/25"
            >
              {PAGE_SIZES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <span className="text-slate-500">
            {total === 0 ? "0–0 of 0" : `${start}–${end} of ${total}`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSkipChange(Math.max(0, tableSkip - pageSize))}
            disabled={!hasPrev}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Previous page"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onSkipChange(tableSkip + pageSize)}
            disabled={!hasNext}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Next page"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  );
}

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

function SearchInput({ value, onChange, label }: SearchInputProps) {
  return (
    <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search..."
        className="h-10 w-full rounded-full border border-slate-200 bg-slate-50/80 pl-10 pr-10 text-sm text-slate-800 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
        aria-label={label}
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-200/60 hover:text-slate-600"
          aria-label="Clear search"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}

interface TableRowProps {
  item: CatalogItem;
  meta: CatalogMeta;
  index: number;
  isActionsOpen: boolean;
  onActionsToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function TableRow({
  item,
  meta,
  index,
  isActionsOpen,
  onActionsToggle,
  onEdit,
  onDelete,
}: TableRowProps) {
  const name = "name" in item ? String(item.name) : "";
  const detailsText = getItemDetailText(item, meta.detailKind);
  const description = "description" in item && item.description ? String(item.description) : "";
  const zebra = index % 2 === 1 ? "bg-slate-50/80" : "bg-white";

  return (
    <tr className={`border-b border-slate-100 ${zebra}`}>
      <td className="px-4 py-3 font-medium text-slate-900">{name}</td>
      <td className="max-w-[200px] truncate px-4 py-3 text-slate-600">{detailsText ?? "-"}</td>
      <td className="hidden max-w-[280px] truncate px-4 py-3 text-slate-600 md:table-cell">
        {description || "-"}
      </td>
      <td className="relative px-4 py-3 text-right" data-catalog-row-actions>
        <button
          type="button"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onActionsToggle();
          }}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
          aria-label="Row actions"
          aria-expanded={isActionsOpen}
        >
          <DotsIcon className="h-5 w-5" />
        </button>
        {isActionsOpen ? (
          <div
            className="absolute right-3 top-full z-20 mt-1 w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
            role="menu"
          >
            <button
              type="button"
              role="menuitem"
              className="block w-full px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50"
              onClick={onEdit}
            >
              Edit
            </button>
            <button
              type="button"
              role="menuitem"
              className="block w-full px-3 py-2 text-left text-sm text-red-700 transition-colors hover:bg-red-50"
              onClick={onDelete}
            >
              Delete
            </button>
          </div>
        ) : null}
      </td>
    </tr>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
      />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function ExportIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
      />
    </svg>
  );
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

function DotsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 8a2 2 0 110-4 2 2 0 010 4zm0 2a2 2 0 100 4 2 2 0 000-4zm0 6a2 2 0 100 4 2 2 0 000-4z" />
    </svg>
  );
}
