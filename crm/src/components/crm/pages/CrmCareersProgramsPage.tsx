"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  CareersProgramPayload,
  CareersProgramRow,
  CertificateTemplateRow,
  createCareersProgram,
  deleteCareersProgram,
  fetchAdminCareersPrograms,
  fetchCertificateTemplates,
  updateCareersProgram,
} from "@/lib/crmApi";
import { formatDate, inputClass, selectClass } from "@/lib/crmUtils";
import { useModalOverlay } from "@/context/ModalOverlayContext";

const FALLBACK_CERTIFICATE_DEFAULT_LABEL = "Internship Completion Certificate";

function latestActiveTemplate(templates: CertificateTemplateRow[]) {
  return [...templates]
    .filter((template) => template.active !== false)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];
}

function offerLetterTypeForSlug(slug: string) {
  return slug === "human-resources" ? "offer-letter-hr" : "offer-letter-marketing";
}

function fallbackOfferLetterLabel(type: CertificateTemplateRow["type"]) {
  return type === "offer-letter-hr" ? "HR Offer Letter" : "Marketing Offer Letter";
}

function resolveDefaultOfferLetterLabel(offerTemplates: CertificateTemplateRow[], slug: string) {
  const type = offerLetterTypeForSlug(slug);
  const match = latestActiveTemplate(offerTemplates.filter((template) => template.type === type));
  return match?.label || fallbackOfferLetterLabel(type);
}

function normalizeTemplateId(
  templateId?: string | { id?: string; _id?: string } | null,
  templateMeta?: { id?: string } | null
) {
  if (typeof templateId === "string" && templateId) return templateId;
  if (templateId && typeof templateId === "object") {
    const objectId = templateId.id || templateId._id;
    if (objectId) return String(objectId);
  }
  if (templateMeta?.id) return templateMeta.id;
  return null;
}

function resolveSavedTemplateLabel(
  templateId: string | null | undefined,
  templateMeta: { label?: string } | null | undefined,
  templates: CertificateTemplateRow[],
  systemDefaultLabel: string
) {
  if (templateMeta?.label) return templateMeta.label;
  if (templateId) {
    const match = templates.find((template) => template.id === templateId);
    if (match?.label) return match.label;
  }
  return `System default (${systemDefaultLabel})`;
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="md:col-span-2 space-y-4 rounded-xl border border-gray-200 bg-gray-50/60 p-5 dark:border-gray-800 dark:bg-gray-800/20">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
        {description ? <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{description}</p> : null}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

function FormField({
  label,
  hint,
  required,
  className = "",
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required ? <span className="text-error-500"> *</span> : null}
      </label>
      {children}
      {hint ? <p className="mt-1.5 text-xs leading-relaxed text-gray-500 dark:text-gray-400">{hint}</p> : null}
    </div>
  );
}

const textareaClass = () => `${inputClass()} !h-auto min-h-[96px] resize-y py-3`;

function slugifyProgram(value: string) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildUniqueDuplicateSlug(baseSlug: string, takenSlugs: Set<string>) {
  const base = slugifyProgram(baseSlug) || "program";
  let candidate = `${base}-copy`;
  let counter = 2;
  while (takenSlugs.has(candidate)) {
    candidate = `${base}-copy-${counter}`;
    counter += 1;
  }
  return candidate;
}

const EMPTY_FORM: CareersProgramPayload = {
  title: "",
  slug: "",
  category: "",
  trackLabel: "",
  description: "",
  highlights: [],
  coverImage: "",
  applyUrl: "",
  location: "Remote",
  duration: "2 Months",
  preferred: false,
  preferredNote: "",
  active: true,
  sortOrder: 0,
  certificateTemplateId: null,
  offerLetterTemplateId: null,
  offerLetterRoleDescription: "",
};

