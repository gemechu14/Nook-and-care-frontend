"use client";

import { Loader } from "../../shared/Loader";
import { CatalogTabs } from "./CatalogTabs";
import { CatalogSidebar } from "./CatalogSidebar";
import { CatalogTable } from "./CatalogTable";
import { CatalogModal } from "./CatalogModal";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { useMasterCatalog } from "./_hooks/useMasterCatalog";
import { getSecondaryColumnLabel, singularAddLabel } from "./_lib/catalogUtils";

export function MasterCatalogSection() {
  const {
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
  } = useMasterCatalog();

  return (
    <div className="space-y-4">
      {loadError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {loadError}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-white">
          <CatalogTabs activeTab={activeTopTab} onTabChange={handleTabChange} />
        </div>

        <div className="flex min-h-[420px] flex-col md:flex-row">
          <CatalogSidebar
            catalogKeys={currentTopTab.keys}
            selectedKey={selectedCatalogKey}
            metaByKey={metaByKey}
            onSelect={handleSidebarSelect}
          />

          <div className="min-w-0 flex-1 bg-white">
            <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
              <h2 className="text-lg font-bold text-slate-900">Master Catalog</h2>
              <p className="mt-1 text-sm text-slate-500">
                Manage reference data for{" "}
                <span className="font-semibold text-slate-800">{selectedMeta.label}</span>
              </p>
            </div>

            {loadingAll ? (
              <div className="px-5 py-12 sm:px-6">
                <Loader />
              </div>
            ) : (
              <CatalogTable
                rows={detailFilteredRows}
                pageRows={detailPageRows}
                meta={selectedMeta}
                searchValue={tableSearch}
                onSearchChange={(v) => {
                  setTableSearch(v);
                  setTableSkip(0);
                }}
                nameSortDir={nameSortDir}
                onSortToggle={() => setNameSortDir((d) => (d === "asc" ? "desc" : "asc"))}
                pageSize={pageSize}
                onPageSizeChange={(s) => {
                  setPageSize(s);
                  setTableSkip(0);
                }}
                tableSkip={tableSkip}
                onSkipChange={setTableSkip}
                rowActionsOpenId={rowActionsOpenId}
                onRowActionsToggle={setRowActionsOpenId}
                onEdit={(item) => openEditFor(selectedCatalogKey, item)}
                onDelete={(item) => setDeleteContext({ key: selectedCatalogKey, item })}
                onAddNew={() => openCreateFor(selectedCatalogKey)}
                onExportCsv={exportToCsv}
                secondaryColLabel={getSecondaryColumnLabel(selectedMeta)}
                addLabel={singularAddLabel(selectedCatalogKey)}
              />
            )}
          </div>
        </div>
      </div>

      <CatalogModal
        isOpen={modalOpen}
        mode={modalMode}
        catalogKey={modalKey}
        form={form}
        onFormChange={setForm}
        error={modalError}
        saving={saving}
        onSubmit={submitModal}
        onClose={() => !saving && setModalOpen(false)}
      />

      <DeleteConfirmModal
        item={deleteContext?.item ?? null}
        deleting={deleting}
        onConfirm={confirmDelete}
        onCancel={() => !deleting && setDeleteContext(null)}
      />
    </div>
  );
}
