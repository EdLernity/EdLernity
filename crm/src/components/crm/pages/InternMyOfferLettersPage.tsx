"use client";

import React, { useEffect, useState } from "react";
import { fetchMyOfferLetters, fetchOfferLetterPdfBlob, MyOfferLetterRow } from "@/lib/crmApi";
import { formatDate } from "@/lib/crmUtils";

export default function InternMyOfferLettersPage() {
  const [letters, setLetters] = useState<MyOfferLetterRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyOfferLetters()
      .then(setLetters)
      .catch(() => setError("Failed to load offer letters"))
      .finally(() => setLoading(false));
  }, []);

  const handleView = async (row: MyOfferLetterRow) => {
    setDownloadingId(row.id);
    try {
      const blob = await fetchOfferLetterPdfBlob(row.id);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch {
      setError("Failed to open offer letter");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Offer Letters</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          View offer letters after your application is approved.
        </p>
      </div>

      {error && (
        <p className="text-sm text-error-500 bg-error-50 dark:bg-error-500/10 rounded-lg px-4 py-2">{error}</p>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th className="px-5 py-3 text-left font-medium text-gray-500">Program</th>
              <th className="px-5 py-3 text-left font-medium text-gray-500">Candidate</th>
              <th className="px-5 py-3 text-left font-medium text-gray-500">Template</th>
              <th className="px-5 py-3 text-left font-medium text-gray-500">Issued</th>
              <th className="px-5 py-3 text-right font-medium text-gray-500">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-500">Loading...</td></tr>
            ) : letters.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-gray-500">
                  No offer letters yet. They appear here after admin or manager approval.
                </td>
              </tr>
            ) : (
              letters.map((row) => (
                <tr key={row.id}>
                  <td className="px-5 py-3 text-gray-900 dark:text-white">{row.internshipSlug}</td>
                  <td className="px-5 py-3 text-gray-600">{row.candidateName}</td>
                  <td className="px-5 py-3 text-gray-600">{row.templateLabel}</td>
                  <td className="px-5 py-3 text-gray-600">{formatDate(row.issuedAt)}</td>
                  <td className="px-5 py-3 text-right">
                    <button
                      type="button"
                      disabled={downloadingId === row.id}
                      onClick={() => handleView(row)}
                      className="text-xs font-medium text-brand-500 hover:text-brand-600 disabled:opacity-50"
                    >
                      {downloadingId === row.id ? "Opening..." : "View PDF"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