export default function CrmCareersProgramsPage() {
  const [programs, setPrograms] = useState<CareersProgramRow[]>([]);
  const [certificateTemplates, setCertificateTemplates] = useState<CertificateTemplateRow[]>([]);
  const [offerTemplates, setOfferTemplates] = useState<CertificateTemplateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [editing, setEditing] = useState<CareersProgramRow | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [highlightsText, setHighlightsText] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [programRows, certData, offerData] = await Promise.all([
        fetchAdminCareersPrograms(),
        fetchCertificateTemplates({ type: "internship-completion" }),
        fetchCertificateTemplates().then((data) => ({
          templates: data.templates.filter(
            (template) =>
              template.type.startsWith("offer-letter") || template.type === "generic"
          ),
        })),
      ]);
      setPrograms(programRows);
      setCertificateTemplates(certData.templates);
      setOfferTemplates(offerData.templates);
    } catch {
      setError("Failed to load careers programs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useModalOverlay(formOpen);

  const sortedPrograms = useMemo(
    () => [...programs].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)),
    [programs]
  );

  const defaultCertificateLabel = useMemo(() => {
    return latestActiveTemplate(certificateTemplates)?.label || FALLBACK_CERTIFICATE_DEFAULT_LABEL;
  }, [certificateTemplates]);

  const formProgramSlug = form.slug?.trim() || editing?.slug || "sales-marketing";

  const defaultOfferLetterLabelForForm = useMemo(
    () => resolveDefaultOfferLetterLabel(offerTemplates, formProgramSlug),
    [offerTemplates, formProgramSlug]
  );

  const openCreate = () => {
    setEditing(null);
    setIsDuplicate(false);
    setForm(EMPTY_FORM);
    setHighlightsText("");
    setFormOpen(true);
    setMessage("");
  };

  const openDuplicate = (row: CareersProgramRow) => {
    const takenSlugs = new Set(programs.map((program) => program.slug));
    setEditing(null);
    setIsDuplicate(true);
    setForm({
      title: `${row.title} (Copy)`,
      slug: buildUniqueDuplicateSlug(row.slug, takenSlugs),
      category: row.category || "",
      trackLabel: row.trackLabel || "",
      description: row.description || "",
      highlights: row.highlights || [],
      coverImage: row.coverImage || "",
      applyUrl: row.applyUrl || "",
      location: row.location || "Remote",
      duration: row.duration || "2 Months",
      preferred: Boolean(row.preferred),
      preferredNote: row.preferredNote || "",
      active: false,
      sortOrder: (row.sortOrder || 0) + 1,
      certificateTemplateId: normalizeTemplateId(row.certificateTemplateId, row.certificateTemplate),
      offerLetterTemplateId: normalizeTemplateId(row.offerLetterTemplateId, row.offerLetterTemplate),
      offerLetterRoleDescription: row.offerLetterRoleDescription || "",
    });
    setHighlightsText((row.highlights || []).join("\n"));
    setFormOpen(true);
    setMessage("");
    setError("");
  };

  const openEdit = (row: CareersProgramRow) => {
    setEditing(row);
    setIsDuplicate(false);
    setForm({
      title: row.title,
      slug: row.slug,
      category: row.category || "",
      trackLabel: row.trackLabel || "",
      description: row.description || "",
      highlights: row.highlights || [],
      coverImage: row.coverImage || "",
      applyUrl: row.applyUrl || "",
      location: row.location || "Remote",
      duration: row.duration || "2 Months",
      preferred: Boolean(row.preferred),
      preferredNote: row.preferredNote || "",
      active: row.active !== false,
      sortOrder: row.sortOrder || 0,
      certificateTemplateId: normalizeTemplateId(row.certificateTemplateId, row.certificateTemplate),
      offerLetterTemplateId: normalizeTemplateId(row.offerLetterTemplateId, row.offerLetterTemplate),
      offerLetterRoleDescription: row.offerLetterRoleDescription || "",
    });
    setHighlightsText((row.highlights || []).join("\n"));
    setFormOpen(true);
    setMessage("");
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
    setIsDuplicate(false);
    setForm(EMPTY_FORM);
    setHighlightsText("");
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");
    const payload: CareersProgramPayload = {
      ...form,
      highlights: highlightsText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    };

    try {
      if (editing) {
        await updateCareersProgram(editing.id, payload);
        setMessage("Program updated");
      } else {
        await createCareersProgram(payload);
        setMessage(isDuplicate ? "Program duplicated" : "Program created");
      }
      closeForm();
      await load();
    } catch (err: unknown) {
      const apiMessage =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null;
      setError(apiMessage || "Failed to save program");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row: CareersProgramRow) => {
    if (!window.confirm(`Delete "${row.title}"? This cannot be undone.`)) return;
    setDeletingId(row.id);
    setMessage("");
    setError("");
    try {
      await deleteCareersProgram(row.id);
      setMessage("Program deleted");
      await load();
    } catch {
      setError("Failed to delete program");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Careers Programs</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage internship roles shown on Careers, Invites, and Offer Letters. Link certificate and offer letter templates per program.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
        >
          Add Program
        </button>
      </div>

      {message ? (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      ) : null}
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3">Program</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Certificate Template</th>
                <th className="px-4 py-3">Offer Letter Template</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    Loading programs...
                  </td>
                </tr>
              ) : sortedPrograms.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No careers programs yet.
                  </td>
                </tr>
              ) : (
                sortedPrograms.map((row) => (
                  <tr key={row.id}>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                      {row.title}
                      <p className="text-xs font-normal text-gray-500">{row.category}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{row.slug}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      {resolveSavedTemplateLabel(
                        row.certificateTemplateId,
                        row.certificateTemplate,
                        certificateTemplates,
                        defaultCertificateLabel
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      {resolveSavedTemplateLabel(
                        row.offerLetterTemplateId,
                        row.offerLetterTemplate,
                        offerTemplates,
                        resolveDefaultOfferLetterLabel(offerTemplates, row.slug)
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          row.active !== false
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {row.active !== false ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {row.updatedAt ? formatDate(row.updatedAt) : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(row)}
                          className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium hover:bg-gray-50 dark:border-gray-700"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => openDuplicate(row)}
                          className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-50 dark:border-gray-700"
                        >
                          Duplicate
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(row)}
                          disabled={deletingId === row.id}
                          className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          {deletingId === row.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {formOpen ? (
        <div
          className="fixed inset-0 z-999999 flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-sm"
          onClick={closeForm}
          role="presentation"
        >
          <div
            className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="careers-program-form-title"
          >
            <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-800">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2
                    id="careers-program-form-title"
                    className="text-xl font-semibold text-gray-900 dark:text-white"
                  >
                    {editing ? "Edit Program" : isDuplicate ? "Duplicate Program" : "Add Program"}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {isDuplicate
                      ? "Review the copied details, adjust the title and slug if needed, then save to create the new program."
                      : "Configure how this internship appears on Careers and which documents interns receive."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Close
                </button>
              </div>
            </div>

            <form onSubmit={handleSave} className="flex min-h-0 flex-1 flex-col">
              <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
                <FormSection title="Program details" description="Core identity shown on the careers page and in dropdowns.">
                  <FormField label="Title" required className="md:col-span-2">
                    <input
                      className={inputClass()}
                      value={form.title}
                      onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. Sales & Marketing Internship"
                      required
                    />
                  </FormField>

                  <FormField
                    label="Slug"
                    hint={editing ? "Slug cannot be changed after creation." : "Leave empty to auto-generate from the title."}
                  >
                    <input
                      className={inputClass()}
                      value={form.slug || ""}
                      onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                      placeholder="sales-marketing"
                      disabled={Boolean(editing)}
                    />
                  </FormField>

                  <FormField label="Category">
                    <input
                      className={inputClass()}
                      value={form.category || ""}
                      onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                      placeholder="e.g. Marketing"
                    />
                  </FormField>

                  <FormField label="Track label">
                    <input
                      className={inputClass()}
                      value={form.trackLabel || ""}
                      onChange={(e) => setForm((prev) => ({ ...prev, trackLabel: e.target.value }))}
                      placeholder="e.g. Marketing Track"
                    />
                  </FormField>

                  <FormField label="Sort order" hint="Lower numbers appear first in listings.">
                    <input
                      type="number"
                      className={inputClass()}
                      value={form.sortOrder || 0}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, sortOrder: Number(e.target.value) || 0 }))
                      }
                    />
                  </FormField>
                </FormSection>

                <FormSection title="Listing info" description="Short metadata displayed on the program card.">
                  <FormField label="Location">
                    <input
                      className={inputClass()}
                      value={form.location || ""}
                      onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                      placeholder="Remote"
                    />
                  </FormField>

                  <FormField label="Duration">
                    <input
                      className={inputClass()}
                      value={form.duration || ""}
                      onChange={(e) => setForm((prev) => ({ ...prev, duration: e.target.value }))}
                      placeholder="2 Months"
                    />
                  </FormField>

                  <FormField label="Cover image URL" className="md:col-span-2">
                    <input
                      className={inputClass()}
                      value={form.coverImage || ""}
                      onChange={(e) => setForm((prev) => ({ ...prev, coverImage: e.target.value }))}
                      placeholder="/Image/technical_internship.png"
                    />
                  </FormField>

                  <FormField label="Apply URL" className="md:col-span-2">
                    <input
                      className={inputClass()}
                      value={form.applyUrl || ""}
                      onChange={(e) => setForm((prev) => ({ ...prev, applyUrl: e.target.value }))}
                      placeholder="https://..."
                    />
                  </FormField>
                </FormSection>

                <FormSection title="Content" description="Longer copy for the program detail view.">
                  <FormField label="Description" className="md:col-span-2">
                    <textarea
                      className={textareaClass()}
                      value={form.description || ""}
                      onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief overview of the internship role and expectations."
                    />
                  </FormField>

                  <FormField
                    label="Highlights"
                    hint="Enter one highlight per line. These appear as bullet points on the careers page."
                    className="md:col-span-2"
                  >
                    <textarea
                      className={textareaClass()}
                      value={highlightsText}
                      onChange={(e) => setHighlightsText(e.target.value)}
                      placeholder={"Hands-on project experience\nMentorship from industry experts\nCertificate on completion"}
                    />
                  </FormField>
                </FormSection>

                <FormSection
                  title="Offer letter content"
                  description="Role responsibilities printed on the intern offer letter PDF for this program."
                >
                  <FormField
                    label="Role description"
                    hint="Describe what the intern will do. This text will appear on the offer letter when issued."
                    className="md:col-span-2"
                  >
                    <textarea
                      className={`${textareaClass()} min-h-[140px]`}
                      value={form.offerLetterRoleDescription || ""}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, offerLetterRoleDescription: e.target.value }))
                      }
                      placeholder="The intern will assist in identifying and generating potential leads, team leading, maintaining lead databases, conducting market research, qualifying prospects, coordinating with different departments, attending meetings, and performing other lead generation-related tasks assigned by the reporting manager."
                    />
                  </FormField>
                </FormSection>

                <FormSection
                  title="Document templates"
                  description="Pick a specific PDF template for this program, or leave on system default to auto-use the latest active template."
                >
                  <FormField
                    label="Certificate template"
                    hint={
                      !form.certificateTemplateId
                        ? `No explicit template saved. At runtime this program uses ${defaultCertificateLabel}.`
                        : `Saved for this program: ${
                            certificateTemplates.find((template) => template.id === form.certificateTemplateId)
                              ?.label || "selected template"
                          }.`
                    }
                  >
                    <select
                      className={selectClass()}
                      value={form.certificateTemplateId || ""}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          certificateTemplateId: e.target.value || null,
                        }))
                      }
                    >
                      <option value="">
                        System default ({defaultCertificateLabel})
                      </option>
                      {certificateTemplates.map((template) => (
                        <option key={template.id} value={template.id}>
                          {template.label}
                        </option>
                      ))}
                    </select>
                  </FormField>

                  <FormField
                    label="Offer letter template"
                    hint={
                      !form.offerLetterTemplateId
                        ? `No explicit template saved. At runtime this program uses ${defaultOfferLetterLabelForForm}.`
                        : `Saved for this program: ${
                            offerTemplates.find((template) => template.id === form.offerLetterTemplateId)
                              ?.label || "selected template"
                          }.`
                    }
                  >
                    <select
                      className={selectClass()}
                      value={form.offerLetterTemplateId || ""}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          offerLetterTemplateId: e.target.value || null,
                        }))
                      }
                    >
                      <option value="">
                        System default ({defaultOfferLetterLabelForForm})
                      </option>
                      {offerTemplates.map((template) => (
                        <option key={template.id} value={template.id}>
                          {template.label} ({template.type})
                        </option>
                      ))}
                    </select>
                  </FormField>
                </FormSection>

                <FormSection title="Visibility" description="Control whether this program is promoted and shown publicly.">
                  <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:gap-6">
                    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
                      <input
                        id="preferred"
                        type="checkbox"
                        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500/20"
                        checked={Boolean(form.preferred)}
                        onChange={(e) => setForm((prev) => ({ ...prev, preferred: e.target.checked }))}
                      />
                      <span>
                        <span className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                          Preferred role
                        </span>
                        <span className="mt-0.5 block text-xs text-gray-500">
                          Highlight this program as a recommended internship.
                        </span>
                      </span>
                    </label>

                    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
                      <input
                        id="active"
                        type="checkbox"
                        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500/20"
                        checked={form.active !== false}
                        onChange={(e) => setForm((prev) => ({ ...prev, active: e.target.checked }))}
                      />
                      <span>
                        <span className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                          Active
                        </span>
                        <span className="mt-0.5 block text-xs text-gray-500">
                          Visible on careers page, invites, and offer letters.
                        </span>
                      </span>
                    </label>
                  </div>

                  {form.preferred ? (
                    <FormField label="Preferred note" className="md:col-span-2">
                      <input
                        className={inputClass()}
                        value={form.preferredNote || ""}
                        onChange={(e) => setForm((prev) => ({ ...prev, preferredNote: e.target.value }))}
                        placeholder="e.g. Most popular among students"
                      />
                    </FormField>
                  ) : null}
                </FormSection>
              </div>

              <div className="flex shrink-0 justify-end gap-3 border-t border-gray-200 bg-gray-50/80 px-6 py-4 dark:border-gray-800 dark:bg-gray-900/80">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-50"
                >
                  {saving ? "Saving..." : editing ? "Save changes" : isDuplicate ? "Create duplicate" : "Create program"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
