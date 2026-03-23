"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { CatalogKey, CatalogItem, TopTabId } from "./../_lib/types";
import type { CatalogMeta } from "./../_lib/types";
import {
  listCatalogItems,
  createCatalogItem,
  updateCatalogItem,
  deleteCatalogItem,
} from "../_lib/catalogApi";
import {
  getDefaultForm,
  formFromItem,
  filterCatalogItems,
  getSecondaryColumnLabel,
  singularAddLabel,
  escapeCsvField,
  getItemDetailText,
} from "../_lib/catalogUtils";
import { ALL_CATALOG_KEYS, TOP_TABS, type PageSize } from "../_lib/constants";
import { CATALOG_META } from "../_lib/catalogConfig";

const DEFAULT_CATALOG_DATA = (): Record<CatalogKey, CatalogItem[]> =>
  Object.fromEntries(ALL_CATALOG_KEYS.map((k) => [k, []])) as unknown as Record<CatalogKey, CatalogItem[]>;

export function useMasterCatalog() {
  const metaByKey = useMemo(() => {
    const map = {} as Record<CatalogKey, CatalogMeta>;
    for (const m of CATALOG_META) map[m.key] = m;
    return map;
  }, []);

  const [activeTopTab, setActiveTopTab] = useState<TopTabId>("lifestyle");
  const [selectedCatalogKey, setSelectedCatalogKey] = useState<CatalogKey>("amenities");
  const [tableSearch, setTableSearch] = useState("");
  const [catalogData, setCatalogData] = useState<Record<CatalogKey, CatalogItem[]>>(
    DEFAULT_CATALOG_DATA
  );
  const [loadingAll, setLoadingAll] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [tableSkip, setTableSkip] = useState(0);
  const [pageSize, setPageSize] = useState<PageSize>(10);
  const [nameSortDir, setNameSortDir] = useState<"asc" | "desc">("asc");
  const [rowActionsOpenId, setRowActionsOpenId] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState<CatalogKey>("amenities");
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(() => getDefaultForm("amenities"));
  const [modalError, setModalError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteContext, setDeleteContext] = useState<{ key: CatalogKey; item: CatalogItem } | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);

  const loadAllCatalogs = useCallback(async () => {
    setLoadingAll(true);
    setLoadError(null);
    try {
      const pairs = await Promise.all(
        ALL_CATALOG_KEYS.map(async (k) => [k, await listCatalogItems(k, 0, 200)] as const)
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

  const currentTopTab = useMemo(
    () => TOP_TABS.find((t) => t.id === activeTopTab)!,
    [activeTopTab]
  );
  const selectedMeta = metaByKey[selectedCatalogKey];

  const detailFilteredRows = useMemo(() => {
    const raw = filterCatalogItems(
      catalogData[selectedCatalogKey] ?? [],
      selectedMeta,
      tableSearch
    );
    return [...raw].sort((a, b) => {
      const an = "name" in a ? String(a.name) : "";
      const bn = "name" in b ? String(b.name) : "";
      return nameSortDir === "asc" ? an.localeCompare(bn) : bn.localeCompare(an);
    });
  }, [catalogData, selectedCatalogKey, selectedMeta, tableSearch, nameSortDir]);

  const detailPageRows = useMemo(
    () => detailFilteredRows.slice(tableSkip, tableSkip + pageSize),
    [detailFilteredRows, tableSkip, pageSize]
  );

  const handleTabChange = useCallback((tabId: TopTabId) => {
    const tab = TOP_TABS.find((t) => t.id === tabId);
    if (tab) {
      setActiveTopTab(tabId);
      setSelectedCatalogKey(tab.keys[0]);
      setTableSearch("");
      setTableSkip(0);
    }
  }, []);

  const handleSidebarSelect = useCallback((key: CatalogKey) => {
    setSelectedCatalogKey(key);
    setTableSearch("");
    setTableSkip(0);
  }, []);

  const openCreateFor = useCallback((key: CatalogKey) => {
    setModalKey(key);
    setModalMode("create");
    setEditingId(null);
    setModalError(null);
    setForm(getDefaultForm(key));
    setModalOpen(true);
  }, []);

  const openEditFor = useCallback((key: CatalogKey, item: CatalogItem) => {
    setModalKey(key);
    setModalMode("edit");
    setEditingId(item.id);
    setModalError(null);
    setForm(formFromItem(key, item));
    setModalOpen(true);
  }, []);

  const exportToCsv = useCallback(() => {
    const secLabel = getSecondaryColumnLabel(selectedMeta);
    const header = ["Name", secLabel, "Description", "Id"].map(escapeCsvField).join(",");
    const lines = detailFilteredRows.map((it) => {
      const name = "name" in it ? String(it.name) : "";
      const detail = getItemDetailText(it, selectedMeta.detailKind) ?? "";
      const desc = "description" in it && it.description ? String(it.description) : "";
      return [name, detail, desc, it.id].map(escapeCsvField).join(",");
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

  const submitModal = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setModalError(null);
      try {
        if (!form.name.trim()) {
          setModalError("Name is required.");
          return;
        }
        if (modalKey === "languages" && !form.code.trim()) {
          setModalError("Language code is required.");
          return;
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
        setModalError(
          err instanceof Error ? err.message : "Failed to save catalog item."
        );
      } finally {
        setSaving(false);
      }
    },
    [form, modalKey, modalMode, editingId, refreshKey]
  );

  const confirmDelete = useCallback(async () => {
    if (!deleteContext) return;
    const { key, item } = deleteContext;
    setDeleting(true);
    try {
      await deleteCatalogItem(key, item.id);
      setDeleteContext(null);
      await refreshKey(key);
    } catch (err) {
      setLoadError(
        err instanceof Error ? err.message : "Failed to delete catalog item."
      );
    } finally {
      setDeleting(false);
    }
  }, [deleteContext, refreshKey]);

  return {
    metaByKey,
    activeTopTab,
    selectedCatalogKey,
    currentTopTab,
    selectedMeta,
    loadError,
    loadingAll,
    tableSearch,
    setTableSearch,
    tableSkip,
    setTableSkip,
    pageSize,
    setPageSize,
    nameSortDir,
    setNameSortDir,
    rowActionsOpenId,
    setRowActionsOpenId,
    detailFilteredRows,
    detailPageRows,
    modalOpen,
    modalKey,
    modalMode,
    form,
    setForm,
    modalError,
    saving,
    deleteContext,
    deleting,
    handleTabChange,
    handleSidebarSelect,
    openCreateFor,
    openEditFor,
    exportToCsv,
    submitModal,
    setModalOpen,
  confirmDelete,
  setDeleteContext,
};
}
