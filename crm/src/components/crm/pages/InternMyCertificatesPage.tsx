"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import PdfPreviewPane from "@/components/crm/PdfPreviewPane";
import {
  fetchMyCertificates,
  fetchCertificatePdfBlob,
  MyCertificateRow,
} from "@/lib/crmApi";
import { formatDate } from "@/lib/crmUtils";

export default function InternMyCertificatesPage() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<MyCertificateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyCertificates()
      .then((rows) => {
        setCertificates(rows);
        if (rows[0]) setSelectedId(rows[0].id);
      })
      .catch(() => setError("Failed to load certificates"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadPreview = async () => {
      if (!selectedId) {
        setPreviewBlob(null);
        return;
      }
      setPreviewLoading(true);
      setError("");
      try {
        const blob = await fetchCertificatePdfBlob(selectedId);
        if (!cancelled) setPreviewBlob(blob);
      } catch (err) {
        if (!cancelled) {
          setPreviewBlob(null);
          setError(err instanceof Error ? err.message : "Could not load certificate preview");
        }
      } finally {
        if (!cancelled) setPreviewLoading(false);
      }
    };

    loadPreview();
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  const selected = certificates.find((row) => row.id === selectedId) || null;
  const displayName =
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || user?.email || "Intern";

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-3xl border border-brand-100 bg-gradient-to-br from-brand-500 via-brand-500 to-brand-600 p-6 text-white shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
          Intern portal
        </p>
        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">My Certificates</h1>
        <p className="mt-2 max-w-2xl text-sm text-white/85 sm:text-base">
          Hi {displayName}. Tap a certificate to preview it on this page.
        </p>
        <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-emerald-300" />
          {certificates.length} issued
        </div>
      </div>

      {error && (
        <p className="rounded-xl bg-error-50 px-4 py-3 text-sm text-error-500 dark:bg-error-500/10">
          {error}
        </p>
      )}

      {loading ? (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-16 text-center text-gray-500 dark:border-gray-800 dark:bg-white/[0.03]">
          Loading your certificates…
        </div>
      ) : certificates.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-16 text-center dark:border-gray-700 dark:bg-white/[0.03]">
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            No certificate yet
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
            When a manager issues your certificate, it will appear here with a full on-page preview.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
          <div className="space-y-3">
            {certificates.map((row) => {
              const active = row.id === selectedId;
              return (
                <button
                  key={row.id}
                  type="button"
                  onClick={() => setSelectedId(row.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    active
                      ? "border-brand-500 bg-brand-50 shadow-sm ring-1 ring-brand-500/30 dark:border-brand-400 dark:bg-brand-500/10"
                      : "border-gray-200 bg-white hover:border-brand-200 dark:border-gray-800 dark:bg-white/[0.03]"
                  }`}
                >
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {row.programTitle}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {row.templateLabel || "Internship Certificate"}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-gray-500">
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                      Issued {formatDate(row.issuedAt)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 px-5 py-4 dark:border-gray-800">
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {selected?.templateLabel || "Certificate preview"}
                </p>
                <p className="mt-0.5 text-xs text-gray-500">
                  Issued to {selected?.studentName || "—"}
                  {selected?.issuedAt ? ` · ${formatDate(selected.issuedAt)}` : ""}
                </p>
              </div>
              {selected?.uuid && (
                <p className="rounded-lg bg-gray-50 px-2.5 py-1 font-mono text-[11px] text-gray-600 dark:bg-white/5 dark:text-gray-300">
                  ID: {selected.uuid}
                </p>
              )}
            </div>

            <div className="p-3 sm:p-4">
              <PdfPreviewPane
                blob={previewBlob}
                loading={previewLoading}
                emptyLabel="Select a certificate to preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
