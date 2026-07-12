"use client";

import React, { useEffect, useState } from "react";
import { fetchMyCertificates, fetchCertificatePdfBlob, MyCertificateRow } from "@/lib/crmApi";
import { formatDate } from "@/lib/crmUtils";

export default function InternMyCertificatesPage() {
  const [certificates, setCertificates] = useState<MyCertificateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyCertificates()
      .then(setCertificates)
      .catch(() => setError("Failed to load certificates"))
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = async (row: MyCertificateRow) => {
    setDownloadingId(row.id);
    setError("");
    try {
      const blob = await fetchCertificatePdfBlob(row.id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${row.studentName.replace(/\s+/g, "_")}_certificate.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      setError("Failed to download certificate");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Certificates</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Download your internship completion certificate after it is approved by admin or manager.
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
              <th className="px-5 py-3 text-left font-medium text-gray-500">Certificate</th>
              <th className="px-5 py-3 text-left font-medium text-gray-500">Name on certificate</th>
              <th className="px-5 py-3 text-left font-medium text-gray-500">Issued</th>
              <th className="px-5 py-3 text-right font-medium text-gray-500">Download</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-500">Loading...</td></tr>
            ) : certificates.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-500">No certificate issued yet</td></tr>
            ) : (
              certificates.map((row) => (
                <tr key={row.id}>
                  <td className="px-5 py-3 text-gray-900 dark:text-white">{row.programTitle}</td>
                  <td className="px-5 py-3 text-gray-600">{row.templateLabel || "Internship Certificate"}</td>
                  <td className="px-5 py-3 text-gray-600">{row.studentName}</td>
                  <td className="px-5 py-3 text-gray-600">{formatDate(row.issuedAt)}</td>
                  <td className="px-5 py-3 text-right">
                    <button
                      type="button"
                      disabled={downloadingId === row.id}
                      onClick={() => handleDownload(row)}
                      className="text-xs font-medium text-brand-500 hover:text-brand-600 disabled:opacity-50"
                    >
                      {downloadingId === row.id ? "Preparing..." : "Download PDF"}
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
