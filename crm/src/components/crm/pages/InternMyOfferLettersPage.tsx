"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import PdfPreviewPane from "@/components/crm/PdfPreviewPane";
import {
  fetchMyOfferLetters,
  fetchOfferLetterPdfBlob,
  MyOfferLetterRow,
} from "@/lib/crmApi";
import { formatDate } from "@/lib/crmUtils";

export default function InternMyOfferLettersPage() {
  const { user } = useAuth();
  const [letters, setLetters] = useState<MyOfferLetterRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyOfferLetters()
      .then((rows) => {
        setLetters(rows);
        if (rows[0]) setSelectedId(rows[0].id);
      })
      .catch(() => setError("Failed to load offer letters"))
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
        const blob = await fetchOfferLetterPdfBlob(selectedId);
        if (!cancelled) setPreviewBlob(blob);
      } catch (err) {
        if (!cancelled) {
          setPreviewBlob(null);
          setError(err instanceof Error ? err.message : "Could not load offer letter preview");
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

  const selected = letters.find((row) => row.id === selectedId) || null;
  const displayName =
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || user?.email || "Intern";

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-3xl border border-brand-100 bg-gradient-to-br from-slate-900 via-brand-600 to-brand-500 p-6 text-white shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
          Intern portal
        </p>
        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">My Offer Letters</h1>
        <p className="mt-2 max-w-2xl text-sm text-white/85 sm:text-base">
          Welcome, {displayName}. Tap an offer letter to preview it on this page.
        </p>
        <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-sky-300" />
          {letters.length} available
        </div>
      </div>

      {error && (
        <p className="rounded-xl bg-error-50 px-4 py-3 text-sm text-error-500 dark:bg-error-500/10">
          {error}
        </p>
      )}

      {loading ? (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-16 text-center text-gray-500 dark:border-gray-800 dark:bg-white/[0.03]">
          Loading your offer letters…
        </div>
      ) : letters.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-16 text-center dark:border-gray-700 dark:bg-white/[0.03]">
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            No offer letters yet
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
            After approval, your offer letter will show here with an on-page preview.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
          <div className="space-y-3">
            {letters.map((row) => {
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
                    {row.templateLabel || "Offer letter"}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Issued {formatDate(row.issuedAt)} · {row.candidateName}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {selected?.templateLabel || "Offer letter preview"}
              </p>
              <p className="mt-0.5 text-xs text-gray-500">
                {selected?.candidateName || "—"}
                {selected?.issuedAt ? ` · ${formatDate(selected.issuedAt)}` : ""}
              </p>
            </div>

            <div className="p-3 sm:p-4">
              <PdfPreviewPane
                blob={previewBlob}
                loading={previewLoading}
                emptyLabel="Select an offer letter to preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
