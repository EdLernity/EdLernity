"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  CertificateRow,
  CertificateTemplateRow,
  CertificateTypeRow,
  certificateTypeLabel,
  createCertificateTemplate,
  createCertificateType,
  deleteCertificateTemplate,
  deleteCertificateType,
  deleteIssuedCertificate,
  fetchCertificatePreviewBlob,
  fetchCertificateTemplatePreviewBlob,
  fetchCertificateTemplates,
  fetchCertificateTypes,
  fetchCertificates,
  normalizeTypeSlug,
  updateCertificateTemplate,
  updateCertificateType,
  uploadCertificateTemplatePdf,
} from "@/lib/crmApi";
import { formatDate, inputClass, selectClass } from "@/lib/crmUtils";
import { useModalOverlay } from "@/context/ModalOverlayContext";
import CrmListPagination, { useClientPagination } from "@/components/crm/CrmListPagination";

type TabKey = "templates" | "types" | "issued";

const EMPTY_FORM = {
  type: "internship-completion",
  label: "",
  pdfUrl: "",
  description: "",
  active: true,
};

const EMPTY_NEW_TYPE = {
  label: "",
  slug: "",
  kind: "certificate" as "certificate" | "offer-letter",
  description: "",
  active: true,
  sortOrder: 0,
};

