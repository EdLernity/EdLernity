import React, { useState } from "react";
import { ShieldCheck, Search, AlertCircle, CheckCircle2 } from "lucide-react";
import BaseLayout from "../../Layout/BaseLayout";
import SeoHead from "../SEO/SeoHead";
import { PAGE_SEO } from "../../Utils/seoConfig";
import { BACKEND_URL } from "../../URL_Config";

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const RECORD_LABELS = {
  "internship-completion": "Internship Completion Certificate",
  "course-completion": "Course Completion Certificate",
};

export default function CertificateVerifyPage() {
  const [certificateId, setCertificateId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const runVerify = async (uuid) => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/v1/certificates/verify/${encodeURIComponent(uuid)}`
      );
      const data = await response.json();
      if (!response.ok || !data.valid) {
        setError(data.message || "Certificate could not be verified.");
        setResult(data);
        return;
      }
      setResult(data);
    } catch {
      setError("Verification failed. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleIdVerify = (e) => {
    e.preventDefault();
    const uuid = certificateId.trim();
    if (!uuid) {
      setError("Please enter a certificate ID.");
      return;
    }
    runVerify(uuid);
  };

  return (
    <BaseLayout>
      <SeoHead
        title={PAGE_SEO.verifyCertificate.title}
        description={PAGE_SEO.verifyCertificate.description}
        path={PAGE_SEO.verifyCertificate.path}
        keywords={PAGE_SEO.verifyCertificate.keywords}
      />

      <section className="bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-950 py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#181FC5]/10 text-[#181FC5] mb-5">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
            Verify EdLernity Certificate
          </h1>
          <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Employers, colleges, and students can verify the authenticity of an EdLernity
            certificate using the certificate ID printed on the document.
          </p>
        </div>
      </section>

      <section className="max-w-xl mx-auto px-4 pb-16 -mt-6">
        <form
          onSubmit={handleIdVerify}
          className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <Search className="text-[#181FC5]" size={20} />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Verify by Certificate ID
            </h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Enter the unique certificate ID printed on the certificate (e.g. EDL-INT-2026-A7K9M2P4).
          </p>
          <input
            type="text"
            value={certificateId}
            onChange={(e) => setCertificateId(e.target.value)}
              placeholder="e.g. EDL-INT-2026-A7K9M2P4"
            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-3 text-sm mb-4"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#181FC5] text-white font-semibold text-sm hover:bg-[#1418a8] disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify Certificate"}
          </button>
        </form>

        {(error || result) && (
          <div
            className={`mt-8 rounded-2xl border p-6 ${
              result?.valid
                ? "border-emerald-200 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10"
                : "border-red-200 bg-red-50 dark:border-red-500/30 dark:bg-red-500/10"
            }`}
          >
            <div className="flex items-start gap-3">
              {result?.valid ? (
                <CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={24} />
              ) : (
                <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={24} />
              )}
              <div className="flex-1">
                <h3
                  className={`text-lg font-bold ${
                    result?.valid ? "text-emerald-800 dark:text-emerald-300" : "text-red-800 dark:text-red-300"
                  }`}
                >
                  {result?.valid ? "Certificate is valid" : "Certificate not verified"}
                </h3>
                <p
                  className={`mt-2 text-sm ${
                    result?.valid ? "text-emerald-700 dark:text-emerald-200" : "text-red-700 dark:text-red-200"
                  }`}
                >
                  {result?.message || error}
                </p>

                {result?.valid && result.certificate && (
                  <div className="mt-5 grid sm:grid-cols-2 gap-4 rounded-xl bg-white/80 dark:bg-gray-900/60 p-4 border border-emerald-100 dark:border-emerald-500/20">
                    <div>
                      <p className="text-xs font-medium text-gray-500">Student name</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                        {result.certificate.studentName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Program / course</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                        {result.certificate.programTitle}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Certificate type</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                        {RECORD_LABELS[result.certificate.recordType] || result.certificate.recordType}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Issued on</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                        {formatDate(result.certificate.issuedAt)}
                      </p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-xs font-medium text-gray-500">Certificate ID</p>
                      <p className="text-sm font-mono text-gray-900 dark:text-white mt-1 break-all">
                        {result.certificate.uuid}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </BaseLayout>
  );
}
