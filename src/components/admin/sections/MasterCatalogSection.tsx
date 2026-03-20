"use client";

import type { FormEvent, ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { catalogApi } from "@/services/catalogService";
import { Loader } from "../shared/Loader";

import type {
  Amenity,
  Activity,
  Certification,
  DiningOption,
  Equipment,
  HouseRule,
  InsuranceOption,
  Language,
  SafetyFeature,
  TreatmentService,
} from "@/types";

type CatalogKey =
  | "amenities"
  | "activities"
  | "languages"
  | "certifications"
  | "diningOptions"
  | "safetyFeatures"
  | "insuranceOptions"
  | "houseRules"
  | "equipment"
  | "treatmentServices";

type CatalogItem =
  | Amenity
  | Activity
  | Language
  | Certification
  | DiningOption
  | SafetyFeature
  | InsuranceOption
  | HouseRule
  | Equipment
  | TreatmentService;

type CatalogMeta = {
  key: CatalogKey;
  label: string;
  helperText: string;
  icon: ReactNode;
  detailKind: "category" | "code" | "issuingOrDescription" | "none";
};

const ITEM_ROWS_PAGE_SIZES: Array<10 | 20 | 50 | 100> = [10, 20, 50, 100];

type CatalogFormState = {
  name: string;
  category: string;
  code: string;
  icon: string;
  description: string;
};

const AMENITY_CATEGORIES = ["BASIC", "PREMIUM", "SAFETY", "ACCESSIBILITY"] as const;
const ACTIVITY_CATEGORIES = ["RECREATIONAL", "SOCIAL", "FITNESS", "EDUCATIONAL"] as const;
const SAFETY_CATEGORIES = ["EMERGENCY", "FIRE", "ACCESSIBILITY", "MEDICAL"] as const;
const HOUSE_RULE_CATEGORIES = ["GENERAL", "VISITOR", "PET", "SMOKING", "QUIET_HOURS"] as const;

function getDefaultForm(key: CatalogKey): CatalogFormState {
  switch (key) {
    case "amenities":
      return { name: "", category: "BASIC", code: "", icon: "", description: "" };
    case "activities":
      return { name: "", category: "RECREATIONAL", code: "", icon: "", description: "" };
    case "languages":
      return { name: "", category: "", code: "", icon: "", description: "" };
    case "certifications":
      return { name: "", category: "", code: "", icon: "", description: "" };
    case "diningOptions":
      return { name: "", category: "", code: "", icon: "", description: "" };
    case "safetyFeatures":
      return { name: "", category: "EMERGENCY", code: "", icon: "", description: "" };
    case "insuranceOptions":
      return { name: "", category: "", code: "", icon: "", description: "" };
    case "houseRules":
      return { name: "", category: "GENERAL", code: "", icon: "", description: "" };
    case "equipment":
      return { name: "", category: "MOBILITY", code: "", icon: "", description: "" };
    case "treatmentServices":
      return { name: "", category: "", code: "", icon: "", description: "" };
    default: {
      return { name: "", category: "", code: "", icon: "", description: "" };
    }
  }
}

function formFromItem(key: CatalogKey, item: CatalogItem): CatalogFormState {
  const base = getDefaultForm(key);
  return {
    ...base,
    name: "name" in item ? String(item.name ?? "") : "",
    category:
      "category" in item && item.category
        ? String(item.category)
        : base.category,
    code: "code" in item && item.code ? String(item.code) : "",
    icon: "icon" in item && item.icon ? String(item.icon) : "",
    description: "description" in item && item.description ? String(item.description) : "",
  };
}

function getItemDetailText(item: CatalogItem, detailKind: CatalogMeta["detailKind"]): string | null {
  if (detailKind === "none") return null;

  if (detailKind === "category") {
    if ("category" in item) return item.category ? String(item.category) : null;
    return null;
  }

  if (detailKind === "code") {
    if ("code" in item) return item.code ? String(item.code) : null;
    return null;
  }

  if (detailKind === "issuingOrDescription") {
    if ("description" in item && item.description) return String(item.description);
    return null;
  }

  return null;
}

async function listCatalogItems(key: CatalogKey, skip: number, limit: number): Promise<CatalogItem[]> {
  switch (key) {
    case "amenities": {
      const res = await catalogApi.amenities.list({ skip, limit });
      return res;
    }
    case "activities": {
      const res = await catalogApi.activities.list({ skip, limit });
      return res;
    }
    case "languages": {
      const res = await catalogApi.languages.list({ skip, limit });
      return res;
    }
    case "certifications": {
      const res = await catalogApi.certifications.list({ skip, limit });
      return res;
    }
    case "diningOptions": {
      const res = await catalogApi.diningOptions.list({ skip, limit });
      return res;
    }
    case "safetyFeatures": {
      const res = await catalogApi.safetyFeatures.list({ skip, limit });
      return res;
    }
    case "insuranceOptions": {
      const res = await catalogApi.insuranceOptions.list({ skip, limit });
      return res;
    }
    case "houseRules": {
      const res = await catalogApi.houseRules.list({ skip, limit });
      return res;
    }
    case "equipment": {
      const res = await catalogApi.equipment.list({ skip, limit });
      return res;
    }
    case "treatmentServices": {
      const res = await catalogApi.treatmentServices.list({ skip, limit });
      return res;
    }
    default: {
      // Exhaustive check
      return [];
    }
  }
}

async function createCatalogItem(key: CatalogKey, form: CatalogFormState): Promise<CatalogItem> {
  switch (key) {
    case "amenities":
      return catalogApi.amenities.create({
        name: form.name.trim(),
        category: form.category.trim(),
        icon: form.icon.trim() ? form.icon.trim() : null,
      });
    case "activities":
      return catalogApi.activities.create({
        name: form.name.trim(),
        category: form.category.trim(),
        description: form.description.trim() ? form.description.trim() : null,
      });
    case "languages":
      return catalogApi.languages.create({
        code: form.code.trim(),
        name: form.name.trim(),
      });
    case "certifications":
      return catalogApi.certifications.create({
        name: form.name.trim(),
        description: form.description.trim() ? form.description.trim() : null,
      });
    case "diningOptions":
      return catalogApi.diningOptions.create({
        name: form.name.trim(),
        description: form.description.trim() ? form.description.trim() : null,
      });
    case "safetyFeatures":
      return catalogApi.safetyFeatures.create({
        name: form.name.trim(),
        category: form.category.trim(),
        description: form.description.trim() ? form.description.trim() : null,
      });
    case "insuranceOptions":
      return catalogApi.insuranceOptions.create({
        name: form.name.trim(),
        description: form.description.trim() ? form.description.trim() : null,
      });
    case "houseRules":
      return catalogApi.houseRules.create({
        name: form.name.trim(),
        description: form.description.trim() ? form.description.trim() : null,
        category: form.category.trim(),
      });
    case "equipment":
      return catalogApi.equipment.create({
        name: form.name.trim(),
        category: form.category.trim(),
        description: form.description.trim() ? form.description.trim() : null,
      });
    case "treatmentServices":
      return catalogApi.treatmentServices.create({
        name: form.name.trim(),
        description: form.description.trim() ? form.description.trim() : null,
      });
    default: {
      throw new Error("Unsupported catalog type.");
    }
  }
}

async function updateCatalogItem(key: CatalogKey, id: string, form: CatalogFormState): Promise<CatalogItem> {
  switch (key) {
    case "amenities":
      return catalogApi.amenities.update(id, {
        name: form.name.trim(),
        category: form.category.trim(),
        icon: form.icon.trim() ? form.icon.trim() : null,
      });
    case "activities":
      return catalogApi.activities.update(id, {
        name: form.name.trim(),
        category: form.category.trim(),
        description: form.description.trim() ? form.description.trim() : null,
      });
    case "languages":
      return catalogApi.languages.update(id, {
        code: form.code.trim(),
        name: form.name.trim(),
      });
    case "certifications":
      return catalogApi.certifications.update(id, {
        name: form.name.trim(),
        description: form.description.trim() ? form.description.trim() : null,
      });
    case "diningOptions":
      return catalogApi.diningOptions.update(id, {
        name: form.name.trim(),
        description: form.description.trim() ? form.description.trim() : null,
      });
    case "safetyFeatures":
      return catalogApi.safetyFeatures.update(id, {
        name: form.name.trim(),
        category: form.category.trim(),
        description: form.description.trim() ? form.description.trim() : null,
      });
    case "insuranceOptions":
      return catalogApi.insuranceOptions.update(id, {
        name: form.name.trim(),
        description: form.description.trim() ? form.description.trim() : null,
      });
    case "houseRules":
      return catalogApi.houseRules.update(id, {
        name: form.name.trim(),
        description: form.description.trim() ? form.description.trim() : null,
        category: form.category.trim(),
      });
    case "equipment":
      return catalogApi.equipment.update(id, {
        name: form.name.trim(),
        category: form.category.trim(),
        description: form.description.trim() ? form.description.trim() : null,
      });
    case "treatmentServices":
      return catalogApi.treatmentServices.update(id, {
        name: form.name.trim(),
        description: form.description.trim() ? form.description.trim() : null,
      });
    default: {
      throw new Error("Unsupported catalog type.");
    }
  }
}

async function deleteCatalogItem(key: CatalogKey, id: string): Promise<void> {
  switch (key) {
    case "amenities":
      await catalogApi.amenities.delete(id);
      return;
    case "activities":
      await catalogApi.activities.delete(id);
      return;
    case "languages":
      await catalogApi.languages.delete(id);
      return;
    case "certifications":
      await catalogApi.certifications.delete(id);
      return;
    case "diningOptions":
      await catalogApi.diningOptions.delete(id);
      return;
    case "safetyFeatures":
      await catalogApi.safetyFeatures.delete(id);
      return;
    case "insuranceOptions":
      await catalogApi.insuranceOptions.delete(id);
      return;
    case "houseRules":
      await catalogApi.houseRules.delete(id);
      return;
    case "equipment":
      await catalogApi.equipment.delete(id);
      return;
    case "treatmentServices":
      await catalogApi.treatmentServices.delete(id);
      return;
    default: {
      throw new Error("Unsupported catalog type.");
    }
  }
}

const ALL_CATALOG_KEYS: CatalogKey[] = [
  "amenities",
  "activities",
  "languages",
  "certifications",
  "diningOptions",
  "safetyFeatures",
  "insuranceOptions",
  "houseRules",
  "equipment",
  "treatmentServices",
];

type TopTabId = "lifestyle" | "safety" | "trustPolicies" | "careEquipment";

const TOP_TABS: Array<{
  id: TopTabId;
  title: string;
  keys: readonly CatalogKey[];
}> = [
  {
    id: "lifestyle",
    title: "Lifestyle & Daily Living",
    keys: ["amenities", "activities", "languages", "diningOptions"],
  },
  {
    id: "safety",
    title: "Safety",
    keys: ["safetyFeatures"],
  },
  {
    id: "trustPolicies",
    title: "Trust and Policies",
    keys: ["certifications", "insuranceOptions", "houseRules"],
  },
  {
    id: "careEquipment",
    title: "Care & Equipment",
    keys: ["equipment", "treatmentServices"],
  },
];

function singularAddLabel(key: CatalogKey): string {
  switch (key) {
    case "amenities":
      return "Amenity";
    case "activities":
      return "Activity";
    case "languages":
      return "Language";
    case "certifications":
      return "Certification";
    case "diningOptions":
      return "Dining Option";
    case "safetyFeatures":
      return "Safety Feature";
    case "insuranceOptions":
      return "Insurance Option";
    case "houseRules":
      return "House Rule";
    case "equipment":
      return "Equipment Item";
    case "treatmentServices":
      return "Treatment Service";
    default: {
      return "Item";
    }
  }
}

function filterCatalogItems(items: CatalogItem[], meta: CatalogMeta, q: string): CatalogItem[] {
  const trimmed = q.trim().toLowerCase();
  if (!trimmed) return items;
  return items.filter((it) => {
    const nameText = "name" in it ? String(it.name) : "";
    const detail = getItemDetailText(it, meta.detailKind) ?? "";
    const descriptionText =
      "description" in it && it.description ? String(it.description) : "";
    return `${nameText} ${detail} ${descriptionText}`.toLowerCase().includes(trimmed);
  });
}

function getSecondaryColumnLabel(meta: CatalogMeta): string {
  if (meta.detailKind === "none") return "Details";
  if (meta.detailKind === "category") return "Category";
  if (meta.detailKind === "code") return "Code";
  return "Summary";
}

function escapeCsvField(value: string): string {
  const v = value.replace(/"/g, '""');
  return `"${v}"`;
}

const emptyCatalogData = (): Record<CatalogKey, CatalogItem[]> => ({
  amenities: [],
  activities: [],
  languages: [],
  certifications: [],
  diningOptions: [],
  safetyFeatures: [],
  insuranceOptions: [],
  houseRules: [],
  equipment: [],
  treatmentServices: [],
});

export function MasterCatalogSection() {
  const CATALOGS: CatalogMeta[] = useMemo(
    () => [
      {
        key: "amenities",
        label: "Amenities",
        helperText: "Features used by listings",
        detailKind: "category",
        icon: (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 21V8a2 2 0 00-2-2h-3" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 21V8a2 2 0 012-2h3" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 6l3-3 3 3" />
          </svg>
        ),
      },
      {
        key: "activities",
        label: "Activities",
        helperText: "Programs and activities catalog",
        detailKind: "category",
        icon: (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 19.5A2.5 2.5 0 016.5 17H20" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 10h5" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 14h3" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 4h6v6" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 4l-6 6" />
          </svg>
        ),
      },
      {
        key: "languages",
        label: "Languages",
        helperText: "Supported languages for listings",
        detailKind: "code",
        icon: (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5h16M7 9h10M7 13h10M7 17h6" />
          </svg>
        ),
      },
      {
        key: "certifications",
        label: "Certifications",
        helperText: "Licenses and certifications catalog",
        detailKind: "issuingOrDescription",
        icon: (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4z" />
          </svg>
        ),
      },
      {
        key: "diningOptions",
        label: "Dining Options",
        helperText: "Dining and meal options",
        detailKind: "issuingOrDescription",
        icon: (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12v7M12 5v14M18 5v7" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 5h12" />
          </svg>
        ),
      },
      {
        key: "safetyFeatures",
        label: "Safety Features",
        helperText: "Emergency and safety catalog",
        detailKind: "category",
        icon: (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11V7" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.5 18H9.5" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.5 21h7L20 4l-8 2-8-2 3.5 17z" />
          </svg>
        ),
      },
      {
        key: "insuranceOptions",
        label: "Insurance Options",
        helperText: "Coverage and payment options",
        detailKind: "issuingOrDescription",
        icon: (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2.21 0-4 1.79-4 4v4h8v-4c0-2.21-1.79-4-4-4z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16h8" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 4h6l-1 4H10L9 4z" />
          </svg>
        ),
      },
      {
        key: "houseRules",
        label: "House Rules",
        helperText: "Policy rules and guidelines",
        detailKind: "category",
        icon: (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11l3 3L22 4" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
          </svg>
        ),
      },
      {
        key: "equipment",
        label: "Equipment",
        helperText: "Available equipment catalog",
        detailKind: "category",
        icon: (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8V4m0 4h4M12 8H8" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 16V8a2 2 0 00-2-2h-6" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16V8a2 2 0 012-2h6" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16h10v4H7v-4z" />
          </svg>
        ),
      },
      {
        key: "treatmentServices",
        label: "Treatment Services",
        helperText: "Care and treatment services catalog",
        detailKind: "issuingOrDescription",
        icon: (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 10h4v4h-4z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v6" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16v6" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 12h6" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12h6" />
          </svg>
        ),
      },
    ],
    []
  );

  const metaByKey = useMemo(() => {
    const rec = {} as Record<CatalogKey, CatalogMeta>;
    for (const c of CATALOGS) rec[c.key] = c;
    return rec;
  }, [CATALOGS]);

  const [activeTopTab, setActiveTopTab] = useState<TopTabId>("lifestyle");
  const [selectedCatalogKey, setSelectedCatalogKey] = useState<CatalogKey>("amenities");
  const [tableSearch, setTableSearch] = useState("");
  const [catalogData, setCatalogData] = useState<Record<CatalogKey, CatalogItem[]>>(() => emptyCatalogData());
  const [loadingAll, setLoadingAll] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [tableSkip, setTableSkip] = useState(0);
  const [pageSize, setPageSize] = useState<10 | 20 | 50 | 100>(10);
  const [nameSortDir, setNameSortDir] = useState<"asc" | "desc">("asc");
  const [rowActionsOpenId, setRowActionsOpenId] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState<CatalogKey>("amenities");
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CatalogFormState>(() => getDefaultForm("amenities"));
  const [modalError, setModalError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteContext, setDeleteContext] = useState<{ key: CatalogKey; item: CatalogItem } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadAllCatalogs = useCallback(async () => {
    setLoadingAll(true);
    setLoadError(null);
    try {
      const pairs = await Promise.all(
        ALL_CATALOG_KEYS.map(async (k) => [k, await listCatalogItems(k, 0, 200)] as const),
      );
      setCatalogData((prev) => {
        const next = { ...prev };
        for (const [k, rows] of pairs) next[k] = rows;
        return next;
      });
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Failed to load catalogs.");
    } finally {
      setLoadingAll(false);
    }
  }, []);

  useEffect(() => {
    void loadAllCatalogs();
  }, [loadAllCatalogs]);

  const refreshKey = useCallback(async (key: CatalogKey) => {
    try {
      const rows = await listCatalogItems(key, 0, 200);
      setCatalogData((p) => ({ ...p, [key]: rows }));
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Failed to refresh catalog.");
    }
  }, []);

  const currentTopTab = useMemo(() => TOP_TABS.find((t) => t.id === activeTopTab)!, [activeTopTab]);

  const selectedMeta = metaByKey[selectedCatalogKey];

  const detailFilteredRows = useMemo(() => {
    const raw = filterCatalogItems(catalogData[selectedCatalogKey] ?? [], selectedMeta, tableSearch);
    return [...raw].sort((a, b) => {
      const an = "name" in a ? String(a.name) : "";
      const bn = "name" in b ? String(b.name) : "";
      return nameSortDir === "asc" ? an.localeCompare(bn) : bn.localeCompare(an);
    });
  }, [catalogData, selectedCatalogKey, selectedMeta, tableSearch, nameSortDir]);

  const detailPageRows = useMemo(
    () => detailFilteredRows.slice(tableSkip, tableSkip + pageSize),
    [detailFilteredRows, tableSkip, pageSize],
  );

  const detailHasPrev = tableSkip > 0;
  const detailHasNext = tableSkip + pageSize < detailFilteredRows.length;

  const openCreateFor = (key: CatalogKey) => {
    setModalKey(key);
    setModalMode("create");
    setEditingId(null);
    setModalError(null);
    setForm(getDefaultForm(key));
    setModalOpen(true);
  };

  const openEditFor = (key: CatalogKey, item: CatalogItem) => {
    setModalKey(key);
    setModalMode("edit");
    setEditingId(item.id);
    setModalError(null);
    setForm(formFromItem(key, item));
    setModalOpen(true);
  };

  const exportCurrentToCsv = useCallback(() => {
    const secLabel = getSecondaryColumnLabel(selectedMeta);
    const header = ["Name", secLabel, "Description", "Id"].map(escapeCsvField).join(",");
    const lines = detailFilteredRows.map((it) => {
      const name = "name" in it ? String(it.name) : "";
      const detail = getItemDetailText(it, selectedMeta.detailKind) ?? "";
      const desc = "description" in it && it.description ? String(it.description) : "";
      return [name, detail, desc, it.id].map((c) => escapeCsvField(c)).join(",");
    });
    const csv = [header, ...lines].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedCatalogKey}-catalog.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [detailFilteredRows, selectedCatalogKey, selectedMeta]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest?.("[data-catalog-row-actions]")) setRowActionsOpenId(null);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  useEffect(() => {
    setRowActionsOpenId(null);
  }, [selectedCatalogKey, activeTopTab]);

  const submitModal = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setModalError(null);
    try {
      if (!form.name.trim()) {
        setModalError("Name is required.");
        return;
      }
      if (modalKey === "languages") {
        if (!form.code.trim()) {
          setModalError("Language code is required.");
          return;
        }
      }

      setSaving(true);
      if (modalMode === "create") {
        await createCatalogItem(modalKey, form);
      } else {
        if (!editingId) throw new Error("Missing item id.");
        await updateCatalogItem(modalKey, editingId, form);
      }

      setModalOpen(false);
      await refreshKey(modalKey);
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "Failed to save catalog item.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteContext) return;
    const { key, item } = deleteContext;
    setDeleting(true);
    try {
      await deleteCatalogItem(key, item.id);
      setDeleteContext(null);
      await refreshKey(key);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to delete catalog item.");
    } finally {
      setDeleting(false);
    }
  };

  const secondaryColLabel = getSecondaryColumnLabel(selectedMeta);

  return (
    <div className="space-y-4">
      {loadError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{loadError}</div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-white px-2">
          <nav className="flex flex-wrap gap-1" aria-label="Catalog areas">
            {TOP_TABS.map((tab) => {
              const tabActive = tab.id === activeTopTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTopTab(tab.id);
                    setSelectedCatalogKey(tab.keys[0]);
                    setTableSearch("");
                    setTableSkip(0);
                  }}
                  className={[
                    "relative px-4 py-3 text-sm font-semibold transition-colors",
                    tabActive ? "text-teal-700" : "text-slate-600 hover:text-slate-900",
                  ].join(" ")}
                >
                  {tab.title}
                  {tabActive ? (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-teal-600" aria-hidden />
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex min-h-[420px] flex-col md:flex-row">
          <aside className="shrink-0 border-b border-slate-200 bg-slate-50 md:w-56 md:border-b-0 md:border-r">
            <p className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Sub-categories</p>
            <nav className="flex flex-row gap-1 overflow-x-auto px-2 pb-3 md:flex-col md:overflow-visible md:px-2 md:pb-4">
              {currentTopTab.keys.map((key) => {
                const meta = metaByKey[key];
                const sideActive = key === selectedCatalogKey;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setSelectedCatalogKey(key);
                      setTableSearch("");
                      setTableSkip(0);
                    }}
                    className={[
                      "flex min-w-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors",
                      sideActive
                        ? "bg-teal-600 text-white shadow-sm"
                        : "text-slate-700 hover:bg-white hover:shadow-sm",
                    ].join(" ")}
                  >
                    <span className={sideActive ? "text-white" : "text-slate-500"}>{meta.icon}</span>
                    <span className="truncate">{meta.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          <div className="min-w-0 flex-1 bg-white">
            <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
              <h2 className="text-lg font-bold text-slate-900">Master Catalog</h2>
              <p className="mt-1 text-sm text-slate-500">
                Manage reference data for <span className="font-semibold text-slate-800">{selectedMeta.label}</span>
              </p>
            </div>

            {loadingAll ? (
              <div className="px-5 py-12 sm:px-6">
                <Loader />
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-6">
                  <h3 className="text-base font-semibold text-slate-900">{selectedMeta.label}</h3>
                  <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                    <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
                      <svg
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                        />
                      </svg>
                      <input
                        value={tableSearch}
                        onChange={(e) => {
                          setTableSearch(e.target.value);
                          setTableSkip(0);
                        }}
                        placeholder="Search..."
                        className="h-10 w-full rounded-full border border-slate-200 bg-slate-50/80 pl-10 pr-10 text-sm text-slate-800 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                        aria-label={`Search ${selectedMeta.label}`}
                      />
                      {tableSearch ? (
                        <button
                          type="button"
                          onClick={() => {
                            setTableSearch("");
                            setTableSkip(0);
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-600"
                          aria-label="Clear search"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                      <button
                        type="button"
                        onClick={() => openCreateFor(selectedCatalogKey)}
                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-teal-700 transition-colors hover:bg-teal-50"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add New {singularAddLabel(selectedCatalogKey)}
                      </button>
                      <button
                        type="button"
                        onClick={exportCurrentToCsv}
                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                          />
                        </svg>
                        Export to CSV
                      </button>
                      <div className="ml-auto hidden items-center gap-0.5 sm:ml-0 sm:flex" aria-hidden>
                        <span
                          className="rounded-lg p-2 text-slate-400"
                          title="Filter"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 4h18M7 12h10M10 20h4"
                            />
                          </svg>
                        </span>
                        <span className="rounded-lg p-2 text-slate-400" title="Columns">
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 6h16M4 12h16M4 18h7"
                            />
                          </svg>
                        </span>
                        <span className="rounded-lg p-2 text-slate-400" title="View">
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 6h16v4H4V6zm0 8h10v4H4v-4z"
                            />
                          </svg>
                        </span>
                        <span className="rounded-lg p-2 text-slate-400" title="Fullscreen">
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 8V4h4M20 8V4h-4M4 16v4h4M20 16v4h-4"
                            />
                          </svg>
                        </span>
                      </div>
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
                            onClick={() =>
                              setNameSortDir((d) => (d === "asc" ? "desc" : "asc"))
                            }
                            className="inline-flex items-center gap-1 font-medium text-slate-600 hover:text-slate-900"
                          >
                            Name
                            <span className="flex flex-col leading-none text-[10px] text-slate-400" aria-hidden>
                              <span>▲</span>
                              <span className="-mt-0.5">▼</span>
                            </span>
                          </button>
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-slate-600">
                          <span className="inline-flex items-center gap-1">
                            {secondaryColLabel}
                            <span className="flex flex-col leading-none text-[10px] text-slate-400" aria-hidden>
                              <span>▲</span>
                              <span className="-mt-0.5">▼</span>
                            </span>
                          </span>
                        </th>
                        <th className="hidden px-4 py-3 text-left font-medium text-slate-600 md:table-cell">
                          Description
                        </th>
                        <th className="px-4 py-3 text-right font-medium text-slate-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailPageRows.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-14 text-center text-slate-500">
                            {detailFilteredRows.length === 0
                              ? "No items match your search. Add one to get started."
                              : "No rows on this page."}
                          </td>
                        </tr>
                      ) : (
                        detailPageRows.map((it, idx) => {
                          const rowName = "name" in it ? String(it.name) : "";
                          const detailsText = getItemDetailText(it, selectedMeta.detailKind);
                          const descriptionText =
                            "description" in it && it.description ? String(it.description) : "";
                          const zebra = idx % 2 === 1 ? "bg-slate-50/80" : "bg-white";
                          return (
                            <tr key={it.id} className={`border-b border-slate-100 ${zebra}`}>
                              <td className="px-4 py-3 font-medium text-slate-900">{rowName}</td>
                              <td className="max-w-[200px] truncate px-4 py-3 text-slate-600">{detailsText ?? "-"}</td>
                              <td className="hidden max-w-[280px] truncate px-4 py-3 text-slate-600 md:table-cell">
                                {descriptionText || "-"}
                              </td>
                              <td className="relative px-4 py-3 text-right" data-catalog-row-actions>
                                <button
                                  type="button"
                                  onMouseDown={(e) => e.stopPropagation()}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setRowActionsOpenId((cur) => (cur === it.id ? null : it.id));
                                  }}
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                                  aria-label="Row actions"
                                  aria-expanded={rowActionsOpenId === it.id}
                                >
                                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 8a2 2 0 110-4 2 2 0 010 4zm0 2a2 2 0 100 4 2 2 0 000-4zm0 6a2 2 0 100 4 2 2 0 000-4z" />
                                  </svg>
                                </button>
                                {rowActionsOpenId === it.id ? (
                                  <div
                                    className="absolute right-3 top-full z-20 mt-1 w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
                                    role="menu"
                                  >
                                    <button
                                      type="button"
                                      role="menuitem"
                                      className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                                      onClick={() => {
                                        setRowActionsOpenId(null);
                                        openEditFor(selectedCatalogKey, it);
                                      }}
                                    >
                                      Edit
                                    </button>
                                    <button
                                      type="button"
                                      role="menuitem"
                                      className="block w-full px-3 py-2 text-left text-sm text-red-700 hover:bg-red-50"
                                      onClick={() => {
                                        setRowActionsOpenId(null);
                                        setDeleteContext({ key: selectedCatalogKey, item: it });
                                      }}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                ) : null}
                              </td>
                            </tr>
                          );
                        })
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
                        onChange={(e) => {
                          const next = Number(e.target.value) as 10 | 20 | 50 | 100;
                          setPageSize(next);
                          setTableSkip(0);
                        }}
                        className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/25"
                      >
                        {ITEM_ROWS_PAGE_SIZES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </label>
                    <span className="text-slate-500">
                      {detailFilteredRows.length === 0
                        ? "0–0 of 0"
                        : `${tableSkip + 1}–${Math.min(tableSkip + detailPageRows.length, detailFilteredRows.length)} of ${detailFilteredRows.length}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setTableSkip((s) => Math.max(0, s - pageSize))}
                      disabled={!detailHasPrev}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Previous page"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTableSkip((s) => s + pageSize)}
                      disabled={!detailHasNext}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Next page"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => {
            if (saving) return;
            setModalOpen(false);
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {modalMode === "create" ? "Create" : "Edit"} {singularAddLabel(modalKey)}
                </h2>
                <p className="text-xs text-slate-500 mt-1">Changes apply platform-wide for new/edited listings.</p>
              </div>
              <button
                onClick={() => {
                  if (saving) return;
                  setModalOpen(false);
                }}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={submitModal} className="p-6 space-y-4">
              {modalError ? (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{modalError}</div>
              ) : null}

              <div className="grid sm:grid-cols-2 gap-4">
                {modalKey === "languages" ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Code *</label>
                      <input
                        value={form.code}
                        onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))}
                        placeholder="en"
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Name *</label>
                      <input
                        value={form.name}
                        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                        placeholder="English"
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                      />
                    </div>
                  </>
                ) : (
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Name *</label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      placeholder="e.g. Wi-Fi"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                    />
                  </div>
                )}

                {modalKey === "amenities" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Category *</label>
                      <select
                        value={form.category}
                        onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white"
                      >
                        {AMENITY_CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Icon key</label>
                      <input
                        value={form.icon}
                        onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))}
                        placeholder="wifi"
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                      />
                    </div>
                  </>
                )}

                {modalKey === "activities" && (
                  <div className="sm:col-span-2 grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Category *</label>
                      <select
                        value={form.category}
                        onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white"
                      >
                        {ACTIVITY_CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                      <textarea
                        value={form.description}
                        onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                        rows={3}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none resize-none"
                      />
                    </div>
                  </div>
                )}

                {modalKey === "safetyFeatures" && (
                  <div className="sm:col-span-2 grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Category *</label>
                      <select
                        value={form.category}
                        onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white"
                      >
                        {SAFETY_CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                      <textarea
                        value={form.description}
                        onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                        rows={3}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none resize-none"
                      />
                    </div>
                  </div>
                )}

                {modalKey === "houseRules" && (
                  <div className="sm:col-span-2 grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Category *</label>
                      <select
                        value={form.category}
                        onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white"
                      >
                        {HOUSE_RULE_CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                      <textarea
                        value={form.description}
                        onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                        rows={3}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none resize-none"
                      />
                    </div>
                  </div>
                )}

                {modalKey === "equipment" && (
                  <div className="sm:col-span-2 grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Category *</label>
                      <input
                        value={form.category}
                        onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                        placeholder="MOBILITY"
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                      <textarea
                        value={form.description}
                        onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                        rows={3}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none resize-none"
                      />
                    </div>
                  </div>
                )}

                {(modalKey === "certifications" ||
                  modalKey === "diningOptions" ||
                  modalKey === "insuranceOptions" ||
                  modalKey === "treatmentServices") && (
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none resize-none"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (saving) return;
                    setModalOpen(false);
                  }}
                  className="flex-1 py-2.5 border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors disabled:opacity-60"
                >
                  {saving ? "Saving..." : modalMode === "create" ? "Create" : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteContext && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => {
            if (deleting) return;
            setDeleteContext(null);
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 pt-6 pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Delete catalog item?</h2>
              <p className="text-sm text-slate-600 mt-2">
                This will remove{" "}
                <span className="font-semibold text-slate-900">
                  {("name" in deleteContext.item ? String(deleteContext.item.name) : "this item") as string}
                </span>{" "}
                from the master catalog. Existing listings may still reference historical selections depending on backend rules.
              </p>
            </div>
            <div className="p-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  if (deleting) return;
                  setDeleteContext(null);
                }}
                className="flex-1 py-2.5 border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