function isPdfFile(file: File) {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

function PdfTemplateDropzone({
  file,
  currentUrl,
  onFileSelect,
}: {
  file: File | null;
  currentUrl?: string;
  onFileSelect: (file: File | null) => void;
}) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const inputId = "certificate-template-pdf-upload";

  const handleFiles = (files: FileList | null) => {
    const next = files?.[0];
    if (!next) return;
    if (!isPdfFile(next)) {
      window.alert("Please upload a PDF file only.");
      return;
    }
    onFileSelect(next);
  };

  const clearFile = () => {
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="application/pdf,.pdf"
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <label
        htmlFor={inputId}
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragActive(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragActive(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragActive(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 text-center transition ${
          dragActive
            ? "border-brand-400 bg-brand-50/80 dark:border-brand-400 dark:bg-brand-500/10"
            : "border-gray-300 bg-gray-50/60 hover:border-brand-300 hover:bg-brand-50/40 dark:border-gray-700 dark:bg-gray-800/40 dark:hover:border-brand-500/40"
        }`}
      >
        <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-white text-brand-600 shadow-sm dark:bg-gray-900">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 16V8m0 0l-3 3m3-3 3 3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 16.5V18a2 2 0 002 2h12a2 2 0 002-2v-1.5" strokeLinecap="round" />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
          Drag and drop PDF here
        </p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          or click to browse · PDF only
        </p>
      </label>

      {file ? (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs dark:border-emerald-500/30 dark:bg-emerald-500/10">
          <span className="truncate font-medium text-emerald-800 dark:text-emerald-200">
            Selected: {file.name}
          </span>
          <button
            type="button"
            onClick={clearFile}
            className="shrink-0 font-medium text-emerald-700 hover:text-emerald-900 dark:text-emerald-300"
          >
            Remove
          </button>
        </div>
      ) : currentUrl ? (
        <p className="text-xs text-gray-500 break-all">Current: {currentUrl}</p>
      ) : null}
    </div>
  );
}

export default function CrmCertificatesPage() {
  const [tab, setTab] = useState<TabKey>("templates");
  const [typeFilter, setTypeFilter] = useState("");
  const [search, setSearch] = useState("");

  const [templates, setTemplates] = useState<CertificateTemplateRow[]>([]);
  const [certificateTypes, setCertificateTypes] = useState<CertificateTypeRow[]>([]);
  const [certificates, setCertificates] = useState<CertificateRow[]>([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<CertificateTemplateRow | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [creatingType, setCreatingType] = useState(false);
  const [showNewTypeForm, setShowNewTypeForm] = useState(false);
  const [newTypeForm, setNewTypeForm] = useState(EMPTY_NEW_TYPE);

  const [typeFormOpen, setTypeFormOpen] = useState(false);
  const [editingType, setEditingType] = useState<CertificateTypeRow | null>(null);
  const [typeForm, setTypeForm] = useState(EMPTY_NEW_TYPE);
  const [savingType, setSavingType] = useState(false);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);

  const closePreview = useCallback(() => {
    setPreviewUrl((current) => {
      if (current?.startsWith("blob:")) URL.revokeObjectURL(current);
      return null;
    });
    setPreviewTitle("");
    setPreviewLoading(false);
  }, []);

  useEffect(() => {
    if (!previewUrl) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePreview();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [previewUrl, closePreview]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const typeParam = typeFilter || undefined;
      const [templateData, certRows, typeRows] = await Promise.all([
        fetchCertificateTemplates(),
        fetchCertificates({ type: typeParam || undefined }),
        fetchCertificateTypes({ includeInactive: true }),
      ]);
      setTemplates(templateData.templates);
      setCertificateTypes(typeRows.length ? typeRows : templateData.typeRows);
      setCertificates(certRows);
    } catch {
      setError("Failed to load certificates");
    } finally {
      setLoading(false);
    }
  }, [typeFilter]);

  useEffect(() => {
    load();
  }, [load]);

  useModalOverlay(formOpen || typeFormOpen || Boolean(previewUrl) || previewLoading);

  useEffect(() => {
    return () => {
      setPreviewUrl((current) => {
        if (current?.startsWith("blob:")) URL.revokeObjectURL(current);
        return null;
      });
    };
  }, []);

  const filteredTemplates = useMemo(() => {
    const term = search.trim().toLowerCase();
    return templates.filter((t) => {
      if (typeFilter && t.type !== typeFilter) return false;
      if (!term) return true;
      return (
        t.label.toLowerCase().includes(term) ||
        t.type.toLowerCase().includes(term) ||
        t.description.toLowerCase().includes(term)
      );
    });
  }, [templates, search, typeFilter]);

  const filteredIssued = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return certificates;
    return certificates.filter(
      (c) =>
        c.studentName.toLowerCase().includes(term) ||
        c.student?.email?.toLowerCase().includes(term) ||
        c.programTitle.toLowerCase().includes(term) ||
        c.uuid.toLowerCase().includes(term)
    );
  }, [certificates, search]);

  const issuedPagination = useClientPagination(filteredIssued);
  const templatesPagination = useClientPagination(filteredTemplates);

  const templateCountByType = useMemo(() => {
    const counts: Record<string, number> = {};
    templates.forEach((t) => {
      counts[t.type] = (counts[t.type] || 0) + 1;
    });
    return counts;
  }, [templates]);

  const filteredTypes = useMemo(() => {
    const term = search.trim().toLowerCase();
    const rows = certificateTypes.filter((type) => !typeFilter || type.slug === typeFilter);
    if (!term) return rows;
    return rows.filter(
      (type) =>
        type.label.toLowerCase().includes(term) ||
        type.slug.toLowerCase().includes(term) ||
        type.description.toLowerCase().includes(term)
    );
  }, [certificateTypes, search, typeFilter]);

  const typesPagination = useClientPagination(filteredTypes);

  const openCreate = () => {
    setEditing(null);
    setPdfFile(null);
    setShowNewTypeForm(false);
    setNewTypeForm(EMPTY_NEW_TYPE);
    setForm({
      ...EMPTY_FORM,
      type: typeFilter || certificateTypes[0]?.slug || "internship-completion",
    });
    setFormOpen(true);
  };

  const openEdit = (row: CertificateTemplateRow) => {
    setEditing(row);
    setPdfFile(null);
    setShowNewTypeForm(false);
    setNewTypeForm(EMPTY_NEW_TYPE);
    setForm({
      type: row.type,
      label: row.label,
      pdfUrl: row.pdfUrl,
      description: row.description,
      active: row.active,
    });
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
    setForm(EMPTY_FORM);
    setPdfFile(null);
    setShowNewTypeForm(false);
    setNewTypeForm(EMPTY_NEW_TYPE);
  };

  const openCreateType = () => {
    setEditingType(null);
    setTypeForm(EMPTY_NEW_TYPE);
    setTypeFormOpen(true);
  };

  const openEditType = (row: CertificateTypeRow) => {
    setEditingType(row);
    setTypeForm({
      label: row.label,
      slug: row.slug,
      kind: row.kind,
      description: row.description,
      active: row.active,
      sortOrder: row.sortOrder,
    });
    setTypeFormOpen(true);
  };

  const closeTypeForm = () => {
    setTypeFormOpen(false);
    setEditingType(null);
    setTypeForm(EMPTY_NEW_TYPE);
  };

  const goToTypesTab = () => {
    closeForm();
    setTab("types");
  };

  const handleCreateType = async () => {
    if (!newTypeForm.label.trim()) {
      setMessage("Type label is required");
      return;
    }
    setCreatingType(true);
    setMessage("");
    try {
      const created = await createCertificateType({
        label: newTypeForm.label.trim(),
        slug: newTypeForm.slug.trim() || normalizeTypeSlug(newTypeForm.label),
        kind: newTypeForm.kind,
      });
      setCertificateTypes((prev) => [...prev, created].sort((a, b) => a.sortOrder - b.sortOrder));
      setForm((prev) => ({ ...prev, type: created.slug }));
      setShowNewTypeForm(false);
      setNewTypeForm(EMPTY_NEW_TYPE);
      setMessage(`Type "${created.label}" created`);
    } catch (err: unknown) {
      const apiMessage =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null;
      setMessage(apiMessage || "Failed to create certificate type");
    } finally {
      setCreatingType(false);
    }
  };

  const handleSaveType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typeForm.label.trim()) {
      setMessage("Type label is required");
      return;
    }

    setSavingType(true);
    setMessage("");
    try {
      if (editingType) {
        await updateCertificateType(editingType.id, {
          label: typeForm.label.trim(),
          kind: typeForm.kind,
          description: typeForm.description.trim(),
          active: typeForm.active,
          sortOrder: typeForm.sortOrder,
        });
        setMessage(`Type "${typeForm.label.trim()}" updated`);
      } else {
        const created = await createCertificateType({
          label: typeForm.label.trim(),
          slug: typeForm.slug.trim() || normalizeTypeSlug(typeForm.label),
          kind: typeForm.kind,
          description: typeForm.description.trim(),
          active: typeForm.active,
          sortOrder: typeForm.sortOrder,
        });
        setMessage(`Type "${created.label}" created`);
      }
      closeTypeForm();
      load();
    } catch (err: unknown) {
      const apiMessage =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null;
      setMessage(apiMessage || "Failed to save certificate type");
    } finally {
      setSavingType(false);
    }
  };

  const handleDeleteType = async (row: CertificateTypeRow) => {
    const count = templateCountByType[row.slug] || 0;
    if (count > 0) {
      setMessage(`Cannot delete "${row.label}" — ${count} PDF template(s) still use it`);
      return;
    }
    if (!window.confirm(`Delete type "${row.label}"? This cannot be undone.`)) return;
    try {
      await deleteCertificateType(row.id);
      setMessage(`Type "${row.label}" deleted`);
      load();
    } catch (err: unknown) {
      const apiMessage =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null;
      setMessage(apiMessage || "Failed to delete certificate type");
    }
  };

  const handleToggleTypeActive = async (row: CertificateTypeRow) => {
    try {
      await updateCertificateType(row.id, { active: !row.active });
      setMessage(`Type "${row.label}" ${row.active ? "deactivated" : "activated"}`);
      load();
    } catch {
      setMessage("Failed to update certificate type");
    }
  };

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.label.trim()) {
      setMessage("Label is required");
      return;
    }
    if (!pdfFile && !form.pdfUrl.trim()) {
      setMessage("Upload a PDF or enter a PDF URL");
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      let pdfUrl = form.pdfUrl.trim();
      if (pdfFile) {
        pdfUrl = await uploadCertificateTemplatePdf(pdfFile);
      }

      const payload = {
        ...form,
        label: form.label.trim(),
        pdfUrl,
      };

      if (editing) {
        await updateCertificateTemplate(editing.id, payload);
        setMessage("Template updated");
      } else {
        await createCertificateTemplate(payload);
        setMessage("Template created");
      }
      closeForm();
      load();
    } catch {
      setMessage("Failed to save template");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTemplate = async (row: CertificateTemplateRow) => {
    if (!window.confirm(`Delete template "${row.label}"?`)) return;
    try {
      await deleteCertificateTemplate(row.id);
      setMessage("Template deleted");
      load();
    } catch {
      setMessage("Failed to delete template");
    }
  };

  const handleDeleteIssued = async (row: CertificateRow) => {
    if (!window.confirm(`Delete issued certificate for ${row.studentName}?`)) return;
    try {
      await deleteIssuedCertificate(row.id, row.recordType);
      setMessage("Issued certificate deleted");
      load();
    } catch {
      setMessage("Failed to delete certificate");
    }
  };

  const openTemplatePreview = async (row: CertificateTemplateRow) => {
    setPreviewLoading(true);
    setPreviewTitle(`${row.label} (sample preview)`);
    setPreviewUrl(null);
    try {
      const blob = await fetchCertificateTemplatePreviewBlob(row.id);
      setPreviewUrl(URL.createObjectURL(blob));
    } catch {
      setMessage("Failed to load template preview");
      setPreviewTitle("");
    } finally {
      setPreviewLoading(false);
    }
  };

  const openIssuedPreview = async (row: CertificateRow) => {
    setPreviewLoading(true);
    setPreviewTitle(`${row.studentName} — ${row.programTitle}`);
    setPreviewUrl(null);
    try {
      const blob = await fetchCertificatePreviewBlob(row.id, row.recordType);
      setPreviewUrl(URL.createObjectURL(blob));
    } catch {
      setMessage("Failed to load certificate preview");
      setPreviewTitle("");
    } finally {
      setPreviewLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Certificates</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage PDF certificate templates and issued records by type
          </p>
        </div>
        {tab === "templates" && (
          <button
            type="button"
            onClick={openCreate}
            className="px-5 py-2.5 rounded-lg bg-brand-500 text-white text-sm font-medium hover:bg-brand-600"
          >
            Add PDF template
          </button>
        )}
        {tab === "types" && (
          <button
            type="button"
            onClick={openCreateType}
            className="px-5 py-2.5 rounded-lg bg-brand-500 text-white text-sm font-medium hover:bg-brand-600"
          >
            Add template type
          </button>
        )}
      </div>

      {message && (
        <p className="text-sm text-brand-600 bg-brand-50 dark:bg-brand-500/10 rounded-lg px-4 py-2">{message}</p>
      )}
      {error && <p className="text-sm text-error-500">{error}</p>}

      <div className="flex flex-wrap gap-3 items-end">
        <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 p-1">
          <button
            type="button"
            onClick={() => setTab("templates")}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              tab === "templates" ? "bg-brand-500 text-white" : "text-gray-600"
            }`}
          >
            PDF Templates
          </button>
          <button
            type="button"
            onClick={() => setTab("types")}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              tab === "types" ? "bg-brand-500 text-white" : "text-gray-600"
            }`}
          >
            Template Types
          </button>
          <button
            type="button"
            onClick={() => setTab("issued")}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              tab === "issued" ? "bg-brand-500 text-white" : "text-gray-600"
            }`}
          >
            Issued Certificates
          </button>
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className={selectClass() + " min-w-[220px]"}
        >
          <option value="">All types</option>
          {certificateTypes.map((type) => (
            <option key={type.slug} value={type.slug}>
              {type.label}
            </option>
          ))}
        </select>

        <input
          type="search"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={inputClass() + " max-w-md"}
        />

        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="h-11 px-5 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-60"
        >
          Refresh
        </button>
      </div>

      {tab === "templates" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {loading ? (
            <p className="text-gray-500 col-span-full py-8 text-center">Loading templates...</p>
          ) : filteredTemplates.length === 0 ? (
            <p className="text-gray-500 col-span-full py-8 text-center">No PDF templates found</p>
          ) : (
            templatesPagination.pageItems.map((row) => (
              <div
                key={row.id}
                className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-5 flex flex-col gap-4"
              >
                <div>
                  <span className="inline-flex text-xs font-medium uppercase tracking-wide text-brand-600 bg-brand-50 dark:bg-brand-500/10 px-2 py-1 rounded">
                    {certificateTypeLabel(row.type, certificateTypes)}
                  </span>
                  <h3 className="mt-2 font-semibold text-gray-900 dark:text-white">{row.label}</h3>
                  {row.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{row.description}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2 break-all">{row.pdfUrl}</p>
                </div>
                <div className="flex flex-wrap gap-2 mt-auto">
                  <button
                    type="button"
                    onClick={() => openTemplatePreview(row)}
                    className="px-3 py-1.5 rounded-lg bg-brand-500 text-white text-xs font-medium"
                  >
                    Preview PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => openEdit(row)}
                    className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-medium"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteTemplate(row)}
                    className="px-3 py-1.5 rounded-lg border border-error-200 text-error-600 text-xs font-medium"
                  >
                    Delete
                  </button>
                </div>
                <p className="text-xs text-gray-400">
                  {row.active ? "Active" : "Inactive"} · Updated {formatDate(row.updatedAt)}
                </p>
              </div>
            ))
          )}
          {filteredTemplates.length > 0 ? (
            <div className="col-span-full rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
              <CrmListPagination
                page={templatesPagination.page}
                totalPages={templatesPagination.totalPages}
                total={templatesPagination.total}
                from={templatesPagination.from}
                to={templatesPagination.to}
                onPageChange={templatesPagination.setPage}
              />
            </div>
          ) : null}
        </div>
      ) : tab === "types" ? (
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-5 py-3 text-left font-medium text-gray-500">Label</th>
                <th className="px-5 py-3 text-left font-medium text-gray-500">Slug</th>
                <th className="px-5 py-3 text-left font-medium text-gray-500">Kind</th>
                <th className="px-5 py-3 text-left font-medium text-gray-500">Templates</th>
                <th className="px-5 py-3 text-left font-medium text-gray-500">Status</th>
                <th className="px-5 py-3 text-left font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-gray-500">
                    Loading types...
                  </td>
                </tr>
              ) : filteredTypes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-gray-500">
                    No template types found
                  </td>
                </tr>
              ) : (
                typesPagination.pageItems.map((type) => (
                  <tr key={type.id}>
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-900 dark:text-white">{type.label}</p>
                      {type.description ? (
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{type.description}</p>
                      ) : null}
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-gray-600">{type.slug}</td>
                    <td className="px-5 py-3 text-gray-700">
                      {type.kind === "offer-letter" ? "Offer letter" : "Certificate"}
                    </td>
                    <td className="px-5 py-3 text-gray-700">{templateCountByType[type.slug] || 0}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex text-xs font-medium px-2 py-1 rounded ${
                          type.active
                            ? "text-emerald-700 bg-emerald-50 dark:bg-emerald-500/10"
                            : "text-gray-600 bg-gray-100 dark:bg-gray-800"
                        }`}
                      >
                        {type.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => openEditType(type)}
                          className="text-xs font-medium text-brand-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleTypeActive(type)}
                          className="text-xs font-medium text-gray-600 hover:underline"
                        >
                          {type.active ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteType(type)}
                          className="text-xs font-medium text-error-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <CrmListPagination
            page={typesPagination.page}
            totalPages={typesPagination.totalPages}
            total={typesPagination.total}
            from={typesPagination.from}
            to={typesPagination.to}
            onPageChange={typesPagination.setPage}
          />
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-5 py-3 text-left font-medium text-gray-500">Type</th>
                <th className="px-5 py-3 text-left font-medium text-gray-500">Student</th>
                <th className="px-5 py-3 text-left font-medium text-gray-500">Program</th>
                <th className="px-5 py-3 text-left font-medium text-gray-500">Certificate ID</th>
                <th className="px-5 py-3 text-left font-medium text-gray-500">Issued</th>
                <th className="px-5 py-3 text-left font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : filteredIssued.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-gray-500">
                    No issued certificates
                  </td>
                </tr>
              ) : (
                issuedPagination.pageItems.map((c) => (
                  <tr key={`${c.recordType}-${c.id}`}>
                    <td className="px-5 py-3 text-gray-700">
                      {certificateTypeLabel(c.recordType, certificateTypes)}
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-900 dark:text-white">{c.studentName}</p>
                      <p className="text-xs text-gray-500">{c.student?.email}</p>
                    </td>
                    <td className="px-5 py-3 text-gray-700">{c.programTitle}</td>
                    <td className="px-5 py-3 font-mono text-xs text-gray-600">{c.uuid}</td>
                    <td className="px-5 py-3 text-gray-600">{formatDate(c.issuedAt)}</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openIssuedPreview(c)}
                          className="text-xs font-medium text-brand-600 hover:underline"
                        >
                          Preview
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteIssued(c)}
                          className="text-xs font-medium text-error-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
          <CrmListPagination
            page={issuedPagination.page}
            totalPages={issuedPagination.totalPages}
            total={issuedPagination.total}
            from={issuedPagination.from}
            to={issuedPagination.to}
            onPageChange={issuedPagination.setPage}
          />
        </div>
      )}

      {formOpen && (
        <div className="fixed inset-0 z-999999 flex items-center justify-center bg-black/40 p-4 sm:p-6">
          <form
            onSubmit={handleSaveTemplate}
            className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 sm:p-8 space-y-5 shadow-xl dark:bg-gray-900"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {editing ? "Edit PDF template" : "Add PDF template"}
            </h2>
            <label className="block space-y-2">
              <span className="text-xs font-medium text-gray-500 mb-1 block">Type *</span>
              <select
                value={showNewTypeForm ? "__new__" : form.type}
                onChange={(e) => {
                  if (e.target.value === "__new__") {
                    setShowNewTypeForm(true);
                    return;
                  }
                  setShowNewTypeForm(false);
                  setForm({ ...form, type: e.target.value });
                }}
                className={selectClass()}
              >
                {certificateTypes.map((type) => (
                  <option key={type.slug} value={type.slug}>
                    {type.label} ({type.kind === "offer-letter" ? "Offer letter" : "Certificate"})
                  </option>
                ))}
                <option value="__new__">+ Add new type...</option>
              </select>
              <button
                type="button"
                onClick={goToTypesTab}
                className="text-xs font-medium text-brand-600 hover:underline"
              >
                Manage template types →
              </button>

              {showNewTypeForm ? (
                <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-4 space-y-3 dark:border-gray-700 dark:bg-gray-800/40">
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-300">Create a new template type</p>
                  <input
                    placeholder="Type label *"
                    value={newTypeForm.label}
                    onChange={(e) =>
                      setNewTypeForm({
                        ...newTypeForm,
                        label: e.target.value,
                        slug: newTypeForm.slug ? newTypeForm.slug : normalizeTypeSlug(e.target.value),
                      })
                    }
                    className={inputClass()}
                  />
                  <input
                    placeholder="Slug (auto-generated if empty)"
                    value={newTypeForm.slug}
                    onChange={(e) => setNewTypeForm({ ...newTypeForm, slug: normalizeTypeSlug(e.target.value) })}
                    className={inputClass()}
                  />
                  <select
                    value={newTypeForm.kind}
                    onChange={(e) =>
                      setNewTypeForm({
                        ...newTypeForm,
                        kind: e.target.value as "certificate" | "offer-letter",
                      })
                    }
                    className={selectClass()}
                  >
                    <option value="certificate">Certificate (issuable to interns)</option>
                    <option value="offer-letter">Offer letter template</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleCreateType}
                    disabled={creatingType}
                    className="w-full rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                  >
                    {creatingType ? "Creating type..." : "Save new type"}
                  </button>
                </div>
              ) : null}
            </label>
            <input
              placeholder="Label *"
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              className={inputClass()}
            />
            <label className="block">
              <span className="text-xs font-medium text-gray-500 mb-1 block">Upload PDF template</span>
              <PdfTemplateDropzone
                file={pdfFile}
                currentUrl={!pdfFile ? editing?.pdfUrl : undefined}
                onFileSelect={setPdfFile}
              />
            </label>
            <div className="text-center text-xs text-gray-400">or paste a PDF URL</div>
            <input
              placeholder="PDF URL"
              value={form.pdfUrl}
              onChange={(e) => setForm({ ...form, pdfUrl: e.target.value })}
              className={inputClass()}
            />
            <textarea
              rows={3}
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={inputClass() + " !h-auto py-3"}
            />
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
              />
              Active template
            </label>
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={closeForm} className="px-4 py-2 text-sm border rounded-lg">
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 text-sm rounded-lg bg-brand-500 text-white disabled:opacity-60"
              >
                {saving ? "Saving..." : editing ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}

      {typeFormOpen && (
        <div className="fixed inset-0 z-999999 flex items-center justify-center bg-black/40 p-4 sm:p-6">
          <form
            onSubmit={handleSaveType}
            className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 sm:p-8 space-y-5 shadow-xl dark:bg-gray-900"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {editingType ? "Edit template type" : "Add template type"}
            </h2>
            <input
              placeholder="Type label *"
              value={typeForm.label}
              onChange={(e) =>
                setTypeForm({
                  ...typeForm,
                  label: e.target.value,
                  slug: editingType ? typeForm.slug : typeForm.slug || normalizeTypeSlug(e.target.value),
                })
              }
              className={inputClass()}
            />
            <input
              placeholder="Slug"
              value={typeForm.slug}
              disabled={Boolean(editingType)}
              onChange={(e) => setTypeForm({ ...typeForm, slug: normalizeTypeSlug(e.target.value) })}
              className={inputClass() + (editingType ? " opacity-60" : "")}
            />
            {editingType ? (
              <p className="text-xs text-gray-500 -mt-2">Slug cannot be changed after creation</p>
            ) : null}
            <select
              value={typeForm.kind}
              onChange={(e) =>
                setTypeForm({
                  ...typeForm,
                  kind: e.target.value as "certificate" | "offer-letter",
                })
              }
              className={selectClass()}
            >
              <option value="certificate">Certificate (issuable to interns)</option>
              <option value="offer-letter">Offer letter template</option>
            </select>
            <textarea
              rows={2}
              placeholder="Description (optional)"
              value={typeForm.description}
              onChange={(e) => setTypeForm({ ...typeForm, description: e.target.value })}
              className={inputClass() + " !h-auto py-3"}
            />
            <input
              type="number"
              placeholder="Sort order"
              value={typeForm.sortOrder}
              onChange={(e) => setTypeForm({ ...typeForm, sortOrder: Number(e.target.value) || 0 })}
              className={inputClass()}
            />
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={typeForm.active}
                onChange={(e) => setTypeForm({ ...typeForm, active: e.target.checked })}
              />
              Active type
            </label>
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={closeTypeForm} className="px-4 py-2 text-sm border rounded-lg">
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingType}
                className="px-4 py-2 text-sm rounded-lg bg-brand-500 text-white disabled:opacity-60"
              >
                {savingType ? "Saving..." : editingType ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}

      {(previewLoading || previewUrl) &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/70 p-4"
            style={{ zIndex: 999999 }}
            onClick={closePreview}
            role="dialog"
            aria-modal="true"
            aria-label="Certificate preview"
          >
            <div
              className="relative flex flex-col w-full max-w-5xl h-[min(90vh,900px)] rounded-2xl bg-white dark:bg-gray-900 shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shrink-0">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate pr-4">
                  {previewTitle || "Certificate preview"}
                </h3>
                <button
                  type="button"
                  onClick={closePreview}
                  className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                >
                  <span aria-hidden="true">✕</span>
                  Close
                </button>
              </div>
              <div className="flex-1 min-h-0 bg-gray-100 dark:bg-gray-950">
                {previewLoading ? (
                  <div className="flex h-full items-center justify-center text-sm text-gray-500">
                    Generating preview...
                  </div>
                ) : previewUrl ? (
                  <iframe
                    title={previewTitle}
                    src={`${previewUrl}#toolbar=1&navpanes=0`}
                    className="h-full w-full border-0 bg-white"
                  />
                ) : null}
              </div>
              <p className="shrink-0 px-4 py-2 text-xs text-gray-500 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                Press Esc or click outside to close
              </p>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
