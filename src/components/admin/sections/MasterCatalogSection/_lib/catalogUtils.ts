import type { CatalogKey, CatalogItem, CatalogMeta, CatalogFormState } from "./types";
import { CATALOG_DEFAULT_CATEGORY, SINGULAR_LABELS } from "./constants";

export function getDefaultForm(key: CatalogKey): CatalogFormState {
  const category = CATALOG_DEFAULT_CATEGORY[key] ?? "";
  return {
    name: "",
    category,
    code: "",
    icon: "",
    description: "",
  };
}

export function formFromItem(key: CatalogKey, item: CatalogItem): CatalogFormState {
  const base = getDefaultForm(key);
  return {
    ...base,
    name: "name" in item ? String(item.name ?? "") : "",
    category: "category" in item && item.category ? String(item.category) : base.category,
    code: "code" in item && item.code ? String(item.code) : "",
    icon: "icon" in item && item.icon ? String(item.icon) : "",
    description: "description" in item && item.description ? String(item.description) : "",
  };
}

export function getItemDetailText(
  item: CatalogItem,
  detailKind: CatalogMeta["detailKind"]
): string | null {
  if (detailKind === "none") return null;
  if (detailKind === "category" && "category" in item)
    return item.category ? String(item.category) : null;
  if (detailKind === "code" && "code" in item) return item.code ? String(item.code) : null;
  if (detailKind === "issuingOrDescription" && "description" in item && item.description)
    return String(item.description);
  return null;
}

export function filterCatalogItems(
  items: CatalogItem[],
  meta: CatalogMeta,
  query: string
): CatalogItem[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return items;
  return items.filter((it) => {
    const nameText = "name" in it ? String(it.name) : "";
    const detail = getItemDetailText(it, meta.detailKind) ?? "";
    const descText = "description" in it && it.description ? String(it.description) : "";
    return `${nameText} ${detail} ${descText}`.toLowerCase().includes(trimmed);
  });
}

export function getSecondaryColumnLabel(meta: CatalogMeta): string {
  const labels: Record<CatalogMeta["detailKind"], string> = {
    none: "Details",
    category: "Category",
    code: "Code",
    issuingOrDescription: "Summary",
  };
  return labels[meta.detailKind];
}

export function escapeCsvField(value: string): string {
  return `"${String(value).replace(/"/g, '""')}"`;
}

export function singularAddLabel(key: CatalogKey): string {
  return SINGULAR_LABELS[key] ?? "Item";
}
